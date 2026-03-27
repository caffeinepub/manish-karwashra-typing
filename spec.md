# Manish Karwashra Typing

## Current State
- Full exam platform with Home, TypingPractice, MCQTest, MockTest, LiveTest pages
- MCQ and Typing tests start directly without any instructions or confirmation step
- No user login/auth system; user identity uses Internet Identity principal or shows "GUEST"
- 4-button exam cards on Home (Typing, MCQ, Practice, Live)
- SSC/TCS/NTA MCQ interfaces, ExamTypingInterface for real exam flow

## Requested Changes (Diff)

### Add
- **ExamInstructions component**: Full-screen instructions screen shown before EVERY test (MCQ and Typing). Multi-page instructions in Hindi/English, language dropdown, keyboard dropdown, declaration checkbox, "I am ready to begin" button that activates after checkbox is checked.
- **Auth system (localStorage-based)**: Login screen shown when user is not logged in. Register with Email OR choose random username + set password (min 6 chars). Login with email/username + password. Password reset via security question (3 preset questions). Password change option in a profile dropdown accessible from Header.
- **AuthContext**: React context managing currentUser state, login, logout, register, resetPassword, changePassword. Stored in localStorage.
- **LoginPage / AuthModal**: Full login/register/reset UI accessible globally.

### Modify
- **TypingPractice.tsx**: Add `instructionsDone` state; if false, render ExamInstructions component instead of the test. Pass exam name and language to instructions.
- **MCQTest.tsx**: Same -- add `instructionsDone` gate before rendering SSC/TCS/NTA interface.
- **Header.tsx**: Show logged-in user name/username + dropdown with "Change Password" and "Logout" options.
- **App.tsx**: Wrap with AuthProvider; add a route guard -- if not logged in, redirect to /login.
- **UserIdentityHeader.tsx**: Use logged-in user data (name, userId) instead of "GUEST".

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/context/AuthContext.tsx` with full localStorage-based auth (register, login, logout, resetPassword, changePassword). Users stored as JSON array in localStorage key `exam_users`.
2. Create `src/frontend/src/pages/LoginPage.tsx` with tabs: Login / Register / Forgot Password. Register tab offers email OR random username + password. Forgot Password uses security question.
3. Create `src/frontend/src/components/ExamInstructions.tsx` -- full-screen instructions with Hindi/English toggle, multi-point instruction list, keyboard dropdown, language dropdown, declaration checkbox, animated "I am ready" button.
4. Update `App.tsx`: wrap with `<AuthProvider>`, add `/login` route, add redirect logic.
5. Update `Header.tsx`: show user info + logout/change-password dropdown.
6. Update `TypingPractice.tsx` and `MCQTest.tsx`: gate with `instructionsDone` state + `<ExamInstructions>` component.
7. Update `UserIdentityHeader.tsx`: read user from auth context.
