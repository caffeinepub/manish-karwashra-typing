# Manish Karwashra Typing

## Current State
- MCQ question bank has ~50-60 questions across 4 categories (SSC, Railway, CTET, Banking)
- `getQuestionsForExam()` returns fixed question arrays - same questions every time
- No randomization - tests feel repetitive
- No admin panel for bulk question import

## Requested Changes (Diff)

### Add
- 500+ MCQ questions organized by category (SSC, Railway, Banking, CTET, HSSC/Haryana GK, Computer/IT)
- Question randomization: each test picks a random subset based on exam's totalQuestions
- Admin Panel page (`/admin`) with bulk question import via JSON paste
- Admin panel shows question count per category, allows adding questions in bulk JSON format

### Modify
- `src/frontend/src/data/mcqQuestions.ts` - expand question bank massively, add randomization in `getQuestionsForExam`
- Split large question sets into category files under `src/frontend/src/data/questions/`
- `src/frontend/src/App.tsx` - add `/admin` route

### Remove
- Nothing removed

## Implementation Plan
1. Create question category files:
   - `data/questions/ssc.ts` - 100+ questions (GK, Reasoning, Math, English, Haryana GK)
   - `data/questions/railway.ts` - 80+ questions (Railway GK, Math, Reasoning, Current Affairs)
   - `data/questions/banking.ts` - 80+ questions (Banking Awareness, Quant, Reasoning, English)
   - `data/questions/ctet.ts` - 80+ questions (Child Dev, Pedagogy, Language, Math, EVS)
   - `data/questions/haryana.ts` - 80+ questions (Haryana GK, History, Geography, Polity)
   - `data/questions/computer.ts` - 80+ questions (MS Office, Computer Basics, Internet, Networking)
2. Update `mcqQuestions.ts` to import from all category files, add `getRandomQuestionsForExam()` that returns shuffled subset
3. Create `src/frontend/src/pages/AdminPanel.tsx` - question manager with JSON import
4. Add `/admin` route in `App.tsx`
5. Validate and build
