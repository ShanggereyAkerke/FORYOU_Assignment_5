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
    soundButton.textContent = sound.enabled ? "Sound on" : "Sound off";
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
    themeButton.textContent = night ? "Day mode" : "Night mode";
    if (paletteButton) {                                              // palette colours are light-only
      paletteButton.disabled = night;
      paletteButton.title = night ? "Switch to Day mode to change the background colour" : "";
    }
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

  /* ---------- Keyboard: arrow keys move focus between menu links ---------- */
  const menu = document.querySelector(".navbar-nav");
  if (menu) {
    const links = Array.from(menu.querySelectorAll(".nav-link"));
    menu.addEventListener("keydown", (event) => {
      const position = links.indexOf(document.activeElement);
      if (position === -1) return;
      let target = null;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown": target = links[(position + 1) % links.length]; break;
        case "ArrowLeft":
        case "ArrowUp":   target = links[(position - 1 + links.length) % links.length]; break;
        case "Home":      target = links[0]; break;
        case "End":       target = links[links.length - 1]; break;
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
  if (greeting) greeting.textContent = getGreeting(new Date().getHours()) + " - welcome to FORYOU.";
})();
