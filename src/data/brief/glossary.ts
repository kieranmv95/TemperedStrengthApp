export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category?: "Movements" | "Equipment" | "Training" | "Nutrition" | "General";
}

// Mock Glossary Data (ELI5 Style)
export const glossary: GlossaryTerm[] = [
  {
    id: "term_001",
    term: "AMRAP",
    definition:
      "As Many Reps/Rounds As Possible. You keep going until the clock runs out or you physically can't do another rep. It's like a race against yourself.",
    category: "Training",
  },
  {
    id: "term_002",
    term: "RPE",
    definition:
      "Rate of Perceived Exertion. A scale from 1-10 measuring how hard a set felt. RPE 10 means you couldn't have done one more rep even if your life depended on it.",
    category: "Training",
  },
  {
    id: "term_003",
    term: "Superset",
    definition:
      "Two exercises done back-to-back with no rest between them. Like doing bicep curls immediately followed by tricep extensions. Your muscles hate it, but it saves time.",
    category: "Training",
  },
  {
    id: "term_004",
    term: "PR / PB",
    definition:
      "Personal Record or Personal Best. The heaviest weight you've ever lifted or fastest time you've achieved. The whole point of training, really.",
    category: "Training",
  },
  {
    id: "term_005",
    term: "Compound Movement",
    definition:
      "An exercise that uses multiple joints and muscle groups. Think squats, deadlifts, bench press. The big stuff that builds real strength.",
    category: "Movements",
  },
  {
    id: "term_006",
    term: "Isolation Movement",
    definition:
      "An exercise targeting one specific muscle. Bicep curls, leg extensions, etc. Good for bodybuilding, less efficient for overall strength.",
    category: "Movements",
  },
  {
    id: "term_007",
    term: "Hypertrophy",
    definition:
      "Muscle growth. When your muscles get bigger because you've been training them with enough volume and eating enough food. The 'gains' everyone talks about.",
    category: "Training",
  },
  {
    id: "term_008",
    term: "Deload",
    definition:
      "A planned week of easier training to let your body recover. Not being lazy – being smart. Even machines need maintenance.",
    category: "Training",
  },
  {
    id: "term_009",
    term: "Time Under Tension (TUT)",
    definition:
      "How long your muscles are working during a set. Slowing down the movement increases TUT, which can lead to more muscle growth.",
    category: "Training",
  },
  {
    id: "term_010",
    term: "Eccentric",
    definition:
      "The lowering phase of a lift. When you're lowering the barbell to your chest in a bench press. Where a lot of muscle damage (the good kind) happens.",
    category: "Movements",
  },
  {
    id: "term_011",
    term: "Concentric",
    definition:
      "The lifting phase of a movement. When you're pushing the bar away from your chest. The part where you're actively fighting gravity.",
    category: "Movements",
  },
  {
    id: "term_012",
    term: "Macros",
    definition:
      "Short for macronutrients: protein, carbs, and fats. The three main types of nutrients your body needs in large amounts. Tracking them helps optimize your diet.",
    category: "Nutrition",
  },
  {
    id: "term_013",
    term: "DOMS",
    definition:
      "Delayed Onset Muscle Soreness. That ache you feel 1-2 days after a hard workout. It means you worked hard, but it's not required for progress.",
    category: "Training",
  },
  {
    id: "term_014",
    term: "Spotter",
    definition:
      "A training partner who stands ready to help if you fail a lift. Essential for heavy bench press and squats. Don't ego lift without one.",
    category: "General",
  },
  {
    id: "term_015",
    term: "Failure",
    definition:
      "The point where you can't complete another rep with good form. Training to failure has its place, but it's not necessary for every set.",
    category: "Training",
  },
  {
    id: "term_016",
    term: "ROM",
    definition:
      "Range of Motion. How far you move through an exercise. Full ROM usually means better muscle development and joint health.",
    category: "Movements",
  },
  {
    id: "term_017",
    term: "Volume",
    definition:
      "Total amount of work done. Usually calculated as sets × reps × weight. More volume generally means more growth, up to a point.",
    category: "Training",
  },
  {
    id: "term_018",
    term: "Intensity",
    definition:
      "How heavy the weight is relative to your max. 80% intensity means you're using 80% of your one-rep max. Not to be confused with 'how hard it feels.'",
    category: "Training",
  },
  {
    id: "term_019",
    term: "Box",
    definition:
      "A Box is often the name given to a gym space, CrossFit intorduced this as many crossfit gyms are simply a box room with kit. For example: 'I will be at the box in 10 minutes'",
    category: "General",
  },
  {
    id: "term_020",
    term: "Reps",
    definition:
      "Repetitions. The number of times you perform an exercise. For example: 'I did 10 reps of squats'.",
    category: "Training",
  },
  {
    id: "term_021",
    term: "Sets",
    definition:
      "Sets. The number of times you perform an exercise. For example: 'I did 10 sets of squats'.",
    category: "Training",
  },
  {
    id: "term_022",
    term: "Pre",
    definition:
      "Pre-workout is a term used to describe pre-workout supplements. For example: 'I took a pre-workout before my workout'. Usually taken 15-30 minutes before a workout containing caffeine and other ingredients to enhance performance and energy.",
    category: "Nutrition",
  },
  {
    id: "term_023",
    term: "Post-workout",
    definition:
      "Post-workout is a term used to describe post-workout supplements. For example: 'I took a post-workout after my workout'. Usually taken 15-30 minutes after a workout containing protein and other ingredients to help with recovery and muscle growth.",
    category: "Nutrition",
  },
  {
    id: "term_024",
    term: "WOD",
    definition:
      "WOD is a term used to describe a workout of the day. For example: 'I did a WOD today'. Usually a workout that is designed to be done in a certain time frame.",
    category: "Training",
  },
  {
    id: "term_025",
    term: "EMOM",
    definition:
      "EMOM is a term used to describe a workout where you perform the same exercise for a certain number of minutes. For example: 'I did 10 minutes of burpees EMOM'. Usually done for a certain number of minutes.",
    category: "Training",
  },
  {
    id: "term_026",
    term: "For Time",
    definition:
      "For Time is a term used to describe a workout where you perform the same exercise for a certain number of minutes. For example: 'I did 10 minutes of burpees For Time'. Usually done for a certain number of minutes.",
    category: "Training",
  },
  {
    id: "term_027",
    term: "Pump",
    definition:
      "Pump is a term used to describe the feeling of fullness in the muscles. Usually felt after a workout. It is a good sign of muscle growth and development.",
    category: "Training",
  },
  {
    id: "term_028",
    term: "Tabata",
    definition:
      "A Tabata workout is a highly efficient, 4-minute form of High-Intensity Interval Training (HIIT) featuring eight rounds of 20 seconds of all-out effort exercise, followed by just 10 seconds of rest, developed by Japanese scientist Izumi Tabata for athletes.",
    category: "Training",
  },
  {
    id: "term_029",
    term: "HIIT / Hit Training",
    definition:
      "HiiT is a term used to describe High-Intensity Interval Training. It is a form of interval training, typically combining short bursts of high-intensity exercise with longer periods of lower-intensity exercise.",
    category: "Training",
  },
  {
    id: "term_030",
    term: "Clips",
    definition:
      "Clips are a type of equipment used to hold weights in place. They are often used in gyms to hold weights in place while you are working out. For example: 'I used clips to hold my weights in place'. Usually used for heavy weights on a standard barbell.",
    category: "Equipment",
  },
  {
    id: "term_031",
    term: "Biscuit Plates",
    definition:
      "A biscuit plate is usually a Tiny incremental weight plate used on a barbell (0.5kg, 1kg, 2kg). For example: 'I used a 0.5kg biscuit plate to add 0.5kg to my squat'. Usually used on a standard barbell.",
    category: "Equipment",
  },
];
