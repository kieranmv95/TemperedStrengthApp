# Accessibility checklist (manual pass)

Automated tests cover roles, labels, states, announcements and Reduce Motion behaviour. This checklist covers what needs a person and a device.

For each screen, run the checks with:

- VoiceOver (iOS) and TalkBack (Android);
- the largest accessibility text size;
- Reduce Motion on.

Record the date, device and result. "Pending" means not yet checked by hand.

At large text (OS font scale 1.3 or more), expect these reflows:

- set rows stack, with weight on its own line;
- rest-timer controls wrap onto a second line;
- two-up tiles become full-width cards.

## Program

| Check                                                                                                                                                | VoiceOver | TalkBack | Largest text | Reduce Motion                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ------------ | --------------------------------------- |
| Tab bar: each tab is announced as "Program, tab, 1 of 5" with its selected state, and labels never clip.                                             | Pending   | Pending  | Pending      | Pending (no bounce or slide)            |
| Date strip: each day reads its full date, "today" and its status; the selected day is announced as selected.                                         | Pending   | Pending  | Pending      | Pending (pill jumps instead of sliding) |
| "Jump to today" appears only away from today and is reachable.                                                                                       | Pending   | Pending  | Pending      | Pending                                 |
| Session actions and warm-up: the header announces expanded or collapsed, and collapsed content isn't reachable.                                      | Pending   | Pending  | Pending      | Pending (no height animation)           |
| Set row: each field reads "{exercise} set N Weight (kg)", "Reps" or "RPE" (with its hint); the check reads "set N, not logged / completed / failed". | Pending   | Pending  | Pending      | Pending                                 |
| The "Set logged" toast is announced with "Undo available", and Undo is reachable before it hides.                                                    | Pending   | Pending  | Pending      | Pending                                 |
| Rest timer: "Rest timer started" and "Rest complete" are announced; buttons are at least 44pt.                                                       | Pending   | Pending  | Pending      | Pending                                 |
| Session complete sheet: focus moves to the title and back on close; stats read with their values.                                                    | Pending   | Pending  | Pending      | Pending (no burst or count-up movement) |
| Nothing floating covers focused or interactive content. The Expo dev tools gear is dev-only; hide it for this pass.                                  | Pending   | Pending  | Pending      | n/a                                     |

## Home

| Check                                                                               | VoiceOver | TalkBack | Largest text | Reduce Motion              |
| ----------------------------------------------------------------------------------- | --------- | -------- | ------------ | -------------------------- |
| The greeting title is a header, and the account badge reads "Account type PRO".     | Pending   | Pending  | Pending      | n/a                        |
| The Today card reads as one button: program, session, and completed or left counts. | Pending   | Pending  | Pending      | Pending (no rolling count) |
| Check-in reads "Check-in, 1 of 4 behaviours · 1 supplement due".                    | Pending   | Pending  | Pending      | Pending (dots fade only)   |
| Cards don't move on first load under Reduce Motion.                                 | n/a       | n/a      | n/a          | Pending                    |

## Workouts

| Check                                                                                                                                             | VoiceOver | TalkBack | Largest text | Reduce Motion                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ------------ | ---------------------------------------- |
| Filters reads "Filter workouts, N active"; Sort by reports expanded.                                                                              | Pending   | Pending  | Pending      | Pending (no badge pop)                   |
| Discipline tiles read their names, including logo-only tiles.                                                                                     | Pending   | Pending  | Pending      | n/a                                      |
| A workout card reads as one element; the heart is reachable after it and announces "Added to favourites".                                         | Pending   | Pending  | Pending      | Pending (no heart pop)                   |
| Filters sheet: focus moves to "Filters"; chips read "Strength, 22 workouts, selected"; Reset is disabled when empty; count changes are announced. | Pending   | Pending  | Pending      | Pending (sheet fades instead of sliding) |
| No floating element covers the search field.                                                                                                      | Pending   | Pending  | Pending      | n/a                                      |

## Explore

| Check                                                                               | VoiceOver | TalkBack | Largest text | Reduce Motion             |
| ----------------------------------------------------------------------------------- | --------- | -------- | ------------ | ------------------------- |
| Skills & Cues reads as one button, and thumbnails never show as empty grey squares. | Pending   | Pending  | Pending      | Pending (static skeleton) |
| Tools: each tile reads its name and description; "See all tools" toggles the grid.  | Pending   | Pending  | Pending      | n/a                       |
| Article chips read "Strength, 4 articles, selected".                                | Pending   | Pending  | Pending      | n/a                       |

## Onboarding and program picker

