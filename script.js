document.addEventListener('DOMContentLoaded', function () {
  // Header glass background after scroll
  var header = document.getElementById('headerSection');

  function onScroll() {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile nav toggle
  var navToggle = document.getElementById('navToggle');
  var menuSection = document.getElementById('menuSection');

  if (navToggle && menuSection) {
    navToggle.addEventListener('click', function () {
      menuSection.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // Mobile Services submenu toggle
  var subMenus = document.querySelectorAll('.hasSubMenu');

  subMenus.forEach(function (hasSubMenu) {
    var subMenuLink = hasSubMenu.querySelector(':scope > a');

    if (!subMenuLink) return;

    subMenuLink.addEventListener('click', function (e) {
      if (window.innerWidth <= 767) {
        e.preventDefault();
        hasSubMenu.classList.toggle('open');
      }
    });
  });

  // Testimonial carousel
  var reviewsEl = document.getElementById('reviewsSplide');

  if (reviewsEl && window.Splide) {
    var reviewsSplide = new Splide(reviewsEl, {
      type: 'loop',
      perPage: 1,
      arrows: true,
      pagination: false,
      drag: true,
      autoplay: true,
      interval: 2000,
      pauseOnHover: true,
      pauseOnFocus: true
    });

    var avatars = document.querySelectorAll('.clientsReviewsHeader li');

    avatars.forEach(function (avatar, i) {
      avatar.addEventListener('click', function () {
        reviewsSplide.go(i);
      });
    });

    reviewsSplide.on('moved', function (newIndex) {
      avatars.forEach(function (avatar, i) {
        avatar.classList.toggle('active', i === newIndex);
      });
    });

    reviewsSplide.mount();
  }

  // Bestseller / portfolio carousel
  var bestsellerEl = document.getElementById('bestsellerSplide');

  if (bestsellerEl && window.Splide) {
    new Splide(bestsellerEl, {
      type: 'loop',
      perPage: 4,
      perMove: 1,
      gap: '20px',
      arrows: true,
      pagination: false,
      drag: true,
      autoplay: true,
      interval: 3500,
      pauseOnHover: true,
      pauseOnFocus: true,
      breakpoints: {
        1199: { perPage: 3 },
        991: { perPage: 2 },
        575: { perPage: 1 }
      }
    }).mount();
  }
   

  // Contact form demo submit
  var contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Thanks! This is a local replica — hook this form up to your backend/CRM when ready.');
      contactForm.reset();
    });
  }
});

