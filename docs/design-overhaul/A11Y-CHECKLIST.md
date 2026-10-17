# Accessibility checklist (manual pass)

Automated tests cover roles, labels, states, announcements and Reduce Motion behaviour. This checklist covers what needs a person and a device.

For each screen, run the checks with:

- VoiceOver (iOS) and TalkBack (Android);
- the largest accessibility text size;
- Reduce Motion on.

Record the date, device and result. "Pending" means not yet checked by hand.

## Program

| Check                                                                                                                                                | VoiceOver | TalkBack | Largest text | Reduce Motion                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------- | -------- | ------------ | --------------------------------------- |
| Tab bar: each tab is announced as "Program, tab, 1 of 5" with its selected state, and labels never clip.                                             | Pending   | Pending  | Pending      | Pending (no bounce or slide)            |
| Date strip: each day reads its full date, "today" and its status; the selected day is announced as selected.                                         | Pending   | Pending  | Pending      | Pending (pill jumps instead of sliding) |
| "Jump to today" appears only away from today and is reachable.                                                                                       | Pending   | Pending  | Pending      | Pending                                 |
| Session actions and warm-up: the header announces expanded or collapsed, and collapsed content isn't reachable.                                      | Pending   | Pending  | Pending      | Pending (no height animation)           |
| Set row: each field reads "{exercise} set N Weight (kg)", "Reps" or "RPE" (with its hint); the check reads "set N, not logged / completed / failed". | Pending   | Pending  | Pending      | Pending                                 |
| The active set's steppers repeat on long-press; haptic ticks are felt but not required.                                                              | Pending   | Pending  | n/a          | n/a                                     |
| The "Set logged" toast is announced with "Undo available", and Undo is reachable before it hides.                                                    | Pending   | Pending  | Pending      | Pending                                 |
| Rest timer: "Rest timer started" and "Rest complete" are announced; buttons are at least 44pt.                                                       | Pending   | Pending  | Pending      | Pending                                 |
| Session complete sheet: focus moves to the title and back on close; stats read with their values.                                                    | Pending   | Pending  | Pending      | Pending (no burst or count-up movement) |
| Nothing floating covers focused or interactive content. The Expo dev tools gear is dev-only; hide it for this pass.                                  | Pending   | Pending  | Pending      | n/a                                     |

## Home, Workouts, Explore

Not yet restyled.
