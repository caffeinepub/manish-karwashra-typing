# Manish Karwashra Typing - Major Navigation Restructure

## Current State

The app currently has:
- Top header navigation (Header.tsx) with login/register buttons
- Pages: Home, LoginPage, TypingPractice, MCQTest, LiveTest, MockTest, LearningTyping, ResultsHistory, AdminPanel
- Routes: /, /login, /typing/:examCategory, /mcq/:examCategory, /live-test, /live-test/:examSlug, /mock-test, /mock-test/:examSlug, /learning, /results, /admin
- Components: ExamTypingInterface, NTAMCQInterface, SSCMCQInterface, TCSMCQInterface, Certificate, UserIdentityHeader, etc.
- 100+ typing paragraphs in LearningTyping, 500+ MCQs in MCQTest/MockTest

## Requested Changes (Diff)

### Add
- **SideDrawer/Sidebar layout component**: Permanent left sidebar on desktop, hamburger slide-out drawer on mobile. Wraps all authenticated pages.
- **New pages**:
  - `/practice` - Practice lessons (Beginner, Home Row, Top Row, Bottom Row, Number, Symbol, Capital Letters, Word, Sentence, Paragraph practice)
  - `/typing-test` - Typing test with modes: 10s, 5min, 15min, 20min, Word Test (500/1000/2000), Paragraph Test, Custom Text. Detailed result card: WPM, Accuracy, Mistakes, Time, Correct Words, Wrong Words
  - `/exam-mode` - Exam typing mode: SSC, DSSSB, Delhi Police, Court, Banking, Railway, State, Custom (links to existing exam simulation)
  - `/games` - Typing games: Falling Words, Word Shooting, Typing Race, Time Attack, Keyboard Jump, Multiplayer Typing Race
  - `/dictation` - Dictation mode page
  - `/progress` - Progress/Analyse: Daily/Weekly/Monthly reports, WPM graph, Accuracy graph, Mistake Analysis, Weak Keys, Typing History, Performance Dashboard
  - `/settings` - Settings: Dark Mode, Font Size/Style, Keyboard Sound, Key Highlight, Language, Theme/Background, Keyboard Layout, Full Screen
  - `/profile` - Profile: User info, Results, Certificates, Ranking, Achievements, Logout
  - `/admin-login` - Dedicated admin login page (username + password)
- **Home page menu cards**: 11 menu cards for Start Typing Test, Practice Lessons, Exam Typing Mode, Typing Games, Dictation Mode, Progress Report, Leaderboard, Daily Challenge, Certificate/Result, Settings, Profile/Login
- **Admin special features**: User management dashboard, content control panel (bulk MCQ import), statistics view

### Modify
- **App.tsx**: Add all new routes, wrap authenticated routes with sidebar layout
- **Home.tsx**: Add 11 menu cards section below the existing Live Test section + exam cards. Keep existing content (metallic banner, Live Test section, exam cards, footer)
- **Header.tsx**: Integrate hamburger menu trigger for mobile drawer
- **AdminPanel.tsx**: Add user management section and stats dashboard
- **Live test page**: Add as separate page in sidebar nav
- **Mock test page**: Add as separate page in sidebar nav

### Remove
- Old top-navbar-only navigation pattern (replace with sidebar)

## Implementation Plan

1. Create `AppLayout.tsx` - wrapper with left sidebar (desktop) + Sheet drawer (mobile), containing all nav items
2. Create `SideNav.tsx` - navigation items: Home, Start Test, Practice, Exam Mode, Mock Test, Live Test, Games, Dictation, Progress, Leaderboard, Daily Challenge, Certificate, Profile, Settings, Admin
3. Update `App.tsx` - add new routes, wrap protected routes in AppLayout
4. Create `TypingTestPage.tsx` - 7 test mode options with full result card
5. Create `PracticePage.tsx` - 10 lesson categories with interactive keyboard lessons
6. Create `ExamModePage.tsx` - 8 exam options linking to existing exam simulation
7. Create `GamesPage.tsx` - 6 typing games (Falling Words, Word Shooting, etc.)
8. Create `DictationPage.tsx` - basic dictation mode
9. Create `ProgressPage.tsx` - WPM/Accuracy charts, typing history, weak keys analysis
10. Create `SettingsPage.tsx` - all settings options with local storage persistence
11. Create `ProfilePage.tsx` - user info, results, certificates, achievements
12. Create `AdminLoginPage.tsx` - admin credentials page
13. Update `AdminPanel.tsx` - add user management + stats
14. Update `Home.tsx` - add 11 menu cards
