/* Shared, browser-local bag. Only known product IDs and integer quantities are accepted. */
(function () {
  "use strict";
  const key = "foryou-bag-v1";
  let memory = {};
  let storageAvailable = true;
  function read() {
    let raw = memory;
    try { if (storageAvailable) raw = JSON.parse(localStorage.getItem(key) || "{}"); } catch (_) { storageAvailable = false; }
    const clean = {};
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      Object.keys(raw).forEach(function (id) {
        const index = Number(id), quantity = Number(raw[id]);
        if (Number.isInteger(index) && index >= 0 && index < (window.ForYouProducts || []).length && Number.isInteger(quantity) && quantity > 0) clean[index] = Math.min(quantity, 99);
      });
    }
    return clean;
  }
  function write(items) {
    memory = items;
    try { if (storageAvailable) localStorage.setItem(key, JSON.stringify(items)); } catch (_) { storageAvailable = false; }
    window.dispatchEvent(new Event("foryou:cart"));
  }
  window.ForYouCart = {
    items: read,
    set: function (id, quantity) {
      if (!Number.isInteger(id) || id < 0 || id >= (window.ForYouProducts || []).length || !Number.isInteger(quantity) || quantity < 0 || quantity > 99) return;
      const items = read();
      if (quantity === 0) delete items[id]; else items[id] = quantity;
      write(items);
    },
    add: function (id) { this.set(id, Math.min((read()[id] || 0) + 1, 99)); },
    count: function () { return Object.values(read()).reduce(function (sum, quantity) { return sum + quantity; }, 0); },
    total: function () { const items = read(); return Object.keys(items).reduce(function (sum, id) { return sum + window.ForYouProducts[id].price * items[id]; }, 0); }
  };
  window.addEventListener("storage", function (event) { if (event.key === key || event.key === null) window.dispatchEvent(new Event("foryou:cart")); });
})();
