import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "audio/soundtracks.json",
  "assets/soundtrack-library.css",
  "assets/soundtrack-library.js",
  "SOUNDTRACK-UPDATE.md"
];

for (const file of requiredFiles) {
  if (!existsSync(file)) throw new Error(`Missing soundtrack file: ${file}`);
}

const html = readFileSync("index.html", "utf8");
const player = readFileSync("assets/theme-music.js", "utf8");
const library = readFileSync("assets/soundtrack-library.js", "utf8");
const tracks = JSON.parse(readFileSync("audio/soundtracks.json", "utf8"));

for (const ref of [
  "./assets/soundtrack-library.css",
  "./assets/soundtrack-library.js",
  "#soundtrack",
  "id=\"soundtrack\""
]) {
  if (!html.includes(ref)) throw new Error(`Missing soundtrack page reference: ${ref}`);
}

for (const expected of ["window.YexipuMusic", "playTrack", "yexipu:music-state"]) {
  if (!player.includes(expected) || !library.includes(expected)) {
    throw new Error(`Missing shared player behavior: ${expected}`);
  }
}

if (!Array.isArray(tracks) || tracks.length === 0) throw new Error("Soundtrack list is empty.");

for (const track of tracks) {
  for (const key of ["id", "title", "subtitle", "scene", "duration", "src"]) {
    if (!track[key]) throw new Error(`Track ${track.id ?? "unknown"} is missing ${key}.`);
  }
  if (!track.src.startsWith("./audio/") || !existsSync(track.src.slice(2))) {
    throw new Error(`Missing audio file for ${track.title}: ${track.src}`);
  }
}

console.log(`Soundtrack library validation passed with ${tracks.length} track(s).`);
