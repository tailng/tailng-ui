import { execSync } from "node:child_process";
import fs from "node:fs";

const root = JSON.parse(fs.readFileSync("package.json", "utf8"));
const tag = `v${root.version}`;

try {
  execSync(`git rev-parse "${tag}"`, { stdio: "ignore" });
  console.log(`[tag] ${tag} already exists, skipping tag creation`);
} catch {
  execSync(`git tag -a "${tag}" -m "Release ${tag}"`, { stdio: "inherit" });
  execSync(`git push origin "${tag}"`, { stdio: "inherit" });
}

// Export for later steps
fs.appendFileSync(process.env.GITHUB_ENV, `ROOT_VERSION=${root.version}\n`);
fs.appendFileSync(process.env.GITHUB_ENV, `ROOT_TAG=${tag}\n`);