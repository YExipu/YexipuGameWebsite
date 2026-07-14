import { readFileSync, statSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "assets/index-CEmz-S-n.css",
  "assets/stable-card-overrides.css",
  "assets/card-flip.js",
  "images/cards/card-back.png",
  "images/cards/sun-wukong.png",
  "images/cards/zhu-bajie.png",
  "images/cards/sha-wujing.png",
  "images/cards/tang-sanzang.png"
];

const requiredRefs = [
  "./images/cards/card-back.png",
  "./images/cards/sun-wukong.png",
  "./images/cards/zhu-bajie.png",
  "./images/cards/sha-wujing.png",
  "./images/cards/tang-sanzang.png",
  "./assets/stable-card-overrides.css",
  "./assets/card-flip.js"
];

const forbiddenRefs = [
  "cardback-trimmed.webp",
  "role-youpu.webp",
  "role-zhangjuan.webp",
  "role-shouye.webp",
  "_next/static/media"
];

for (const file of requiredFiles) {
  const stat = statSync(file);
  if (!stat.isFile()) throw new Error(`Missing file: ${file}`);
}

const html = readFileSync("index.html", "utf8");
const css = [
  readFileSync("assets/index-CEmz-S-n.css", "utf8"),
  readFileSync("assets/stable-card-overrides.css", "utf8")
].join("\n");
const js = readFileSync("assets/card-flip.js", "utf8");

for (const ref of requiredRefs) {
  if (!html.includes(ref)) throw new Error(`Missing page reference: ${ref}`);
}

for (const ref of forbiddenRefs) {
  if (html.includes(ref)) throw new Error(`Forbidden old asset reference in index.html: ${ref}`);
}

for (const expected of ["rotateY(180deg)", "transform-style", "object-fit: contain", "aspect-ratio: 480 / 1340"]) {
  if (!css.includes(expected)) throw new Error(`Missing card CSS behavior: ${expected}`);
}

for (const expected of ["click", "keydown", "aria-pressed", "is-flipped"]) {
  if (!js.includes(expected)) throw new Error(`Missing card interaction behavior: ${expected}`);
}

console.log("Static site build validation passed.");
