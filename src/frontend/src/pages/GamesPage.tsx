import { useEffect, useRef, useState } from "react";

const GAME_WORDS = [
  "type",
  "fast",
  "speed",
  "quick",
  "jump",
  "word",
  "key",
  "press",
  "score",
  "level",
  "test",
  "exam",
  "hand",
  "finger",
  "skill",
  "learn",
  "practice",
  "accuracy",
  "wpm",
  "timer",
  "india",
  "haryana",
  "delhi",
  "ssc",
  "bank",
  "train",
  "court",
  "clerk",
  "data",
  "entry",
  "great",
  "nation",
  "work",
  "hard",
  "play",
  "game",
  "move",
  "next",
  "win",
  "star",
  "road",
  "fire",
  "river",
  "cloud",
  "light",
  "stone",
  "brave",
  "smart",
];

function getRandomWord() {
  return GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
}

type GameType =
  | "menu"
  | "falling"
  | "timeattack"
  | "carracing"
  | "balloon"
  | "toys";
type Character = "boy" | "girl" | null;

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

// ─── Character Picker ───────────────────────────────────────────────────────
function CharacterPicker({
  onSelect,
}: {
  onSelect: (c: Character) => void;
}) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-pink-50 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-purple-800 mb-2">
        अपना Character चुनें
      </h2>
      <p className="text-gray-500 text-sm mb-8">
        Choose your player before the game starts!
      </p>
      <div className="flex gap-10">
        <button
          type="button"
          onClick={() => onSelect("boy")}
          className="flex flex-col items-center gap-3 bg-blue-100 hover:bg-blue-200 border-2 border-blue-400 rounded-2xl px-8 py-6 transition-all hover:scale-105"
          data-ocid="game.character.button"
        >
          <span className="text-7xl">👦</span>
          <span className="font-bold text-blue-700 text-lg">Boy</span>
        </button>
        <button
          type="button"
          onClick={() => onSelect("girl")}
          className="flex flex-col items-center gap-3 bg-pink-100 hover:bg-pink-200 border-2 border-pink-400 rounded-2xl px-8 py-6 transition-all hover:scale-105"
          data-ocid="game.character.button"
        >
          <span className="text-7xl">👧</span>
          <span className="font-bold text-pink-700 text-lg">Girl</span>
        </button>
      </div>
    </div>
  );
}

