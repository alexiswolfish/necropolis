import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./app.css";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function prepareFonts() {
  if (!("fonts" in document)) {
    return;
  }

  const requiredFonts = [
    document.fonts.load('400 1em "Spinosa BTW01 Regular"'),
    document.fonts.load('400 1em "Lohengrin"'),
    document.fonts.load('400 1em "Darksame Regular"'),
    document.fonts.load('400 1em "Bistream Amerigo"'),
    document.fonts.load('700 1em "Trade Gothic LT Std"')
  ];

  await Promise.race([Promise.allSettled(requiredFonts), wait(2500)]);
}

async function boot() {
  await prepareFonts();
  document.documentElement.classList.add("fonts-ready");

  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

boot();
