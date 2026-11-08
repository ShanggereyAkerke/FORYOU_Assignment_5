/* Assignment 6: jQuery search, engagement and useful browser interactions. */
$(document).ready(function () {
  "use strict";
  console.log("jQuery is ready!"); // Task 0
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Task 7: one live region; replacing a message cancels its previous animation.
  const $toast = $('<div class="foryou-toast" role="status" aria-live="polite" hidden></div>').appendTo("body");
  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    $toast.stop(true, true).text(message).prop("hidden", false).show();
    toastTimer = setTimeout(function () {
      $toast.fadeOut(reduceMotion ? 0 : 350, function () { $toast.prop("hidden", true); });
    }, 3200);
  }

  // Task 6: run only after the existing form validation succeeds.
  const pending = new Map();
  function submit(form, complete) {
    if (pending.has(form)) return;
    const $button = $(form).find('[type="submit"]');
    const original = $button.html();
    $button.prop("disabled", true).html('<span class="submit-spinner" aria-hidden="true"></span> Please wait…');
    $(form).attr("aria-busy", "true");
    const restore = function () {
      $button.prop("disabled", false).html(original);
      $(form).removeAttr("aria-busy");
      pending.delete(form);
    };
    const timer = setTimeout(function () {
      restore();
      complete();
      notify("Form checks complete. No details were sent or saved.");
    }, 1400);
    pending.set(form, { timer, restore });
  }
  $("#join-form, #subscribe-form").on("reset.assignment6", function () {
    const job = pending.get(this);
    if (job) { clearTimeout(job.timer); job.restore(); }
  });
  // Closing the subscription dialog also cancels an unfinished simulation.
  $("#subscribe-dialog").on("close.assignment6", function () {
    const form = document.getElementById("subscribe-form");
    const job = pending.get(form);
    if (job) { clearTimeout(job.timer); job.restore(); }
  });
  window.ForYouUX = { notify, submit };
  $(document).on("foryou:bag", function (event, name) { notify(name + " added to your bag."); });

  // Task 4: scrollable distance, not the entire document height; clamp both ends.
  const $progress = $('<div class="reading-progress" role="progressbar" aria-label="Page scroll progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>').prependTo("body");
  function updateProgress() {
    const distance = Math.max(0, $(document).height() - $(window).height());
    const percent = distance ? Math.min(100, Math.max(0, $(window).scrollTop() / distance * 100)) : 100;
    $progress.attr("aria-valuenow", Math.round(percent)).find("span").css("width", percent + "%");
  }
  $(window).on("scroll.assignment6 resize.assignment6 load.assignment6", updateProgress);
  updateProgress();

  // Task 5: animate real project facts once, as each number enters the viewport.
  function animateCounter(element) {
    const $element = $(element);
    if ($element.data("counted")) return;
    $element.data("counted", true);
    const target = Number($element.attr("data-count"));
    if (reduceMotion) { $element.text(target); return; }
    $({ count: 0 }).animate({ count: target }, {
      duration: 1600,
      step: function (value) { $element.text(Math.floor(value)); },
      complete: function () { $element.text(target); }
    });
  }
  function inView(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom >= 0;
  }
  function checkCounters() { $("[data-count]").each(function () { if (inView(this)) animateCounter(this); }); }
  $(window).on("scroll.counters resize.counters", checkCounters);
  checkCounters();

  // Task 9: src is assigned with jQuery only when an image is visible.
  function loadImage(image) {
    const $image = $(image);
    const source = $image.attr("data-src");
    if (!source) return;
    $image.one("load", function () { $(this).addClass("is-loaded"); updateProgress(); })
      .one("error", function () { $(this).addClass("image-error"); });
    $image.attr("src", source).removeAttr("data-src");
  }
  function checkImages() { $("img[data-src]").each(function () { if (inView(this)) loadImage(this); }); }
  $(window).on("scroll.lazy resize.lazy load.lazy", checkImages);
  // Bootstrap's next slide starts hidden; load it just before its transition.
  $(".carousel").on("slide.bs.carousel", function (event) { $(event.relatedTarget).find("img[data-src]").each(function () { loadImage(this); }); });
  checkImages();

  // Task 8: success appears only after the clipboard write resolves.
  $("[data-copy-target]").on("click", async function () {
    const $button = $(this);
    if ($button.prop("disabled")) return;
    const original = $button.html();
    const text = $(this.getAttribute("data-copy-target")).text().trim();
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      $button.prop("disabled", true).html('<span aria-hidden="true">✓</span> Copied'); // taste-skill-ignore: assignment requires a checkmark
      const $tip = $button.siblings('[role="tooltip"]');
      $tip.text("Copied to clipboard!").prop("hidden", false);
      notify("Copied to clipboard!");
      setTimeout(function () { $button.prop("disabled", false).html(original); $tip.prop("hidden", true); }, 2400);
    } catch (error) {
      notify("Copy is unavailable. Select the text and copy it manually.");
    }
  });

  // Tasks 1-3: literal text matching; no user input is inserted as HTML.
  function highlight(root, keyword) {
    $(root).find("mark.search-match").each(function () { this.replaceWith(document.createTextNode(this.textContent)); });
    root.normalize();
    if (!keyword) return;
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "gi");
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      if (node.parentElement.closest("script, style, mark, .rating, .rating-text, [data-add]")) return;
      const content = node.textContent;
      regex.lastIndex = 0;
      let match;
      let start = 0;
      const fragment = document.createDocumentFragment();
      while ((match = regex.exec(content))) {
        fragment.append(content.slice(start, match.index));
        const mark = document.createElement("mark");
        mark.className = "search-match";
        mark.textContent = match[0];
        fragment.append(mark);
        start = match.index + match[0].length;
      }
      if (start) { fragment.append(content.slice(start)); node.replaceWith(fragment); }
    });
  }

  const $search = $("#product-search");
  const $suggestions = $("#search-suggestions");
  const titles = $("#product-row .card-title").map(function () { return $(this).text(); }).get();
  let selection = -1;
  function closeSuggestions() {
    selection = -1;
    $suggestions.empty().prop("hidden", true);
    $search.attr("aria-expanded", "false").removeAttr("aria-activedescendant");
  }
  function filterProducts(showSuggestions) {
    const keyword = String($search.val() || "").trim();
    const query = keyword.toLocaleLowerCase();
    let count = 0;
    $("#product-row .product-card").each(function () {
      const $card = $(this);
      const text = $card.find(".card-title, .card-text").text() + " " + ($card.find("img").attr("alt") || "");
      const matches = text.toLocaleLowerCase().includes(query);
      $card.parent().prop("hidden", !matches);
      if (matches) count++;
      highlight(this, keyword);
    });
    $("#search-status").text(count + (count === 1 ? " piece" : " pieces") + (keyword ? ' matching “' + keyword + '”.' : " in this price range."));
    $("#search-empty").prop("hidden", count !== 0);
    closeSuggestions();
    if (showSuggestions && query) {
      titles.filter(function (title) { return title.toLocaleLowerCase().includes(query); }).forEach(function (title, index) {
        $("<li>", { id: "suggestion-" + index, role: "option", "aria-selected": "false", text: title }).appendTo($suggestions);
      });
      const open = $suggestions.children().length > 0;
      $suggestions.prop("hidden", !open);
      $search.attr("aria-expanded", String(open));
    }
    checkImages();
    updateProgress();
  }
  $search.on("input", function () { filterProducts(true); });
  $search.on("keydown", function (event) {
    const $options = $suggestions.children();
    if (event.key === "Escape") { closeSuggestions(); return; }
    if (!$options.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      selection = event.key === "ArrowDown" ? (selection + 1) % $options.length : (selection < 0 ? $options.length - 1 : (selection - 1 + $options.length) % $options.length);
      $options.attr("aria-selected", "false").eq(selection).attr("aria-selected", "true");
      $search.attr("aria-activedescendant", $options.eq(selection).attr("id"));
      $options.eq(selection).get(0).scrollIntoView({ block: "nearest" });
    } else if (event.key === "Enter" && selection >= 0) {
      event.preventDefault();
      $search.val($options.eq(selection).text());
      filterProducts(false);
    } else if (event.key === "Tab") closeSuggestions();
  });
  $suggestions.on("mousedown", '[role="option"]', function (event) { event.preventDefault(); });
  $suggestions.on("click", '[role="option"]', function () { $search.val($(this).text()); filterProducts(false); $search.trigger("focus"); });
  $search.on("blur", closeSuggestions);
  $("#clear-search").on("click", function () { $search.val(""); filterProducts(false); $search.trigger("focus"); });
  $(document).on("foryou:products", function () { filterProducts(false); });
  if ($search.length) filterProducts(false);

  // FAQ keyword search highlights every occurrence, including words in answers.
  $("#faq-search").on("input", function () {
    const keyword = $(this).val().trim();
    $(".faq-item").each(function () {
      highlight(this, keyword);
      const matches = this.textContent.toLocaleLowerCase().includes(keyword.toLocaleLowerCase());
      $(this).prop("hidden", !matches);
      const $toggle = $(this).find(".faq-toggle");
      if (keyword && matches && $toggle.attr("aria-expanded") !== "true") $toggle.trigger("click");
    });
    const count = $(".faq-item").filter(function () { return !this.hidden; }).length;
    $("#faq-search-status").text(count + (count === 1 ? " matching question." : " matching questions."));
    updateProgress();
  });
});
