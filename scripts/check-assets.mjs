// Stops the build if site content points at a file that is not in public/.
// This keeps broken images and dead download links off the live site.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|tsx)$/.test(name)) files.push(p);
  }
};
walk(join(root, "src"));

const missing = [];
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const m of text.matchAll(/["'`](\/(?:assets|downloads)\/[^"'`]+)["'`]/g)) {
    if (!existsSync(join(root, "public", decodeURI(m[1])))) missing.push(`${file.replace(root, "")}: ${m[1]}`);
  }
}
if (missing.length) {
  console.error("Missing files referenced by site content:\n  " + missing.join("\n  "));
  process.exit(1);
}
console.log(`check-assets: all referenced files exist (${files.length} source files checked).`);
