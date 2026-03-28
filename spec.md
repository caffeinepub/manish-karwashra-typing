# Manish Karwashra Typing

## Current State
App has MCQ mock tests for SSC, Railway, Banking, HSSC etc. MockTestListPage shows numbered mocks per exam. MCQTest page uses Login → Instructions → Exam flow via existing components.

## Requested Changes (Diff)

### Add
- `src/frontend/src/data/questions/hartron_q1.ts` - Already written (400 questions)
- `src/frontend/src/data/questions/hartron_q2.ts` - Already written (400 questions)
- `src/frontend/src/data/questions/hartron_q3.ts` - Already written (487 questions)
- `src/frontend/src/pages/HartronMockPage.tsx` - Full Hartron exam page with 3-step flow
- Route `/hartron-mock/:mockNumber` in App.tsx
- Hartron entry in MockTestListPage

### Modify
- `src/frontend/src/App.tsx` - Add hartron route
- `src/frontend/src/pages/MockTestListPage.tsx` - Add Hartron card with 43 mocks (1287 ÷ 30)
- `src/frontend/src/data/mcqQuestions.ts` - Import and expose HARTRON_QUESTIONS

### Remove
Nothing

## Implementation Plan

### 1. mcqQuestions.ts update
Import HARTRON_Q1, HARTRON_Q2, HARTRON_Q3, combine into HARTRON_QUESTIONS array. The MCQQuestion type from backend.d.ts has fields: id (BigInt), examCategory, language, questionText, option1, option2, option3, option4, correctAnswer (BigInt).

BUT the new hartron_q1/q2/q3 files use a simpler local type with fields: id (number), question, options (array), correct (number), language, section. So HartronMockPage should use these directly WITHOUT converting to backend MCQQuestion type.

### 2. HartronMockPage.tsx
This page has 3 steps:

**Step 1: Login/Registration Form**
- Title: "Hartron CBT Exam - Registration"
- Fields: Roll Number (text input), Candidate Name (text input), Category (dropdown: General / SC / ST / OBC / EWS)
- Submit button: "Proceed to Instructions"
- Mock number shown in header (from URL param)
- Simple validation (all fields required)

**Step 2: Instructions Page**
- Candidate info shown at top (Roll No, Name, Category)
- Full instructions in a card:
  - Exam: Hartron Computer Proficiency Test
  - Total Questions: 30
  - Time: 15 Minutes
  - Passing Marks: General Category = 15/30 | Reserved Category (SC/ST/OBC/EWS) = 14/30
  - No Negative Marking
  - Each question carries 1 mark
  - Do not refresh the page during exam
  - Once time is up, exam auto-submits
  - Questions are from MS Office, Computer Fundamentals, Database, Internet topics
- Checkbox: "I have read and understood the instructions"
- Button: "Start Exam" (disabled until checkbox checked)

**Step 3: Exam Interface**
- Header: "Hartron CBT | Roll: {rollNo} | {name} | {category}" + live countdown timer (15:00)
- Show question number and text
- 4 radio option buttons (A, B, C, D)
- Question palette on right (numbered 1-30, green=answered, white=unanswered, current=blue)
- Navigation: Previous / Next buttons
- Submit button (with confirmation dialog)
- Auto-submit when timer hits 0

**Step 4: Result Screen**
- Candidate info (Roll No, Name, Category)
- Score: X / 30
- Passing marks for their category
- PASS (green) or FAIL (red) badge
- Correct answers: X, Wrong answers: Y, Not Attempted: Z
- No negative marking note
- "View Solutions" button toggles answer key
- "Take Another Mock" button

### 3. Seeded question selection (30 per mock)
Use mock number as seed to deterministically shuffle the 1287 questions and pick first 30.
Simple seeded shuffle: use a LCG (Linear Congruential Generator) with seed = mockNumber.

### 4. App.tsx route
Add route: `/hartron-mock/$mockNumber` -> HartronMockPage (with login guard)

### 5. MockTestListPage
Add a Hartron card with:
- Color: bg-cyan-600
- Label: "Hartron CBT"
- 43 mocks (Mock 1 to Mock 43)
- Each mock button navigates to `/hartron-mock/{n}`
