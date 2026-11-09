$(document).ready(function () {
  "use strict";
  const cart = window.ForYouCart;
  const money = function (value) { return value.toLocaleString("en-US") + " KZT"; };
  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }
  function render() {
    const entries = Object.entries(cart.items());
    const list = document.getElementById("bag-items");
    list.replaceChildren();
    entries.forEach(function (entry) {
      const id = Number(entry[0]), quantity = entry[1], product = window.ForYouProducts[id];
      const row = node("article", "fy-bag-item");
      const image = node("img"); image.src = "images/" + product.image; image.alt = product.alt; image.width = 150; image.height = 180;
      const info = node("div", "fy-bag-item-info");
      const title = node("h2"); const link = node("a", "", product.name); link.href = "collection.html?view=style2&q=" + encodeURIComponent(product.name); title.append(link);
      info.append(title, node("p", "fy-bag-color", product.color));
      const controls = node("div", "fy-bag-quantity");
      const stepper = node("div", "fy-quantity-stepper");
      stepper.setAttribute("role", "group"); stepper.setAttribute("aria-label", "Quantity for " + product.name);
      const plus = node("button", "", "+"); plus.type = "button"; plus.dataset.quantityId = id; plus.dataset.delta = "1";
      plus.id = "increase-" + id; plus.setAttribute("aria-label", "Increase quantity of " + product.name); plus.disabled = quantity >= 99;
      const amount = node("output", "", String(quantity)); amount.setAttribute("aria-label", "Quantity");
      const minus = node("button", "", "\u2212"); minus.type = "button"; minus.dataset.quantityId = id; minus.dataset.delta = "-1";
      minus.id = "decrease-" + id; minus.setAttribute("aria-label", "Decrease quantity of " + product.name); minus.disabled = quantity <= 1;
      stepper.append(plus, amount, minus);
      const remove = node("button", "fy-bag-remove", "\u00d7"); remove.type = "button"; remove.dataset.removeId = id; remove.setAttribute("aria-label", "Remove " + product.name); remove.title = "Remove " + product.name;
      controls.append(stepper, remove); info.append(controls);
      row.append(image, info, node("p", "fy-bag-line-total", money(product.price * quantity)));
      list.append(row);
    });
    document.getElementById("bag-empty").hidden = entries.length !== 0;
    document.getElementById("bag-summary").hidden = entries.length === 0;
    document.getElementById("bag-count").textContent = cart.count() + (cart.count() === 1 ? " piece" : " pieces");
    document.getElementById("bag-total").textContent = money(cart.total());
    document.getElementById("summary-count").textContent = cart.count() + (cart.count() === 1 ? " item" : " items");
    document.querySelectorAll("[data-bag-subtotal]").forEach(function (el) { el.textContent = money(cart.total()); });
  }
  $("#bag-items").on("click", "[data-quantity-id]", function () {
    const id = Number(this.dataset.quantityId), direction = Number(this.dataset.delta), focusId = this.id;
    const quantity = (cart.items()[id] || 1) + direction;
    cart.set(id, quantity); render();
    const previous = document.getElementById(focusId);
    (previous.disabled ? document.getElementById((direction > 0 ? "decrease-" : "increase-") + id) : previous).focus();
    $("#bag-feedback").text("Quantity updated to " + quantity + ".");
  });
  $("#bag-items").on("click", "[data-remove-id]", function () {
    const name = window.ForYouProducts[Number(this.dataset.removeId)].name;
    cart.set(Number(this.dataset.removeId), 0); render();
    const target = document.querySelector("#bag-items button") || document.querySelector("#bag-empty a");
    target.focus(); $("#bag-feedback").text(name + " removed from your bag.");
  });
  window.addEventListener("storage", render);
  render();
});
