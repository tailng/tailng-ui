import { execSync } from "node:child_process";
import fs from "node:fs";

const targets = process.argv[2] ?? "";
const npmTag = process.argv[3] ?? "latest";

const has = (t) => ("," + targets + ",").includes("," + t + ",");
const run = (cmd, cwd) =>
  execSync(cmd, { stdio: "inherit", cwd, env: { ...process.env } });

const publish = (dir) => {
  if (!fs.existsSync(dir)) {
    throw new Error(`Publish directory not found: ${dir}`);
  }

  const pkg = JSON.parse(fs.readFileSync(`${dir}/package.json`, "utf8"));
  const name = pkg.name ?? dir;
  const version = pkg.version ?? "";

  console.log(`Publishing ${name}@${version} with tag ${npmTag}`);

  const cmd = [
    "npm publish",
    "--access public",
    `--tag ${npmTag.trim()}`,
    "--provenance",
  ].join(" ");

  if (process.env.DRY_RUN === "true") {
    console.log(`DRY_RUN=true, skipping: ${cmd}`);
    return;
  }

  run(cmd, dir);
};

// Publish in dependency order
if (has("cdk")) publish("dist/libs/cdk");
if (has("theme")) publish("dist/libs/theme");
if (has("icons")) publish("dist/libs/icons");
if (has("ui")) publish("dist/libs/ui");