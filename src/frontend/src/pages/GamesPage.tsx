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
];

function getRandomWord() {
  return GAME_WORDS[Math.floor(Math.random() * GAME_WORDS.length)];
}

type GameType = "menu" | "falling" | "timeattack";

interface FallingWord {
  id: number;
  word: string;
  x: number;
  y: number;
  speed: number;
}

function FallingWordsGame({ onExit }: { onExit: () => void }) {
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

function TimeAttackGame({ onExit }: { onExit: () => void }) {
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

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<GameType>("menu");

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
      id: "wordshoot" as GameType,
      title: "Word Shooting",
      emoji: "🔫",
      desc: "Words pe shoot karo typing se. Coming soon!",
      available: false,
    },
    {
      id: "race" as GameType,
      title: "Typing Race",
      emoji: "🏎️",
      desc: "Online race lagao. Coming soon!",
      available: false,
    },
    {
      id: "jump" as GameType,
      title: "Keyboard Jump",
      emoji: "🕞️",
      desc: "Keys press karo aur jump karo. Coming soon!",
      available: false,
    },
    {
      id: "multi" as GameType,
      title: "Multiplayer Race",
      emoji: "👥",
      desc: "Friends ke saath race lagao. Coming soon!",
      available: false,
    },
  ];

  if (activeGame === "falling")
    return (
      <div className="p-4 md:p-8">
        <FallingWordsGame onExit={() => setActiveGame("menu")} />
      </div>
    );
  if (activeGame === "timeattack")
    return (
      <div className="p-4 md:p-8 max-w-lg mx-auto">
        <TimeAttackGame onExit={() => setActiveGame("menu")} />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b] mb-2">
          🎮 Typing Games
        </h1>
        <p className="text-gray-600 mb-6">
          Typing skills improve karein fun games ke saath!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              disabled={!game.available}
              onClick={() => game.available && setActiveGame(game.id)}
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
