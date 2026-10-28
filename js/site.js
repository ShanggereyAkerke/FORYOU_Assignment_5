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
    if (input.id === "understood" && !input.checked)
      message = "Please confirm that this is a demonstration.";
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
    joinForm.reset();
    status.textContent = "All checks passed. Demo complete — no account was created or details saved.";
    status.classList.add("success");
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
    status.textContent = "Email validated. Demo complete — no subscription was created.";
    status.classList.add("success");
    form.reset();
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

// Task 4: cycle through three light colours from the collection's palette.
const colourButton = document.getElementById("change-colour");
if (colourButton) {
  const palette = [
    { name: "Chalk", value: "#fbf6ee" },
    { name: "Moss", value: "#e6ebdf" },
    { name: "Rose", value: "#f0e2e5" }
  ];
  let selected = 0;
  colourButton.addEventListener("click", () => {
    selected = (selected + 1) % palette.length;
    document.body.style.backgroundColor = palette[selected].value;
    document.getElementById("colour-name").textContent = palette[selected].name;
  });
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
