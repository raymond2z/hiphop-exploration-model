import { access, cp, rm } from "node:fs/promises";

const project = new URL("../", import.meta.url);
const output = new URL("dist/", project);
const pages = ["index.html", "possibilities.html", "vocabulary.html"];
const assets = "assets/site";
const files = [...pages, assets];

await Promise.all(files.map(file => access(new URL(file, output))));
await rm(new URL(assets, project), { recursive: true, force: true });
for (const file of files) {
  await cp(new URL(file, output), new URL(file, project), { recursive: true });
}
