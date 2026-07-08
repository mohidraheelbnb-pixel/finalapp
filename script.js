document.addEventListener('DOMContentLoaded', function () {

  // Header glass background after scroll
  var header = document.getElementById('headerSection');
  function onScroll() {
    if (window.scrollY > 20) header.classList.add('active');
    else header.classList.remove('active');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var menuSection = document.getElementById('menuSection');
  if (navToggle && menuSection) {
    navToggle.addEventListener('click', function () {
      menuSection.classList.toggle('open');
    });
  }

  // Mobile Services submenu toggle
  var hasSubMenu = document.querySelector('.hasSubMenu');
  if (hasSubMenu) {
    var subMenuLink = hasSubMenu.querySelector(':scope > a');
    subMenuLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        hasSubMenu.classList.toggle('open');
      }
    });
  }

  // Testimonial carousel
  var avatars = document.querySelectorAll('.clientsReviewsHeader li');
  var reviewsContainer = document.getElementById('reviewsContainer');
  var slides = reviewsContainer ? reviewsContainer.querySelectorAll('.emblaSlide') : [];
  var current = 0;

  function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    reviewsContainer.style.transform = 'translateX(-' + (current * 100) + '%)';
    avatars.forEach(function (a, i) {
      a.classList.toggle('active', i === current);
    });
  }

  avatars.forEach(function (avatar, i) {
    avatar.addEventListener('click', function () { goToSlide(i); });
  });

  var reviewsPrev = document.getElementById('reviewsPrev');
  var reviewsNext = document.getElementById('reviewsNext');
  if (reviewsPrev) reviewsPrev.addEventListener('click', function () { goToSlide(current - 1); });
  if (reviewsNext) reviewsNext.addEventListener('click', function () { goToSlide(current + 1); });

  if (slides.length) {
    setInterval(function () { goToSlide(current + 1); }, 2000);
  }

  // Bestseller/portfolio carousel — true seamless infinite loop, one card per click
  var bestsellerViewport = document.getElementById('bestsellerViewport');
  var bestsellerContainer = bestsellerViewport ? bestsellerViewport.querySelector('.emblaContainer') : null;

  if (bestsellerViewport && bestsellerContainer) {
    var originalSlides = Array.prototype.slice.call(bestsellerContainer.querySelectorAll('.emblaSlide'));
    var cloneBefore = originalSlides.map(function (s) { return s.cloneNode(true); });
    var cloneAfter = originalSlides.map(function (s) { return s.cloneNode(true); });

    bestsellerContainer.innerHTML = '';
    cloneBefore.forEach(function (n) { bestsellerContainer.appendChild(n); });
    originalSlides.forEach(function (n) { bestsellerContainer.appendChild(n); });
    cloneAfter.forEach(function (n) { bestsellerContainer.appendChild(n); });

    var singleSetWidth = 0;
    var scrollAmount = 0;
    var isJumping = false;
    var animFrame = null;
    var targetScrollLeft = null;

    function measure() {
      var slidesEls = bestsellerContainer.querySelectorAll('.emblaSlide');
      var n = slidesEls.length / 3;
      var firstOfMiddle = slidesEls[n];
      var firstOfLastClone = slidesEls[n * 2];
      singleSetWidth = firstOfLastClone.offsetLeft - firstOfMiddle.offsetLeft;
      var gap = parseFloat(getComputedStyle(bestsellerContainer).gap) || 20;
      scrollAmount = slidesEls[0].getBoundingClientRect().width + gap;
      bestsellerViewport.scrollLeft = firstOfMiddle.offsetLeft; // start inside the real (middle) set
    }
    measure();
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);

    // Wrap position back into the middle (real) set if we've drifted into a clone.
    // Safe to call any time nothing is actively animating.
    function wrapIfNeeded() {
      if (!singleSetWidth) return;
      if (bestsellerViewport.scrollLeft >= singleSetWidth * 1.5) {
        bestsellerViewport.scrollLeft -= singleSetWidth;
      } else if (bestsellerViewport.scrollLeft <= singleSetWidth * 0.5) {
        bestsellerViewport.scrollLeft += singleSetWidth;
      }
    }

    function smoothScrollTo(target, duration) {
      if (animFrame) cancelAnimationFrame(animFrame);
      var start = bestsellerViewport.scrollLeft;
      var change = target - start;
      var startTime = null;
      function step(time) {
        if (!startTime) startTime = time;
        var elapsed = time - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        bestsellerViewport.scrollLeft = start + change * ease;
        if (elapsed < duration) {
          animFrame = requestAnimationFrame(step);
        } else {
          animFrame = null;
          targetScrollLeft = null;
          isJumping = true;
          wrapIfNeeded(); // only correct now that the animation is fully settled
          isJumping = false;
        }
      }
      animFrame = requestAnimationFrame(step);
    }

    document.querySelectorAll('[data-target="bestsellerViewport"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isNext = btn.classList.contains('emblaNext');
        // base off the pending target if one exists, so rapid clicks queue by exactly one card each
        var base = targetScrollLeft !== null ? targetScrollLeft : bestsellerViewport.scrollLeft;
        var target = base + (isNext ? scrollAmount : -scrollAmount);
        targetScrollLeft = target;
        smoothScrollTo(target, 900); // ms — raise to slow down further
      });
    });

    // Handles manual drag/swipe/wheel scrolling only — ignored while a button
    // animation is running, so the two never fight over scrollLeft mid-motion.
    bestsellerViewport.addEventListener('scroll', function () {
      if (isJumping || animFrame) return;
      wrapIfNeeded();
    });
  }

  // Contact form - local demo submit (no backend)
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thanks! This is a local replica — hook this form up to your backend/CRM when ready.');
      contactForm.reset();
    });
  }
});