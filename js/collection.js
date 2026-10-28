/* Assignment 5 - Collection page: product data, price filter, star ratings, bag and size finder.
   Needs js/common.js first (it provides window.ForYou.sound). */
(function () {
  "use strict";
  const sound = window.ForYou ? window.ForYou.sound : { play() {} };

  /* ================= 1. DATA: an array of objects with methods ================= */
  const products = [
    { name: "Everyday shirt",    price: 18900, image: "shirt.png",    alt: "Everyday shirt in chalk",
      text: "An easy cotton layer for a relaxed everyday wardrobe." },
    { name: "Easy knit",         price: 24900, image: "knit.png",     alt: "Easy knit in moss",
      text: "Soft texture and a muted green that pairs with your favourites." },
    { name: "Weekend jacket",    price: 32900, image: "jacket.png",   alt: "Weekend jacket in sand",
      text: "A lightweight finishing layer for slow weekends and busy days." },
    { name: "Straight trousers", price: 22900, image: "trousers.png", alt: "Straight trousers in charcoal",
      text: "A relaxed straight-leg shape with a simple, versatile finish." }
  ].map((item, index) => Object.assign(item, {
    id: index,
    rating: 0,
    priceLabel() { return this.price.toLocaleString("en-US") + " KZT"; },   // object method
    setRating(value) { this.rating = value; }                               // object method
  }));

  const row = document.getElementById("product-row");
  const filterBar = document.getElementById("price-filters");
  const filterNote = document.getElementById("filter-note");
  const bagStatus = document.getElementById("bag-status");
  if (!row || !filterBar) return;

  let bag = [];                      // ids of products added to the bag
  filterBar.hidden = false;          // controls appear only when JavaScript works
  bagStatus.hidden = false;

  /* ================= 2. SWITCH STATEMENTS ================= */
  function matchesRange(product, range) {
    switch (range) {
      case "under20": return product.price < 20000;
      case "mid":     return product.price >= 20000 && product.price <= 30000;
      case "over30":  return product.price > 30000;
      default:        return true;                    // "all"
    }
  }
  function describeRange(range, count) {
    const pieces = count + (count === 1 ? " piece" : " pieces");
    switch (range) {
      case "under20": return "Showing " + pieces + " under 20,000 KZT.";
      case "mid":     return "Showing " + pieces + " from 20,000 to 30,000 KZT.";
      case "over30":  return "Showing " + pieces + " over 30,000 KZT.";
      default:        return "Showing all " + pieces + ".";
    }
  }

  /* ================= 3. RENDERING with loops and higher-order functions ================= */
  function starsHTML(product) {
    let html = "";
    for (let value = 1; value <= 5; value++) {         // loop builds five star buttons
      html += '<button type="button" class="star" data-value="' + value +
              '" aria-label="Rate ' + product.name + " " + value + ' out of 5">&#9733;</button>';
    }
    return html;
  }

  function cardHTML(product) {
    return '<div class="col-12 col-sm-6 col-lg-3"><article class="card h-100 product-card border-0 rounded-0" data-id="' + product.id + '">' +
      '<img class="card-img-top rounded-0 product-image" src="images/' + product.image + '" alt="' + product.alt + '" width="1254" height="1254" loading="lazy">' +
      '<div class="card-body d-flex flex-column px-0 pt-3 pb-0">' +
      '<h3 class="card-title h4">' + product.name + '</h3>' +
      '<p class="card-text text-secondary">' + product.text + '</p>' +
      '<p class="fw-semibold mb-2">' + product.priceLabel() + '</p>' +
      '<div class="rating" role="group" aria-label="Rating for ' + product.name + '">' + starsHTML(product) + '</div>' +
      '<p class="rating-text small text-secondary" aria-live="polite"></p>' +
      '<div class="d-flex flex-wrap gap-2 mt-auto">' +
      '<button type="button" class="btn btn-primary btn-sm" data-add>Add to bag</button>' +
      '<a class="btn gap-1 btn-outline-primary btn-sm" href="collection.html#size-finder">Find your size <span aria-hidden="true">↗</span></a>' +
      '</div></div></article></div>';
  }

  function paintStars(card, rating) {
    card.querySelectorAll(".star").forEach((star) => {              // querySelectorAll + forEach
      star.classList.toggle("on", Number(star.dataset.value) <= rating);
    });
    card.querySelector(".rating-text").textContent =
      rating ? "You rated this " + rating + " out of 5." : "Not rated yet.";
  }

  function renderProducts(range) {
    const visible = products.filter((product) => matchesRange(product, range));   // filter
    row.innerHTML = visible.map(cardHTML).join("");                               // map
    row.querySelectorAll(".product-card").forEach((card, index) => {
      card.style.animationDelay = index * 80 + "ms";                // staggered entrance (CSS animation "enter")
      paintStars(card, products[Number(card.dataset.id)].rating);   // ratings survive re-rendering
    });
    filterNote.textContent = describeRange(range, visible.length);
  }

  function applyFilter(range) {
    filterBar.querySelectorAll("button").forEach((button) => {
      const active = button.dataset.range === range;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderProducts(range);
  }

  filterBar.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-range]");
    if (!button) return;
    applyFilter(button.dataset.range);
    sound.play(440);
  });

  // Keyboard shortcuts 1-4 choose a filter (ignored while typing in a field).
  document.addEventListener("keydown", (event) => {
    if (event.target.matches("input, select, textarea") || event.ctrlKey || event.metaKey || event.altKey) return;
    switch (event.key) {
      case "1": applyFilter("all"); break;
      case "2": applyFilter("under20"); break;
      case "3": applyFilter("mid"); break;
      case "4": applyFilter("over30"); break;
    }
  });

  /* ================= 4. Stars and bag (event delegation) ================= */
  function updateBag() {
    const total = bag.reduce((sum, id) => sum + products[id].price, 0);           // reduce
    bagStatus.textContent = bag.length
      ? "Bag: " + bag.length + (bag.length === 1 ? " item" : " items") + " · " + total.toLocaleString("en-US") + " KZT"
      : "Bag: empty";
    bagStatus.classList.remove("pop");
    void bagStatus.offsetWidth;                  // re-read layout so the animation can restart
    bagStatus.classList.add("pop");
  }

  row.addEventListener("click", (event) => {
    const card = event.target.closest(".product-card");
    if (!card) return;
    const product = products[Number(card.dataset.id)];
    const star = event.target.closest(".star");
    if (star) {
      product.setRating(Number(star.dataset.value));
      paintStars(card, product.rating);
      sound.play(480 + product.rating * 60);
    }
    if (event.target.closest("[data-add]")) {
      bag.push(product.id);
      updateBag();
      sound.play(660, 0.18);
    }
  });

  /* ================= 5. Multi-step size finder with a callback ================= */
  const table = document.getElementById("size-table");
  const finder = document.getElementById("finder-form");
  const finderSection = document.getElementById("size-finder");
  if (!table || !finder) { applyFilter("all"); return; }
  finderSection.hidden = false;

  // Read the size guide table into an array of objects, so the table is the single source of truth.
  const sizes = Array.from(table.querySelectorAll("tbody tr")).map((tr) => {
    const cells = Array.from(tr.children).map((cell) => cell.textContent.trim());
    const toRange = (text) => text.split("–").map(Number);
    return { label: cells[0], chest: toRange(cells[1]), waist: toRange(cells[2]), hip: toRange(cells[3]) };
  });

  function sizeIndex(value, key) {
    const index = sizes.findIndex((size) => value <= size[key][1]);   // first size whose upper limit fits
    return index === -1 ? sizes.length - 1 : index;
  }

  function recommend(chest, waist, hip, fit) {
    let index = Math.max(sizeIndex(chest, "chest"), sizeIndex(waist, "waist"), sizeIndex(hip, "hip"));
    let note;
    switch (fit) {
      case "fitted":  note = "Fitted: true to your measurements."; break;
      case "relaxed": index = Math.min(index + 1, sizes.length - 1); note = "Relaxed: one size up for extra room."; break;
      default:        note = "Regular: true to size.";
    }
    return "Your size: " + sizes[index].label + ". " + note;
  }

  const steps = Array.from(finder.querySelectorAll(".finder-step"));
  const backButton = document.getElementById("finder-back");
  const nextButton = document.getElementById("finder-next");
  const restartButton = document.getElementById("finder-restart");
  const progress = document.getElementById("finder-progress");
  const errorBox = document.getElementById("finder-error");
  const inputs = ["chest", "waist", "hip"].map((name) => document.getElementById("finder-" + name));
  let current = 0;

  // showStep receives a callback that runs after the step becomes visible.
  function showStep(index, onShown) {
    current = index;
    steps.forEach((step, i) => { step.hidden = i !== index; });
    backButton.hidden = index === 0;
    nextButton.hidden = index === steps.length - 1;
    restartButton.hidden = index !== steps.length - 1;
    progress.textContent = "Step " + (index + 1) + " of " + steps.length;
    if (typeof onShown === "function") onShown(index);
  }

  function afterStep(index) {                                       // the callback
    if (index === 0) inputs[0].focus();
    if (index === 2) {
      const [chest, waist, hip] = inputs.map((input) => Number(input.value));
      const fit = finder.querySelector('input[name="fit"]:checked').value;
      document.getElementById("finder-result").textContent = recommend(chest, waist, hip, fit);
      sound.play(740, 0.2);
    }
  }

  function measurementsValid() {
    const bad = inputs.find((input) => !(Number(input.value) >= 60 && Number(input.value) <= 150));
    inputs.forEach((input) => input.removeAttribute("aria-invalid"));
    if (!bad) { errorBox.textContent = ""; return true; }
    bad.setAttribute("aria-invalid", "true");
    errorBox.textContent = "Enter each measurement as a number from 60 to 150 cm.";
    bad.focus();
    return false;
  }

  nextButton.addEventListener("click", () => {
    if (current === 0 && !measurementsValid()) return;
    showStep(current + 1, afterStep);
    sound.play(560);
  });
  backButton.addEventListener("click", () => showStep(current - 1, afterStep));   // inputs keep their values
  restartButton.addEventListener("click", () => {
    finder.reset();
    errorBox.textContent = "";
    showStep(0, afterStep);
  });
  finder.addEventListener("submit", (event) => event.preventDefault());

  /* ================= Start-up ================= */
  applyFilter("all");
  showStep(0);
})();
