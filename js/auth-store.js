/* Browser-local authentication for the assignment. Store salted password hashes, never plaintext. */
(function () {
  "use strict";
  const usersKey = "foryou-users-v1", sessionKey = "foryou-session-v1";
  function users() {
    const data = JSON.parse(localStorage.getItem(usersKey) || "[]");
    if (!Array.isArray(data)) throw new Error("Account storage is unavailable.");
    return data;
  }
  const hex = function (bytes) { return Array.from(bytes).map(function (n) { return n.toString(16).padStart(2, "0"); }).join(""); };
  async function hash(password, salt) {
    const bytes = new Uint8Array(salt.match(/.{2}/g).map(function (n) { return parseInt(n, 16); }));
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    return hex(new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: bytes, iterations: 100000, hash: "SHA-256" }, key, 256)));
  }
  window.ForYouAuth = {
    current: function () {
      try {
        const email = localStorage.getItem(sessionKey);
        const user = users().find(function (item) { return item.email === email; });
        return user ? { name: user.name, email: user.email, phone: user.phone } : null;
      } catch (_) { return null; }
    },
    register: async function (details) {
      const data = users();
      if (data.some(function (user) { return user.email === details.email; })) throw new Error("An account with this email already exists. Please log in.");
      const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
      const passwordHash = await hash(details.password, salt);
      data.push({ name: details.name, email: details.email, phone: details.phone, salt: salt, passwordHash: passwordHash });
      localStorage.setItem(usersKey, JSON.stringify(data));
    },
    login: async function (email, password) {
      const user = users().find(function (item) { return item.email === email; });
      if (!user || await hash(password, user.salt) !== user.passwordHash) throw new Error("Email or password is incorrect.");
      localStorage.setItem(sessionKey, user.email);
    },
    logout: function () { localStorage.removeItem(sessionKey); }
  };
})();
