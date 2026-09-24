import { existsSync, readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "audio/yexipu-theme.mp3",
  "assets/theme-music.css",
  "assets/theme-music.js",
  "index.html"
];

for (const file of requiredFiles) {
  if (!existsSync(file) || !statSync(file).isFile()) {
    throw new Error(`Missing theme music file: ${file}`);
  }
}

const html = readFileSync("index.html", "utf8");
const js = readFileSync("assets/theme-music.js", "utf8");

for (const ref of ["./assets/theme-music.css", "./assets/theme-music.js"]) {
  if (!html.includes(ref)) throw new Error(`Missing page reference: ${ref}`);
}

for (const expected of [
  "./audio/yexipu-theme.mp3",
  "autoplay",
  "localStorage",
  "audio.volume = 0.45",
  "loop",
  "aria-pressed",
  'addEventListener("click", resumeFromGesture, true)',
  'getItem(STORAGE_KEY) === "off"'
]) {
  if (!js.includes(expected)) throw new Error(`Missing music behavior: ${expected}`);
}

if (statSync("audio/yexipu-theme.mp3").size < 100000) {
  throw new Error("Theme music file appears to be empty or truncated.");
}

console.log("Theme music integration validation passed.");
