/* Shared FORYOU navigation: homepage and catalog use the same markup and behavior. */
(function () {
  "use strict";
  const mount = document.querySelector("[data-site-navigation]");
  if (!mount) return;
  mount.outerHTML = '<svg class="fy-sprite" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>\n  <symbol id="fy-arrow" viewBox="0 0 24 24"><path d="M4 12h15M13 5l7 7-7 7"/></symbol>\n  <symbol id="fy-search" viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></symbol>\n  <symbol id="fy-bag" viewBox="0 0 24 24"><path d="M5 7h14l1 14H4L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></symbol>\n  <symbol id="fy-menu" viewBox="0 0 24 24"><path d="M3 7h18M3 12h18M3 17h18"/></symbol>\n</defs></svg>\n<header class="site-header">\n  <nav class="navbar fy-navigation" aria-label="Main navigation">\n    <div class="fy-container fy-header-row">\n      <a class="navbar-brand wordmark" href="index.html?view=style2" aria-label="FORYOU home">FORYOU<span class="brand-dot">.</span></a>\n      <button class="fy-menu-toggle" type="button" data-open-shop aria-controls="shop-menu" aria-haspopup="dialog" aria-expanded="false"><svg class="fy-icon" aria-hidden="true"><use href="#fy-menu"/></svg> Menu</button>\n      <div class="collapse fy-menu" id="main-navigation">\n        <ul class="navbar-nav">\n          <li><a class="nav-link active" href="index.html?view=style2" aria-current="page">Home</a></li>\n          <li><button class="nav-link fy-shop-trigger" type="button" data-open-shop aria-controls="shop-menu" aria-haspopup="dialog" aria-expanded="false">Collection</button></li>\n          <li><a class="nav-link" href="about.html?view=style2">About</a></li>\n          <li><a class="nav-link" href="contact.html?view=style2">Contact</a></li>\n        </ul>\n      </div>\n    <div class="fy-nav-preferences nav-tools" aria-label="Display and sound">\n        <button type="button" class="fy-icon-button" id="theme-toggle" aria-label="Night mode" title="Night mode" aria-pressed="false"><svg class="fy-icon fy-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 13.3A8.5 8.5 0 0 1 10.7 3.5a8.5 8.5 0 1 0 9.8 9.8Z"/></svg><svg class="fy-icon fy-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg></button>\n        <button type="button" class="fy-icon-button" id="sound-toggle" aria-label="Sound on" title="Sound on" aria-pressed="true"><svg class="fy-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4V4Z"/><path class="fy-sound-waves" d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/><path class="fy-sound-muted" d="m16 9 6 6m0-6-6 6"/></svg></button>\n        <button type="button" class="fy-icon-button" id="change-colour" aria-label="Change background" title="Change background" aria-describedby="colour-name"><svg class="fy-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="8"/><path d="M12 4v16"/><path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" stroke="none"/></svg></button>\n        <span id="colour-name" class="visually-hidden" role="status">White</span><a class="fy-icon-button fy-account-link" href="login.html?view=auth1" aria-label="Your account" title="Your account"><svg class="fy-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3H4Z"/></svg></a>\n      </div>\n      <form class="fy-header-search" action="collection.html" method="get" role="search"><input type="hidden" name="view" value="style2">\n        <label class="visually-hidden" for="home-search">Search the collection</label>\n        <input id="home-search" name="q" type="search" placeholder="Search FORYOU" maxlength="100">\n        <button type="submit" aria-label="Search collection"><svg class="fy-icon" aria-hidden="true"><use href="#fy-search"/></svg></button>\n      </form>\n      <a class="fy-bag-link" aria-label="Bag" href="bag.html?view=style2"><svg class="fy-icon" aria-hidden="true"><use href="#fy-bag"/></svg><span>Bag</span></a>\n    </div>\n  </nav>\n</header>\n<dialog id="shop-menu" class="fy-shop-dialog" aria-labelledby="shop-menu-title">\n  <div class="fy-container fy-shop-content">\n    <div class="fy-shop-top"><a class="wordmark" href="index.html?view=style2">FORYOU.</a><h2 id="shop-menu-title">Find your everyday.</h2><button class="fy-icon-button" type="button" data-close-shop aria-label="Close shopping menu"><svg class="fy-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></button></div>\n    <form class="fy-shop-search" action="collection.html" role="search"><input type="hidden" name="view" value="style2"><label class="visually-hidden" for="shop-search">Search clothing</label><input id="shop-search" name="q" type="search" placeholder="Search clothing" maxlength="100"><button class="fy-icon-button" type="submit" aria-label="Search clothing"><svg class="fy-icon" aria-hidden="true"><use href="#fy-search"/></svg></button></form>\n    <p class="visually-hidden" id="shop-menu-status" role="status"></p>\n    <nav class="fy-shop-grid" id="shop-menu-products" aria-label="Clothing shortcuts"></nav>\n    <div class="fy-shop-bottom"><a class="fy-text-link" id="shop-browse-all" href="collection.html?view=style2">Explore the collection</a><nav aria-label="More pages"><a href="profile.html?view=auth1">Profile</a><a href="index.html?view=style2">Home</a><a href="about.html?view=style2">About</a><a href="contact.html?view=style2">Contact</a></nav></div>\n  </div>\n</dialog>\n';
  const page = document.body.dataset.page || (document.body.classList.contains("fy-catalog") ? "collection" : "home");
  if (page !== "home") {
    document.querySelector('.nav-link[aria-current]').removeAttribute("aria-current");
    document.querySelector('.nav-link.active').classList.remove("active");
    const current = page === "collection" ? document.querySelector(".fy-shop-trigger") : document.querySelector('.nav-link[href^="' + page + '.html"]');
    if (current) { current.classList.add("active"); current.setAttribute("aria-current", "page"); }
  }
  if (page === "bag") document.querySelector(".fy-bag-link").setAttribute("aria-current", "page");
  $(document).ready(function () {
  const header = document.querySelector(".site-header");
  function updateHeader() { header.classList.toggle("fy-header-scrolled", page !== "home" && window.scrollY > 40); }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

    const account = document.querySelector(".fy-account-link");
    if (window.ForYouAuth.current()) { account.href = "profile.html?view=auth1"; account.setAttribute("aria-label", "Your profile"); }
    function updateBagLink() {
      const count = window.ForYouCart ? window.ForYouCart.count() : 0;
      const link = document.querySelector(".fy-bag-link");
      link.setAttribute("aria-label", "Bag, " + count + (count === 1 ? " item" : " items"));
      link.querySelector("span").textContent = count ? "Bag (" + count + ")" : "Bag";
    }
    updateBagLink();
    window.addEventListener("foryou:cart", updateBagLink);
    const products = window.ForYouProducts || [];
    function element(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }
    function image(source, alt) {
      const node = element("img"); node.src = "images/" + source; node.alt = alt;
      node.width = 140; node.height = 130; node.loading = "lazy";
      return node;
    }
    function productLink(product) { return "collection.html?view=style2&q=" + encodeURIComponent(product.name); }
    const search = document.getElementById("home-search");
    const searchForm = search.closest("form");
    searchForm.autocomplete = "off";
    search.autocomplete = "off";
    search.setAttribute("role", "combobox");
    search.setAttribute("aria-autocomplete", "list");
    search.setAttribute("aria-expanded", "false");
    search.setAttribute("aria-controls", "nav-search-options");
    const popup = element("div", "fy-search-popup"); popup.hidden = true;
    const caption = element("p", "fy-search-caption");
    const list = element("ul", "fy-search-options"); list.id = "nav-search-options"; list.setAttribute("role", "listbox"); list.setAttribute("aria-label", "Matching clothes");
    const resultStatus = element("p", "visually-hidden"); resultStatus.setAttribute("role", "status");
    popup.append(caption, list); searchForm.append(popup, resultStatus);
    let matches = [], active = -1;
    function closeSearch() {
      popup.hidden = true; active = -1; search.setAttribute("aria-expanded", "false"); search.removeAttribute("aria-activedescendant");
    }
    function suggest() {
      const query = search.value.trim().toLowerCase();
      if (!query) { closeSearch(); return; }
      matches = products.filter(function (product) { return (product.name + " " + product.color + " " + product.category).toLowerCase().includes(query); }).slice(0, 4);
      active = -1; list.replaceChildren(); search.removeAttribute("aria-activedescendant");
      caption.textContent = matches.length ? "In the collection" : "No matching pieces";
      matches.forEach(function (product, index) {
        const option = element("li", "fy-search-option"); option.id = "nav-search-option-" + index; option.dataset.index = index;
        option.setAttribute("role", "option"); option.setAttribute("aria-selected", "false");
        const text = element("div", "fy-search-product"); text.append(element("span", "fy-search-name", product.name), element("span", "fy-search-color", product.color));
        option.append(image(product.image, ""), text, element("span", "fy-search-price", product.price.toLocaleString("en-US") + " KZT"));
        list.append(option);
      });
      if (!matches.length) list.append(element("li", "fy-search-empty", "Try a garment name, color or category."));
      popup.hidden = false; search.setAttribute("aria-expanded", "true");
      resultStatus.textContent = matches.length + " search suggestions.";
    }
    search.addEventListener("input", suggest);
    search.addEventListener("focus", function () { if (search.value.trim()) suggest(); });
    search.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { closeSearch(); return; }
      if ((event.key === "ArrowDown" || event.key === "ArrowUp") && matches.length && !popup.hidden) {
        event.preventDefault();
        active = event.key === "ArrowDown" ? (active + 1) % matches.length : (active <= 0 ? matches.length - 1 : active - 1);
        list.querySelectorAll('[role="option"]').forEach(function (option, index) { option.setAttribute("aria-selected", String(index === active)); });
        search.setAttribute("aria-activedescendant", "nav-search-option-" + active);
      }
      if (event.key === "Enter" && active >= 0 && !popup.hidden) { event.preventDefault(); window.location.assign(productLink(matches[active])); }
    });
    list.addEventListener("pointerdown", function (event) { event.preventDefault(); });
    list.addEventListener("click", function (event) {
      const option = event.target.closest('[role="option"]');
      if (option) window.location.assign(productLink(matches[Number(option.dataset.index)]));
    });
    searchForm.addEventListener("focusout", function (event) { if (!searchForm.contains(event.relatedTarget)) closeSearch(); });
    document.addEventListener("pointerdown", function (event) { if (!searchForm.contains(event.target)) closeSearch(); });
  const shopMenu = document.getElementById("shop-menu");
  let shopOpener;
  function renderShop() {
    const sections = [
      { key: "", title: "All pieces", image: "shirt.png" },
      { key: "tops", title: "Tops", image: "essential-tee.png" },
      { key: "knitwear", title: "Knitwear", image: "soft-cardigan.png" },
      { key: "bottoms", title: "Bottoms", image: "wide-leg-jeans.png" },
      { key: "outerwear", title: "Outerwear", image: "city-coat.png" }
    ];
    const links = sections.map(function (section) {
      const link = element("a", "fy-shop-item");
      link.href = "collection.html?view=sections1" + (section.key ? "&q=" + section.key : "");
      link.append(image(section.image, ""), element("span", "", section.title));
      return link;
    });
    document.getElementById("shop-menu-products").replaceChildren(...links);
    document.getElementById("shop-menu-products").setAttribute("aria-label", "Shop by clothing category");
  }
  $("[data-open-shop]").on("click", function () {
    shopOpener = this;
    renderShop();
    shopMenu.showModal();
    shopMenu.scrollTop = 0;
    document.body.classList.add("fy-shop-open");
    $("[data-open-shop]").attr("aria-expanded", "true");
    document.getElementById("shop-search").focus();
  });
  $("[data-close-shop]").on("click", function () { shopMenu.close(); });
  shopMenu.addEventListener("click", function (event) { if (event.target === shopMenu) shopMenu.close(); });
  shopMenu.addEventListener("close", function () {
    document.body.classList.remove("fy-shop-open");
    $("[data-open-shop]").attr("aria-expanded", "false");
    if (shopOpener) shopOpener.focus();
  });
  });
})();
