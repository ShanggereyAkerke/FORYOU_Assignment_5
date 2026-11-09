/* FORYOU homepage: reusable previews from the same product data as Collection. */
$(document).ready(function () {
  "use strict";
  const products = window.ForYouProducts;
  if (!products || !document.getElementById("home-products")) return;
  const groups = [
    { key: "tops", title: "Tops", image: "essential-tee.png" },
    { key: "knitwear", title: "Knitwear", image: "soft-cardigan.png" },
    { key: "bottoms", title: "Bottoms", image: "wide-leg-jeans.png" },
    { key: "outerwear", title: "Outerwear", image: "city-coat.png" }
  ];
  const price = new Intl.NumberFormat("en-US");
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function image(source, alt) {
    const node = element("img");
    node.src = "images/" + source;
    node.alt = alt;
    node.width = 1254;
    node.height = 1254;
    node.loading = "lazy";
    node.decoding = "async";
    return node;
  }
  function productLink(product) { return "collection.html?view=style2&q=" + encodeURIComponent(product.name); }
  function productCard(product) {
    const article = element("article", "fy-product fy-enter");
    const link = element("a", "fy-product-link");
    link.href = productLink(product);
    const media = element("div", "fy-product-photo");
    media.append(image(product.image, product.alt));
    const heading = element("h3", "", product.name);
    link.append(media, heading);
    article.append(link, element("p", "fy-product-color", product.color), element("p", "fy-product-price", price.format(product.price) + " KZT"));
    return article;
  }
  const categories = document.getElementById("home-categories");
  categories.replaceChildren();
  groups.forEach(function (group) {
    const count = products.filter(function (item) { return item.category === group.key; }).length;
    const link = element("a", "fy-category-link fy-enter");
    link.href = "collection.html?view=style2&q=" + group.key;
    link.append(image(group.image, ""));
    const text = element("div");
    text.append(element("h3", "", group.title), element("p", "", count + " pieces"));
    link.append(text);
    categories.append(link);
  });
  function render(category) {
    const matching = category === "all" ? products : products.filter(function (item) { return item.category === category; });
    const selection = category === "all" ? [products[4], products[7], products[10], products[13]] : matching.slice(0, 4);
    const grid = document.getElementById("home-products");
    grid.replaceChildren(...selection.map(productCard));
    $("#home-filters button").each(function () { $(this).attr("aria-pressed", String(this.dataset.category === category)); });
    $("#home-results").text(selection.length + " of " + matching.length + " pieces");
    $("#home-see-all").attr("href", category === "all" ? "collection.html?view=style2" : "collection.html?view=style2&q=" + category);
    const label = document.createTextNode("Browse all " + matching.length + " pieces ");
    const seeAll = document.getElementById("home-see-all");
    seeAll.firstChild.replaceWith(label);
  }
  $("#home-filters").on("click", "button[data-category]", function () { render(this.dataset.category); });
  render("all");

  // A small entrance on arriving sections; content stays readable without JS.
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("fy-arrive"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".fy-enter").forEach(function (node) { observer.observe(node); });
  }
});
