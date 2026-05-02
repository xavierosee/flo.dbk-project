#!/usr/bin/env node
// Installs gstack skills into ~/.claude/skills/gstack for every teammate.
const { execSync } = require("child_process");
const { existsSync } = require("fs");
const { homedir } = require("os");
const path = require("path");

const dest = path.join(homedir(), ".claude", "skills", "gstack");

if (existsSync(dest)) {
  console.log("gstack already installed — running setup to refresh docs...");
} else {
  console.log("Cloning gstack...");
  execSync(
    `git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git "${dest}"`,
    { stdio: "inherit" }
  );
}

console.log("Running gstack setup...");
// On Windows the setup script is bash — invoke via git-bash or WSL bash.
const isWindows = process.platform === "win32";
const setupCmd = isWindows
  ? `bash "${dest}/setup"`
  : `"${dest}/setup"`;
execSync(setupCmd, { cwd: dest, stdio: "inherit", shell: isWindows ? true : "/bin/bash" });

console.log("gstack setup complete.");
