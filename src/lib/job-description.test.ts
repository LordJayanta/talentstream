import assert from "node:assert/strict";
import { parseJobDescription } from "./job-description";

const withResponsibilities = parseJobDescription(
  "Intro paragraph.\n\n### Responsibilities\n- Build things.\n- Ship things.\n\n### What We Value\n- Care."
);
assert.deepEqual(withResponsibilities.responsibilities, ["Build things.", "Ship things."]);
assert.equal(withResponsibilities.about, "Intro paragraph.\n\n## What We Value\n- Care.");

const proseOnly = parseJobDescription("Intro.\n\n### The Role\nYou will drive excellence.");
assert.deepEqual(proseOnly.responsibilities, []);
assert.match(proseOnly.about, /## The Role/);
assert.match(proseOnly.about, /You will drive excellence\./);

const plain = parseJobDescription("Just a paragraph.");
assert.equal(plain.about, "Just a paragraph.");
assert.deepEqual(plain.responsibilities, []);

console.log("job-description: ok");
