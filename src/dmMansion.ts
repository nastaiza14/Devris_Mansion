// import "./game_messages";
import { MachineConfig, send, Action, assign } from "xstate";
import { actions } from "xstate";

const {choose, log} = actions

const sayErrorBack: Action<SDSContext, SDSEvent> = send((context: SDSContext) => ({
  type: "SPEAK",
  value: `That doesn't seem to work.`,
}));

function say(text: string): Action<SDSContext, SDSEvent> {
  return send((_context: SDSContext) => ({ type: "SPEAK", value: text }));
}

interface gameTexts {
  [index: string]: {
    [index: string]: string
  }
}

// Contains game message and some anotations for the game sounds that couldn't be implemented.
// There was also going to be constant background sounds.

const gameMessage: gameTexts = {
  welcome_txt: {
    welcome_1: "Welcome to the splendid Bavarian Mansion of family Devris. You are the child of doctor Alfred Devris and his late wife Monika. The Mansion is spacious, a bit too big for an only child like yourself and your busy father. ",
    welcome_2: "You will get information about the room or a section of the room when you enter such room or section. Try opening doors and objects, checking your surrounding and the objects you find there, and combining objects. Use your voice to do so. If something doesn't work, try formulating it differently.",
    welcome_3: "You can say \"go back\" to go to a previous section. If you need information about the room again, ask for help or you can ask \" where am I \". If you get stuck and want a hint, say so.",
    welcome_4: "Even though the map and object help is visible, it is highly encouraged that you play with a headset on in a dark room, without looking at your screen."
  },
  my_room_txt: {
    my_room_1: "The wind is so strong I can't sleep... Today is the fifth anniversary of mom being gone. She was so kind cheerful and beautiful... I miss you, mom.", // weep sound from Azure
    my_room_2: "This is my room. There's a night table, my bed, and my pet rabbit, my sweet Snowball.",
    my_room_3: "I should go get a glass of water.",
    my_room_hint: "I should get out of the room."
  },
  hall_2F_txt: {
    hall_2F_1: "The library is to the right of the hall, maybe I can read a book. Mom's room is next to mine. I miss you, mom. The rest of the hall is to the left, it's quite dark and I don't have matches with me to lit the lamps. If I want to go to the kitchen I should use the stairs...but going down there is scary at night...",
    hall_2F_2: "This is the library door.",
    hall_2F_3: "It's dark, but the storage room is at the end of the hall.",
    hall_2F_4: "I can't see much, but this is the door for the storage room.",
    // with oil lamp
    hall_2F_5: "The library is to the right of the hall, maybe I can read a book. Mom's room is next to mine. The rest of the hall is to the left. I can use the stairs to go down to the kitchen.",
    hall_2F_6: "The storage room is at the end of the hall.",
    hall_2F_7: "This is the door for the storage room.",
    // split hall 2F into 2 states
    hall_2F_hint: "I can enter any room or open any door here in the second floor."
  },
  mom_room_txt: {
    mom_room_1: "Mom, I wish you were here with me. I wish you could read a book for me tonight like you used to. I hate this scary wind.", 
    mom_room_2: "There's mom's picture, her closet and her dressing table. Why are the lamps lit?",
    mom_closet: "The closet has all her dresses and a safe.",
    mom_safe: "The safe needs a code",
    // if code_note = True : what are the numbers?
    // small_key = True
    mom_code: "What are the numbers?",
    mom_dress: "Her favorite blue dress is missing.",
    mom_room_hint: "What's in her closet?",
    got_smallkey: "There is a small key in the safe and a bottle of perfume.",
    mom_perfume: "That was her favorite perfume. "
  },
  library_txt: {
    library_1: "The room is warm and cozy. Let's see, what can I read?", 
    library_2: "The fireplace is in the middle of the room. There are two big shelves, the one on the left and the one on the right. The left shelf has files and books with brown covers. The right shelf has books of different colors.",
    
    left_shelf: "There are many files titled \"subjects\" and books on anatomy. One book is titled \"The Beauty of the Human Body\" ",
    left_shelf_1: "Are these people? They are completely disfigured. What is this doing in the library? This is grotesque.",
    left_shelf_2: "These are some technical books.",
    beauty_of_body: "Between the book's pages there is a note with handwritten numbers. The numbers are pretty, I don't think dad wrote this.",
    // get code -> code_note = True
    right_shelf: "Some of these books are literature classics. There is a book titled \"Stories for witches\".",
    //right_shelf_1: "Hhmm, what can I read?",
    right_shelf_1: "I don't feel like reading such dense books right now.",
    stories_for_witch: "The first story is short, let's see.",

    fireplace: "It's warm and cozy in here.",
    library_hint: "I should grab a book and read something. I bet there's something interesting in one of the books.",
    library_hint_deep: "There must be something interesting around here." 
    // fireplace sounds
    // after reading "Stories for witches" book, thunder jumpscare

  },
  storage_txt: {
    storage_1: "I can't see, but the matches should be around here somewhere.",
    storage_2: "I can feel the boxes of matches in the shelf, there is also an oil lamp and other containers, but I can't see what they are.",
    storage_3: "There are boxes of matches in the shelf, there are empty glass bottles and tins with different oils. I think some contain that new oil called gasoline, for cars.",
    storage_hint: "I can use some of the stuff that's in here.",
    // if you have the oil lamp on your inventory...
    storage_2_1: "I can feel the boxes of matches in the shelf and other containers, but I can't see what they are. The oil lamp was here.",
  },
  // heavy breathing sounds    
  // if oil_lamp = true   
  stairs_txt: {
    stairs_1: "I can barely see anything, but there's some light in the main hall.",
    // with oil lamp
    stairs_2: "Now I can see much better."
  },
  // if oil_lamp = True start from 2
  main_hall_txt: {
    main_hall_1: "What, is it raining now?", 
    main_hall_2: "The chandelier in this hall makes a weird shadow at night. The kitchen is to the left and the doll room is to the right. The stairs lead to the second floor.",
    main_hall_3: "This is the doll room.",
    main_hall_4: "This hall leads to the kitchen.",
    main_hall_hint: "I probably need some sort of lamp before I can do much around here."
  },
  // on counter 2, thunder sounds
  // if Oil_lamp = True, code_note = True, rusty_key = True, Maria appears
  // if Computer time = xx:00 or xx:30 -> loud clock sound
  doll_room_txt: {
    // only this without oil lamp
    doll_1:"I can barely see the dolls, it's dark.",
    // with oil lamp
    doll_2: "This is where my dolls are. My dad keeps giving me these for my birthday, they used to creep my out a little, but they are beautiful. Maybe too realistic, and barely smaller than me, I can't even play with them.",
    doll_3: "There are eight dolls in the shelves. There is a cabinet under the shelves.",
    cabinet: "There is a small chest.",
    doll_room_hint: "Without a lamp I can't do much here."
  },
  kitchen_hall_txt: {
    kit_hall: "What is that sound?", // delay, first play the sound
    kit_hall2: "That sound is creeping me out and I can't see anything. I should go back",
    kit_hall3: "I don't like that sound.",
    kit_hall4: "This is the kitchen door..."
    // if oil_lamp on, go to 3 onwards
  },
  kitchen_txt: { //heavy breathing sounds, chewing sounds, grunting sounds
    kitchen_1: "Where did that dog come from? We don't have a dog! It smells terrible, like a dead animal. What is it even eating?",
    kitchen_2: "There's a dog chewing on something on the floor, near it there's the back door. On the opposite side there's the kitchen cupboard and a rug. Has this rug always been here?",
    near_dog: "I don't wanna go near that beast.",
    cupboard: "There is some cutlery, plates, cups and bags of flour, there's also a lighter.",
    rug: "There is a trapdoor with a lock",
    // examine rug = 
  },
  // lighter = True
  // if
  kitchen_stairs_txt: {
    // scream  heavy breathing sound
    kit_stairs_1: "What is this huge thing?",
    // please kill me sound    
    kit_stairs_2: "This sort of beast has two torsos? It doesn't have any flesh left. It's arms are too short, but there's no way I can't pass through with this thing here.",
    kit_stairs_3: "I can use this to get rid of this monster.",
    kit_stairs_4: "This is gross. But now I can use these stairs."
  },
  // when counter 1, storage room text: gasoline, I can use it to get rid of that monster.
  // monster sounds, heavy breathing sounds, weeping sounds
  
  hall_basement_txt:{
    // heavy breathing
    // Maria's voice shouting: HEY!, HEY!.  are you in there? get out!! NOW!!
    // dim weeping sounds
    hall_base_1: "It's Maria, I should hide.",
    hall_base_2: "There is a door in front of the stairs. The hall goes on, it's dark and I can't see the end.",
    // terrified sounds TWO OPTIONS
    hall_base_3: "What is dad doing?", //delay + chainsaw sounds
    hall_base_4: "He can't be doing this...", //delay + chainsaw sounds
    hall_base_5: "DAD!... He can't hear me..."
  },
  basement_room_txt:{
    // louder weeping sounds
    // gasp 
    basement_1: "Is there anyone here?",
    basement_2: "There room is full with barrels, wooden planks, cloths and surgical supplies. It looks like someone is hiding in some barrels in the back.",
    barrels_back: "Are you okay? Why are you crying?",
    boy_1: "What happened to your eye? and you arm?",
    // mumbling
    // heavy breathing
    boy_2: "He, he has no tongue.",
    // boy cries 
    // Maria approaching steps and shouting: where are you, don't go to the laboratory now.
    boy_3: "We should hide.",
    // hide in the barrels
    // if hide: where?  if hide in barrels:
    // Maria opens door and goes away: I SAID DONT GO TO THE LABORATORY NOW, weeps
    boy_4: "Did my dad do this to you?"
    //  boy nods ??? sound of a nod? of an uh-huh
    // boy keeps weeping
  },
  lab_txt: { // Dad asks, "what are you doing here?""
    lab_1: "Dad? What are you doing? What is all this? ... Is that... mom?"
  },
  short_story: { 
    story: "Once upon a time, there was a rich man pulling along a cart full of treasure. His cart had broken down in the woods, but there came a passing hunter and his dog. The rich man pleaded to the hunter to keep a close eye on his cart, to which the hunter agreed. The rich man went to get a new cart. Meanwhile, the hunter kept watch. Night soon fell, and the hunter grew worried for his elderly mother still at home. So the hunter told the dog to watch the cart and went home to check on his mother. When the man returned, he saw the dog on guard. So he gave the dog a reward for his master, a silver coin, to carry in his mouth. The dog ran all the way home and brought his master the coin. But the hunter flew into a rage. \" I told you to watch the cart, and what did you do? You stole from it!\" So the master killed the dog." 
  },
  objects: {
    code_note: "8,4,3,7,2",
    oil_lamp_on: "This will be helpful."
  },
  nothing_txt: {
    nothing: "Nothing remarkable here."
  },
  CREDITS: {
    credits: "Congratulations, you have reached the end of the game. This audio adventure is based on the 2012 indie RPG \"Mad Father\", developed by Sen (a.t. sen _ old on twitter), the text called \"Stories for Witches\" is extracted from \"The Witch's house\", an indie RPG developed by Fummy released the same year, with the original title \"A funny story\". There have been little tweaks in the story and the gameplay, but the main line persists. To avoid major spoilers I decided not to continue with the story.",
  },
}


