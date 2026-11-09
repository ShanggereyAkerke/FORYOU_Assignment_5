/* Category pills combine with the existing price filters and live keyword search. */
$(document).ready(function () {
  const categories = [
    { key: "", title: "All pieces", image: "shirt.png" },
    { key: "tops", title: "Tops", image: "essential-tee.png" },
    { key: "knitwear", title: "Knitwear", image: "soft-cardigan.png" },
    { key: "bottoms", title: "Bottoms", image: "wide-leg-jeans.png" },
    { key: "outerwear", title: "Outerwear", image: "city-coat.png" }
  ];
  categories.forEach(function (category) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.catalogCategory = category.key;
    const label = document.createElement("span");
    label.textContent = category.title;
    button.append(label);
    document.getElementById("catalog-categories").append(button);
  });
  let selected = "";
  function applyCategory(key) {
    selected = key;
    $("[data-catalog-category]").each(function () { $(this).attr("aria-pressed", String(this.dataset.catalogCategory === selected)); });
    $(document).trigger("foryou:category", [selected]);
  }
  $("#catalog-categories").on("click", "button", function () { applyCategory(this.dataset.catalogCategory); });
  const query = String($("#product-search").val() || "").trim().toLowerCase();
  if (categories.some(function (category) { return category.key && category.key === query; })) {
    $("#product-search").val("").trigger("input"); applyCategory(query);
  } else applyCategory("");
});
