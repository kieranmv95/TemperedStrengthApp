import type { RecoverySource } from '@/src/types/recovery';

export const recoveryData: RecoverySource[] = [
  {
    id: 'r_01',
    title: 'Core Stability Flow',
    description:
      'Focus on bracing your midsection throughout. Move slowly. If you feel your lower back take over, reset.',
    difficulty: 'Beginner',
    estimatedTime: 10,
    tags: ['Core', 'Abs', 'Lower Back'],
    isPremium: false,
    blocks: [
      {
        name: 'Cat-Cow',
        videoId: 'LIVJZZyZ2qM',
        instructions:
          'On all fours. Inhale and let your belly drop (Cow), exhale and round your spine toward the ceiling (Cat). Link each movement to your breath.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Dead Bug',
        instructions:
          'Lie on your back, arms pointing to the ceiling, knees at 90°. Slowly lower opposite arm and leg toward the floor without letting your lower back lift. Return and switch.',
        dose: { kind: 'duration', seconds: 45 },
      },
      {
        name: 'Bird-Dog',
        instructions:
          'On all fours. Extend your opposite arm and leg simultaneously, keeping your hips level. Pause for 2 seconds at the top before returning.',
        dose: { kind: 'duration', seconds: 45 },
      },
      {
        name: 'Hollow Body Hold',
        instructions:
          'Lie on your back. Press your lower back into the floor, lift your shoulders and legs slightly, arms overhead. Hold the position without letting your back arch.',
        dose: { kind: 'duration', seconds: 30 },
      },
      {
        name: 'Side Plank',
        instructions:
          "Stack your feet, lift your hips into a straight line. Keep your free hand on your hip or reach toward the ceiling. Don't let your hips sag.",
        dose: { kind: 'duration_bilateral', secondsPerSide: 30 },
      },
      {
        name: 'Cobra Pose',
        instructions:
          'Lie face-down, hands under your shoulders. Press up using your back muscles, trying not to push too hard with your arms. Hold and breathe into your belly.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: "Child's Pose",
        instructions:
          'Sink your hips back to your heels, arms extended. Let your lower back decompress completely. Breathe deeply through your nose.',
        dose: { kind: 'duration', seconds: 90 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_02',
    title: 'Desk Job Recovery',
    description:
      'The antidote to sitting. Undoes the damage from hours at a desk: tight hips, a locked upper back, and rounded shoulders. Breathe deeply into each stretch.',
    difficulty: 'Beginner',
    estimatedTime: 12,
    tags: ['Recovery', 'Posture', 'Hips', 'Upper Back'],
    isPremium: false,
    blocks: [
      {
        name: 'Neck Rolls',
        instructions:
          "Slowly drop your right ear to your right shoulder and roll your chin to your chest, then to the left. Keep the movement smooth and don't roll your head backward.",
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Cat-Cow',
        instructions:
          'On all fours. Inhale to drop your belly (Cow), exhale to round your spine (Cat). Move slowly and let your neck follow naturally.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Thread the Needle',
        instructions:
          'On all fours, slide one arm under your torso until your shoulder and cheek rest on the ground. Use the top arm for a gentle assist. Hold, then switch sides.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Couch Stretch',
        instructions:
          'Kneel with one shin resting vertically against a wall or couch, front foot flat on the floor. Stand tall through your torso, no hunching forward. You should feel a strong stretch in your front hip.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Pigeon Pose',
        instructions:
          'From a lunge, bring your front shin across the mat at roughly 45°. Square your hips toward the floor and fold your torso forward. Use a cushion under your hip if needed.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Cobra Pose',
        instructions:
          'Hands under your shoulders, elbows close. Press up and open the chest, keeping your lower body relaxed on the floor.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: "Child's Pose",
        instructions:
          'Arms extended, hips back to heels. Let your spine lengthen and breathe into your lower back. This is your finish. Stay as long as you need.',
        dose: { kind: 'duration', seconds: 60 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_03',
    title: 'Handstand Prep',
    description:
      'Wrist prep, scapular control, and body-line practice. Do this before any handstand session. Skip it and your wrists will remind you later.',
    difficulty: 'Intermediate',
    estimatedTime: 10,
    tags: ['Shoulders', 'Wrists', 'Skill', 'Handstand'],
    isPremium: false,
    blocks: [
      {
        name: 'Wrist Circles',
        instructions:
          'Extend both arms and rotate your wrists in large, slow circles. Reverse direction at the halfway point. This warms the joint through its full range.',
        dose: {
          kind: 'duration',
          seconds: 30,
          rounds: 2,
          roundsLabel: 'each direction',
        },
      },
      {
        name: 'Wrist Flexor Stretch',
        instructions:
          'Place palms flat on the floor with fingers pointing back toward your knees. Gently shift your weight over the hand until you feel a stretch along the forearm. Slightly increase the pressure and lightly move forward and backward to release tension.',
        dose: {
          kind: 'duration',
          seconds: 60,
        },
      },
      {
        name: 'Extensor Stretch',
        instructions:
          'Place palms flat on the floor with fingers pointing away from your knees. Gently shift your weight over the hand until you feel a stretch along the back of the forearm. Slightly increase the pressure and lightly move forward and backward to release tension.',
        dose: {
          kind: 'duration',
          seconds: 60,
        },
      },
      {
        name: 'Scapular Push-ups',
        instructions:
          'In a high plank. Without bending your elbows, let your chest sink between your arms (protraction), then push the floor away and spread your shoulder blades apart (retraction). Controlled only.',
        dose: { kind: 'reps', count: 15 },
      },
      {
        name: 'Wall Slides',
        instructions:
          "Stand with your back against a wall, arms in a goal-post position. Slowly slide your arms overhead while keeping your elbows and wrists in contact with the wall. If you can't maintain contact, only go as high as you can.",
        dose: { kind: 'reps', count: 15 },
      },
      {
        name: 'Pike Push-ups',
        instructions:
          'High push-up position, walk your feet in until your hips are high and your body forms an inverted V. Lower your head toward the floor between your hands, then press back up.',
        dose: { kind: 'reps', count: 10 },
      },
      {
        name: 'Wall Walk',
        instructions:
          'Start in a push-up position with feet at the wall. Walk your feet up the wall as you walk your hands in, getting as vertical as possible. Hold briefly at the top, then reverse slowly.',
        dose: { kind: 'reps', count: 5 },
      },
      {
        name: 'Kick-up Practice',
        instructions:
          'Hands on the floor, shoulder-width apart. Kick up gently with one leg and let the other follow. Focus on a straight body line, not height. Keep your gaze between your hands.',
        dose: { kind: 'duration', seconds: 60 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_04',
    title: 'Shoulder Health Flow',
    description:
      'Prehab for athletes with stiff or overhead-heavy shoulders. Use a light resistance band. This should feel like active recovery, not a workout.',
    difficulty: 'Beginner',
    estimatedTime: 10,
    tags: ['Shoulders', 'Prehab', 'Rotator Cuff'],
    isPremium: false,
    blocks: [
      {
        name: 'Arm Swings',
        instructions:
          'Stand tall and let both arms swing loosely across your chest and back out to the sides. Gradually increase the range as your shoulders warm up. Relax your neck and jaw.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Thread the Needle',
        instructions:
          'On all fours, thread one arm under your torso until your shoulder and cheek rest on the ground. Use the free arm to deepen the stretch gently. Breathe into the upper back.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      {
        name: 'Pec Opener',
        instructions:
          "Stand in a doorway or place your forearm on a wall at 90°. Gently rotate your chest away from the arm until you feel a stretch across the pec and front shoulder. Don't lean aggressively.",
        dose: { kind: 'duration_bilateral', secondsPerSide: 30 },
      },
      {
        name: 'Wall Slides',
        instructions:
          'Back against the wall, arms in a goal-post. Slide arms overhead while keeping all contact points on the wall. Slow and controlled only.',
        dose: { kind: 'reps', count: 15 },
      },
      {
        name: 'Banded Pull-Aparts',
        instructions:
          "Hold a resistance band at chest height with both hands, palms down, arms straight. Pull the band apart by squeezing your shoulder blades together. Control the return. Don't let it snap back.",
        dose: { kind: 'reps', count: 20 },
      },
      {
        name: 'Band Pass-Throughs',
        instructions:
          "Hold a band with a wide grip in front of your thighs. Keeping your arms straight, raise the band overhead and bring it all the way behind you until it touches your lower back. Reverse. If you can't keep your arms straight, widen your grip.",
        dose: { kind: 'reps', count: 15 },
      },
    ],
    equipment: ['bands'],
  },
  {
    id: 'r_05',
    title: 'Full Body Reset',
    description:
      'A head-to-toe mobility session to use the morning after a heavy training day. Move slowly. Today is about restoring range, not adding fatigue.',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Full Body', 'Recovery', 'Post-Workout'],
    isPremium: true,
    blocks: [
      {
        name: 'Neck Rolls',
        instructions:
          'Slow, deliberate rolls from ear to shoulder to chest. Reverse halfway. Never roll your head back.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Thoracic Rotation',
        instructions:
          'Sit cross-legged. Place one hand behind your head and rotate your elbow toward the ceiling, following with your eyes. Return to centre and repeat. Keep your lower back still.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Cat-Cow',
        instructions:
          'Slow breath-linked spinal movement. 5 seconds per direction.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: "World's Greatest Stretch",
        instructions:
          'From a deep lunge, place the same-side hand inside your front foot. Rotate your top arm to the ceiling, following with your gaze. Return, then add a hamstring reach: straighten your front leg and hinge forward.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Hip 90/90',
        instructions:
          'Sit on the floor with both legs bent at 90°: one in front, one to the side. Sit tall on both sit bones. Hold, then rotate forward to the other side.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Pigeon Pose',
        instructions:
          'Front shin across the mat. Square your hips and fold forward. Breathe deeply into your outer hip.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Supine Twist',
        instructions:
          'Lie on your back. Hug one knee to your chest, then guide it across your body while your arms extend out to the sides. Keep both shoulders on the floor.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: "Child's Pose",
        instructions:
          'Final rest. Arms extended, hips back. Breathe slowly for the full duration.',
        dose: { kind: 'duration', seconds: 90 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_06',
    title: 'Hip Flexor Unlock',
    description:
      'Targeted work for chronically tight hip flexors, common in anyone who sits, squats heavy, or runs. Expect one side to feel noticeably tighter than the other.',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    tags: ['Hips', 'Mobility', 'Lower Body'],
    isPremium: true,
    blocks: [
      {
        name: 'Supine Hip Circles',
        instructions:
          'Lie on your back and hug both knees to your chest. Draw large circles with your knees, rotating through the hip joint. Reverse direction halfway.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Couch Stretch',
        instructions:
          'Kneel with one shin against a wall, front foot flat. Drive your hips forward and stand tall. The goal is a vertical torso. Resist arching your lower back to compensate.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Kneeling Hip Flexor Stretch with Reach',
        instructions:
          'In a kneeling lunge, squeeze the glute of the back leg to posteriorly tilt your pelvis. Raise the arm on the same side as your back leg overhead and gently reach to the opposite side.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Pigeon Pose',
        instructions:
          'Bring your front shin across the mat. Spend extra time here. Fold your torso forward and breathe into the deep glute and hip flexor.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 120 },
      },
      {
        name: 'Lizard Pose',
        instructions:
          'From a deep lunge with both hands inside your front foot, lower your back knee to the ground (or keep it raised for more intensity). Walk your hands forward if you can.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Supine Figure Four',
        instructions:
          'Lie on your back. Cross one ankle over the opposite knee and flex the foot. Either pull the bottom leg toward you or press the top knee gently away. Feel the outer hip.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_07',
    title: 'Thoracic Spine Restore',
    description:
      "The thoracic spine is the region most people completely neglect. Unlocking it improves posture, overhead range, and even breathing. You may feel some cracking. That's normal.",
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Upper Back', 'Posture', 'Spine', 'Mobility'],
    isPremium: true,
    blocks: [
      {
        name: 'Foam Roller T-Spine Extension',
        instructions:
          'Place a foam roller horizontally under your mid-back (not lower back). Support your head with interlaced hands. Gently extend over the roller, working your way up a few segments at a time. 30 seconds per segment.',
        dose: { kind: 'duration', seconds: 180 },
      },
      {
        name: 'Open Book Stretch',
        instructions:
          'Lie on your side with knees bent at 90°, arms extended in front of you. Slowly rotate your top arm up and over toward the floor on the other side, following with your gaze. Return and repeat.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Seated Thoracic Rotation',
        instructions:
          'Sit cross-legged or on a chair. Place one hand behind your head and the other on the opposite knee. Use the knee as a lever to rotate your chest as far as you can. Hold at end range for 2 seconds.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Thread the Needle',
        instructions:
          'On all fours. Slide one arm under your torso and reach as far as you can. The shoulder and cheek rest on the ground. Breathe into the upper back and hold the end position.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Prayer Stretch (Lat/T-Spine)',
        instructions:
          'Kneel in front of a bench or box. Extend your arms onto the surface and sink your chest toward the floor, letting your armpits open. Keep your hips directly over your knees.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Puppy Pose',
        instructions:
          'On all fours, walk your hands forward and let your chest sink toward the floor, keeping your hips over your knees. Hold with your forehead or chin resting on the mat.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Doorframe Pec Stretch',
        instructions:
          'Stand in a doorframe. Arms at 90° on the frame, step one foot forward and gently press your chest through the gap. Hold without holding your breath.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
    ],
    equipment: ['foam roller'],
  },
  {
    id: 'r_08',
    title: 'Lower Body Flush',
    description:
      'Designed for after leg day or a long run. Works through the quads, hamstrings, calves, and glutes to speed up recovery and restore movement quality.',
    difficulty: 'Beginner',
    estimatedTime: 18,
    tags: ['Lower Body', 'Recovery', 'Legs', 'Post-Workout'],
    isPremium: true,
    blocks: [
      {
        name: 'Standing Quad Stretch',
        instructions:
          'Stand on one leg, pull your heel to your glute. Keep your knees together and stand tall. Use a wall for balance if needed.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Downward Dog with Pedalling',
        instructions:
          'From a high plank, push your hips up and back. Alternate pressing each heel toward the floor, slow and deliberate, holding each side for 2 seconds.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Standing Hamstring Stretch',
        instructions:
          'Place one heel on a low surface or step. Hinge at your hips (not your waist) and reach toward your foot until you feel a stretch in the back of your thigh. Keep your spine long.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Foam Roller Quads',
        instructions:
          'Lie face-down with the roller under one quad. Use your arms to control the pressure. Roll slowly from just above the knee to the hip flexor region. Pause on tight spots.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Foam Roller IT Band / Outer Thigh',
        instructions:
          'On your side with the roller under the outer thigh. Support yourself on your forearm. Roll from just above the knee to just below the hip. Go slowly. This one can be intense.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Pigeon Pose',
        instructions:
          'Front shin across the mat. Focus on breathing and letting the hip release rather than forcing depth.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Supine Hamstring Stretch',
        instructions:
          'Lie on your back. Loop a band or towel around one foot and extend the leg toward the ceiling. Keep the other leg flat on the floor. Hold at a point of comfortable tension.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Legs Up the Wall',
        instructions:
          'Sit sideways against a wall and swing your legs up. Relax completely for the full duration. This drains lactic acid and reduces swelling in the legs.',
        dose: { kind: 'duration', seconds: 180 },
      },
    ],
    equipment: ['foam roller'],
  },
  {
    id: 'r_09',
    title: 'Morning Mobility Wake-Up',
    description:
      'A gentle 15-minute flow to do before coffee, training, or anything else. No equipment, no warm-up needed. This is the warm-up.',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Morning', 'Full Body', 'Mobility'],
    isPremium: true,
    blocks: [
      {
        name: 'Diaphragmatic Breathing',
        instructions:
          'Lie on your back with hands on your belly. Breathe in for 4 seconds through your nose, feeling your belly rise. Exhale for 6 seconds. This activates the parasympathetic nervous system.',
        dose: { kind: 'duration', seconds: 120 },
      },
      {
        name: 'Supine Twist',
        instructions:
          'From lying, hug one knee across your body. Both shoulders stay flat. Hold, breathe, switch.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Cat-Cow',
        instructions:
          'Slow and breath-driven. Let your spine find its full range in both directions before you add speed.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Downward Dog',
        instructions:
          'Hold at the top and breathe into the backs of your legs. Pedal your heels alternately to gradually open the calves and hamstrings.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Low Lunge with Thoracic Rotation',
        instructions:
          'Step into a low lunge. Place one hand behind your head and rotate your elbow toward the ceiling. Slow reps: 5 each side before switching.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Hip 90/90',
        instructions:
          'Sit on the floor with both knees bent to 90°. Sit tall and breathe. If one side barely reaches the floor, add a folded blanket under that hip.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        name: 'Standing Hip Circles',
        instructions:
          'Stand on one leg and draw large circles with the opposite knee. Slow and controlled. Use a wall for balance.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 30 },
      },
      {
        name: 'Chest Opener',
        instructions:
          'Interlace your hands behind your back. Stand tall, roll your shoulders back, and gently lift your arms while expanding your chest toward the ceiling.',
        dose: { kind: 'duration', seconds: 60 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_10',
    title: 'Wrist & Forearm Health',
    description:
      'Essential if you do any gymnastics work, barbell pressing, or ring training. Neglecting wrist prep is the fastest route to an overuse injury that sidelines you for weeks.',
    difficulty: 'Intermediate',
    estimatedTime: 14,
    tags: ['Wrists', 'Forearms', 'Prehab', 'Skill'],
    isPremium: true,
    blocks: [
      {
        name: 'Wrist Circles',
        instructions:
          'Extend both arms and circle both wrists simultaneously: clockwise for 30 seconds, anti-clockwise for 30 seconds. Big, slow rotations through the full range.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Palm-Down Forearm Stretch',
        instructions:
          'Extend one arm forward, palm down. Use the other hand to gently pull the fingers back toward you. Hold at the point of tension. This stretches the extensors along the top of the forearm.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      {
        name: 'Palm-Up Forearm Stretch',
        instructions:
          'Extend one arm forward, palm up. Gently pull the fingers back and down. This stretches the flexors on the underside of the forearm.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      {
        name: 'Wrist Weight-Shifting (Hands on Floor)',
        instructions:
          'In a tall kneeling or bear position, place your hands flat on the floor with fingers pointing forward. Gently rock forward and back over your wrists, gradually loading them through their range.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Finger Extensions with Band',
        instructions:
          'Loop a light band around all five fingers on one hand. Open your hand against the resistance of the band, fully extending all fingers. This strengthens the extensors to balance grip-heavy training.',
        dose: { kind: 'reps_bilateral', countPerSide: 20, unit: 'reps' },
      },
      {
        name: 'Reverse Wrist Circles (Knuckles Down)',
        instructions:
          'On all fours, flip both hands so the backs of your hands face the floor and fingers point toward your knees. Gently shift your weight over your hands. Hold where it feels tight.',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        name: 'Prayer Stretch & Reverse Prayer',
        instructions:
          'Press your palms together in front of your chest (prayer) and slowly lower them toward your waist. Then flip: backs of hands together, raise them toward your chest (reverse prayer).',
        dose: {
          kind: 'duration',
          seconds: 45,
          rounds: 2,
          roundsLabel: 'each position',
        },
      },
    ],
    equipment: ['bands'],
  },
  {
    id: 'r_11',
    title: 'Deep Stretch: Hips and Hamstrings',
    description:
      'A longer, deeper session for when you have time and your body genuinely needs it. Work slowly into each position. Passive stretching at this intensity requires patience, not force.',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['Hips', 'Hamstrings', 'Flexibility', 'Deep Stretch'],
    isPremium: true,
    blocks: [
      {
        name: 'Supine Windshield Wipers',
        instructions:
          'Lie on your back with knees bent, feet wider than shoulder-width. Let both knees fall to one side, then slowly sweep them to the other. Breathe out as they fall.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Happy Baby',
        instructions:
          'Lie on your back, hug your knees to your chest, then grab the outside edges of your feet and gently pull them toward the floor on either side of your torso. Rock side to side.',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        name: 'Hip 90/90 with Forward Fold',
        instructions:
          'In a 90/90 position, slowly walk your hands forward over the front leg until you feel a stretch deep in the hip. Hold, breathe, rotate to the other side.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 120 },
      },
      {
        name: 'Pigeon Pose',
        instructions:
          "Allow full 2-minute holds on each side. Fold completely forward and let go of any muscular effort. Use a prop under your hip if the pelvis doesn't reach the floor.",
        dose: { kind: 'duration_bilateral', secondsPerSide: 120 },
      },
      {
        name: 'Wide-Leg Forward Fold',
        instructions:
          'Stand with feet 3–4 feet apart. Hinge at the hips and walk your hands down your legs or to the floor. Let gravity do the work. Bend your knees slightly if your hamstrings are very tight.',
        dose: { kind: 'duration', seconds: 120 },
      },
      {
        name: 'Seated Forward Fold',
        instructions:
          "Sit with legs extended. Hinge from the hips (not the waist) and reach for your feet. Hold wherever your range ends. Don't round your back to create the illusion of progress.",
        dose: { kind: 'duration', seconds: 120 },
      },
      {
        name: 'Reclined Butterfly',
        instructions:
          'Lie on your back, bring the soles of your feet together, and let your knees fall open. Place one hand on your belly and one on your chest. Breathe fully and let gravity stretch your inner thighs.',
        dose: { kind: 'duration', seconds: 120 },
      },
      {
        name: 'Savasana',
        instructions:
          "Lie flat, arms slightly away from your body, palms up. Close your eyes. The nervous system integration of this flow happens here. Don't skip it.",
        dose: { kind: 'duration', seconds: 120 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_12',
    title: 'Pre-Workout Activation',
    description:
      'Not a stretch session. This is activation. Prime your glutes, open your hips, and wake up the scapular muscles so your body is actually ready to train, not just warm.',
    difficulty: 'Intermediate',
    estimatedTime: 12,
    tags: ['Activation', 'Pre-Workout', 'Glutes', 'Scapula'],
    isPremium: true,
    blocks: [
      {
        name: 'Glute Bridges',
        instructions:
          'Lie on your back, feet flat. Drive through your heels and squeeze your glutes hard at the top. Hold each rep for 2 seconds. If you feel your hamstrings more than your glutes, move your feet closer.',
        dose: { kind: 'reps', count: 20 },
      },
      {
        name: 'Clamshells',
        instructions:
          "Lie on your side with hips stacked, knees bent to 45°. Keep your feet together and rotate the top knee toward the ceiling. Don't let your pelvis rock back. Use a band above the knee to add resistance.",
        dose: { kind: 'reps_bilateral', countPerSide: 20, unit: 'reps' },
      },
      {
        name: 'Banded Monster Walks',
        instructions:
          "Band above the knees. Stand in a slight squat and walk forward, laterally, then back, maintaining tension in the band throughout. Don't let your knees cave inward.",
        dose: {
          kind: 'reps',
          count: 10,
          unit: 'steps',
          rounds: 4,
          roundsLabel: 'each direction',
        },
      },
      {
        name: 'Bear Crawl Hold',
        instructions:
          'Kneel on all fours, then lift your knees 2 inches off the ground. Hold this position with a flat back and braced core. This activates your shoulder stabilisers and deep core.',
        dose: { kind: 'duration', seconds: 30 },
      },
      {
        name: "World's Greatest Stretch",
        instructions:
          'From a deep lunge, place your inside hand on the floor and rotate the top arm to the ceiling. Spend time at the top. Optional: add a hamstring reach at the end.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      {
        name: 'Band Pull-Aparts',
        instructions:
          'Arms straight at chest height. Pull the band apart until it touches your chest, squeezing your shoulder blades together. This fires up the rear delts and scapular retractors before pressing or pulling.',
        dose: { kind: 'reps', count: 20 },
      },
      {
        name: 'Inchworms',
        instructions:
          'Stand tall, hinge at your hips, and walk your hands out to a plank. Pause, then walk your feet toward your hands. This ties together hamstring length and anterior core control.',
        dose: { kind: 'reps', count: 8 },
      },
    ],
    equipment: ['bands'],
  },
  {
    id: 'p_01',
    title: 'Full Body Flush',
    description:
      'A head-to-toe percussive reset. Cycle through every major muscle group to reduce soreness, improve circulation, and leave you feeling like you have new legs. Use the ball attachment throughout.',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Full Body', 'Recovery', 'Percussive'],
    isPremium: false,
    blocks: [
      {
        name: 'Upper Traps',
        instructions:
          'Place the ball on the top of your shoulder, midway between your neck and the tip of your shoulder. Let your arm hang loose. Slow, sweeping passes from the base of your skull outward. Avoid pressing directly onto the spine.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Pecs',
        instructions:
          'Work across the chest from the sternum outward toward the shoulder. Keep the gun angled slightly away from the collarbone and avoid the armpit. Best done in a doorway so your arm can rest freely at your side.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Lats',
        instructions:
          'Reach the gun to the outer edge of your back, just below the armpit, and work downward in slow vertical passes. Raise your arm overhead to put the lat on stretch for a deeper effect.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Medium' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Quads',
        instructions:
          'Sit on the edge of a chair or bench with your leg extended. Work in slow passes from just above the knee upward to the hip flexor. Cover all three heads: sweep the inner, middle, and outer quad. Avoid the knee joint itself.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Hamstrings',
        instructions:
          'Sit with your leg extended on a surface. Work from just above the back of the knee up toward the glute. Use a slow gliding motion rather than holding in one spot for too long.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Calves',
        instructions:
          'Sit with one ankle crossed over the opposite knee, or extend your leg out. Work both the gastrocnemius (upper, meatier portion) and soleus (lower, closer to the ankle) in separate slow passes.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Glutes',
        instructions:
          'Stand or lie on your side. Work across the full gluteal region in a grid pattern. Find any knots and pause briefly without holding longer than 5 seconds in one spot. Avoid the tailbone and sacrum.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_02',
    title: 'Upper Body Reset',
    description:
      'Thorough percussive work across the shoulders, chest, arms, and upper back. Ideal after pressing, pulling, or overhead sessions. Spend longer on any area that feels particularly knotted.',
    difficulty: 'Beginner',
    estimatedTime: 18,
    tags: ['Upper Body', 'Recovery', 'Percussive', 'Shoulders'],
    isPremium: true,
    blocks: [
      {
        name: 'Upper Traps',
        instructions:
          'Sweep from the base of the skull outward to the tip of the shoulder. Drop your chin to your chest to put the muscle on a gentle stretch. Cover both sides before moving on.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Rear Delts and Teres',
        instructions:
          'Work across the back of the shoulder and the small muscles running from the armpit to the shoulder blade. Reach your working arm across your chest to open this region. Slow, deliberate passes.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Medium' },
            { seconds: 45, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'Pecs',
        instructions:
          'Start at the sternum and sweep outward in horizontal passes. Work from the collarbone level down to the bottom of the pec. Avoid the armpit and skip any areas directly over the collarbone.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Biceps',
        instructions:
          'Extend your arm and rest it on a surface, palm up. Work in slow vertical passes from the elbow crease up toward the shoulder. Avoid the elbow joint itself.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Triceps',
        instructions:
          'Rest your arm with the back of the upper arm facing up. Slow passes from elbow to shoulder. Focus on the lateral head (outer) and the long head (the portion closest to the armpit). Both respond well to firm pressure.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Medium' },
            { seconds: 45, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'Forearms',
        instructions:
          'Extend your arm, palm up for the flexors (underside), then palm down for the extensors (top). Both sides of the forearm take a lot of load and are often skipped. Use light pressure only near the wrist.',
        dose: {
          kind: 'percussive_bilateral',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Rhomboids and Mid Traps',
        instructions:
          'Reach your arm across your chest to wing your shoulder blade out. Work the area between the spine and the inner edge of the shoulder blade. Avoid pressing directly onto the spine. Two slow passes per side.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'Lats',
        instructions:
          'Raise one arm overhead and work the outer back from armpit to lower ribs in vertical sweeps. The lat on stretch receives the percussive work far more effectively than when the arm is at rest.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_03',
    title: 'Lower Body Reset',
    description:
      'A complete percussive flush for the hips, quads, hamstrings, calves, and feet. Use this after leg day, heavy squatting, or any session that leaves your legs feeling beaten up.',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Lower Body', 'Recovery', 'Percussive', 'Legs'],
    isPremium: true,
    blocks: [
      {
        name: 'Hip Flexors',
        instructions:
          'Lie on your back or stand upright. Place the ball just below the front of your hip bone and work slowly across the upper quad and into the hip crease. This area is often tender, so start light and only increase if it feels productive.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Glutes',
        instructions:
          'Lie on your side or stand with the gun behind you. Work across all three glute regions in a slow grid. Pause on any knots for no more than 5 seconds before moving on. Both sides.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Medium' },
            { seconds: 90, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'IT Band and Outer Quad',
        instructions:
          'Stand or lie on your side. The IT band itself does not benefit from deep pressure, so keep this light and use gliding passes. The goal is the tissue either side of it, not the band itself.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Light' },
          ],
        },
      },
      {
        name: 'Quads',
        instructions:
          'Sit on the edge of a bench with your leg extended. Work in three columns: inner, middle, and outer quad. Slow upward passes from just above the knee to the hip. Avoid the kneecap.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Adductors (Inner Thigh)',
        instructions:
          'Sit with your knee turned out and leg resting on a surface. Work the inner thigh from just above the knee up toward the groin. Keep pressure light near the top. Often one of the most productive areas after squats and lunges.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Hamstrings',
        instructions:
          'Sit at the edge of a surface with the back of your thigh accessible. Work from above the knee upward in slow passes. Spend extra time on the biceps femoris (outer hamstring) and the semimembranosus (inner) as separate passes.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Calves',
        instructions:
          'Sit with your leg extended and ankle relaxed. Upper calf first (gastrocnemius), then lower calf toward the ankle (soleus). Keep the ankle joint itself off limits. Both sides.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Plantar Fascia (Feet)',
        instructions:
          'Sit and rest your foot on the opposite knee. Work across the arch from heel to the ball of the foot in slow, deliberate passes. Use a lighter touch on the heel. Often dramatically effective for runners and lifters alike.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_04',
    title: 'Run Warm-Up',
    description:
      'A pre-run percussive activation sequence. The goal here is not recovery but stimulation: waking up the calves, quads, glutes, and hip flexors so they are firing properly before your first kilometre. Keep sessions brief and pressure moderate.',
    difficulty: 'Beginner',
    estimatedTime: 8,
    tags: ['Running', 'Warm-Up', 'Percussive', 'Activation'],
    isPremium: true,
    blocks: [
      {
        name: 'Hip Flexors',
        instructions:
          'Brief passes across the front of the hip crease. The goal is to wake this area up, not release it. Keep it moving and do not linger. Both sides.',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 30, intensity: 'Medium' }],
        },
      },
      {
        name: 'Glutes',
        instructions:
          'Quick, brisk passes across both glutes. You want to stimulate blood flow and neural drive into these muscles before they have to fire. Move faster than you would in a recovery session.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 30, intensity: 'Medium' },
            { seconds: 30, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'Quads',
        instructions:
          'Work from knee to hip in faster passes than a recovery session. Cover the full quad surface on each leg. This raises local tissue temperature and primes the muscles for loading.',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 30, intensity: 'Medium' }],
        },
      },
      {
        name: 'Hamstrings',
        instructions:
          'Quick sweeping passes from above the knee to the upper thigh. Do not go too firm pre-run. The aim is stimulation, not deep tissue work.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 30, intensity: 'Light' },
            { seconds: 30, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Calves',
        instructions:
          'Focus on the upper gastrocnemius with brisk, stimulating passes. Give the lower calf and soleus a quick pass too. This is one of the highest-payoff areas to activate before running.',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 30, intensity: 'Medium' }],
        },
      },
      {
        name: 'Plantar Fascia (Feet)',
        instructions:
          'Quick passes across the arch of each foot. This is especially useful in cold weather or first thing in the morning when the fascia is at its least pliable. Keep it brief.',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 20, intensity: 'Light' }],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_05',
    title: 'Run Recovery',
    description:
      'Designed for the 30 minutes after a run, while your muscles are still warm. Works through every tissue that absorbs impact during running: calves, plantar fascia, quads, hamstrings, and glutes. Slower and deeper than the warm-up.',
    difficulty: 'Beginner',
    estimatedTime: 16,
    tags: ['Running', 'Recovery', 'Percussive', 'Post-Run'],
    isPremium: true,
    blocks: [
      {
        name: 'Plantar Fascia (Feet)',
        instructions:
          'Start here while the tissue is still warm. Sit and rest one foot on the opposite knee. Slow passes from heel to ball of foot. This is the first point of impact on every stride and often the most neglected. Both feet.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Calves',
        instructions:
          'Sit with your leg extended. Work the full gastrocnemius first, then move to the soleus (the lower, flatter muscle beneath it). The soleus absorbs enormous load during running and rarely gets direct attention. Both sides.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Achilles and Lower Leg',
        instructions:
          'Work just above the achilles tendon into the lower calf muscle belly. Do not apply the gun directly onto the tendon itself. Slow passes, light pressure, staying in the muscle tissue either side.',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 45, intensity: 'Light' }],
        },
      },
      {
        name: 'Hamstrings',
        instructions:
          'Sit at the edge of a surface and work from above the knee upward. Runners typically accumulate the most fatigue in the biceps femoris (outer hamstring). Cover both the inner and outer hamstring in separate passes.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Quads',
        instructions:
          'Sit with your leg extended. Work all three columns of the quad from knee to hip. Longer runs load the quads eccentrically on every downhill, making this one of the more tender areas post-run.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'IT Band and Outer Thigh',
        instructions:
          'Light gliding passes only. You are targeting the tissue either side of the IT band, not the band itself. If anything feels sharp or painful, reduce pressure further or skip.',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 60, intensity: 'Light' }],
        },
      },
      {
        name: 'Glutes',
        instructions:
          'Work across both glutes in slow, deliberate passes. Gluteal fatigue is common after longer runs and often overlooked. Spend extra time on any areas that feel particularly knotted.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Medium' },
            { seconds: 90, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'Hip Flexors',
        instructions:
          'Finish here. The hip flexors are in a shortened position for the entire duration of a run and often feel tight post-session. Light passes across the front of the hip crease. Both sides.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_06',
    title: 'Climbing Recovery',
    description:
      'Targeted percussive work for the specific demands of climbing: forearms, hands, lats, and the upper back. Use this after a bouldering or route session to flush the forearms before they stiffen up.',
    difficulty: 'Beginner',
    estimatedTime: 16,
    tags: ['Climbing', 'Recovery', 'Percussive', 'Forearms'],
    isPremium: true,
    blocks: [
      {
        name: 'Forearm Flexors',
        instructions:
          'Start here immediately after climbing, while the forearms are still pumped. Extend your arm, palm up. Work in slow passes from the wrist up to the elbow crease. Do not press directly onto the wrist joint. This is often the single highest-value thing you can do post-session.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Forearm Extensors',
        instructions:
          'Flip your arm over, palm down. Work the top of the forearm from wrist to elbow in the same slow passes. These muscles work to extend the fingers and stabilise the wrist and are frequently overlooked after climbing.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Thenar and Hypothenar (Hand Muscles)',
        instructions:
          'Rest your hand palm-up on your knee. Work slowly across the fleshy pad at the base of your thumb (thenar) and the outer edge of the palm (hypothenar). Use lighter pressure and keep passes slow. Both hands.',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 45, intensity: 'Light' }],
        },
      },
      {
        name: 'Biceps',
        instructions:
          'Extend your arm and rest it on a surface, palm up. Work from elbow to shoulder in slow passes. The biceps act as a primary elbow flexor throughout climbing and often carry residual tension long after a session.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        name: 'Lats',
        instructions:
          'Raise one arm overhead and work the outer back from armpit to lower ribs. The lats drive every pulling movement in climbing and respond well to percussive work immediately after a session. Both sides.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'Rhomboids and Mid Traps',
        instructions:
          'Reach your arm across your chest to wing the shoulder blade out. Work the area between the spine and the inner edge of the shoulder blade. Useful for climbers who experience mid-back fatigue after long sessions on the wall.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
      {
        name: 'Upper Traps and Neck Base',
        instructions:
          'Sweep from the base of the skull outward toward the shoulder tip. Drop your chin toward your chest to put the muscle on a gentle stretch. Sustained tension through the traps is common after overhanging and roof climbing.',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'r_13',
    title: 'Knee and Hip Health',
    description:
      'Prehab for two of the most injury-prone joints in the body. This flow combines targeted strengthening, controlled mobility, and loaded stretching to build resilience rather than just temporary relief. Consistency with this one pays dividends.',
    difficulty: 'Intermediate',
    estimatedTime: 22,
    tags: ['Knees', 'Hips', 'Prehab', 'Mobility'],
    isPremium: true,
    blocks: [
      {
        name: 'Supine Hip Circles',
        instructions:
          'Lie on your back and hug both knees to your chest. Draw large, slow circles with both knees together, rotating through the hip joint. Reverse direction halfway. This lubricates the joint before any loading.',
        dose: {
          kind: 'duration',
          seconds: 30,
          rounds: 2,
          roundsLabel: 'each direction',
        },
      },
      {
        name: 'Clamshells with Band',
        instructions:
          'Lie on your side with a light resistance band just above both knees. Bend your hips and knees to roughly 45 degrees, keeping your feet together. Rotate your top knee toward the ceiling as far as you can without your pelvis rolling back. Lower with control. Weak glute medius is one of the primary drivers of knee pain, so take this seriously.',
        dose: { kind: 'reps_bilateral', countPerSide: 20, unit: 'reps' },
      },
      {
        name: 'Banded Glute Bridge',
        instructions:
          'Lie on your back with knees bent, feet flat, and a resistance band just above your knees. Press your knees out against the band throughout. Drive through your heels and squeeze your glutes hard at the top. Hold each rep for 2 seconds. If you feel your hamstrings more than your glutes, bring your feet a few centimetres closer to your hips.',
        dose: { kind: 'reps', count: 20 },
      },
      {
        name: 'Terminal Knee Extension with Band',
        instructions:
          'Anchor a resistance band at knee height and loop it behind one knee. Step back to create tension. Stand with a soft bend in the knee, then fully extend the knee against the band resistance. Slow and deliberate. This directly strengthens the VMO (the teardrop-shaped quad muscle above the inner knee) which is critical for knee tracking.',
        dose: { kind: 'reps_bilateral', countPerSide: 20, unit: 'reps' },
      },
      {
        name: 'Wall Sit',
        instructions:
          'Back flat against a wall, lower yourself until your thighs are parallel to the floor. Knees should track directly over your second toe. Do not let them cave inward. Hold the position without holding your breath. Isometric quad loading reduces knee pain and builds joint tolerance.',
        dose: { kind: 'duration', seconds: 45 },
      },
      {
        name: 'Hip 90/90',
        instructions:
          'Sit on the floor with both legs bent to 90 degrees: one in front, one to the side. Sit tall on both sit bones. You should feel a stretch in the outer hip of the front leg and the inner thigh of the back leg. Hold, then rotate forward onto the other side.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Couch Stretch',
        instructions:
          'Kneel with one shin resting vertically against a wall, front foot flat on the floor. Squeeze the glute of the back leg to tilt your pelvis and deepen the hip flexor stretch. Stand tall through your torso. Tight hip flexors pull the pelvis forward and put the knee and hip under constant low-level stress.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Supine Figure Four',
        instructions:
          'Lie on your back. Cross one ankle over the opposite knee and flex the foot. Either pull the bottom thigh toward your chest or press the crossed knee gently away from you. This targets the piriformis and deep external rotators, which when tight can refer pain into the hip and alter knee tracking.',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        name: 'Lateral Band Walk',
        instructions:
          'Place a resistance band just above your knees. Stand in a slight squat position. Take slow, deliberate steps sideways, keeping your knees pressed outward against the band. Do not let your feet come together between steps. The glute medius and minimus are the target here.',
        dose: { kind: 'reps_bilateral', countPerSide: 15, unit: 'steps' },
      },
      {
        name: "Child's Pose",
        instructions:
          'Sink your hips back to your heels, arms extended. Let your lower back and hips decompress fully. If your knees are uncomfortable in this position, place a rolled towel in the crease behind the knee to reduce compression.',
        dose: { kind: 'duration', seconds: 90 },
      },
    ],
    equipment: ['bands'],
  },
];
