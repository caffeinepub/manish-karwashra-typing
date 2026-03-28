# Manish Karwashra Typing

## Current State
Multi-page exam preparation platform with sidebar navigation. MCQ mock tests exist for SSC, Railway, NTPC, Banking, Delhi Police, DSSSB, HSSC, CTET. Result screens show score/percentage but NO answer key or full solution. SSCMCQInterface has a basic result view with Try Again button. ExamModePage has Railway card (id: "railway") - clicking MCQ navigates to `/mcq/railway` which should use TCSMCQInterface. NTPC Graduate/Undergraduate mocks exist. GamesPage has Falling Words and Time Attack games only.

## Requested Changes (Diff)

### Add
- **Answer Key in all MCQ result screens**: After submitting, show full list of all questions with: question text, user's answer (highlighted green if correct, red if wrong), and correct answer clearly marked
- **Full Solution panel** in result: below each question in answer key, show which option was correct with a note
- **New Games in GamesPage**: 
  1. Car Racing Game - two cars on track, user types words to accelerate their car, opponent auto-races
  2. Balloon Pop Game - balloons float up with words, type the word to pop balloon before it escapes top
  3. Boy-Girls Character Selection before games - pick avatar (boy/girl) that shows during play
  4. Toys Theme typing game - typing room themed with toys, type words that appear on toys
- **Mock Test Lock** - show a simple name/ID entry gate before accessing mock test list (localStorage-based, no backend needed). User enters name once, saved to localStorage
- **Certificate** - ensure certificate button appears in ALL MCQ interfaces (SSCMCQInterface, TCSMCQInterface, NTAMCQInterface) after qualifying, not just SSC

### Modify
- **SSCMCQInterface result screen**: Add scrollable answer key section below score cards. Each row: Q number, question text (truncated), user answer, correct answer, ✓/✗ icon
- **TCSMCQInterface result screen**: Same answer key addition
- **NTAMCQInterface result screen**: Same answer key addition  
- **ExamModePage Railway card**: Change id from "railway" to "railway-ntpc" so MCQ button correctly navigates to `/mcq/railway-ntpc` which uses TCSMCQInterface. Ensure Typing Test button also uses railway-ntpc.
- **GamesPage**: Add Car, Balloon, Boy-Girls character picker, Toys game alongside existing games
- **MockTestListPage**: Fix any blurred/disabled-looking mock buttons - ensure all mock number buttons are fully clickable and visible

### Remove
- Nothing removed

## Implementation Plan
1. Fix ExamModePage: change Railway exam id from "railway" to "railway-ntpc" so routing works correctly
2. Fix MockTestListPage: investigate and fix any CSS blur/opacity issues on mock buttons
3. Update SSCMCQInterface result: add answer key section (scrollable list, Q text + user answer + correct answer)
4. Update TCSMCQInterface result: same answer key section
5. Update NTAMCQInterface result: same answer key section + ensure certificate button visible
6. Add Mock Lock gate to MockTestListPage: simple name entry modal, stored in localStorage
7. Add new games to GamesPage: Car Racing, Balloon Pop, Boy-Girls picker, Toys theme game
