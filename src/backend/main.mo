import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Time "mo:core/Time";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type TypingPassage = {
    id : Nat;
    title : Text;
    content : Text;
    language : Text;
    examCategory : Text;
    wordCount : Nat;
  };

  type MCQQuestion = {
    id : Nat;
    questionText : Text;
    option1 : Text;
    option2 : Text;
    option3 : Text;
    option4 : Text;
    correctAnswer : Nat;
    examCategory : Text;
    language : Text;
  };

  type TypingResult = {
    userId : Text;
    wpm : Nat;
    accuracy : Nat;
    examCategory : Text;
    timestamp : Int;
    duration : Nat;
    passageId : Nat;
    attemptNumber : Nat;
    isPractice : Bool;
  };

  type MCQResult = {
    userId : Text;
    score : Nat;
    totalQuestions : Nat;
    examCategory : Text;
    timestamp : Int;
    attemptNumber : Nat;
    isPractice : Bool;
  };

  let passages = List.empty<TypingPassage>();
  let mcqQuestions = List.empty<MCQQuestion>();
  let typingResults = Map.empty<Text, List.List<TypingResult>>();
  let mcqResults = Map.empty<Text, List.List<MCQResult>>();

  var passageId = 0;
  var questionId = 0;

  module TypingResult {
    public func compareByWpm(a : TypingResult, b : TypingResult) : Order.Order {
      Nat.compare(b.wpm, a.wpm);
    };
  };

  public shared ({ caller }) func addPassage(passage : TypingPassage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add passages");
    };
    let newPassage : TypingPassage = {
      passage with
      id = passageId;
    };
    passages.add(newPassage);
    passageId += 1;
  };

  public shared ({ caller }) func addMCQQuestion(question : MCQQuestion) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add questions");
    };
    let newQuestion : MCQQuestion = {
      question with
      id = questionId;
    };
    mcqQuestions.add(newQuestion);
    questionId += 1;
  };

  public shared ({ caller }) func saveTypingResult(typingResult : TypingResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save typing results");
    };

    let callerText = caller.toText();
    if (typingResult.userId != callerText) {
      Runtime.trap("Unauthorized: Can only save results for your own user ID");
    };

    let userResults = switch (typingResults.get(typingResult.userId)) {
      case (null) { List.empty<TypingResult>() };
      case (?results) { results };
    };
    let newResult : TypingResult = {
      typingResult with
      timestamp = Time.now();
    };
    userResults.add(newResult);
    typingResults.add(typingResult.userId, userResults);
  };

  public shared ({ caller }) func saveMCQResult(mcqResult : MCQResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save MCQ results");
    };

    let callerText = caller.toText();
    if (mcqResult.userId != callerText) {
      Runtime.trap("Unauthorized: Can only save results for your own user ID");
    };

    let userResults = switch (mcqResults.get(mcqResult.userId)) {
      case (null) { List.empty<MCQResult>() };
      case (?results) { results };
    };
    let newResult : MCQResult = {
      mcqResult with
      timestamp = Time.now();
    };
    userResults.add(newResult);
    mcqResults.add(mcqResult.userId, userResults);
  };

  public query ({ caller }) func getPassagesByExam(examCategory : Text) : async [TypingPassage] {
    passages.values().toArray().filter(func(p) { p.examCategory == examCategory });
  };

  public query ({ caller }) func getPassagesByExamAndLanguage(examCategory : Text, language : Text) : async [TypingPassage] {
    passages.values().toArray().filter(
      func(p) {
        p.examCategory == examCategory and p.language == language;
      }
    );
  };

  public query ({ caller }) func getAllPassages() : async [TypingPassage] {
    passages.toArray();
  };

  public query ({ caller }) func getMCQsByExam(examCategory : Text) : async [MCQQuestion] {
    mcqQuestions.values().toArray().filter(func(q) { q.examCategory == examCategory });
  };

  public query ({ caller }) func getMCQsByExamAndLanguage(examCategory : Text, language : Text) : async [MCQQuestion] {
    mcqQuestions.values().toArray().filter(
      func(q) {
        q.examCategory == examCategory and q.language == language;
      }
    );
  };

  public query ({ caller }) func getAllMCQs() : async [MCQQuestion] {
    mcqQuestions.toArray();
  };

  public query ({ caller }) func getLeaderboard() : async [TypingResult] {
    typingResults.values().flatMap(func(results) { results.values() }).toArray().sort(TypingResult.compareByWpm);
  };

  public query ({ caller }) func getLeaderboardByExam(examCategory : Text) : async [TypingResult] {
    typingResults.values().flatMap(func(results) { results.values() }).toArray().filter(func(r) { r.examCategory == examCategory }).sort(TypingResult.compareByWpm);
  };

  public query ({ caller }) func getUserTypingResults(userId : Text) : async [TypingResult] {
    let callerText = caller.toText();
    if (callerText != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own results");
    };

    switch (typingResults.get(userId)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };

  public query ({ caller }) func getUserMCQResults(userId : Text) : async [MCQResult] {
    let callerText = caller.toText();
    if (callerText != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own results");
    };

    switch (mcqResults.get(userId)) {
      case (null) { [] };
      case (?results) { results.toArray() };
    };
  };

  public query ({ caller }) func isAdmin() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin);
  };

  public query ({ caller }) func checkIsAdmin() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin);
  };
};
