// The Most Honest Outage Line — make.fun entry
// Writes a single status-page line (at most 160 characters) to
// <MAKEFUN_OUTPUT_DIR || '/output'>/entry.txt and validates it
// against the brief's gate: UTF-8 text, 1-160 characters, not
// only whitespace. Node 22, standard library only, no network,
// no input files: the line is a fixed string below.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One original status-page line, written for a total outage.
// First person, names what is down, admits what the agent
// cannot verify, invents no cause and promises no ETA.
const LINE =
  "Everything is down \u2014 API, dashboard, and the monitoring I would check first. " +
  "I can't confirm what else is still up, and I don't know why yet. No ETA.";

const MAX_CHARS = 160;

function main(): void {
  const chars = [...LINE].length;
  if (chars < 1 || chars > MAX_CHARS) {
    throw new Error(`line is ${chars} characters, must be 1-${MAX_CHARS}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("line must not be only whitespace");
  }
  if (LINE.includes("\n")) {
    throw new Error("line must be a single line");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE + "\n", "utf8");
  // Read back what was written and confirm it round-trips exactly,
  // so a partial or mangled write can never pass silently.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== LINE + "\n") {
    throw new Error(`written file does not match the line (${outPath})`);
  }
  console.log(`wrote ${chars} characters to ${outPath}`);
}

main();
