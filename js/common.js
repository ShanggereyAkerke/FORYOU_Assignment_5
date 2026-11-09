/* Assignment 5 - behaviour shared by every main page:
   sound effects, Day/Night theme, arrow-key menu navigation and a time-of-day greeting.
   Wrapped in an IIFE so its names never clash with js/site.js (Assignment 4). */
(function () {
  "use strict";

  /* ---------- Saved preferences (localStorage may be blocked, so always try/catch) ---------- */
  const prefs = {
    key: "foryou-prefs",
    read() {
      try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch (error) { return {}; }
    },
    save(patch) {
      try { localStorage.setItem(this.key, JSON.stringify(Object.assign(this.read(), patch))); } catch (error) { /* ignore */ }
    }
  };

  /* ---------- Sound: one shared AudioContext, one tone at a time (tones never overlap) ---------- */
  const sound = {
    enabled: prefs.read().sound !== false,
    ctx: null,
    current: null,
    play(frequency, duration = 0.12) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!this.enabled || !AudioCtx) return;
      this.ctx = this.ctx || new AudioCtx();
      if (this.current) {
        try { this.current.stop(); } catch (error) { /* already stopped */ }
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
      this.current = osc;
      osc.onended = () => { if (this.current === osc) this.current = null; };
    }
  };
  window.ForYou = { sound, prefs };          // shared with js/collection.js

  /* ---------- Sound on/off button ---------- */
  const soundButton = document.getElementById("sound-toggle");
  function showSoundState() {
    soundButton.setAttribute("aria-pressed", String(sound.enabled));
    const label = sound.enabled ? "Sound on" : "Sound off";
    if (!soundButton.querySelector("svg")) soundButton.textContent = label;
    soundButton.setAttribute("aria-label", label);
    soundButton.title = label;
  }
  if (soundButton) {
    showSoundState();
    soundButton.addEventListener("click", () => {
      sound.enabled = !sound.enabled;
      prefs.save({ sound: sound.enabled });
      showSoundState();
      sound.play(600);
    });
  }

  /* ---------- Day / Night theme: Bootstrap colour mode + our own CSS variables ---------- */
  const themeButton = document.getElementById("theme-toggle");
  const paletteButton = document.getElementById("change-colour");   // Assignment 4 palette (home only)
  function setTheme(night) {
    document.documentElement.setAttribute("data-bs-theme", night ? "dark" : "light");
    themeButton.setAttribute("aria-pressed", String(night));
    const label = night ? "Day mode" : "Night mode";
    if (!themeButton.querySelector("svg")) themeButton.textContent = label;
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    if (paletteButton) {
      paletteButton.disabled = false;
      paletteButton.title = "Change background";
    }
    window.dispatchEvent(new Event("foryou:theme"));
  }
  if (themeButton) {
    setTheme(prefs.read().theme === "night");
    themeButton.addEventListener("click", () => {
      const night = document.documentElement.getAttribute("data-bs-theme") !== "dark";
      setTheme(night);
      prefs.save({ theme: night ? "night" : "day" });
      sound.play(night ? 330 : 494, 0.15);
    });
  }

  /* ---------- Popup button click sound (event delegation) ---------- */
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-open-popup]")) sound.play(520);
  });

  /* ---------- Keyboard: arrows move through visible navigation controls ---------- */
  const menu = document.querySelector(".navbar");
  if (menu) {
    document.addEventListener("keydown", (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      // Leave text editing, dialogs and other page widgets their own keys.
      const active = document.activeElement;
      if (active.matches("input, textarea, select") || active.isContentEditable) return;
      const onPage = active === document.body || active === document.documentElement;
      if (!onPage && !menu.contains(active)) return;
      if (document.querySelector("dialog[open]")) return;
      const links = Array.from(menu.querySelectorAll(".nav-link, .nav-tools button"))
        .filter((link) => !link.disabled && link.getClientRects().length > 0);
      if (!links.length) return;
      const position = links.indexOf(document.activeElement);
      let target = null;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown": target = links[position === -1 ? 0 : (position + 1) % links.length]; break;
        case "ArrowLeft":
        case "ArrowUp":   target = links[position === -1 ? links.length - 1 : (position - 1 + links.length) % links.length]; break;
        case "Home":      if (!onPage) target = links[0]; break;
        case "End":       if (!onPage) target = links[links.length - 1]; break;
      }
      if (target) { event.preventDefault(); target.focus(); }
    });
  }

  /* ---------- Home page: greeting chosen with a switch statement ---------- */
  function getGreeting(hour) {
    switch (true) {
      case hour < 12: return "Good morning";
      case hour < 18: return "Good afternoon";
      default:        return "Good evening";
    }
  }
  const greeting = document.getElementById("greeting");
  function updateGreeting() {
    const message = getGreeting(new Date().getHours()) + " - welcome to FORYOU";
    if (greeting) greeting.textContent = message + ".";
    const search = document.getElementById("home-search");
    if (search) {
      const style = window.getComputedStyle(search);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const choices = [message, getGreeting(new Date().getHours()) + " - FORYOU", getGreeting(new Date().getHours()), "Search"];
      const available = search.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 20;
      if (context) context.font = style.font;
      search.placeholder = context ? (choices.find(function (text) { return context.measureText(text).width <= available; }) || "Search") : "Search";
      search.title = message + ". Search the collection.";
    }
  }
  updateGreeting();
  window.addEventListener("resize", updateGreeting);
  if (greeting || document.getElementById("home-search")) window.setInterval(updateGreeting, 60000);
})();
