/* Public API: CountriesNow country names and ISO codes; only the chosen code is stored. */
$(document).ready(function () {
  "use strict";
  const user = window.ForYouAuth.current();
  if (!user) { window.location.replace("login.html?view=auth1"); return; }
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-phone").textContent = user.phone;
  document.getElementById("logout").addEventListener("click", function () { window.ForYouAuth.logout(); window.location.replace("login.html?view=auth1"); });
  window.addEventListener("pageshow", function () { if (!window.ForYouAuth.current()) window.location.replace("login.html?view=auth1"); });
  window.addEventListener("storage", function () { if (!window.ForYouAuth.current()) window.location.replace("login.html?view=auth1"); });
  const select = document.getElementById("profile-country");
  const form = document.getElementById("country-form");
  const loader = document.getElementById("country-loader");
  const retry = document.getElementById("country-retry");
  const save = document.getElementById("save-country");
  const error = document.getElementById("country-error");
  const status = document.getElementById("country-status");
  const key = "foryou-profile-country:" + user.email;
  let countries = [];
  async function loadCountries() {
    loader.hidden = false; retry.hidden = true; select.disabled = true; save.disabled = true;
    error.textContent = ""; status.textContent = ""; form.setAttribute("aria-busy", "true");
    const controller = new AbortController();
    const timeout = window.setTimeout(function () { controller.abort(); }, 12000);
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/iso", { signal: controller.signal });
      if (!response.ok) throw new Error("Country request failed.");
      const data = await response.json();
      if (data.error || !Array.isArray(data.data)) throw new Error("Invalid country list.");
      countries = data.data.filter(function (country) { return /^[A-Z]{2}$/.test(country.Iso2) && typeof country.name === "string"; })
        .map(function (country) { return { name: country.name, code: country.Iso2 }; })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (!countries.length) throw new Error("Empty country list.");
      select.replaceChildren(new Option("Choose your country", ""));
      countries.forEach(function (country) { select.append(new Option(country.name, country.code)); });
      try {
        const saved = localStorage.getItem(key);
        if (countries.some(function (country) { return country.code === saved; })) select.value = saved;
      } catch (_) { /* The live list remains usable without storage. */ }
      select.disabled = false; save.disabled = false;
    } catch (failure) {
      console.warn("Country list request:", failure.message);
      countries = [];
      error.textContent = "We couldn't load the countries. Check your connection and try again.";
      retry.hidden = false;
    } finally {
      window.clearTimeout(timeout); loader.hidden = true; form.setAttribute("aria-busy", "false");
    }
  }
  retry.addEventListener("click", loadCountries);
  select.addEventListener("change", function () { error.textContent = ""; status.textContent = ""; select.removeAttribute("aria-invalid"); });
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const chosen = countries.find(function (country) { return country.code === select.value; });
    if (!chosen) { error.textContent = "Choose your country first."; select.setAttribute("aria-invalid", "true"); select.focus(); return; }
    try { localStorage.setItem(key, chosen.code); status.textContent = "Country saved: " + chosen.name + "."; }
    catch (_) { error.textContent = "Your browser couldn't save the country. Allow local storage and try again."; }
  });
  loadCountries();
});