interface listObjects {
  [index: string]: boolean
}

const gameObjects: listObjects = {
  "code_note": false,
  "small_key": false,
  "matches": false,
  "oil_lamp": false,
  "rusty_key": false,
  "lighter": false,
  "gasoline": false,
  "oil_lamp_on": false,
  "father_knowledge": false,
}

const objectUpdater = (anObj: keyof listObjects) => {
  gameObjects[anObj] = true
}


// - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *  - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * 

// I couldn't use this function, I couldn't make it so that it can communicate with audio html elements. How can I do that?- * - * - * - * - * - * 

// Right now it's just a dummy function, so that it can appear in the code. - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * 

// let audio: HTMLAudioElement | null = null;

const soundPlayer = (fileName: string) => {
//   // audio?.pause();
//   // audio = new Audio(`mansion_sounds/${fileName}`);
//   // audio.play();
  return "hi"
};

// Call the function to play the sound
// soundPlayer('audiofile.mp3');

// Call this function to pause the sound
// const pauseSound = () => {
//   audio?.pause();
// };

// html <audio autoplay ...>
// html <audio loop autoplay ...>
// html <audio autoplay ...>  send pause when exiting state

// - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *  - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * 
// - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - *  - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * - * 


export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = {
  initial: "idle",
  states: {
    idle: {
      on: {
        CLICK: "init",
      },
    },
    init: {
      on: {
        TTS_READY: "welcome",
        CLICK: "welcome",
      },
    },
    welcome: {
       entry: send((context) => ({
         type: "SPEAK",
         value: `${gameMessage.welcome_txt.welcome_1}, ${ gameMessage.welcome_txt.welcome_2}, ${ gameMessage.welcome_txt.welcome_3}` })),
      on: { ENDSPEECH: "mansion" }
    },
    mansion: {
      initial: "my_room",
      states: {
        my_room:{
          initial: "my_room_speak",
          on: { 
            RECOGNISED : [
              {
                target: "#root.dm.mansion.hall_2F.hall_2F_speak",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room" && gameObjects.oil_lamp_on === false,
              },
              {
                target: "#root.dm.mansion.hall_2F.hall_2F_light",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room" && gameObjects.oil_lamp_on === true,
              },
              {
                target: ".nothing",
                cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("night table"))
              },
              {
                target: ".nothing",
                cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("bed")),
              },
              {
                target: ".check_snowball",
                cond: (context) => ((context.nluResult.prediction.topIntent) === "show affection" && (context.nluResult.query).includes("snowball")),
              },
              {
                target: ".check_snowball",
                cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("snowball")),
              },
              // utilities
              {
                target: ".my_room_around",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
              },
              {
                target: ".hint",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get hint",
              },
              {
                target: ".no_match"
              },
            ]
          },
          states: {
            what_should_I_do: {
              entry: send("LISTEN")
            },
            my_room_speak: {
              entry: send((context) => ({
              type: "SPEAK",
              value: `${gameMessage.my_room_txt.my_room_1}`})),
              on: { ENDSPEECH: "my_room_around" }
            },
            my_room_around: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.my_room_txt.my_room_2}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            check_snowball: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `My cute little Snowball, there, there.` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            hint: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.my_room_txt.my_room_hint}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            nothing: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.nothing_txt.nothing}` })),
              on: { ENDSPEECH: "what_should_I_do" }
            },
            no_match: {
              entry: sayErrorBack,
            on: { ENDSPEECH: "what_should_I_do" },
            },
          },
        },
        hall_2F: {
          initial: "hall_2F_speak",
          on : { 
            RECOGNISED : [
            // changing place
            {
              target: "my_room",
              cond: (context) => (context.nluResult.prediction.topIntent) === "go to" && (context.nluResult.query).includes("my room"),
            },
            {
              target: "mom_room",
              cond: (context) => (context.nluResult.prediction.topIntent) === "go to" && (context.nluResult.query).includes("mom's room"),
            },
            // library
            {
              target: ".before_library",
              cond: (context) => ((context.nluResult.prediction.topIntent) === "direction" && (context.nluResult.query).includes("right")),
            },
            {
              target: ".before_library",
              cond: (context) => ((context.nluResult.prediction.topIntent) === "go to" && (context.nluResult.query).includes("library")),
            },
            // middle of the hall
            {
              target: ".middle_of_hall",
              cond: (context) => (context.nluResult.prediction.topIntent) === "direction" && (context.nluResult.query).includes("left"),
            },
            // stairs
            {
              target: "stairs",
              cond: (context) => (context.nluResult.prediction.topIntent) === "use stairs" && (context.nluResult.query).includes("stairs"),
            },
            // utilities
            {
              target: ".hall_2F_light",
              cond: (context) => (context.nluResult.prediction.topIntent) === "get help" && gameObjects.oil_lamp_on === true,
            },
            {
              target: ".hall_2F_speak",
              cond: (context) => (context.nluResult.prediction.topIntent) === "get help" && gameObjects.oil_lamp_on === false,
            },
            {
              target: ".hint",
              cond: (context) => (context.nluResult.prediction.topIntent) === "get a hint",
            },
            // objects  
            {
              target: ".oil_lamp_lit",
              cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "matches" &&  (context.nluResult.prediction.entities[1].text) === "oil lamp" && gameObjects.matches === true && gameObjects.oil_lamp === true,
              actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
            },
            {
              target: ".oil_lamp_lit",
              cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "oil lamp" &&  (context.nluResult.prediction.entities[1].text) === "matches" && gameObjects.matches === true && gameObjects.oil_lamp === true,
              actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
            },
            {
              target: ".read_the_note",
              cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("note") && gameObjects.code_note === true,
            },
            {
              target: ".no_match"
            },
            ]
          },
          states: {
            what_should_I_do: {
              entry: send("LISTEN")
          },
            hall_2F_speak: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.hall_2F_txt.hall_2F_1}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            hall_2F_light: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.hall_2F_txt.hall_2F_5}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            middle_of_hall: {
              initial: "middle_of_hall_speak",
              on: { 
                RECOGNISED : [
                  // actions
                  {
                    target: ".before_storage_room",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "direction" && (context.nluResult.query).includes("left"),
                  },
                  {
                    target: ".before_storage_room",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "go further",
                  },
                  {
                    target: ".before_storage_room",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "go to" && (context.nluResult.query).includes("end"),
                  },
                  {
                    target: "hall_2F_speak",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back" && gameObjects.oil_lamp_on === false,
                  },
                  {
                    target: "hall_2F_light",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back" && gameObjects.oil_lamp_on === true,
                  },
                  // objects  ????
                  // {
                  //   target: ".oil_lamp_lit",
                  //   cond: (context) => [((context.nluResult.prediction.topIntent) === "combine object" && (context.nluResult.query).includes("lamp")), gameObjects.matches === true, gameObjects.oil_lamp === true ],
                  //   actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
                  // },
                  {
                    target: ".no_match"
                  },
                ]
              },
              states:{
                what_should_I_do: {
                  entry: send("LISTEN")
                },
                middle_of_hall_speak: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.hall_2F_txt.hall_2F_3}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                middle_of_hall_light: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.hall_2F_txt.hall_2F_6}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                oil_lamp_lit: {
                  entry: say("I turned on the oil lamp. With this I can see much better."),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                before_storage_room:{
                  initial: "before_storage_speak",
                  on: {
                    RECOGNISED: [
                      // actions before entering
                      {
                        target: "#root.dm.mansion.storage_room",
                        cond: (context) => ((context.nluResult.prediction.topIntent) === "go to")
                      },
                      {
                        target: "#root.dm.mansion.storage_room",
                        cond: (context) => ((context.nluResult.prediction.topIntent) === "open door")
                      },
                      // be careful with "go back", think about a way to announce it without being repetitive or add "where am I, to help"
                      {
                        target: "middle_of_hall_speak",
                        cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back" && gameObjects.oil_lamp_on === false,
                      },
                      {
                        target: "middle_of_hall_light",
                        cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back" && gameObjects.oil_lamp_on === true,
                      },
                      {
                        target: ".no_match"
                      },
                    ]
                  },
                  states: {
                      before_storage_speak: {
                      entry: send((context) => ({
                        type: "SPEAK",
                        value: `${gameMessage.hall_2F_txt.hall_2F_4}` })),
                        on: { ENDSPEECH: "what_should_I_do" }
                      },
                      what_should_I_do: {
                        entry: send("LISTEN")
                      },
                      no_match: {
                        entry: sayErrorBack,
                      on: { ENDSPEECH: "what_should_I_do" },
                      },
                    },
                  },
                no_match: {
                  entry: sayErrorBack,
                on: { ENDSPEECH: "what_should_I_do" },
                },
              },
            },
            before_library: {
              // confirmation for entering library
              initial: "before_library_speak",
              on: {
                RECOGNISED: [
                  // actions before entering room
                  {
                    target: "#root.dm.mansion.library",
                    cond: (context) => ((context.nluResult.prediction.topIntent) === "go to")
                  },
                  {
                    target: "#root.dm.mansion.library",
                    cond: (context) => ((context.nluResult.prediction.topIntent) === "open door")
                  },
                  // be careful with "go back", think about a way to announce it without being repetitive or add "where am I, to help"
                  {
                    target: "hall_2F_speak",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back" && gameObjects.oil_lamp_on === true,
                  },
                  {
                    target: "hall_2F_light",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back" && gameObjects.oil_lamp_on === false,
                  },
                  {
                    target: ".no_match"
                  },
                ]
              },
              states: {
                before_library_speak: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.hall_2F_txt.hall_2F_2}` })),
                  on: { ENDSPEECH: "what_should_I_do" }
                },
                what_should_I_do: {
                  entry: send("LISTEN")
                },
                no_match: {
                  entry: sayErrorBack,
                on: { ENDSPEECH: "what_should_I_do" },
                },
              }
            },
            oil_lamp_lit: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.objects.oil_lamp_on}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            read_the_note:{
              entry: say("The note has the numbers: 8, 4, 3, 7, 2"),
              on: { ENDSPEECH: "what_should_I_do" }
            },
            hint: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.hall_2F_txt.hall_2F_hint}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            no_match: {
              entry: sayErrorBack,
            on: { ENDSPEECH: "what_should_I_do" },
            },
          },
        },
        mom_room: {
          initial: "mom_room_speak",
          on: { 
            RECOGNISED : [
              // actions
              {
                target: "#root.dm.mansion.hall_2F.hall_2F_speak",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room" && gameObjects.oil_lamp_on === false,
              },
              {
                target: "#root.dm.mansion.hall_2F.hall_2F_light",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room" && gameObjects.oil_lamp_on === true,
              },
              {
                target: ".mom_closet",
                cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("closet")) || ((context.nluResult.prediction.topIntent) === "open object" && (context.nluResult.query).includes("closet")) ,
              },
              {
                target: ".nothing",
                cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("dresser")),
              },
              {
                target: ".nothing",
                cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("picture")),
              },
              // objects
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "matches" &&  (context.nluResult.prediction.entities[1].text) === "oil lamp" && gameObjects.matches === true && gameObjects.oil_lamp === true,
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "oil lamp" &&  (context.nluResult.prediction.entities[1].text) === "matches" && gameObjects.matches === true && gameObjects.oil_lamp === true,
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              {
                target: ".read_the_note",
                cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("note") && gameObjects.code_note === true,
              },
              // utilities
              {
                target: ".mom_room_around",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
              },
              {
                target: ".hint",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get hint",
              },
              {
                target: ".no_match"
              },
            ]
          },
          states: {
            // states for MOM ROOM
            mom_room_speak: {
              entry: send((context) => ({
              type: "SPEAK",
              value: `${gameMessage.mom_room_txt.mom_room_1}` })),
              on: { ENDSPEECH: "mom_room_around" }
            },
            mom_room_around: {
              entry: send((context) => ({
              type: "SPEAK",
              value: `${gameMessage.mom_room_txt.mom_room_2}` })),
              on: { ENDSPEECH: "what_should_I_do" }
            },
            what_should_I_do: {
              entry: send("LISTEN")
            },
            mom_closet: {
              initial: "mom_closet_speak",
              on: { 
                RECOGNISED : [
                  // actions
                  {
                    target: ".mom_safe",
                    cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("safe")),
                  },
                  {
                    target: ".mom_dress",
                    cond: (context) => ((context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("dresses")),
                  },
                  {
                    target: "what_should_I_do",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                  },
                  {
                    target: "#root.dm.mansion.hall_2F",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
                  },
                  // utilities
                  {
                    target: "mom_room_around",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
                  },
                  {
                    target: ".no_match"
                  },
                ]
              },
              states: {
                // states for MOM CLOSET
                mom_closet_speak: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.mom_room_txt.mom_closet}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                what_should_I_do: {
                  entry: send("LISTEN")
                },
                mom_safe: {
                  initial: "closed_safe",
                  on: {
                    RECOGNISED: [
                      // actions
                      {
                        target: "#root.dm.mansion.mom_room.mom_closet.mom_safe.open_safe",
                        cond: (context) => (context.nluResult.prediction.topIntent) === "open object" && (context.nluResult.query).includes("safe"),
                      },
                      {
                        target: "#root.dm.mansion.mom_room.mom_closet.mom_safe.opened_safe",
                        cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "8, 4, 3, 7, 2",
                      },
                      {
                        target: "#root.dm.mansion.hall_2F",
                        cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
                      },
                      // utilities
                      {
                        target: "what_should_I_do",
                        cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                      },
                      {
                        target: "mom_closet_speak",
                        cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
                      },
                      {
                        target: ".no_match"
                      },
                    ]
                  },
                  states:{
                    // states for SAFE (mom_safe)
                    closed_safe: {
                      entry: send((context) => ({
                        type: "SPEAK",
                        value: `${gameMessage.mom_room_txt.mom_safe}` })),
                        on: { ENDSPEECH: "what_should_I_do" }
                    },
                    open_safe: {
                      entry: send((context) => ({
                        type: "SPEAK",
                        value: `${gameMessage.mom_room_txt.mom_code}` })),
                        on: { ENDSPEECH: "what_should_I_do" }
                    },
                    opened_safe: {
                      initial : "inside_safe",
                      on: {
                        RECOGNISED: [
                          // actions
                          {
                            target: "#root.dm.mansion.hall_2F",
                            cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
                          },
                          {
                            target: ".what_should_I_do",
                            cond: (context) => (context.nluResult.prediction.topIntent) === "open object" && (context.nluResult.query).includes("safe"),
                          },
                          {
                            target: ".what_should_I_do",
                            cond: (context) => (context.nluResult.prediction.topIntent) === "take object" && (context.nluResult.query).includes("small key"),
                            actions: [(context) => objectUpdater("small_key"), soundPlayer("discovery_sound.mp3")],
                          },
                          {
                            target: ".perfume",
                            cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("perfume"),
                          },
                          // utilities
                          {
                            target: "what_should_I_do",
                            cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                          },
                          {
                            target: ".no_match"
                          },
                        ]
                      },
                      states: {
                        inside_safe: {
                          entry: send((context) => ({
                          type: "SPEAK",
                          value: `${gameMessage.mom_room_txt.got_smallkey}` })),
                          on: { ENDSPEECH: "what_should_I_do" }
                        },
                        perfume: {
                          entry: send((context) => ({
                          type: "SPEAK",
                          value: `${gameMessage.mom_room_txt.mom_perfume}` })),
                          on: { ENDSPEECH: "what_should_I_do" }
                        },
                        no_match: {
                          entry: sayErrorBack,
                        on: { ENDSPEECH: "what_should_I_do" },
                        },
                        what_should_I_do: {
                          entry: send("LISTEN")
                        },
                      },
                    },
                    what_should_I_do: {
                      entry: send("LISTEN")
                    },
                    no_match: {
                      entry: sayErrorBack,
                    on: { ENDSPEECH: "what_should_I_do" },
                    },
                  }, 
                },
                // states for MOM CLOSET
                mom_dress: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.mom_room_txt.mom_dress}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                no_match: {
                  entry: sayErrorBack,
                on: { ENDSPEECH: "what_should_I_do" },
                },
              }
            },
            // states for MOM ROOM
            hint: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.mom_room_txt.mom_room_hint}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            read_the_note:{
              entry: say("The note has the numbers: 8, 4, 3, 7, 2"),
              on: { ENDSPEECH: "what_should_I_do" }
            },
            nothing: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.nothing_txt.nothing}` })),
              on: { ENDSPEECH: "what_should_I_do" }
            },
            oil_lamp_lit: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.objects.oil_lamp_on}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            no_match: {
              entry: sayErrorBack,
            on: { ENDSPEECH: "what_should_I_do" },
            },
          }
        },
        library: {
          initial: "library_speak",
          on : { 
            RECOGNISED: [ 
              // actions: select side of the shelf or fireplace
              {
                target: "#root.dm.mansion.hall_2F.hall_2F_speak",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room" && gameObjects.oil_lamp_on === false,
              },
              {
                target: "#root.dm.mansion.hall_2F.hall_2F_light",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room" && gameObjects.oil_lamp_on === true,
              },
              {
                target: ".left_shelf",
                cond: (context) => (context.nluResult.prediction.topIntent) === "direction" && (context.nluResult.query).includes("shelf"),
              },
              {
                target: ".left_shelf",
                cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("left"),
              },
              {
                target: ".right_shelf",
                cond: (context) => (context.nluResult.prediction.topIntent) === "direction" && (context.nluResult.query).includes("shelf"),
              },
              {
                target: ".right_shelf",
                cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("right"),
              },
              {
                target: ".fireplace",
                cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("fireplace"),
              },
              // objects
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "matches" &&  (context.nluResult.prediction.entities[1].text) === "oil lamp" && gameObjects.matches === true && gameObjects.oil_lamp === true,
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "oil lamp" &&  (context.nluResult.prediction.entities[1].text) === "matches" && gameObjects.matches === true && gameObjects.oil_lamp === true,
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              // utilities
              {
                target: ".library_around",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
              },
              {
                target: ".hint",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get hint",
              },
              {
                target: ".no_match"
              },
            ]
          },
          states:{
            library_speak: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.library_txt.library_1}`})),
              on: { ENDSPEECH: "library_around" }
            },
            library_around: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.library_txt.library_2}`})),
              on: { ENDSPEECH: "what_should_I_do" }
            },
            what_should_I_do: {
              entry: send("LISTEN")
          },
          left_shelf: {
            initial: "ls_speak",
            on: {
              RECOGNISED : [
                // actions
                {
                  target: "#root.dm.mansion.hall_2F",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
                },
                {
                  target: ".ls_files",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("files"),
                },
                {
                  target: ".ls_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("books"),
                },
                {
                  target: ".ls_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("anatomy"),
                },
                {
                  target: ".ls_beauty_of_the",
                  cond: (context) => (context.nluResult.prediction.topIntent)  === "read object" && (context.nluResult.query).includes("human body"),
                },
                {
                  target: ".ls_files",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("files"),
                },
                {
                  target: ".ls_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("books"),
                },
                {
                  target: ".ls_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("anatomy"),
                },
                {
                  target: ".ls_beauty_of_the",
                  cond: (context) => (context.nluResult.prediction.topIntent)  === "check object" && (context.nluResult.query).includes("human body"),
                },
                {
                  target: "library_around",
                  cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                },
                // utilities
                {
                  target: ".ls_speak",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
                },
                {
                  target: ".hint",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "get hint",
                },
                {
                  target: ".no_match"
                },
              ]
            },
            states : {
              ls_speak: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.left_shelf}`})),
                on: { ENDSPEECH: "what_should_I_do" }
              },
              ls_files: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.left_shelf_1}`})),
                on: { ENDSPEECH: "what_should_I_do" }
              },
              ls_books: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.left_shelf_2}`})),
                on: { ENDSPEECH: "what_should_I_do" }
              },
              ls_beauty_of_the: {
                initial: "code_in_the_book",
                on: {
                  RECOGNISED: [
                    // actions
                    {
                      target: "#root.dm.mansion.hall_2F",
                      cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
                    },
                    {
                      target: ".read_the_numbers",
                      cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("numbers"),
                    },
                    {
                      target: ".read_the_numbers",
                      cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("note"),
                    },
                    {
                      target: ".take_the_note",
                      cond: (context) => (context.nluResult.prediction.topIntent) === "take object" && (context.nluResult.query).includes("note"),
                      actions: [(context) => objectUpdater("code_note"), soundPlayer("discovery_sound.mp3")]
                    },
                    // utilities
                    {
                      target: "ls_speak",
                      cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                    },
                    {
                      target: ".code_in_the_book",
                      cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
                    },
                    {
                      target: ".no_match",
                    },
                  ]
                },
                states:{
                  code_in_the_book: {
                    entry: send((context) => ({
                      type: "SPEAK",
                      value: `${gameMessage.library_txt.beauty_of_body}`})), 
                    on: { ENDSPEECH: "what_should_I_do" }
                  },
                  take_the_note:{
                    entry: say("I got a note with some numbers."),
                    on: { ENDSPEECH: "what_should_I_do" }
                  },
                  read_the_numbers:{
                    entry: say("The note has the numbers: 8, 4, 3, 7, 2"),
                    on: { ENDSPEECH: "what_should_I_do" }
                  },
                  what_should_I_do: {
                    entry: send("LISTEN")
                  },
                  no_match: {
                    entry: sayErrorBack,
                  on: { ENDSPEECH: "what_should_I_do" },
                  },
                }
              },
              what_should_I_do: {
                entry: send("LISTEN")
              },
              hint: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.library_hint_deep}` })),
                  on: { ENDSPEECH: "what_should_I_do" }
              },
              no_match: {
                entry: sayErrorBack,
              on: { ENDSPEECH: "what_should_I_do" },
              },
            },
          },
          right_shelf: {
            initial: "rs_speak",
            on: {
              RECOGNISED : [
                // actions
                {
                  target: "#root.dm.mansion.hall_2F",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
                },
                {
                  target: ".rs_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("literature"),
                },
                {
                  target: ".rs_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("books"),
                },
                {
                  target: ".rs_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "read object" && (context.nluResult.query).includes("classic"),
                },
                {
                  target: ".rs_stories_for",
                  cond: (context) => (context.nluResult.prediction.topIntent)  === "read object" && (context.nluResult.query).includes("stories"),
                },
                {
                  target: ".rs_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("literature"),
                },
                {
                  target: ".rs_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("books"),
                },
                {
                  target: ".rs_books",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("classic"),
                },
                {
                  target: ".rs_stories_for",
                  cond: (context) => (context.nluResult.prediction.topIntent)  === "check object" && (context.nluResult.query).includes("stories"),
                },
                {
                  target: "library_around",
                  cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                },
                // utilities
                {
                  target: ".rs_speak",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
                },
                {
                  target: ".hint",
                  cond: (context) => (context.nluResult.prediction.topIntent) === "get hint",
                },
                {
                  target: ".no_match"
                },
              ]
            },
            states : {
              rs_speak: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.right_shelf}`})),
                on: { ENDSPEECH: "what_should_I_do" }
              },
              rs_books: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.right_shelf_1}`})),
                on: { ENDSPEECH: "what_should_I_do" }
              },
              rs_stories_for: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.stories_for_witch}, ${gameMessage.short_story.story}`})),
                on: { ENDSPEECH: "what_should_I_do" }
              },
              what_should_I_do: {
                entry: send("LISTEN")
              },
              hint: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.library_txt.library_hint_deep}` })),
                  on: { ENDSPEECH: "what_should_I_do" }
              },
              no_match: {
                entry: sayErrorBack,
              on: { ENDSPEECH: "what_should_I_do" },
              },
            },
          },
          fireplace: {
            entry: send((context) => ({
              type: "SPEAK",
              value: `${gameMessage.library_txt.fireplace}` })),
            on: { ENDSPEECH: "what_should_I_do" }
          },
          oil_lamp_lit: {
            entry: send((context) => ({
              type: "SPEAK",
              value: `${gameMessage.objects.oil_lamp_on}` })),
              on: { ENDSPEECH: "what_should_I_do" }
          },
          hint: {
            entry: send((context) => ({
              type: "SPEAK",
              value: `${gameMessage.library_txt.library_hint}` })),
              on: { ENDSPEECH: "what_should_I_do" }
          },
          no_match: {
            entry: sayErrorBack,
          on: { ENDSPEECH: "what_should_I_do" },
          },
          }
        },
        storage_room: {
          // condition before entering
          always: [
            {
              target: "#root.dm.mansion.inside_storage_room.storage_room_speak",
              cond: (context) => gameObjects.oil_lamp_on === false,
            },
            {
              target: "#root.dm.mansion.inside_storage_room.storage_room_light",
              cond: (context) => gameObjects.oil_lamp_on === true,
            },
            // {
            //     target: "#root.dm.mansion.inside_storage_room.storage_room_with_oil_lamp",
            //     cond: (context) => gameObjects.oil_lamp_on === false && gameObjects.oil_lamp === true,
            // }, 
          ],
        },
        inside_storage_room: {
          on: {
            RECOGNISED: [
              // actions              // this is implicitly true -> gameObjects.oil_lamp_on === false
              {
                target: "#root.dm.mansion.hall_2F.middle_of_hall.middle_of_hall_speak",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
              },
              {
                target: ".nothing",
                cond: (context) => (context.nluResult.prediction.topIntent) === "take object" && (context.nluResult.query).includes("empty"),
              },
              {
                target: ".matches_taken",
                cond: (context) => (context.nluResult.prediction.topIntent) === "take object" && (context.nluResult.query).includes("matches"),
                actions: [(context) => objectUpdater("matches"), soundPlayer("discovery_sound.mp3")],
              },
              {
                target: ".oil_lamp_taken",
                cond: (context) => (context.nluResult.prediction.topIntent) === "take object" && (context.nluResult.query).includes("oil lamp"),
                actions: [(context) => objectUpdater("oil_lamp"), soundPlayer("discovery_sound.mp3") ],
              },
              // v Combining objects to turn on lamp  
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "oil lamp" &&  (context.nluResult.prediction.entities[1].text === "matches"),
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "matches" &&  (context.nluResult.prediction.entities[1].text === "oil lamp"),
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              //  ^ Combined object to turn on lamp
              // utilities
              {
                target: ".storage_room_around",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get help" && gameObjects.oil_lamp === false,
              },
              {
                target: ".storage_room_with_oil_lamp",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get help" && gameObjects.oil_lamp === true,
              },
              {
                target: ".hint",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get a hint",
              },
              {
                target: ".no_match"
              },
            ],
          },
          states: {
            storage_room_speak: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.storage_txt.storage_1}` })),
                on: {  // implicitly -> gameObjects.oil_lamp_on === false
                  ENDSPEECH: [
                  { target: "storage_room_with_oil_lamp",
                    cond: (context) => gameObjects.oil_lamp === true,
                  },
                  { target: "storage_room_around",
                  },
                ]
              }
            },
            storage_room_around: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.storage_txt.storage_2}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            // this means that you posses the object, but haven't lit it
            storage_room_with_oil_lamp: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.storage_txt.storage_2_1}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            storage_room_light: {
              initial: "storage_light_around",
              on: {
                RECOGNISED: [
                  //actions  get gasoline and look around
                  // if the oil lamp is not lit, you still can't see, but if you do we need another nested dialogue WE NEED A PARALEL STATE
                  {
                    target: ".gasoline_taken",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "take object" && (context.nluResult.query).includes("gasoline"),
                    actions: [(context) => objectUpdater("gasoline"), soundPlayer("discovery_sound.mp3")],
                  },
                  // this is implicitly true -> gameObjects.oil_lamp_on === true
                  {
                    target: "#root.dm.mansion.hall_2F.middle_of_hall.middle_of_hall_light",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "change room" ,
                  },
                   // utilities
                  {
                    target: "#root.dm.mansion.inside_storage_room.storage_room_light.storage_light_around",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
                  },
                  {
                    target: ".hint",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "get a hint",
                  },
                  {
                    target: ".no_match"
                  },
                ]
              },
              states: {
                storage_light_around: {
                  entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.storage_txt.storage_3}` })),
                  on: { ENDSPEECH: "what_should_I_do" }
                },
                what_should_I_do: {
                  entry: send("LISTEN")
                },
                hint: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.storage_txt.storage_hint}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                // we need to see before getting this, !
                gasoline_taken: {
                  entry: say("I got a tin of gasoline."),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                no_match: {
                  entry: sayErrorBack,
                on: { ENDSPEECH: "what_should_I_do" },
                },
              }
            },
            what_should_I_do: {
              entry: send("LISTEN")
            },
            matches_taken: {
              entry: say("I got a box of matches."),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            oil_lamp_taken: {
              entry: say("I got an oil lamp."),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            oil_lamp_lit: {
              entry: say("I turned on the oil lamp. With this I can see much better."),
                on: { ENDSPEECH: "storage_room_light" }  
            },
            nothing: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.nothing_txt.nothing}` })),
              on: { ENDSPEECH: "what_should_I_do" }
            },
            hint: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.storage_txt.storage_hint}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            no_match: {
              entry: sayErrorBack,
            on: { ENDSPEECH: "what_should_I_do" },
            },

          },
        },
        stairs:{
          // condition
          always: [
            {
              target: "main_hall",
              cond: (context) => gameObjects.oil_lamp_on === false,
              actions: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.stairs_txt.stairs_1}` })),
            },
            {
              target: "main_hall",
              cond: (context) => gameObjects.oil_lamp_on === true,
              actions: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.stairs_txt.stairs_2}` }))
              },
          ]
        },
        stairs_up:{
          // condition
          always: [
            {
              target: "#root.dm.mansion.hall_2F.hall_2F_speak",
              cond: (context) => gameObjects.oil_lamp_on == false,
              actions: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.stairs_txt.stairs_1}` })),
            },
            {
              target: "#root.dm.mansion.hall_2F.hall_2F_light",
              cond: (context) => gameObjects.oil_lamp_on == true,
              actions: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.stairs_txt.stairs_2}` }))
              },
          ]
        },
        main_hall:{
          initial: "main_hall_speak",
          on : {
            RECOGNISED : [
              // actions
              {
                target: ".before_doll_room",
                cond: (context) => (context.nluResult.prediction.topIntent) === "direction" && (context.nluResult.query).includes("right"),
              },
              {
                target: ".before_kitchen_hall",
                cond: (context) => (context.nluResult.prediction.topIntent) === "direction"  && (context.nluResult.query).includes("left"),
              },
              {
                target: ".before_doll_room",
                cond: (context) => (context.nluResult.prediction.topIntent) === "go to"  && (context.nluResult.query).includes("doll room"),
              },
              {
                target: ".before_kitchen_hall",
                cond: (context) => (context.nluResult.prediction.topIntent) === "go to"  && (context.nluResult.query).includes("kitchen"),
              },
              {
                target: "stairs_up",
                cond: (context) => (context.nluResult.prediction.topIntent) === "use stairs"  && (context.nluResult.query).includes("stairs"),
              },
              // utilities
              {
                target: ".main_hall_around",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get help",
              },
              {
                target: ".hint",
                cond: (context) => (context.nluResult.prediction.topIntent) === "get hint",
              },
              {
                target: ".no_match"
              },
            ]
          },
          states: {
            main_hall_speak: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.main_hall_txt.main_hall_1} ` })),
                on: { ENDSPEECH: "main_hall_around" }
            },
            main_hall_around: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.main_hall_txt.main_hall_2}`})),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            what_should_I_do: {
              entry: send("LISTEN")
            },
            hint: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.main_hall_txt.main_hall_hint}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            no_match: {
              entry: sayErrorBack,
            on: { ENDSPEECH: "what_should_I_do" },
            },
            before_doll_room: {
              initial: "enter_doll_room",
              on: {
                RECOGNISED: [
                  {
                    target: "#root.dm.mansion.doll_room",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "go to" && ((context.nluResult.query)).includes("doll room"),
                  },
                  {
                    target: "#root.dm.mansion.main_hall.main_hall_around",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                  },
                  {
                    target: ".no_match"
                  },
                ]
              },
              states: {
                enter_doll_room: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.main_hall_txt.main_hall_3}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                  },
                  what_should_I_do: {
                    entry: send("LISTEN")
                  },
                  no_match: {
                    entry: sayErrorBack,
                  on: { ENDSPEECH: "what_should_I_do" },
                  },
                },
            },
            before_kitchen_hall: {
              initial: "enter_kitchen_hall",
              on: {
                RECOGNISED: [
                  {
                    target: "#root.dm.mansion.kitchen_hall",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "go to" && ((context.nluResult.query)).includes("kitchen"),
                  },
                  {
                    target: "#root.dm.mansion.main_hall.main_hall_around",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                  },
                  {
                    target: ".no_match"
                  },
                ]
              },
              states: {
                enter_kitchen_hall: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.main_hall_txt.main_hall_4}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                what_should_I_do: {
                  entry: send("LISTEN")
                },
                no_match: {
                  entry: sayErrorBack,
                on: { ENDSPEECH: "what_should_I_do" },
                },
              }, 
            },
          }
        },
        doll_room:{
          always: [
            {
            target: ".doll_room_dark",
            cond: (context) => gameObjects.oil_lamp_on == false,
            },
            {
              target: ".doll_room_speak",
              cond: (context) => gameObjects.oil_lamp_on == true,
              },
          ],
          on : {
            RECOGNISED: [
              // actions
              {
                target: "#root.dm.mansion.main_hall",
                cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
              },
              {
                target: ".cabinet",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "open object" && (context.nluResult.query).includes("cabinet"), 
              },
              {
                target: ".cabinet",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("cabinet"), 
              },
              {
                target: ".doll_room_dark",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "get help" && gameObjects.oil_lamp_on === false, 
              },
              {
                target: ".doll_room_around",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "get help" && gameObjects.oil_lamp_on === true, 
              },
              // objects
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "matches" &&  (context.nluResult.prediction.entities[1].text) === "oil lamp" && gameObjects.matches === true && gameObjects.oil_lamp === true,
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              {
                target: ".oil_lamp_lit",
                cond: (context) => (context.nluResult.prediction.topIntent) === "combine objects" && (context.nluResult.prediction.entities[0].text) === "oil lamp" &&  (context.nluResult.prediction.entities[1].text) === "matches" && gameObjects.matches === true && gameObjects.oil_lamp === true,
                actions: [(context) => objectUpdater("oil_lamp_on"), soundPlayer("discovery_sound.mp3")]
              },
              {
                target: ".no_match",
              },
            ]
          },
          states: {
            doll_room_dark: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.doll_room_txt.doll_1}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            doll_room_speak: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.doll_room_txt.doll_2}` })),
                on: { ENDSPEECH: "doll_room_around" }
            },
            doll_room_around: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.doll_room_txt.doll_3}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            what_should_I_do: {
              entry: send("LISTEN")
            },
            oil_lamp_lit: {
              entry: send((context) => ({
                type: "SPEAK",
                value: `${gameMessage.objects.oil_lamp_on}` })),
                on: { ENDSPEECH: "what_should_I_do" }
            },
            cabinet: {
              initial: "open_cabinet",
              on: {
                RECOGNISED: [
                  // actions
                  {
                    target: ".open_chest",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "open object" && (context.nluResult.query).includes("chest"),
                  },
                  {
                    target: ".opened_chest",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "open object" && (context.nluResult.query).includes("small key") && gameObjects.small_key === true,
                    actions: (context) => [objectUpdater("rusty_key"), soundPlayer("discovery_sound.mp3")]
                  },
                  {
                    target: "#root.dm.mansion.main_hall",
                    cond: (context) => (context.nluResult.prediction.topIntent) === "change room",
                  },
                  // utilities
                  {
                    target: "doll_room_around",
                    cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "go back",
                  },
                  {
                    target: ".no_match"
                  },
                ]
              },
              states:{
                what_should_I_do: {
                  entry: send("LISTEN")
                },
                open_cabinet: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.doll_room_txt.cabinet}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                open_chest: {
                  entry: say("The chest needs a key."),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                opened_chest:{
                  entry: say("I got a rusty key."),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                hint: {
                  entry: send((context) => ({
                    type: "SPEAK",
                    value: `${gameMessage.doll_room_hint}` })),
                    on: { ENDSPEECH: "what_should_I_do" }
                },
                no_match: {
                  entry: sayErrorBack,
                on: { ENDSPEECH: "what_should_I_do" },
                },
              },
            },
            no_match: {
              entry: sayErrorBack,
            on: { ENDSPEECH: "what_should_I_do" },
            },
          },
        },
        kitchen_hall:{
          initial: "kitchen_hall_speak",
          states:{
            kitchen_hall_speak: {
                    entry: send((context) => ({
                      type: "SPEAK",
                      value: `${gameMessage.kitchen_hall_txt.kit_hall}` })),
                      on: { ENDSPEECH: "fin" }
                    },
            fin: {
              entry: say("Is that an animal? Is it chewing on something? I'm scared."),
              on: {ENDSPEECH: "credits"}
            },
            credits: {
                entry: send((context) => ({
                  type: "SPEAK",
                  value: `${gameMessage.CREDITS.credits}` })),
                  on: { ENDSPEECH: "#root.dm.idle" },
            },
          },
        },
        
        // kitchen_hall: {
        //   initial: "kitchen_hall_speak",
        //   on : {
        //     RECOGNISED: [
        //       {
        //         target: ".before_kitchen",
        //         cond:  (context) => (context.nluResult.prediction.topIntent) === "go further / keep walking /continue",
        //       }
        //     ]
        //   },
        //   states: {
        //     kitchen_hall_speak: {
        //       entry: send((context) => ({
        //         type: "SPEAK",
        //         value: `${gameMessage.kitchen_hall_txt.kit_hall}` })),
        //         on: { ENDSPEECH: [
        //           {
        //           target: "what_should_I_do" ,
        //           cond: (context) => gameObjects.oil_lamp_on == false,
        //           actions: send((context) => ({
        //             type: "SPEAK",
        //             value: `${gameMessage.kitchen_hall_txt.kit_hall2}` }))
        //           },
        //           {
        //             target: "what_should_I_do" ,
        //             cond: (context) => gameObjects.oil_lamp_on == true,
        //             actions: send((context) => ({
        //               type: "SPEAK",
        //               value: `${gameMessage.kitchen_hall_txt.kit_hall3}` }))
        //             },
        //         ]
        //       }
        //     },
        //     what_should_I_do: {
        //       entry: send("LISTEN")
        //     },
        //     before_kitchen: {
        //       initial: "enter_kitchen",
        //       on : {
        //         RECOGNISED : [
        //           {
        //             target: "#root.dm.mansion.kitchen",
        //             cond: (context) => (context.nluResult.prediction.topIntent) === "open door, go to kitchen etc",
        //           }
        //         ]
        //       },
        //       states:{
        //         enter_kitchen: {
        //         entry: send((context) => ({
        //           type: "SPEAK",
        //           value: `${gameMessage.kitchen_hall_txt.kit_hall4}` })),
        //           on: { ENDSPEECH: "what_should_I_do" }
        //         },
        //         what_should_I_do: {
        //           entry: send("LISTEN")
        //         },
        //         no_match: {
        //           entry: sayErrorBack,
        //         on: { ENDSPEECH: "what_should_I_do" },
        //         },
        //       },
        //     },
        //   },
        // },
        // kitchen: {
        //   initial: "kitchen_speak",
        //   on : {
        //     RECOGNISED: [
        //       {
        //         target: ".near_dog",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "check/inspect/go near back door" || "near dog",
        //       },
        //       {
        //         target: ".kitchen_cupboard",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "check/inspect/search cupboard ",
        //       },
        //       {
        //         target: ".rug",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "move/lift/remove/pull rug",
        //       },
        //     ]
        //   },
        //   states: {
        //     kitchen_speak: {
        //       entry: send((context) => ({
        //         type: "SPEAK",
        //         value: `${gameMessage.kitchen_txt.kitchen_1, gameMessage.kitchen_txt.kitchen_2}` })),
        //         on: { ENDSPEECH: "what_should_I_do" }
        //       },
        //       what_should_I_do: {
        //         entry: send("LISTEN")
        //       },
        //       near_dog: {
        //         entry: send((context) => ({
        //           type: "SPEAK",
        //           value: `${gameMessage.kitchen_txt.near_dog}` })),
        //           on: { ENDSPEECH: "what_should_I_do" }
        //       },
        //       kitchen_cupboard: {
        //         initial: "cupboard",
        //         on: {
        //           RECOGNISED: [
        //             // Get object template
        //             {
        //               target: "what_should_I_do",
        //               cond: (context) => (context.nluResult.prediction.topIntent) === "take/grab/get lighter",
        //               actions: [gameObjects.lighter == true, soundPlayer("discovery_sound.mp3")],
        //             }
        //             // go back, help etc
        //           ]
        //         },
        //         states: {
        //           cupboard: {
        //             entry: send((context) => ({
        //               type: "SPEAK",
        //               value: `${gameMessage.kitchen_txt.cupboard}` })),
        //               on: { ENDSPEECH: "what_should_I_do" }
        //           },
        //           what_should_I_do: {
        //             entry: send("LISTEN")
        //           },
        //         }
        //       },
        //       rug: {
        //         initial: "check_rug",
        //         on: {
        //           RECOGNISED: [
        //             // Get object template
        //             {
        //               target: "#root.dm.mansion.kitchen_stairs",
        //               cond: (context) => (context.nluResult.prediction.topIntent) === "use/try the/() rusty key",
        //               actions: [gameObjects.lighter == true, soundPlayer("discovery_sound.mp3")],
        //             }
        //             // go back, help etc
        //           ]
        //         },
        //         states:{
        //           check_rug: {
        //           entry: send((context) => ({
        //             type: "SPEAK",
        //             value: `${gameMessage.kitchen_txt.rug}` })),
        //           on: { ENDSPEECH: "what_should_I_do" }
        //         },
        //         what_should_I_do: {
        //           entry: send("LISTEN")
        //         },
        //       },
        //     }
        //   }
        // },
        // kitchen_stairs:{
        //   initial: "kitchen_stairs_speak",
        //   on : {
        //     RECOGNISED: [
        //       {
        //         target: ".no_obstacle",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "use gasoline and lighter",
        //       }
        //       // if go back, etc / help
        //     ]
        //   },
        //   states: {
        //     kitchen_stairs_speak: {
        //       entry: send((context) => ({
        //         type: "SPEAK",     // use sound in the middle of these two sentences 
        //         value: `${gameMessage.kitchen_stairs_txt.kit_stairs_1,gameMessage.kitchen_stairs_txt.kit_stairs_2 }` })),
        //       on: { ENDSPEECH: "what_should_I_do" }
        //     },
        //     what_should_I_do: {
        //       entry: send("LISTEN")
        //     },
        //     no_obstacle: {
        //       entry: send((context) => ({
        //         type: "SPEAK",     // play monster scream sounds
        //         value: `${gameMessage.kitchen_stairs_txt.kit_stairs_3, gameMessage.kitchen_stairs_txt.kit_stairs_4}` })),
        //       on: { ENDSPEECH: "#root.dm.mansion.hall_basement" }
        //     },
        //   }
        // },
        // hall_basement: {
        //   initial: "hall_basement_speak",
        //   on : {
        //     RECOGNISED: [
        //       {
        //         target: "basement_room",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "enter room / open door",
        //       },
        //       {
        //         target: ".what_should_I_do",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "go further (in the hall)",
        //       },
        //       {
        //         target: ".what_should_I_do",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "go further (in the hall)",
        //       },
        //     ]
        //   },
        //   states: {
        //     hall_basement_speak: {
        //       entry: send((context) => ({
        //         type: "SPEAK",     // play SOUNDS
        //         value: `${gameMessage.hall_basement_txt.hall_base_1, gameMessage.hall_basement_txt.hall_base_2}` })),
        //       on: { ENDSPEECH: "what_should_I_do" }
        //     },
        //     what_should_I_do: {
        //       entry: send("LISTEN")
        //     },
        //     middle_of_hall: {
        //       always: [
        //         {
        //         target: "before_laboratory",
        //         cond: (context) => gameObjects.father_knowledge = true,
        //         actions: send((context) => ({
        //           type: "SPEAK",
        //           value: `${gameMessage.hall_basement_txt.hall_base_4}` })),
        //         },
        //         {
        //           target: "before_laboratory",
        //           cond: (context) => gameObjects.father_knowledge = false,
        //           actions: send((context) => ({
        //             type: "SPEAK",
        //             value: `${gameMessage.hall_basement_txt.hall_base_3}` }))
        //         },
        //       ]
        //     },
        //     before_laboratory: {
        //       initial: "enter_laboratory",
        //       on: { 
        //         RECOGNISED: [
        //           {
        //             target: "#root.dm.mansion.laboratory",
        //             cond: (context) => (context.nluResult.prediction.topIntent) === "open the door x 3" 
        //             // chainsaw sound stops
        //           },
        //         ]
        //       },
        //       states: {
        //         enter_laboratory: {
        //           entry: send((context) => ({
        //             type: "SPEAK",     // play SOUNDS
        //             value: `${gameMessage.hall_basement_txt.hall_base_5}` })),
        //         },
        //         what_should_I_do: {
        //           entry: send("LISTEN")
        //         },
        //       }
        //     }
        //   }
        // },
        // basement_room: {
        //   initial: "basement_speak",
        //   on : {
        //     RECOGNISED: [
        //       {
        //         target: ".boy_behind",
        //         cond: (context) => (context.nluResult.prediction.topIntent) === "check object" && (context.nluResult.query).includes("barrels"),
        //         // chainsaw sound stops
        //       },
        //       {
        //         target: ".boy_behind_2",
        //         cond: (context) => (context.recResult[0].utterance.toLowerCase().replace(/\.$/g, "")) === "hide behind the barrels" || "hide in the barrels" || "hide in barrels" || "hide behind barrels" ,
        //         // chainsaw sound stops
        //       },
        //       // on three FAILED TRIES, Maria founds me
        //     ]
        //   },
        //   states: {
        //     basement_speak: {
        //       entry: send((context) => ({
        //         type: "SPEAK",     // play SOUNDS
        //         value: `${gameMessage.basement_room_txt.basement_1, gameMessage.basement_room_txt.basement_2}` })),
        //     },
        //     what_should_I_do: {
        //       entry: send("LISTEN")
        //     },
        //     boy_behind: {
        //       entry: send((context) => ({
        //         type: "SPEAK",     // play SOUNDS
        //         value: `${gameMessage.basement_room_txt.boy_1, gameMessage.basement_room_txt.boy_2,  gameMessage.basement_room_txt.boy_3}` })),
        //     },
        //     boy_behind_2: {
        //       entry: send((context) => ({
        //         type: "SPEAK",     // play SOUNDS   change sound for actual sounds
        //         value: `${gameMessage.basement_room_txt.boy_4}` }))
        //     },
        //   },
        //   // if get to the bottom of conversation, father_knowledge = true
        // },
        // laboratory: {
        //   initial: "laboratory_speak",
        //   //on : {},
        //   states: {
        //     laboratory_speak: {
        //       entry: send((context) => ({
        //         type: "SPEAK",     
        //         value: `${gameMessage.lab_txt.lab_1}` })),
        //         on: { ENDSPEECH: "credits"}
        //     },
        //     credits : {
        //       entry: send((context) => ({
        //         type: "SPEAK",     
        //         value: `${gameMessage.CREDITS.credits}` })),
        //         on: { ENDSPEECH: "#root.dm.init"}
        //     }
        //   }
        // },
        // unused:
        mansion_hist: {
          type: "history",
          history: "deep"
        }
      }
    },
  },
};