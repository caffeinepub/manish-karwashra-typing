# Manish Karwashra Typing

## Current State
- MockTest.tsx: Full exam flow (login → biometric → instructions → practice → main exam → result). Has basic timer, char highlight, submit button.
- TypingPractice.tsx: Simple typing practice per exam category.
- LiveTest.tsx: Live test page.
- MCQTest.tsx: MCQ test with timer, question navigator, result screen.
- App.tsx: Routes for all pages.

## Requested Changes (Diff)

### Add
- **User Identity Header**: User ID, Name, Profile Photo displayed during test (use mock data: ID=EX2024001, Name=Candidate, photo placeholder avatar).
- **Exam Metadata Header**: Exam Date (today's date), Time (current live time), Session Name (Morning/Afternoon based on hour).
- **Timer Presets**: Buttons for 1, 2, 5, 10, 15, 20, 30 minutes visible before and during test.
- **Text Size Toggle**: Small / Large toggle for both source paragraph and typing area.
- **Highlight Toggle**: On/Off toggle for character highlight.
- **Scroll Mode Toggle**: Manual scroll bar vs Automatic scroll (auto-scroll to current typing position).
- **Stop Button**: Stops the timer and shows results immediately.
- **Backspace Rule Toggle**: Allowed (Practice Mode) vs Disabled (Strict Exam Mode).
- **Bold Text Support**: Source paragraph words can be rendered as bold (mark certain words bold in paragraphs).
- **Error Tracking Post-Timer**: After timer ends (or stop pressed), show overlay/section with: correct words (green), error words (red), errors count, correct count, WPM, accuracy.
- **100+ Typing Paragraphs**: Add comprehensive paragraph data file with 100+ passages (500+ words each) covering: Haryana GK, India History, Stories, Vocabulary, Country Words, COVID-19, G20, New trains/metro/buses, New films/songs/books, Fruits/Vegetables/Colors/Vehicles, Newspaper articles, Important stories.
- **MCQ/Typing Switch**: Tab or toggle at top of typing pages to switch between Typing Practice and MCQ test mode.
- **Consistent UI**: White background (#ffffff), Dark Yellow border (#DAA520 or #B8860B), Black text (#000000) for all typing areas. Source paragraph and typing textarea must have same font-size, font-family, width.

### Modify
- MockTest.tsx: Add all above features to the main exam phase. Control panel row below header. Error tracking shown in result screen.
- TypingPractice.tsx: Add control panel (timer presets, text size, highlight, scroll mode, backspace toggle, stop button). Add typing/MCQ tab switch. Use new paragraph data.
- LiveTest.tsx: Add user identity + exam metadata header. Same control panel. Use new paragraph data.
- Update color scheme: all typing area borders to dark yellow, backgrounds white, text black.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/data/paragraphs.ts` with 100+ typed paragraphs (each 500+ words, categorized).
2. Create `src/frontend/src/components/TypingControlPanel.tsx` - reusable control panel component with all toggles.
3. Create `src/frontend/src/components/UserIdentityHeader.tsx` - shows User ID, Name, photo, exam date/time/session.
4. Update MockTest.tsx to use new components, new paragraphs, error tracking in result.
5. Update TypingPractice.tsx with control panel + MCQ tab switch.
6. Update LiveTest.tsx with user identity header + control panel.
7. Apply consistent color scheme (white bg, dark yellow border, black text) across all typing areas.
