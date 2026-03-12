import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";

// server deps to bundle to reduce openat(2) syscalls
// which helps cold start times
const allowlist = [
  "@google/generative-ai",
  "axios",
  "connect-pg-simple",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "pg",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    // disable minification for easier debugging; variable names (like
    // `app`) are preserved which helps ensure exports remain accessible
    // and we can inspect the bundle if needed.
    minify: false,
    external: externals,
    logLevel: "info",
    // We export the app from `server/index.ts` itself. It includes a
    // conditional assignment to `module.exports` and uses `globalThis.__APP`
    // so that the value is reachable even after bundling. Adding an esbuild
    // footer here previously put `module.exports = app` outside the module
    // scope which caused a ReferenceError (app was defined inside a wrapper).
    // Keeping the footer would override the real export. Remove it and allow
    // the source to control the export.
    // footer: { js: "module.exports = app;" },
  });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
