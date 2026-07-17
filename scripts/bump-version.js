#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(path.dirname(process.argv[1]), '..');
const packageJsonPath = path.join(root, 'package.json');
const appJsonPath = path.join(root, 'app.json');
const patchNotesPath = path.join(root, 'app', 'patch-notes.tsx');

const bumpType = (process.argv[2] || 'minor').toLowerCase();

if (!['major', 'minor', 'patch'].includes(bumpType)) {
  console.error(`Unknown bump type "${bumpType}". Use major, minor, or patch.`);
  process.exit(1);
}

function bumpSemver(version, type) {
  const parts = version.split('.').map((part) => Number(part));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    throw new Error(`Invalid semver version: ${version}`);
  }

  let [major, minor, patch] = parts;

  if (type === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (type === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const patchNotesSource = fs.readFileSync(patchNotesPath, 'utf8');

const currentVersion = packageJson.version;
const nextVersion = bumpSemver(currentVersion, bumpType);

if (appJson.expo?.version !== currentVersion) {
  console.warn(
    `Warning: app.json version (${appJson.expo?.version}) did not match package.json (${currentVersion}). Both will be set to ${nextVersion}.`
  );
}

packageJson.version = nextVersion;
appJson.expo.version = nextVersion;

const patchNotesMarker = 'const PATCH_NOTES: PatchNote[] = [';
const markerIndex = patchNotesSource.indexOf(patchNotesMarker);

if (markerIndex === -1) {
  console.error('Could not find PATCH_NOTES array in app/patch-notes.tsx');
  process.exit(1);
}

const insertAt = markerIndex + patchNotesMarker.length;
const newEntry = `
  {
    version: '${nextVersion}',
    dateLabel: '',
    notes: [''],
  },`;

const updatedPatchNotes =
  patchNotesSource.slice(0, insertAt) +
  newEntry +
  patchNotesSource.slice(insertAt);

writeJson(packageJsonPath, packageJson);
writeJson(appJsonPath, appJson);
fs.writeFileSync(patchNotesPath, updatedPatchNotes);

console.log(`Bumped version ${currentVersion} → ${nextVersion} (${bumpType})`);
console.log('Updated package.json, app.json, and app/patch-notes.tsx');
