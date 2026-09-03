(function($) {
  "use strict";

  var toggle = document.getElementById("menu-toggle");
  var menu = document.getElementById("menu");
  var close = document.getElementById("menu-close");

  // Mobile menu toggle
  if (toggle && menu) {
    toggle.addEventListener("click", function(e) {
      menu.classList.toggle("open");
    });
  }

  if (close && menu) {
    close.addEventListener("click", function(e) {
      menu.classList.remove("open");
    });
  }

  // Close menu after clicking a link on smaller screens
  $(window).on("resize", function() {
    if ($(window).width() < 991) {
      $(".main-menu a").on("click", function() {
        if (menu) menu.classList.remove("open");
      });
    }
  });

  // =============================================================
  // Typing Effect in Hero
  // =============================================================
  var typedElement = document.getElementById("typedText");
  var roles = [
    "Full Stack Web Developer",
    "Backend Engineer",
    "Frontend Developer",
    "Problem Solver"
  ];
  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function type() {
    if (!typedElement) return;
    var current = roles[roleIndex];

    if (!deleting) {
      typedElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 70);
    } else {
      typedElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 35);
    }
  }

  if (typedElement) {
    setTimeout(type, 600);
  }

  // =============================================================
  // Scroll Reveal
  // =============================================================
  var revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function(entries, observer) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            var delay = entry.target.getAttribute("data-delay");
            if (delay) {
              entry.target.style.transitionDelay = (parseInt(delay) * 0.1) + "s";
            }
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function(el) {
      el.classList.add("revealed");
    });
  }

  // =============================================================
  // Scroll Progress Bar
  // =============================================================
  var progressBar = document.getElementById("scrollProgress");

  function updateProgress() {
    if (!progressBar) return;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    var docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    var scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = scrolled + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // =============================================================
  // Staggered hover lift for service items (extra polish)
  // =============================================================
  $(".hover").mouseleave(function() {
    $(this).removeClass("hover");
  });
})(jQuery);
