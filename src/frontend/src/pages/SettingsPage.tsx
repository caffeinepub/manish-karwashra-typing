import { useEffect, useState } from "react";

const THEMES = [
  { id: "blue", label: "Blue (Default)", bg: "bg-blue-600" },
  { id: "dark", label: "Dark", bg: "bg-gray-900" },
  { id: "green", label: "Green", bg: "bg-green-600" },
  { id: "purple", label: "Purple", bg: "bg-purple-600" },
  { id: "orange", label: "Orange", bg: "bg-orange-600" },
];

const FONT_SIZES = ["Small", "Medium", "Large"];
const FONT_STYLES = ["Monospace", "Sans-serif", "Serif"];
const KEYBOARD_LAYOUTS = ["QWERTY", "Dvorak"];
const LANGUAGES = ["English", "Hindi", "Both"];

interface Settings {
  darkMode: boolean;
  fontSize: string;
  fontStyle: string;
  keyboardSound: boolean;
  keyHighlight: boolean;
  language: string;
  theme: string;
  keyboardLayout: string;
}

const DEFAULT_SETTINGS: Settings = {
  darkMode: false,
  fontSize: "Medium",
  fontStyle: "Monospace",
  keyboardSound: false,
  keyHighlight: true,
  language: "Both",
  theme: "blue",
  keyboardLayout: "QWERTY",
};

function loadSettings(): Settings {
  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(localStorage.getItem("app_settings") || "{}"),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function saveSettings() {
    localStorage.setItem("app_settings", JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  useEffect(() => {
    if (settings.darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [settings.darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0d1b4b] mb-6">
          ⚙️ Settings
        </h1>

        <div className="space-y-5">
          {/* Dark Mode */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-gray-800 mb-4">Appearance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700">Dark Mode</div>
                  <div className="text-sm text-gray-500">
                    Dark background enable/disable karein
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update("darkMode", !settings.darkMode)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    settings.darkMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  data-ocid="settings.dark_mode"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <div className="font-medium text-gray-700 mb-2">Font Size</div>
                <div className="flex gap-2">
                  {FONT_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update("fontSize", s)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        settings.fontSize === s
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                      data-ocid={`settings.font_size.${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium text-gray-700 mb-2">Font Style</div>
                <div className="flex gap-2 flex-wrap">
                  {FONT_STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update("fontStyle", s)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        settings.fontStyle === s
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                      data-ocid={`settings.font_style.${s}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium text-gray-700 mb-2">
                  Theme / Background
                </div>
                <div className="flex gap-3">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => update("theme", t.id)}
                      className="flex flex-col items-center gap-1"
                      data-ocid={`settings.theme.${t.id}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full ${t.bg} ${
                          settings.theme === t.id
                            ? "ring-4 ring-offset-2 ring-blue-400"
                            : ""
                        }`}
                      />
                      <span className="text-xs text-gray-600">
                        {t.label.split(" ")[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Typing Settings */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-bold text-gray-800 mb-4">Typing Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700">
                    Keyboard Sound
                  </div>
                  <div className="text-sm text-gray-500">
                    Key press pe click sound
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    update("keyboardSound", !settings.keyboardSound)
                  }
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    settings.keyboardSound ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  data-ocid="settings.keyboard_sound"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      settings.keyboardSound ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-700">Key Highlight</div>
                  <div className="text-sm text-gray-500">
                    Virtual keyboard pe pressed key highlight
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update("keyHighlight", !settings.keyHighlight)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    settings.keyHighlight ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  data-ocid="settings.key_highlight"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      settings.keyHighlight ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div>
                <div className="font-medium text-gray-700 mb-2">
                  Language Select
                </div>
                <div className="flex gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => update("language", l)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        settings.language === l
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                      data-ocid={`settings.language.${l}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="font-medium text-gray-700 mb-2">
                  Keyboard Layout
                </div>
                <div className="flex gap-2">
                  {KEYBOARD_LAYOUTS.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => update("keyboardLayout", l)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        settings.keyboardLayout === l
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 text-gray-700 hover:border-blue-400"
                      }`}
                      data-ocid={`settings.keyboard_layout.${l}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={saveSettings}
              className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${
                saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
              data-ocid="settings.save_button"
            >
              {saved ? "✅ Settings Saved!" : "Save Settings"}
            </button>
            <button
              type="button"
              onClick={toggleFullScreen}
              className="flex-1 py-3 rounded-xl font-bold bg-gray-700 text-white hover:bg-gray-800 transition-colors"
              data-ocid="settings.fullscreen_button"
            >
              ⛶ Full Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
