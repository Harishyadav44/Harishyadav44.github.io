/* ============================================
   Portfolio — 3D background + UI (GitHub Pages ready)
   ============================================ */
(function () {
  "use strict";

  // -------- SVG background animator (replaces heavy Three.js background) --------
  function initBackground() {
    var svg = document.getElementById("bg-illustration");
    if (!svg) return;

    // generate subtle stars
    var stars = document.getElementById("stars");
    var starCount = 120;
    for (var i = 0; i < starCount; i++) {
      var cx = Math.random() * 1600;
      var cy = Math.random() * 900;
      var r = Math.random() * 1.6 + 0.2;
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", cx);
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", "#ffffff");
      circle.setAttribute("fill-opacity", (Math.random() * 0.6 + 0.12).toFixed(2));
      stars.appendChild(circle);
    }

    // animate blobs with sin/cos motion for organic movement
    var blobs = Array.prototype.slice.call(svg.querySelectorAll('.blob'));
    var seed = blobs.map(function () { return Math.random() * 1000; });

    function animate() {
      var t = performance.now() * 0.00012;
      blobs.forEach(function (b, idx) {
        var baseCx = parseFloat(b.getAttribute('cx'));
        var baseCy = parseFloat(b.getAttribute('cy'));
        var dx = Math.sin(t * (0.6 + idx * 0.12) + seed[idx]) * (30 + idx * 6);
        var dy = Math.cos(t * (0.45 + idx * 0.08) + seed[idx] * 0.7) * (18 + idx * 4);
        b.setAttribute('cx', baseCx + dx);
        b.setAttribute('cy', baseCy + dy);
      });
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(initBackground, 80); });
  } else {
    setTimeout(initBackground, 80);
  }

  // -------- Scroll-in from right (data flow) --------
  var flowEls = document.querySelectorAll(".flow-in");
  var observerOptions = { root: null, rootMargin: "0px 0px -80px 0px", threshold: 0.08 };
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);
  flowEls.forEach(function (el) {
    observer.observe(el);
  });

  // -------- Footer year --------
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -------- Mobile menu --------
  var menuBtn = document.querySelector(".menu-btn");
  var header = document.querySelector(".header");
  var navLinks = document.querySelectorAll(".nav a");

  if (menuBtn && header) {
    menuBtn.addEventListener("click", function () {
      header.classList.toggle("nav-open");
      menuBtn.setAttribute("aria-expanded", header.classList.contains("nav-open"));
    });
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        header.classList.remove("nav-open");
      });
    });
  }

  // -------- Active nav link on scroll --------
  var sections = document.querySelectorAll(".section, .hero");
  var navAnchors = document.querySelectorAll(".nav a");

  function updateActiveLink() {
    var scrollY = window.scrollY;
    var headerHeight = header ? header.offsetHeight : 80;
    sections.forEach(function (section) {
      var top = section.offsetTop - headerHeight;
      var height = section.offsetHeight;
      var id = section.getAttribute("id");
      if (id && scrollY >= top && scrollY < top + height) {
        navAnchors.forEach(function (a) {
          a.classList.remove("active");
          if (a.getAttribute("href") === "#" + id) a.classList.add("active");
        });
      }
    });
  }

  if (navAnchors.length && sections.length) {
    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
  }

  // -------- Projects neon indicator (moves to the currently visible project) --------
  function initProjectIndicator() {
    var projectsWrap = document.querySelector('.projects-wrap');
    var projectCards = Array.prototype.slice.call(document.querySelectorAll('.project-card'));
    var indicator = document.querySelector('.neon-indicator');
    if (!projectsWrap || !projectCards.length || !indicator) return;

    function updateIndicator() {
      var viewportCenter = window.scrollY + window.innerHeight / 2;
      var best = projectCards[0];
      var bestDist = Infinity;
      projectCards.forEach(function (card) {
        var rect = card.getBoundingClientRect();
        var cardCenter = window.scrollY + rect.top + rect.height / 2;
        var dist = Math.abs(viewportCenter - cardCenter);
        if (dist < bestDist) {
          bestDist = dist;
          best = card;
        }
      });
      var wrapRect = projectsWrap.getBoundingClientRect();
      var targetRect = best.getBoundingClientRect();
      var top = (targetRect.top - wrapRect.top) + targetRect.height / 2;
      indicator.style.top = (top - (indicator.offsetHeight / 2)) + 'px';
    }

    window.addEventListener('scroll', throttle(updateIndicator, 80));
    window.addEventListener('resize', throttle(updateIndicator, 150));
    // initial
    setTimeout(updateIndicator, 120);
  }

  // throttle helper
  function throttle(fn, wait) {
    var last = 0;
    return function () {
      var now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, arguments);
      }
    };
  }

  initProjectIndicator();
})();