// ─── Falling Words Game ──────────────────────────────────────────────────────
function FallingWordsGame({
  onExit,
  character,
}: { onExit: () => void; character: Character }) {
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const idRef = useRef(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    frameRef.current = setInterval(() => {
      setWords((prev) => {
        const updated = prev.map((w) => ({
          ...w,
          y: w.y + (0.5 + level * 0.3),
        }));
        const fallen = updated.filter((w) => w.y > 100);
        if (fallen.length > 0) {
          setLives((l) => {
            if (l - fallen.length <= 0) setGameOver(true);
            return Math.max(0, l - fallen.length);
          });
        }
        return updated.filter((w) => w.y <= 100);
      });
    }, 50);
    spawnRef.current = setInterval(
      () => {
        idRef.current += 1;
        setWords((prev) => [
          ...prev,
          {
            id: idRef.current,
            word: getRandomWord(),
            x: Math.random() * 80 + 5,
            y: 0,
            speed: 1,
          },
        ]);
      },
      Math.max(800, 2000 - level * 150),
    );
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [level]);

  function handleInput(val: string) {
    setInput(val);
    setWords((prev) => {
      const idx = prev.findIndex((w) => w.word === val.trim());
      if (idx !== -1) {
        setScore((s) => {
          const newScore = s + 1;
          if (newScore % 10 === 0) setLevel((l) => Math.min(l + 1, 10));
          return newScore;
        });
        setInput("");
        return prev.filter((_, i) => i !== idx);
      }
      return prev;
    });
  }

  return (
    <div
      className="bg-gray-900 rounded-2xl p-4 relative overflow-hidden"
      style={{ height: 500 }}
    >
      <div className="flex items-center justify-between mb-3 text-white">
        <div className="flex gap-4">
          <span>
            {character === "boy" ? "👦" : "👧"}{" "}
            {character === "boy" ? "Boy" : "Girl"}
          </span>
          <span>
            Score: <strong>{score}</strong>
          </span>
          <span>
            Level: <strong>{level}</strong>
          </span>
          <span>
            Lives: <strong>{"❤️".repeat(lives)}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-gray-400 hover:text-white text-sm"
        >
          Exit
        </button>
      </div>
      <div className="relative bg-gray-800 rounded-xl" style={{ height: 380 }}>
        {gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <div className="text-4xl mb-2">💀 Game Over!</div>
            <div className="text-xl">Score: {score}</div>
            <button
              type="button"
              onClick={() => {
                setScore(0);
                setLives(3);
                setLevel(1);
                setWords([]);
                setGameOver(false);
              }}
              className="mt-4 bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Play Again
            </button>
          </div>
        ) : (
          words.map((w) => (
            <div
              key={w.id}
              className="absolute text-sm font-bold px-2 py-1 rounded bg-blue-500 text-white"
              style={{
                left: `${w.x}%`,
                top: `${w.y}%`,
                transform: "translateX(-50%)",
              }}
            >
              {w.word}
            </div>
          ))
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full mt-3 bg-gray-700 text-white rounded-lg px-4 py-2 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Word type karein..."
        disabled={gameOver}
        data-ocid="game.falling.input"
      />
    </div>
  );
}

// ─── Time Attack Game ────────────────────────────────────────────────────────
function TimeAttackGame({
  onExit,
  character,
}: { onExit: () => void; character: Character }) {
  const [word, setWord] = useState(getRandomWord());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startGame() {
    setStarted(true);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setFinished(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function handleInput(val: string) {
    if (!started) startGame();
    setInput(val);
    if (val.trim() === word) {
      setScore((s) => s + 1);
      setWord(getRandomWord());
      setInput("");
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-6 text-white text-center">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg">{character === "boy" ? "👦" : "👧"}</div>
        <div className="text-2xl font-bold">⏱ {timeLeft}s</div>
        <div className="text-2xl font-bold">Score: {score}</div>
        <button
          type="button"
          onClick={onExit}
          className="text-gray-400 hover:text-white text-sm"
        >
          Exit
        </button>
      </div>
      {finished ? (
        <div>
          <div className="text-5xl mb-3">🏆</div>
          <div className="text-2xl font-bold mb-1">Final Score: {score}</div>
          <div className="text-gray-400">60 seconds mein {score} words!</div>
          <button
            type="button"
            onClick={() => {
              setScore(0);
              setTimeLeft(60);
              setStarted(false);
              setFinished(false);
              setWord(getRandomWord());
            }}
            className="mt-5 bg-blue-600 px-8 py-3 rounded-xl hover:bg-blue-700 text-lg font-bold"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div className="text-5xl font-bold text-yellow-300 mb-8 tracking-widest">
            {word}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full max-w-xs mx-auto block bg-gray-700 text-white text-center rounded-xl px-6 py-3 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Type here!"
            data-ocid="game.timeattack.input"
          />
          {!started && (
            <div className="text-gray-400 mt-4 text-sm">
              Typing shuru karte hi timer start ho jaayega
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Car Racing Game ─────────────────────────────────────────────────────────
function CarRacingGame({
  onExit,
  character,
}: { onExit: () => void; character: Character }) {
  const TOTAL = 20;
  const [playerPos, setPlayerPos] = useState(0);
  const [aiPos, setAiPos] = useState(0);
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [input, setInput] = useState("");
  const [finished, setFinished] = useState<"win" | "lose" | null>(null);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [startTime] = useState(Date.now());
  const aiRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    aiRef.current = setInterval(() => {
      setAiPos((p) => {
        if (p >= TOTAL) {
          clearInterval(aiRef.current!);
          return p;
        }
        return p + 1;
      });
    }, 1800);
    return () => {
      if (aiRef.current) clearInterval(aiRef.current);
    };
  }, []);

  useEffect(() => {
    if (aiPos >= TOTAL && !finished) setFinished("lose");
  }, [aiPos, finished]);

  function handleInput(val: string) {
    setInput(val);
    if (val.trim() === currentWord) {
      const newPos = playerPos + 1;
      setPlayerPos(newPos);
      setWordsTyped((w) => w + 1);
      setCurrentWord(getRandomWord());
      setInput("");
      if (newPos >= TOTAL) {
        clearInterval(aiRef.current!);
        setFinished("win");
      }
    }
  }

  const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
  const wpm = Math.round((wordsTyped / elapsed) * 60);

  return (
    <div className="bg-gradient-to-b from-sky-900 to-gray-900 rounded-2xl p-5 text-white">
      <div className="flex justify-between mb-4">
        <span className="text-sm">🏁 Car Racing Game</span>
        <button
          type="button"
          onClick={onExit}
          className="text-gray-400 hover:text-white text-sm"
        >
          Exit
        </button>
      </div>

      {finished ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-3">
            {finished === "win" ? "🏆" : "😢"}
          </div>
          <div className="text-2xl font-bold mb-1">
            {finished === "win" ? "YOU WIN! 🎉" : "YOU LOSE! 😢"}
          </div>
          <div className="text-gray-300 mb-2">
            WPM: {wpm} | Words typed: {wordsTyped}
          </div>
          <button
            type="button"
            onClick={onExit}
            className="mt-4 bg-orange-500 px-8 py-3 rounded-xl hover:bg-orange-600 font-bold"
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          {/* Tracks */}
          <div className="space-y-4 mb-5">
            {/* Player Track */}
            <div>
              <div className="text-xs text-green-300 mb-1">
                {character === "boy" ? "👦" : "👧"} YOU
              </div>
              <div className="relative bg-gray-700 rounded-full h-10 overflow-hidden border border-green-500">
                <div className="absolute inset-0 flex items-center px-2 opacity-20">
                  {[
                    "s1",
                    "s2",
                    "s3",
                    "s4",
                    "s5",
                    "s6",
                    "s7",
                    "s8",
                    "s9",
                    "s10",
                  ].map((k) => (
                    <div key={k} className="flex-1 border-r border-white/30" />
                  ))}
                </div>
                <div
                  className="absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-300"
                  style={{ left: `${(playerPos / TOTAL) * 88 + 2}%` }}
                >
                  🚗
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg">
                  🏁
                </div>
              </div>
            </div>
            {/* AI Track */}
            <div>
              <div className="text-xs text-red-300 mb-1">🤖 AI</div>
              <div className="relative bg-gray-700 rounded-full h-10 overflow-hidden border border-red-500">
                <div
                  className="absolute top-1/2 -translate-y-1/2 text-2xl transition-all duration-300"
                  style={{ left: `${(aiPos / TOTAL) * 88 + 2}%` }}
                >
                  🚙
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-lg">
                  🏁
                </div>
              </div>
            </div>
          </div>
          {/* Word to type */}
          <div className="text-center mb-4">
            <div className="text-xs text-gray-400 mb-1">
              Type this word to accelerate:
            </div>
            <div className="text-3xl font-bold text-yellow-300 tracking-widest">
              {currentWord}
            </div>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 text-xl font-mono text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Type here..."
            data-ocid="game.carracing.input"
          />
          <div className="flex justify-center gap-6 mt-3 text-xs text-gray-400">
            <span>Words: {wordsTyped}</span>
            <span>WPM: {wpm}</span>
            <span>
              Progress: {playerPos}/{TOTAL}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Balloon Pop Game ────────────────────────────────────────────────────────
interface Balloon {
  id: number;
  word: string;
  x: number;
  y: number;
  color: string;
}

const BALLOON_COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#ec4899",
];

function BalloonPopGame({
  onExit,
  character,
}: { onExit: () => void; character: Character }) {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [popped, setPopped] = useState<number[]>([]);
  const idRef = useRef(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const speed = 0.3 + Math.floor(score / 5) * 0.05;
    frameRef.current = setInterval(() => {
      setBalloons((prev) => {
        const updated = prev.map((b) => ({ ...b, y: b.y - speed }));
        const escaped = updated.filter((b) => b.y < -10);
        if (escaped.length > 0) {
          setLives((l) => {
            const newL = l - escaped.length;
            if (newL <= 0) setGameOver(true);
            return Math.max(0, newL);
          });
        }
        return updated.filter((b) => b.y >= -10);
      });
    }, 50);
    spawnRef.current = setInterval(
      () => {
        idRef.current += 1;
        setBalloons((prev) => [
          ...prev,
          {
            id: idRef.current,
            word: getRandomWord(),
            x: Math.random() * 75 + 5,
            y: 110,
            color:
              BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
          },
        ]);
      },
      Math.max(1200, 2500 - score * 30),
    );
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [score]);

  function handleInput(val: string) {
    setInput(val);
    const trimmed = val.trim();
    const idx = balloons.findIndex((b) => b.word === trimmed);
    if (idx !== -1) {
      const id = balloons[idx].id;
      setPopped((p) => [...p, id]);
      setTimeout(() => {
        setBalloons((prev) => prev.filter((b) => b.id !== id));
        setPopped((p) => p.filter((pid) => pid !== id));
      }, 300);
      setScore((s) => s + 1);
      setInput("");
    }
  }

  return (
    <div
      className="bg-gradient-to-b from-blue-900 to-indigo-900 rounded-2xl p-4 relative overflow-hidden"
      style={{ height: 520 }}
    >
      <div className="flex items-center justify-between mb-2 text-white">
        <div className="flex gap-4 text-sm">
          <span>{character === "boy" ? "👦" : "👧"}</span>
          <span>
            🎈 Score: <strong>{score}</strong>
          </span>
          <span>
            Lives: <strong>{"❤️".repeat(lives)}</strong>
          </span>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-gray-400 hover:text-white text-sm"
        >
          Exit
        </button>
      </div>
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ height: 380 }}
      >
        {gameOver ? (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
            <div className="text-4xl mb-2">💥 Game Over!</div>
            <div className="text-xl">Score: {score}</div>
            <button
              type="button"
              onClick={() => {
                setScore(0);
                setLives(3);
                setBalloons([]);
                setGameOver(false);
              }}
              className="mt-4 bg-purple-600 px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Play Again
            </button>
          </div>
        ) : (
          balloons.map((b) => (
            <div
              key={b.id}
              className="absolute flex flex-col items-center transition-transform"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                transform: popped.includes(b.id) ? "scale(2)" : "scale(1)",
                opacity: popped.includes(b.id) ? 0 : 1,
                transition: "all 0.3s",
              }}
            >
              <div
                className="w-14 h-16 rounded-full flex items-center justify-center font-bold text-white text-xs text-center px-1"
                style={{
                  background: b.color,
                  boxShadow: `0 0 12px ${b.color}`,
                }}
              >
                {b.word}
              </div>
              <div className="w-0.5 h-4" style={{ background: b.color }} />
            </div>
          ))
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        className="w-full mt-3 bg-white/10 text-white rounded-lg px-4 py-2 text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/40"
        placeholder="Type balloon word to pop!"
        disabled={gameOver}
        data-ocid="game.balloon.input"
      />
    </div>
  );
}

// ─── Toys Typing Game ─────────────────────────────────────────────────────────
interface ToyBox {
  id: number;
  word: string;
  x: number;
  y: number;
  color: string;
  emoji: string;
}

const TOY_EMOJIS = ["🧸", "🎠", "🎪", "🎯", "🎲", "🪀", "🧩", "🎡"];
const TOY_COLORS = [
  "#fde68a",
  "#fbcfe8",
  "#a7f3d0",
  "#bfdbfe",
  "#ddd6fe",
  "#fed7aa",
];

function ToysGame({
  onExit,
  character,
}: { onExit: () => void; character: Character }) {
  const [boxes, setBoxes] = useState<ToyBox[]>([]);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const idRef = useRef(0);
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    frameRef.current = setInterval(() => {
      setBoxes((prev) =>
        prev.map((b) => ({ ...b, x: b.x - 0.4 })).filter((b) => b.x > -15),
      );
    }, 50);
    spawnRef.current = setInterval(() => {
      idRef.current += 1;
      setBoxes((prev) => [
        ...prev,
        {
          id: idRef.current,
          word: getRandomWord(),
          x: 105,
          y: 20 + Math.random() * 60,
          color: TOY_COLORS[Math.floor(Math.random() * TOY_COLORS.length)],
          emoji: TOY_EMOJIS[Math.floor(Math.random() * TOY_EMOJIS.length)],
        },
      ]);
    }, 1800);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (frameRef.current) clearInterval(frameRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function handleInput(val: string) {
    setInput(val);
    const trimmed = val.trim();
    const idx = boxes.findIndex((b) => b.word === trimmed);
    if (idx !== -1) {
      setScore((s) => s + 1);
      setBoxes((prev) => prev.filter((_, i) => i !== idx));
      setInput("");
    }
  }

  return (
    <div
      className="rounded-2xl p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fce7f3 0%, #dbeafe 50%, #dcfce7 100%)",
        height: 520,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-4 text-sm font-semibold text-purple-800">
          <span>{character === "boy" ? "👦" : "👧"} Toys Game</span>
          <span>⏱ {timeLeft}s</span>
          <span>⭐ Score: {score}</span>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-gray-500 hover:text-gray-800 text-sm"
        >
          Exit
        </button>
      </div>
      <div
        className="relative rounded-xl overflow-hidden bg-white/40"
        style={{ height: 390 }}
      >
        {gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl mb-2">🎉 Time Up!</div>
            <div className="text-2xl font-bold text-purple-700 mb-1">
              Score: {score}
            </div>
            <button
              type="button"
              onClick={onExit}
              className="mt-4 bg-purple-500 text-white px-8 py-3 rounded-xl hover:bg-purple-600 font-bold"
            >
              Play Again
            </button>
          </div>
        ) : (
          boxes.map((b) => (
            <div
              key={b.id}
              className="absolute flex flex-col items-center justify-center rounded-xl border-2 border-white/60 shadow-lg text-center px-2 py-1"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                background: b.color,
                minWidth: 70,
                transform: "translateY(-50%)",
              }}
            >
              <span className="text-xl">{b.emoji}</span>
              <span className="text-xs font-bold text-gray-700 mt-0.5">
                {b.word}
              </span>
            </div>
          ))
        )}
      </div>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        disabled={gameOver}
        className="w-full mt-3 rounded-xl px-4 py-2 text-lg font-mono bg-white/70 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
        placeholder="Type toy word!"
        data-ocid="game.toys.input"
      />
    </div>
  );
}

// ─── Main GamesPage ──────────────────────────────────────────────────────────
export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType>("menu");
  const [pendingGame, setPendingGame] = useState<GameType | null>(null);
  const [character, setCharacter] = useState<Character>(null);

  const GAMES = [
    {
      id: "falling" as GameType,
      title: "Falling Words",
      emoji: "🌧️",
      desc: "Words upar se girte hain, type karke hatao. 3 lives milti hain.",
      available: true,
    },
    {
      id: "timeattack" as GameType,
      title: "Time Attack",
      emoji: "⏱️",
      desc: "60 seconds mein jitne ho sake utne words type karo!",
      available: true,
    },
    {
      id: "carracing" as GameType,
      title: "Car Racing",
      emoji: "🚗",
      desc: "Words type karke apni car aage badhaao. AI se race lagao!",
      available: true,
    },
    {
      id: "balloon" as GameType,
      title: "Balloon Pop",
      emoji: "🎈",
      desc: "Balloons pe word type karke unhe pop karo before they escape!",
      available: true,
    },
    {
      id: "toys" as GameType,
      title: "Toys Typing",
      emoji: "🧸",
      desc: "Toy boxes slide karte hain — type karke 60 sec mein score badhaao!",
      available: true,
    },
    {
      id: "wordshoot" as GameType,
      title: "Word Shooting",
      emoji: "🔫",
      desc: "Words pe shoot karo typing se. Coming soon!",
      available: false,
    },
  ];

  function startGame(id: GameType) {
    if (!character) {
      setPendingGame(id);
    } else {
      setActiveGame(id);
    }
  }

  function handleCharacterSelect(c: Character) {
    setCharacter(c);
    if (pendingGame) {
      setActiveGame(pendingGame);
      setPendingGame(null);
    }
  }

  function exitGame() {
    setActiveGame("menu");
    setPendingGame(null);
  }

  // Character picker screen
  if (pendingGame) {
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <CharacterPicker onSelect={handleCharacterSelect} />
      </div>
    );
  }

  if (activeGame === "falling")
    return (
      <div className="p-4 md:p-8">
        <FallingWordsGame onExit={exitGame} character={character} />
      </div>
    );
  if (activeGame === "timeattack")
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <TimeAttackGame onExit={exitGame} character={character} />
      </div>
    );
  if (activeGame === "carracing")
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <CarRacingGame onExit={exitGame} character={character} />
      </div>
    );
  if (activeGame === "balloon")
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <BalloonPopGame onExit={exitGame} character={character} />
      </div>
    );
  if (activeGame === "toys")
    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        <ToysGame onExit={exitGame} character={character} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b] mb-2">
          🎮 Typing Games
        </h1>
        <p className="text-gray-600 mb-2">
          Typing skills improve karein fun games ke saath!
        </p>
        {character && (
          <div className="mb-4 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
            {character === "boy" ? "👦" : "👧"}{" "}
            {character === "boy" ? "Boy" : "Girl"} selected
            <button
              type="button"
              onClick={() => setCharacter(null)}
              className="text-purple-400 hover:text-purple-700 text-xs ml-1"
            >
              ✕ Change
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              disabled={!game.available}
              onClick={() => game.available && startGame(game.id)}
              className={`w-full text-left bg-white rounded-2xl shadow-md p-5 border-2 transition-all ${
                game.available
                  ? "border-purple-200 hover:border-purple-500 hover:shadow-lg cursor-pointer"
                  : "border-gray-100 opacity-60 cursor-not-allowed"
              }`}
              data-ocid={`game.${game.id}`}
            >
              <div className="text-4xl mb-3">{game.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-1">{game.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{game.desc}</p>
              {game.available ? (
                <span className="inline-block bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                  Play Now
                </span>
              ) : (
                <span className="inline-block bg-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">
                  Coming Soon
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
