#!/usr/bin/env node
/* Wraps the artifact body (workout-tracker.html) into a standalone,
   installable page under site/. One source of truth, two deployments. */
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const ROOT = __dirname, OUT = path.join(ROOT, "site");
const body = fs.readFileSync(path.join(ROOT, "workout-tracker.html"), "utf8");
const rev = crypto.createHash("sha256").update(body).digest("hex").slice(0, 10);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, "assets")))
  fs.copyFileSync(path.join(ROOT, "assets", f), path.join(OUT, "assets", f));

fs.writeFileSync(path.join(OUT, "index.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Iron Ledger">
<meta name="theme-color" content="#EDEFF3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0D1117" media="(prefers-color-scheme: dark)">
<meta name="description" content="Six-day push/pull/legs cut program with a set-by-set logger.">
<link rel="manifest" href="./manifest.webmanifest">
<link rel="apple-touch-icon" href="./assets/icon-180.png">
<link rel="icon" type="image/png" sizes="192x192" href="./assets/icon-192.png">
<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${body}
<script>
if ("serviceWorker" in navigator)
  addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
</script>
</body>
</html>
`);

fs.writeFileSync(path.join(OUT, "manifest.webmanifest"), JSON.stringify({
  name: "Iron Ledger", short_name: "Iron Ledger",
  description: "Six-day push/pull/legs cut program with a set-by-set logger.",
  start_url: "./", scope: "./", display: "standalone", orientation: "portrait",
  background_color: "#0D1117", theme_color: "#0D1117",
  icons: [
    { src: "./assets/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "./assets/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "./assets/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
  ]
}, null, 2));

fs.writeFileSync(path.join(OUT, "sw.js"), `/* Iron Ledger service worker — build ${rev} */
const CACHE = "iron-ledger-${rev}";
const SHELL = ["./", "./index.html", "./manifest.webmanifest",
  "./assets/icon-180.png", "./assets/icon-192.png", "./assets/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;

  // The page itself: fresh when online, cached when the gym has no signal.
  if (req.mode === "navigate"){
    e.respondWith(fetch(req)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); return res; })
      .catch(() => caches.match("./index.html").then(r => r || caches.match("./"))));
    return;
  }
  // Everything else (icons, fonts): cache first, fill the cache on the way past.
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res && (res.ok || res.type === "opaque")){
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
    }
    return res;
  }).catch(() => hit)));
});
`);

console.log("built site/ — revision " + rev);
