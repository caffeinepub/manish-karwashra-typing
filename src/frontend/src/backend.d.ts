import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TypingResult {
    wpm: bigint;
    duration: bigint;
    isPractice: boolean;
    userId: string;
    examCategory: string;
    timestamp: bigint;
    passageId: bigint;
    attemptNumber: bigint;
    accuracy: bigint;
}
export interface TypingPassage {
    id: bigint;
    title: string;
    content: string;
    wordCount: bigint;
    language: string;
    examCategory: string;
}
export interface MCQQuestion {
    id: bigint;
    correctAnswer: bigint;
    questionText: string;
    language: string;
    examCategory: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
}
export interface UserProfile {
    name: string;
}
export interface MCQResult {
    isPractice: boolean;
    userId: string;
    score: bigint;
    totalQuestions: bigint;
    examCategory: string;
    timestamp: bigint;
    attemptNumber: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMCQQuestion(question: MCQQuestion): Promise<void>;
    addPassage(passage: TypingPassage): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkIsAdmin(): Promise<boolean>;
    getAllMCQs(): Promise<Array<MCQQuestion>>;
    getAllPassages(): Promise<Array<TypingPassage>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<TypingResult>>;
    getLeaderboardByExam(examCategory: string): Promise<Array<TypingResult>>;
    getMCQsByExam(examCategory: string): Promise<Array<MCQQuestion>>;
    getMCQsByExamAndLanguage(examCategory: string, language: string): Promise<Array<MCQQuestion>>;
    getPassagesByExam(examCategory: string): Promise<Array<TypingPassage>>;
    getPassagesByExamAndLanguage(examCategory: string, language: string): Promise<Array<TypingPassage>>;
    getUserMCQResults(userId: string): Promise<Array<MCQResult>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserTypingResults(userId: string): Promise<Array<TypingResult>>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMCQResult(mcqResult: MCQResult): Promise<void>;
    saveTypingResult(typingResult: TypingResult): Promise<void>;
}