| Check                                                                                                                       | VoiceOver | TalkBack | Largest text | Reduce Motion                            |
| --------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ------------ | ---------------------------------------- |
| Step titles are headers; single-choice options read as radio buttons with their checked state.                              | Pending   | Pending  | Pending      | Pending (step fades only)                |
| "Skip setup" and the continue button are reachable, and the continue button reports disabled until a choice is made.        | Pending   | Pending  | Pending      | n/a                                      |
| A program card reads as one element, including PRO, difficulty, "Recommended" and locked.                                   | Pending   | Pending  | Pending      | n/a                                      |
| Details, start-date and weekday sheets: the close button is labelled; calendar days read their full date and "unavailable". | Pending   | Pending  | Pending      | n/a                                      |
| Weekday chips announce selected or locked, and the hint is not conveyed by colour alone.                                    | Pending   | Pending  | Pending      | n/a                                      |
| Move session and Swap sheets: focus moves to the title; move days read as radio buttons.                                    | Pending   | Pending  | Pending      | Pending (sheet fades instead of sliding) |

## Skills & Cues, articles and glossary

| Check                                                                                                  | VoiceOver | TalkBack | Largest text | Reduce Motion                 |
| ------------------------------------------------------------------------------------------------------ | --------- | -------- | ------------ | ----------------------------- |
| A skill card reads as one button; locked skills say so.                                                | Pending   | Pending  | Pending      | n/a                           |
| Tips, cues and videos: previous/next are labelled and the position is announced ("Tip 1 of 2").        | Pending   | Pending  | Pending      | n/a                           |
| Cue stills have a text label.                                                                          | Pending   | Pending  | n/a          | n/a                           |
| An article card reads as one element; the bookmark is a separate 44pt button that announces its state. | Pending   | Pending  | Pending      | n/a                           |
| Glossary terms and patch-note versions announce expanded or collapsed.                                 | Pending   | Pending  | Pending      | Pending (no height animation) |

## Workout detail and recovery

| Check                                                                                         | VoiceOver | TalkBack | Largest text | Reduce Motion                             |
| --------------------------------------------------------------------------------------------- | --------- | -------- | ------------ | ----------------------------------------- |
| The favourite button reports its state and announces changes.                                 | Pending   | Pending  | Pending      | n/a                                       |
| Log form: every input has a label; edit and delete buttons include the log's date.            | Pending   | Pending  | Pending      | n/a                                       |
| A recovery card reads "title, minutes, difficulty, PRO, locked".                              | Pending   | Pending  | Pending      | n/a                                       |
| Recovery flow announces "Block X of Y"; the timer announces start, each step and "Time's up". | Pending   | Pending  | Pending      | Pending (ring jumps instead of animating) |

## Check-in and tools

| Check                                                                                            | VoiceOver | TalkBack | Largest text | Reduce Motion                            |
| ------------------------------------------------------------------------------------------------ | --------- | -------- | ------------ | ---------------------------------------- |
| Behaviour rows read logged or not logged, and "Read only on Free" when locked.                   | Pending   | Pending  | Pending      | n/a                                      |
| Calendar days read like "Saturday 17 October, today, has check-in"; month buttons are 44pt.      | Pending   | Pending  | Pending      | n/a                                      |
| Log sheet: focus moves to the title; scale and quantity values are spoken.                       | Pending   | Pending  | Pending      | Pending (sheet fades instead of sliding) |
| Calculators: inputs read their unit; the result is announced on Calculate; errors are announced. | Pending   | Pending  | Pending      | n/a                                      |

## You and account

| Check                                                                               | VoiceOver | TalkBack | Largest text | Reduce Motion |
| ----------------------------------------------------------------------------------- | --------- | -------- | ------------ | ------------- |
| Every switch has a label; kg/lb reads as radio buttons with the checked unit.       | Pending   | Pending  | Pending      | n/a           |
| Awards read "Achieved", "Not achieved" or "PRO" as text.                            | Pending   | Pending  | Pending      | n/a           |
| Email, OTP and redeem-code inputs have visible labels; redeem errors are announced. | Pending   | Pending  | Pending      | n/a           |

## Shop and competition

| Check                                                              | VoiceOver | TalkBack | Largest text | Reduce Motion                            |
| ------------------------------------------------------------------ | --------- | -------- | ------------ | ---------------------------------------- |
| Shop tiles read "Partner" and their name; the sheet CTA is a link. | Pending   | Pending  | Pending      | Pending (sheet fades instead of sliding) |
| A leaderboard row reads as one element with its rank.              | Pending   | Pending  | Pending      | n/a                                      |
