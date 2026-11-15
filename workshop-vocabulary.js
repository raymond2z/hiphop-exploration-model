const workshopVocabulary = [
  {
    day: 1,
    steps: [
      "Walk it Out", "Smurf", "Harlem Shake", "Cabbage patch", "Seek",
      "Cat Daddy", "Shimmy", "Up Stairs Down Stairs", "Pop Corn", "Bobby Brown",
      "Dougie", "World of Dance", "Aunt Jackie", "Baseball", "Prep"
    ]
  },
  {
    day: 2,
    steps: [
      "Stomp", "Walk Out", "Butterfly慢版", "Getty Up快版", "Bart Simpson",
      "Sham Rock", "Nae Nae", "Cameo", "Out Law", "TLC", "Camel Walk",
      { name: "Bernnie", alternate: "Bennie" },
      "Skate", "Snake", "Roof Top", "Kid N Play"
    ]
  },
  {
    day: 3,
    steps: [
      "De-Da", "Chicken Head", "Wha-Bo", "Heart Attack", "Gigolo", "ATL Stomp",
      "Skip Skate Yeek Style", "Smurf Yeek Style", "Party Machine", "Diddy Dance"
    ]
  }
].flatMap(({ day, steps }) => steps.map(step =>
  typeof step === "string" ? { day, name: step } : { day, ...step }
));
