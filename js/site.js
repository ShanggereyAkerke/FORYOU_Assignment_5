/* Assignment 4. Suggested defense split: Akerke — validation and FAQs;
   Shyngys — popup, palette and clock. Both review all components.
   Local demonstrations only: no data is sent or stored. */
"use strict";

// Task 1: show accessible errors beside every invalid field.
function showError(input, message) {
  document.getElementById(input.id + "-error").textContent = message;
  input.setAttribute("aria-invalid", String(Boolean(message)));
  input.classList.toggle("is-invalid", Boolean(message));
  return !message;
}
function emailError(input) {
  if (!input.value.trim()) return "Enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()) || input.validity.typeMismatch) {
    return "Enter a valid email, such as alex@example.com.";
  }
  return "";
}
const joinForm = document.getElementById("join-form");
if (joinForm) {
  const fields = [...joinForm.querySelectorAll("input")];
  const status = document.getElementById("join-status");
  const password = document.getElementById("password");
  let submitted = false;
  function validate(input) {
    let message = "";
    if (input.id === "name") {
  const name = input.value.trim();

  if (!name) {
    message = "Enter your name.";
  } else if (name.length > 100) {
    message = "Use no more than 100 characters.";
  } else if (!/^\p{L}[\p{L}\p{M}]*(?:[ '’-][\p{L}\p{M}]+)*$/u.test(name)) {
    message = "Use letters, spaces, hyphens or apostrophes only.";
  }
}

    if (input.id === "email") message = emailError(input);

    if (input.id === "password") {
      if (/\s/u.test(input.value)) {
    message = "Password must not contain spaces.";
  } else if (input.value.length < 8 || input.value.length > 128) {
    message = "Use a password with 8–128 characters.";
  }
}

    if (input.id === "confirm-password") {
    if (!input.value) {
    message = "Confirm your password.";
  } else if (/\s/u.test(input.value)) {
    message = "Password must not contain spaces.";
  } else if (input.value.length < 8 || input.value.length > 128) {
    message = "Use a password with 8–128 characters.";
  } else if (input.value !== password.value) {
    message = "Your passwords do not match.";
  }
}
    return showError(input, message);
  }
  joinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submitted = true;
    const results = fields.map(validate);
    if (results.includes(false)) {
      status.textContent = "Please check the highlighted fields.";
      status.classList.remove("success");
      fields.find((input) => input.getAttribute("aria-invalid") === "true").focus();
      return;
    }
    const complete = () => {
      joinForm.reset();
      status.textContent = "Your details have been checked.";
      status.classList.add("success");
    };
    if (window.ForYouUX) window.ForYouUX.submit(joinForm, complete);
    else complete();
  });
  fields.forEach((input) => input.addEventListener("input", () => {
    status.textContent = "";
    if (submitted) {
      validate(input);
      if (input === password) validate(document.getElementById("confirm-password"));
    }
  }));
  joinForm.addEventListener("reset", () => {
    submitted = false;
    fields.forEach((input) => showError(input, ""));
    status.textContent = "";
    status.classList.remove("success");
  });
}

// Task 2: CSS animates the row while JS controls open/closed state.
document.querySelectorAll(".faq-toggle").forEach((button) => {
  const answer = document.getElementById(button.getAttribute("aria-controls"));
  answer.classList.add("is-collapsed");
  answer.inert = true;
  answer.setAttribute("aria-hidden", "true");
  button.addEventListener("click", () => {
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    button.querySelector("span").textContent = open ? "−" : "+";
    answer.classList.toggle("is-collapsed", !open);
    answer.inert = !open;
    answer.setAttribute("aria-hidden", String(!open));
  });
});

// Task 3: dialog supplies keyboard focus containment and Escape support.
const dialog = document.getElementById("subscribe-dialog");
if (dialog) {
  let opener;
  document.querySelectorAll("[data-open-popup]").forEach((button) => {
    button.addEventListener("click", () => {
      opener = button;
      dialog.showModal();
      document.body.classList.add("popup-open");
      document.getElementById("subscriber-email").focus();
    });
  });
  dialog.querySelector("[data-close-popup]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog &&
        (event.clientX < bounds.left || event.clientX > bounds.right ||
         event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  const form = document.getElementById("subscribe-form");
  const email = document.getElementById("subscriber-email");
  const status = document.getElementById("subscribe-status");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    if (!showError(email, emailError(email))) { email.focus(); return; }
    const complete = () => {
      form.reset();
      status.textContent = "Your email format is valid.";
      status.classList.add("success");
    };
    if (window.ForYouUX) window.ForYouUX.submit(form, complete);
    else complete();
  });
  email.addEventListener("input", () => {
    status.textContent = "";
    if (email.getAttribute("aria-invalid") === "true") showError(email, emailError(email));
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("popup-open");
    form.reset();
    showError(email, "");
    status.textContent = "";
    opener?.focus();
  });
}

// Task 4: independent background palettes for light and dark themes.
const colourButton = document.getElementById("change-colour");
if (colourButton) {
  const palettes = {
    light: [{ name: "White", value: "#ffffff" }, { name: "Mist", value: "#f3f3f3" }, { name: "Silver", value: "#e7e7e7" }],
    dark: [{ name: "Charcoal", value: "#171717" }, { name: "Graphite", value: "#242424" }, { name: "Midnight", value: "#101820" }]
  };
  const selected = { light: 0, dark: 0 };
  try {
    const saved = JSON.parse(localStorage.getItem("foryou-backgrounds") || "{}");
    ["light", "dark"].forEach(function (mode) { if (Number.isInteger(saved[mode]) && saved[mode] >= 0 && saved[mode] < 3) selected[mode] = saved[mode]; });
  } catch (_) { /* Defaults work when storage is unavailable. */ }
  function applyBackground() {
    const mode = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
    const color = palettes[mode][selected[mode]];
    document.body.style.setProperty(mode === "dark" ? "--fy-selected-dark" : "--fy-selected-paper", color.value);
    document.getElementById("colour-name").textContent = color.name;
    colourButton.title = "Change background (" + color.name + ")";
  }
  colourButton.addEventListener("click", function () {
    const mode = document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
    selected[mode] = (selected[mode] + 1) % palettes[mode].length;
    try { localStorage.setItem("foryou-backgrounds", JSON.stringify(selected)); } catch (_) { /* Selection remains usable. */ }
    applyBackground();
  });
  window.addEventListener("foryou:theme", applyBackground);
  applyBackground();
}

// Task 5: use the visitor's local Date, and update once every second.
const clocks = document.querySelectorAll("[data-clock]");
if (clocks.length) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true
  });
  function updateClock() {
    const now = new Date();
    clocks.forEach((clock) => {
      clock.textContent = formatter.format(now);
      clock.dateTime = now.toISOString();
    });
  }
  updateClock();
  setInterval(updateClock, 1000);
}
