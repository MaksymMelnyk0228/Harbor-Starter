import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "apps", "web", "public", "images", "products");
const distDir = path.join(root, "apps", "web", "dist", "images", "products");

const headers = {
  "User-Agent": "HarborStore/1.0 (catalog image seeding; https://localhost)",
  Accept: "application/json,image/jpeg,image/png,image/*;q=0.8",
};

/** Wikimedia Commons filenames that match each catalog product. */
const files = {
  "cloud-cans": ["Headphones 1.jpg", "Sony WH-1000XM4.jpg", "Over-ear headphones.jpg"],
  "lumen-monitor-27": ["Apple Cinema Display.jpg", "Dell UltraSharp monitor.jpg", "Computer monitor.jpg"],
  "type-k-mechanical": ["Cherry MX keyboard.jpg", "Mechanical Keyboard.jpg"],
  "harbor-hub": ["USB-C Hubb 5 portar.jpg", "4-port USB hub.jpg"],
  "frame-webcam": ["Webcam (Logitech c922).jpg", "Logitech Brio 301 webcam HS1.jpg"],
  "pebble-speaker": ["JBL Flip speaker.jpg", "Bluetooth speaker.jpg", "Portable speaker.jpg"],
  "pro-laptop-15": ["MacBook Pro.jpg", "Apple MacBook Pro.jpg"],
  "ultrabook-13": ["MacBook Air.jpg", "Ultrabook.jpg"],
  "nook-mini-pc": ["2018 Mac Mini cropped.jpg", "Intel NUC Mini PC.jpg"],
  "lift-laptop-stand": [
    "Rain Design M Stand under MacBook, along with Yamaha HS50M on stand (2014-11-24 21.38.58 by c-g.).jpg",
  ],
  "field-backpack": ["Backpack.jpg", "Leather backpack.jpg"],
  "slate-desk-mat": ["Logitech Red mouse on a mouse pad.jpg"],
  "cable-kit": ["Five USB cables with braided jackets in different colours.jpg"],
  "folio-phone-case": ["Apple iPhone 7 in Apple leather case.jpg", "Mujjo iPhone Wallet Brown.jpg"],
  "disc-charger": ["Wireless Charging Pad.jpg"],
  "ceramic-lamp": ["Table lamp MET DT8739.jpg"],
  "pour-over-kettle": ["Coffee Pour Over Setup.jpg"],
  "linen-throw": ["Woolen blanket from Salhus Væverier, Norway.jpg"],
  "hearth-purifier": ["Air Purifier (Levoit LV-H133) (49317867758).jpg"],
  "climate-dial": ["Nest Diamond Thermostat.jpg"],
  "vector-controller": ["DualSense controller.jpg", "PlayStation 5 DualSense.jpg"],
  "rift-headset": ["Oculus Quest 2 - 2.jpg"],
  "ember-ssd-2tb": ["Samsung SSD 840 EVO-front left PNr°0418.jpg"],
  "apex-wheel": ["Logitech G29 steering wheel.jpg"],
  "north-phone": ["IPhone 12 Pro.jpg", "IPhone X.jpg"],
  "page-reader": ["2023 Amazon Kindle Paperwhite (1).jpg"],
  "current-bank": ["Anker power bank and cable.jpg"],
  "clip-wallet": ["Aarong leather wallet.jpg"],
  "clear-screen-kit": ["IPhone screen.jpg", "Smartphone screen.jpg"],
  "studio-mic": ["Studio microphone.jpg", "Condenser microphone.jpg"],
  "dock-bar": ["USB-C dock - back.jpg"],
  "night-shift-mouse": ["Computer mouse.jpg", "Wireless mouse.jpg"],
};

async function fetchWithTimeout(url, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { headers, redirect: "follow", signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function commonsFileUrl(filename) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url&titles=${encodeURIComponent(`File:${filename}`)}`;
  const response = await fetchWithTimeout(api, 10000);
  if (!response.ok) return null;
  const data = await response.json();
  const page = Object.values(data.query?.pages || {})[0];
  if (!page || page.missing != null) return null;
  return page.imageinfo?.[0]?.url ?? null;
}

async function downloadUrl(url) {
  const response = await fetchWithTimeout(url, 30000);
  if (!response.ok) return null;
  const type = response.headers.get("content-type") || "";
  if (type.includes("text/html")) return null;
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 15000) return null;
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50;
  if (!isJpeg && !isPng) return null;
  return buffer;
}

async function download(slug, filenames) {
  const dest = path.join(outDir, `${slug}.jpg`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
    console.log(`skip ${slug} (already present)`);
    return true;
  }
  for (const filename of filenames) {
    try {
      const url = await commonsFileUrl(filename);
      if (!url) continue;
      const buffer = await downloadUrl(url);
      if (!buffer) continue;
      fs.writeFileSync(dest, buffer);
      console.log(`ok ${slug} <- ${filename} (${Math.round(buffer.length / 1024)}kb)`);
      return true;
    } catch (error) {
      console.warn(`retry ${slug}: ${error.message}`);
    }
  }
  console.error(`FAIL ${slug}`);
  return false;
}

fs.mkdirSync(outDir, { recursive: true });
let ok = 0;
for (const [slug, filenames] of Object.entries(files)) {
  if (await download(slug, filenames)) ok += 1;
}

if (fs.existsSync(path.join(root, "apps", "web", "dist"))) {
  fs.mkdirSync(distDir, { recursive: true });
  for (const name of fs.readdirSync(outDir).filter((file) => file.endsWith(".jpg"))) {
    fs.copyFileSync(path.join(outDir, name), path.join(distDir, name));
  }
  console.log("Copied images into dist.");
}

console.log(`Done: ${ok}/${Object.keys(files).length}`);
if (ok < Object.keys(files).length) process.exit(1);
