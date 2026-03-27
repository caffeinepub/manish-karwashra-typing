# Manish Karwashra Typing - Version 11

## Current State
Fully functional exam simulation platform with typing practice, MCQ tests, login, instructions flow, and 20+ built-in paragraphs. CharHighlight does char-by-char comparison causing entire paragraph to show wrong when a word is skipped.

## Requested Changes (Diff)

### Add
- 100 new English paragraphs from Google Doc (IDs 201-300) covering SSC CGL, Banking, Railway, Delhi Police, Teaching, State, General categories
- New paragraph categories: ssc-cgl, banking, railway, delhi-police, teaching, state (add to category filter)
- Certificate component (TypingCertificate / MCQCertificate) shown after qualifying a test
- Download certificate as PNG/PDF using browser print or html2canvas
- Certificate contains: candidate name, exam name, score/WPM, accuracy, date, decorative border
- Qualifying criteria: Typing >= 30 WPM AND >= 80% accuracy; MCQ >= 60% score

### Modify
- paragraphs.ts: append 100 new paragraphs, add new category types
- CharHighlight.tsx: rewrite to use word-aware comparison - when space is typed, snap to next word boundary so skipped words show as wrong but subsequent words align correctly
- TypingPractice.tsx: show certificate after qualifying test completion
- MCQTest.tsx: show certificate after qualifying score
- CATEGORIES list in TypingPractice.tsx: add new category entries

### Remove
- Nothing removed

## Implementation Plan
1. Update Paragraph category type in paragraphs.ts to include new categories
2. Append 100 paragraphs to paragraphs.ts
3. Rewrite CharHighlight to use word-level alignment
4. Create Certificate component with download button
5. Integrate certificate in TypingPractice result screen (if WPM >= 30 && accuracy >= 80)
6. Integrate certificate in MCQTest result screen (if score >= 60%)
7. Update CATEGORIES array in TypingPractice
