# Manish Karwashra Typing Platform

## Current State
- Multi-page typing/MCQ practice platform with sidebar navigation
- Auth system using localStorage (login, register, forgot password)
- LiveTest page with 6 exam groups, all using 600s duration, no Hartron, no language filter
- Certificate component exists but ResultsHistory shows 'coming soon' toast instead of real download
- LearningTyping page has keyboard layout display, tips, and ProTyping section but lacks structured step-by-step learning

## Requested Changes (Diff)

### Add
- Hartron exam group to LiveTest with 15 min duration and Haryana categories
- Language select (Hindi/English) in LiveTest for each exam
- Demo account in AuthContext so users can always test login (user: demo, pass: demo123)
- Certificate download button in ResultsHistory (replace 'coming soon' toast with real Certificate component)
- Structured step-by-step lessons in LearningTyping: Beginner → Home Row → Top Row → Bottom Row → Number Keys → Word Practice → Sentence Practice with interactive typing for each
- Finger guide animation/indicator showing which finger to use for next key

### Modify
- LiveTest exam durations to match real exams: SSC=600s(10min), Banking=600s, Railway=900s(15min), Delhi Police=600s, Teaching=600s, HSSC=900s, Hartron=900s
- LiveTest paragraph font size: make it adjustable with min 250px height max 1500px (i.e., min-height 250px max-height 1500px for text display area); also font size slider stays
- Login error messages: improve to guide user to register if user not found; add 'Pehle register karein' hint
- AuthContext: add demo account (username: demo, password: demo123) that always works; fix any lookup issues
- LearningTyping: replace simple tips+ProTyping with a rich, structured learning flow: lesson selector sidebar on left, lesson content + interactive keyboard + practice area on right
- ResultsHistory: replace 'certificate coming soon' button with actual Certificate modal (store examName, date, wpm, accuracy, score in result and pass to Certificate component)

### Remove
- 'Certificate feature coming soon!' toast in ResultsHistory

## Implementation Plan
1. Update AuthContext: add demo account seed on first load; improve error messages in LoginPage to hint at registering
2. Update LiveTest: add Hartron exam group, per-exam durations, language filter (Hindi/English) for each exam, paragraph height min 250px max 1500px configurable via slider
3. Update ResultsHistory: import Certificate component, add showCertificate state per result, render Certificate modal with stored data
4. Rewrite LearningTyping: structured lesson system with keyboard-first learning, interactive practice, finger guides, lesson progress
