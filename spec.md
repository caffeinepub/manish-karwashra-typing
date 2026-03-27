# Manish Karwashra Typing

## Current State
The app has a full typing exam platform with ExamTypingInterface.tsx (used by Practice/Mock/Exam tests) and TypingPractice.tsx page. The interface currently has a vertical stacked layout with control bar at top. The paragraphs.ts data file has 20+ paragraphs mainly focused on Haryana GK and India History.

## Requested Changes (Diff)

### Add
- 30 new typing paragraphs from Google Doc in categories: ssc-cgl, banking, railway, general (SSC CGL/CHSL Constitution, Economy, Fundamental Rights, Climate Change, Digital India, Women Empowerment, NEP 2020, Railways, Banking, Panchayati Raj, GST, Swachh Bharat, Ayushman Bharat, Make in India, Skill Development, Agriculture, Startups, Environment, Space, National Integration, RBI, Financial Inclusion, NPA, Digital Banking, Priority Sector, Basel Norms, MSMEs, etc.)
- New category types: 'ssc-cgl' | 'banking' | 'railway' to the Paragraph interface

### Modify
- ExamTypingInterface.tsx: Complete UI redesign to match screenshot - split layout with passage panel on left/top and typing area below, right sidebar with: Submit button, large timer display ("15:00 Time Left"), Font Size controls (A+ [number] A-), Settings panel with radio buttons for backspace mode (No backspace / Current word backspace / Full backspace), checkboxes for Highlight Word (Alt+h), Auto Scroll (Alt+s), Play Keyboard Sound, Highlighter Colour section with radio buttons (Black/Blue/Yellow). Top toolbar with "How to type this?" button on left, "Start" and "Full Screen(esc)" on right.
- TypingPractice.tsx: Use the same new layout/settings approach consistent with the image reference

### Remove
- Nothing removed

## Implementation Plan
1. Update src/frontend/src/data/paragraphs.ts - add 'ssc-cgl' | 'banking' | 'railway' to category type union, and append 30 new paragraphs from the Google Doc
2. Redesign ExamTypingInterface.tsx to match the screenshot: two-column layout (main area left, settings panel right), top toolbar row, passage display box, typing input box, right panel with submit/timer/font-size/settings
3. Update TypingPractice.tsx to use consistent layout where the passage + typing area matches the screenshot style
4. Validate and build
