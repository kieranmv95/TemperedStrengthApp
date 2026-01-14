// Brief Tab Data Types and Mock Data

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: "Methodology" | "Nutrition" | "Recovery" | "Mindset" | "Technique";
  readTime: number; // in minutes
  image: string;
  content: string;
  isFeatured?: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  artworkUrl: string;
  itunesUrl: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category?: "Movements" | "Equipment" | "Training" | "Nutrition" | "General";
}

// Mock Articles Data
export const articles: Article[] = [
  {
    id: "article_001",
    title: "The Science of Progressive Overload",
    subtitle: "Why adding weight isn't the only way to grow stronger",
    category: "Methodology",
    readTime: 8,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    isFeatured: true,
    content: `Progressive overload is the gradual increase of stress placed upon the body during training. While most people think this means simply adding more weight to the bar, there are actually multiple ways to achieve progressive overload.

## Methods of Progressive Overload

### 1. Increase Weight
The most obvious method. Add 2.5-5kg to your lifts when you can complete all prescribed reps with good form.

### 2. Increase Reps
If you're doing 3x8, try 3x10 with the same weight before adding load.

### 3. Increase Sets
Add volume by performing an additional set of your working weight.

### 4. Decrease Rest Time
Completing the same work in less time increases training density.

### 5. Improve Form
Better technique means more muscle activation and safer progression.

## The Key Principle

Your body adapts to stress. To continue making progress, you must consistently challenge it beyond its current capacity. Track your workouts, make small incremental changes, and trust the process.`,
  },
  {
    id: "article_002",
    title: "Nutrition Timing: Does It Really Matter?",
    subtitle: "Separating fact from fitness industry fiction",
    category: "Nutrition",
    readTime: 6,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    content: `The fitness industry has long perpetuated the myth of the "anabolic window" – the idea that you must consume protein within 30 minutes of your workout or lose your gains.

## The Truth

Research shows that total daily protein intake matters far more than timing. As long as you're hitting your protein targets (1.6-2.2g per kg of bodyweight), the exact timing is secondary.

## When Timing Does Matter

- **Fasted Training**: If you train without eating, having protein post-workout becomes more important.
- **Multiple Sessions**: Athletes training twice daily benefit from strategic nutrient timing.
- **Competition**: Pre-event nutrition timing is crucial for performance.

## Practical Takeaways

1. Focus on total daily intake first
2. Spread protein across 3-5 meals
3. Don't stress about the exact minute you eat
4. Pre-workout nutrition > post-workout for most people`,
  },
  {
    id: "article_003",
    title: "Sleep: The Ultimate Performance Enhancer",
    subtitle: "How 8 hours beats any supplement on the market",
    category: "Recovery",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
    content: `You can have the perfect training program and dial in your nutrition, but without adequate sleep, you're leaving gains on the table.

## What Happens During Sleep

- **Growth Hormone Release**: The majority of GH is released during deep sleep
- **Muscle Protein Synthesis**: Peaks during sleep when amino acids are available
- **Neural Recovery**: Your CNS repairs and consolidates motor patterns
- **Inflammation Reduction**: Sleep reduces systemic inflammation

## Sleep Optimization Tips

1. **Consistent Schedule**: Same bed/wake times, even on weekends
2. **Cool Room**: 18-20°C is optimal for sleep quality
3. **Dark Environment**: Block all light sources
4. **No Screens**: 60 minutes before bed minimum
5. **Limit Caffeine**: None after 2pm

## The Bottom Line

8 hours of quality sleep will do more for your performance than any legal supplement. Prioritize it.`,
  },
  {
    id: "article_004",
    title: "Mental Toughness in Training",
    subtitle: "Building an unbreakable mindset under the bar",
    category: "Mindset",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800",
    content: `The difference between a good lifter and a great one often comes down to what happens between the ears. Mental toughness isn't something you're born with – it's trained.

## Developing Mental Fortitude

### Embrace Discomfort
Growth happens outside your comfort zone. Learn to sit with discomfort rather than flee from it.

### Process Over Outcome
Focus on executing the lift perfectly, not on the number on the bar.

### Positive Self-Talk
Replace "I can't" with "I haven't yet." Your internal dialogue shapes your reality.

### Visualization
See yourself completing the lift before you approach the bar.

## Practical Application

Before your next heavy set:
1. Take 3 deep breaths
2. Visualize a successful lift
3. Use a cue word or phrase
4. Execute with full commitment

Mental training is training. Treat it with the same seriousness as your physical work.`,
  },
];

// Mock Playlists Data
export const playlists: Playlist[] = [
  {
    id: "playlist_003",
    title: "Heavy Metal Gym",
    subtitle: "Titan Strength",
    artworkUrl:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400",
    itunesUrl:
      "https://music.apple.com/gb/playlist/heavy-metal-gym-titan-strength/pl.u-yZyVW7Xudoa1YgG",
  },
  {
    id: "playlist_001",
    title: "80s Gym",
    subtitle: "The Neon Power Hour",
    artworkUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    itunesUrl:
      "https://music.apple.com/gb/playlist/80s-gym-the-neon-power-hour/pl.u-XkD04YEs2JayDV9",
  },
  {
    id: "playlist_002",
    title: "90s Gym",
    subtitle: "Millennium Momentum",
    artworkUrl:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400",
    itunesUrl:
      "https://music.apple.com/gb/playlist/90s-gym-millennium-momentum/pl.u-yZyVWPAFdoa1YgG",
  },
  {
    id: "playlist_004",
    title: "Rock Gym",
    subtitle: "The Iron Anthem",
    artworkUrl:
      "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400",
    itunesUrl:
      "https://music.apple.com/gb/playlist/rock-gym-the-iron-anthem/pl.u-XkD04oZI2JayDV9",
  },
  {
    id: "playlist_005",
    title: "Gym Mega Mix",
    subtitle: "No Rhyme or Reason",
    artworkUrl:
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    itunesUrl:
      "https://music.apple.com/gb/playlist/gym-mega-mix-no-rhyme-or-reason/pl.u-06oxDv3TYmAZWd0",
  },
];

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
];

// Helper functions
export const getFeaturedArticle = (): Article | undefined => {
  return articles.find((article) => article.isFeatured);
};

export const getArticleById = (id: string): Article | undefined => {
  return articles.find((article) => article.id === id);
};

export const searchGlossary = (query: string): GlossaryTerm[] => {
  const lowercaseQuery = query.toLowerCase();
  return glossary.filter(
    (term) =>
      term.term.toLowerCase().includes(lowercaseQuery) ||
      term.definition.toLowerCase().includes(lowercaseQuery)
  );
};

export const getGlossaryByCategory = (
  category: GlossaryTerm["category"]
): GlossaryTerm[] => {
  return glossary.filter((term) => term.category === category);
};
