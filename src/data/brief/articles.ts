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
    
    - **Growth Hormone Release**: The majority of GH is released during deep sleep.
    - **Muscle Protein Synthesis**: Peaks during sleep when amino acids are available.
    - **Neural Recovery**: Your CNS repairs and consolidates motor patterns.
    
    ## Sleep Optimization Tips
    
    1. **Consistent Schedule**: Same bed/wake times, even on weekends.
    2. **Cool Room**: 18-20°C is optimal for sleep quality.
    3. **Dark Environment**: Block all light sources.
    4. **No Screens**: 60 minutes before bed minimum.
    
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
    
    ## Practical Application
    
    Before your next heavy set:
    1. Take 3 deep breaths.
    2. Visualize a successful lift.
    3. Execute with full commitment.`,
  },
  {
    id: "article_005",
    title: "Mastering the Squat Depth",
    subtitle: "How to improve mobility for a deeper, safer squat",
    category: "Technique",
    readTime: 9,
    image: "https://images.unsplash.com/photo-1574673003875-4a2ad2bcd5b5?w=800",
    content: `Squatting deep isn't just for show—it engages more muscle fibers and ensures better joint health.
    
    ## Common Mobility Issues
    
    ### Ankle Dorsiflexion
    If your heels lift off the ground, your ankles are likely tight. This forces the torso to lean too far forward.
    
    ### Hip Internal Rotation
    Tight hips prevent the "knees out" position, essential for creating space for the pelvis to drop.
    
    ## Drills to Improve Depth
    
    1. **Goblet Squat Holds**: Sink into a deep squat and use your elbows to push your knees out.
    2. **Ankle Wall Stretch**: Lean your knee toward a wall while keeping your heel planted.
    
    ## Technique Check
    
    Always film your sets from the side. Your hip crease should ideally drop below the top of your knee.`,
  },
  {
    id: "article_006",
    title: "Active Recovery vs. Passive Rest",
    subtitle: "When to move and when to sit still",
    category: "Recovery",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    content: `Should you spend your day off on the couch or on a light walk? The answer depends on your training intensity.
    
    ## What is Active Recovery?
    
    Active recovery involves low-intensity exercise to increase blood flow without adding stress.
    - Walking or light hiking
    - Swimming at a relaxed pace
    - Flow yoga or mobility work
    
    ## When to Choose Passive Rest
    
    Passive rest is necessary when:
    - You show signs of overtraining (high resting heart rate).
    - You have a localized injury.
    - You are mentally burnt out.
    
    ## The 50% Rule
    
    On an active recovery day, keep your effort at roughly 50% of what you would do during a normal training session.`,
  },
  {
    id: "article_007",
    title: "The Hierarchy of Hydration",
    subtitle: "Why water is the most underrated ergogenic aid",
    category: "Nutrition",
    readTime: 6,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800",
    content: `A mere 2% drop in body water levels can lead to a significant decrease in physical performance.
    
    ## Why Hydration Matters
    
    - **Joint Lubrication**: Synovial fluid is primarily water.
    - **Nutrient Transport**: Blood volume drops when dehydrated.
    
    ## Your Daily Protocol
    
    ### 1. The Morning Flush
    Drink 500ml of water immediately upon waking to combat overnight fluid loss.
    
    ### 2. The Training Buffer
    Aim for 500-750ml of water for every hour of intense exercise.
    
    ### 3. Electrolyte Balance
    If you sweat heavily, ensure you consume sodium and magnesium to maintain muscle contraction quality.`,
  },
  {
    id: "article_008",
    title: "Mastering the Conventional Deadlift",
    subtitle: "Technical pillars for a powerful, pain-free pull",
    category: "Technique",
    readTime: 10,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    content: `The deadlift is the ultimate test of strength. Success lies in the setup.
    
    ## The Setup Checklist
    
    ### 1. The Stance
    Feet hip-width apart. The bar should be over the mid-foot—about an inch from your shins.
    
    ### 2. The Grip
    Hinge and grip the bar just outside your legs. Do not move the bar.
    
    ### 3. Shins to Bar
    Bring your shins forward until they touch the bar. Drop your hips only as much as needed.
    
    ### 4. Chest Up
    Pull the slack out of the bar. Your lats should feel squeezed.
    
    ## The Movement
    
    Drive the floor away with your legs. It is a "push" off the floor followed by a "pull" to lockout. Keep the bar close to your body.`,
  },
  {
    id: "article_009",
    title: "Consistency vs. Intensity",
    subtitle: "The math of long-term body transformation",
    category: "Mindset",
    readTime: 5,
    image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800",
    content: `A world-class program followed for two weeks is useless compared to a basic program followed for two years.
    
    ## The 15-Minute Rule
    
    If you are exhausted, commit to just 15 minutes of your program. Usually, once you start, you'll finish. If you don't, you still maintained the habit.
    
    ## Key Strategies
    
    - **Log Everything**: Data provides proof of progress.
    - **Lower the Barrier**: Pack your gym bag the night before.
    - **Forgive Slip-ups**: If you miss a workout, just make the next choice a healthy one.
    
    Success is simply the result of average work repeated daily without quitting.`,
  },
  {
    id: "article_010",
    title: "Injury Prevention 101",
    subtitle: "Understanding the difference between pain and strain",
    category: "Recovery",
    readTime: 7,
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800",
    content: `Injury is the fastest way to halt progress. Understanding biofeedback is essential for longevity.
    
    ## Good Pain vs. Bad Pain
    
    ### Muscle Soreness (DOMS)
    A dull ache 24-48 hours after training. This is normal.
    
    ### Sharp/Joint Pain
    If you feel a sharp or radiating sensation, stop immediately. This is a signal of mechanical stress.
    
    ## Warm-up Essentials
    
    - **Raise**: Increase body temperature with light cardio.
    - **Activate**: Use low-intensity movements to "wake up" the muscles (e.g., glute bridges).
    - **Mobilize**: Move your joints through the required range of motion.
    
    Longevity is the ultimate gain. You can't build muscle if you're stuck on the physio's table.`,
  },
];
