/**
 * One-off: infer equipment[] from workout blocks, description, and tags.
 * Run: node scripts/populate-workout-equipment.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonPath = path.join(__dirname, '../src/data/workouts.json');

const RULES = [
  [/kettlebell|\bkb\b/i, 'kettlebell'],
  [/dumbbell|\bdb\b/i, 'dumbbell'],
  [
    /\bbarbell\b|clean and jerk|power clean|squat clean|snatch|thruster|back squat|front squat|overhead squat|bench press|barbell row|romanian deadlift \(barbell/i,
    'barbell',
  ],
  [/jump\s*rope|skipping rope|double[\s-]?under/i, 'skipping rope'],
  [
    /leg press|cable fly|smith machine|lat pulldown|pec deck|hack squat|seated row machine|leg curl machine|leg extension|chosen machine/i,
    'static machines',
  ],
  [/row(er|ing)? machine|concept\s*2|\d+\s*m\s*row|\d+\s*cal(?:orie)?\s*row|\brow\b/i, 'rower'],
  [/assault bike|echo bike|air bike|\bbike\b/i, 'bike'],
  [/ski\s*erg/i, 'ski erg'],
  [/resistance band|\bband\b/i, 'bands'],
  [/\bbox\b|box jump/i, 'box'],
  [/wall ball|medicine ball|slam ball|med ball/i, 'medicine ball'],
  [/pull[\s-]?up bar|chin[\s-]?up/i, 'pull-up bar'],
  [/\bsled\b|prowler/i, 'sled'],
  [/ghd|glute ham/i, 'ghd'],
];

const ORDER = [
  'kettlebell',
  'dumbbell',
  'barbell',
  'skipping rope',
  'static machines',
  'rower',
  'bike',
  'ski erg',
  'bands',
  'box',
  'medicine ball',
  'pull-up bar',
  'sled',
  'ghd',
];

function workoutText(workout) {
  return (
    JSON.stringify(workout.blocks) +
    ' ' +
    workout.description +
    ' ' +
    workout.tags.join(' ')
  );
}

function inferEquipment(workout) {
  const text = workoutText(workout);
  const found = new Set();
  for (const [re, label] of RULES) {
    if (re.test(text)) found.add(label);
  }
  if (workout.tags.includes('No Equipment')) {
    return [];
  }
  return ORDER.filter((eq) => found.has(eq));
}

const workouts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
for (const w of workouts) {
  w.equipment = inferEquipment(w);
}
fs.writeFileSync(jsonPath, JSON.stringify(workouts, null, 2) + '\n');

const noEqTag = workouts.filter((w) => w.tags.includes('No Equipment'));
const noEqEmpty = noEqTag.filter((w) => w.equipment.length === 0);
console.log(
  `Updated ${workouts.length} workouts. No Equipment tag: ${noEqTag.length}, empty equipment: ${noEqEmpty.length}`
);
const mismatches = noEqTag.filter((w) => w.equipment.length > 0);
if (mismatches.length) {
  console.log(
    'No Equipment tag but has equipment:',
    mismatches.map((w) => w.id)
  );
}
