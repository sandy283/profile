/* =====================================================================
   Sandeep Sharma — site interactions (shared across all pages)
   ===================================================================== */
(function () {
  "use strict";

  /* ---- Lucide icons ---- */
  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
  renderIcons();
  window.addEventListener("load", renderIcons);

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky header shadow ---- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", (window.scrollY || 0) > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Active nav link by current page ---- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__link").forEach(function (link) {
    var href = (link.getAttribute("href") || "").split("/").pop();
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) closeNav();
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Count-up for home stats ---- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var decimals = (el.dataset.count.split(".")[1] || "").length;
    var dur = 1300, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = decimals ? target.toFixed(decimals) : Math.round(target).toString();
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- Announcement bar dismiss (per session) ---- */
  var announce = document.getElementById("announce");
  var announceClose = document.getElementById("announceClose");
  if (announce && announceClose) {
    try {
      if (sessionStorage.getItem("announceDismissed") === "1") {
        document.body.classList.add("announce-hidden");
      }
    } catch (e) {}
    announceClose.addEventListener("click", function () {
      document.body.classList.add("announce-hidden");
      try { sessionStorage.setItem("announceDismissed", "1"); } catch (e) {}
    });
  }

  /* ---- Theme toggle (persisted in localStorage) ---- */
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f7f8fb" : "#0a0c12");
  }
  // Sync with any value the inline head script already applied.
  try {
    var saved = localStorage.getItem("theme");
    if (saved) applyTheme(saved);
  } catch (e) {}

  var themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var isLight = document.documentElement.getAttribute("data-theme") === "light";
      var next = isLight ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---- Page-visit counter (global via free Abacus API; local fallback) ---- */
  (function visitCounter() {
    var footBottom = document.querySelector(".foot-bottom");
    if (!footBottom) return;

    var wrap = document.createElement("span");
    wrap.className = "visits";
    wrap.innerHTML = '<i data-lucide="eye"></i><span class="visits__num">…</span><span class="visits__label">visits</span>';
    var socials = footBottom.querySelector(".foot-socials");
    if (socials) footBottom.insertBefore(wrap, socials);
    else footBottom.appendChild(wrap);
    renderIcons();

    var numEl = wrap.querySelector(".visits__num");
    function show(n) { numEl.textContent = Number(n).toLocaleString(); }

    // Abacus: GET /hit/<namespace>/<key> increments and returns {"value": N}. No key/sign-up needed.
    var ENDPOINT = "https://abacus.jasoncameron.dev/hit/sandeep-sharma-sandy283-portfolio/site";

    fetch(ENDPOINT, { method: "GET", cache: "no-store" })
      .then(function (r) { if (!r.ok) throw new Error("counter " + r.status); return r.json(); })
      .then(function (d) {
        var v = d && (d.value != null ? d.value : d.count);
        if (v == null) throw new Error("no value");
        show(v);
        try { localStorage.setItem("visitsCache", String(v)); } catch (e) {}
      })
      .catch(function () {
        // Offline / localhost fallback so the widget still shows a sensible number.
        var cached = 0, local = 1;
        try { cached = parseInt(localStorage.getItem("visitsCache") || "0", 10); } catch (e) {}
        try {
          local = parseInt(localStorage.getItem("visitsLocal") || "0", 10) + 1;
          localStorage.setItem("visitsLocal", String(local));
        } catch (e) {}
        show(cached > local ? cached : local);
        wrap.title = "Approximate count (live counter unavailable)";
      });
  })();

  /* ---- Collapsible sections (minimize / expand) ---- */
  document.querySelectorAll(".collapse-btn").forEach(function (btn) {
    var section = btn.closest(".collapsible");
    if (!section) return;
    btn.addEventListener("click", function () {
      var collapsed = section.classList.toggle("collapsed");
      btn.setAttribute("aria-expanded", String(!collapsed));
    });
  });

  /* ---- Before/After portrait compare slider ---- */
  var compare = document.getElementById("compare");
  var handle = document.getElementById("compareHandle");
  if (compare && handle) {
    var dragging = false;

    function setPos(clientX) {
      var rect = compare.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      compare.style.setProperty("--pos", pct + "%");
      handle.setAttribute("aria-valuenow", Math.round(pct));
    }

    function onDown(e) {
      dragging = true;
      compare.style.cursor = "ew-resize";
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      setPos(e.touches ? e.touches[0].clientX : e.clientX);
    }
    function onUp() { dragging = false; compare.style.cursor = ""; }

    handle.addEventListener("mousedown", onDown);
    compare.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    handle.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    // Keyboard support
    handle.addEventListener("keydown", function (e) {
      var cur = parseFloat(compare.style.getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") { cur = Math.max(0, cur - 4); }
      else if (e.key === "ArrowRight") { cur = Math.min(100, cur + 4); }
      else return;
      compare.style.setProperty("--pos", cur + "%");
      handle.setAttribute("aria-valuenow", Math.round(cur));
      e.preventDefault();
    });

    // A gentle one-time nudge so visitors notice it slides.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var seq = [50, 62, 38, 50], k = 0;
      var nudge = setInterval(function () {
        k++;
        if (k >= seq.length) { clearInterval(nudge); return; }
        compare.style.setProperty("--pos", seq[k] + "%");
      }, 420);
    }
  }
})();