import express from "express";
import qrcode from "qrcode";
import { Client, LocalAuth } from "whatsapp-web.js";

const app = express();
app.use(express.json());

let status = "disconnected";
let qr = "";

const client = new Client({
  authStrategy: new LocalAuth()
});

client.on("qr", async (q) => {
  qr = await qrcode.toDataURL(q);
  status = "qr_pending";
});

client.on("ready", () => {
  status = "connected";
  qr = "";
  console.log("WhatsApp connected");
});

client.on("message", async (msg) => {
  const text = msg.body.toLowerCase();

  if (text.includes("chatgpt")) {
    msg.reply("🔥 ChatGPT available! Price: 1500");
  } else if (text.includes("capcut")) {
    msg.reply("🎬 CapCut Pro available! Price: 800");
  } else {
    msg.reply("👋 Welcome! Type ChatGPT / CapCut");
  }
});

app.get("/status", (req, res) => {
  res.json({ status, qr });
});

client.initialize();
app.listen(3000, () => console.log("Server running"));
