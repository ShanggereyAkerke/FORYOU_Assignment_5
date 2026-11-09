$(document).ready(function () {
  "use strict";
  if (window.ForYouAuth.current()) { window.location.replace("profile.html?view=auth1"); return; }
  function show(mode) {
    $("[data-auth-mode]").each(function () { $(this).attr("aria-pressed", String(this.dataset.authMode === mode)); });
    document.getElementById("login-form").hidden = mode !== "login";
    document.getElementById("register-form").hidden = mode !== "register";
  }
  $("[data-auth-mode]").on("click", function () { show(this.dataset.authMode); });
  function error(input, text) {
    document.getElementById(input.id + "-error").textContent = text;
    input.setAttribute("aria-invalid", String(Boolean(text)));
    return !text;
  }
  function validate(input) {
    const value = input.value.trim();
    let message = "";
    if (!value) message = "Enter your " + input.dataset.field + ".";
    else if (input.name === "name" && (!/^[\p{L}][\p{L}\p{M} '’-]*$/u.test(value) || value.length > 100)) message = "Use a name of up to 100 characters, using letters, spaces, apostrophes or hyphens.";
    else if (input.name === "email" && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 254)) message = "Enter a valid email address.";
    else if (input.name === "phone" && !/^\+?[0-9]{7,15}$/.test(value.replace(/[ ()-]/g, ""))) message = "Use 7-15 digits, with an optional + country code.";
    else if (input.id === "register-password" && (input.value.length < 8 || input.value.length > 128 || !/[a-z]/.test(input.value) || !/[A-Z]/.test(input.value) || !/[0-9]/.test(input.value) || !/[^A-Za-z0-9\s]/.test(input.value) || /\s/.test(input.value))) message = "Use 8-128 characters with uppercase, lowercase, a number and a symbol; no spaces.";
    else if (input.name === "confirm" && input.value !== document.getElementById("register-password").value) message = "Your passwords do not match.";
    return error(input, message);
  }
  ["login", "register"].forEach(function (mode) {
    const form = document.getElementById(mode + "-form");
    let submitted = false;
    form.addEventListener("input", function (event) {
      document.getElementById(mode + "-status").textContent = "";
      if (submitted) validate(event.target);
    });
    form.addEventListener("submit", async function (event) {
      event.preventDefault(); submitted = true;
      const inputs = Array.from(form.querySelectorAll("input"));
      const valid = inputs.map(validate).every(Boolean);
      const status = document.getElementById(mode + "-status");
      if (!valid) { status.textContent = "Please check the highlighted fields."; inputs.find(function (input) { return input.getAttribute("aria-invalid") === "true"; }).focus(); return; }
      const button = form.querySelector('[type="submit"]');
      if (button.disabled) return;
      button.disabled = true; form.setAttribute("aria-busy", "true"); status.textContent = mode === "login" ? "Logging in..." : "Creating your account...";
      const email = form.elements.email.value.trim().toLowerCase();
      try {
        if (mode === "register") {
          await window.ForYouAuth.register({ name: form.elements.name.value.trim(), email: email, phone: form.elements.phone.value.trim(), password: form.elements.password.value });
          form.reset(); show("login"); document.getElementById("login-email").value = email;
          document.getElementById("login-status").textContent = "Account created. Log in to continue.";
          document.getElementById("login-password").focus(); status.textContent = "";
        } else {
          await window.ForYouAuth.login(email, form.elements.password.value);
          form.reset(); window.location.assign("profile.html?view=auth1");
        }
      } catch (failure) {
        status.textContent = failure.message.includes("email") || failure.message.includes("incorrect") ? failure.message : "We couldn't access account storage. Allow local storage and try again.";
      } finally { button.disabled = false; form.setAttribute("aria-busy", "false"); }
    });
  });
  show(new URLSearchParams(window.location.search).get("mode") === "register" ? "register" : "login");
});
