$(document).ready(function () {
  loadProducts();
  loadTestimonials();

  function loadProducts() {
    $.get('/api/products', function (data) {
      let html = '';

      data.forEach((p) => {
        html += `
  <div class="product-card">
    <div class="product-image-wrap">
      <img src="${p.image}" alt="${p.name}">
    </div>
    <div class="product-category">${p.category || 'Chair'}</div>
    <div class="product-name">${p.name}</div>
    <div class="product-footer">
      <div class="price">$${p.price}</div>
      <button class="add-btn">+</button>
    </div>
  </div>
`;
      });

      $('#productList').html(html);
    });
  }


  function loadTestimonials() {
    $.get('/api/testimonials', function (data) {
      let html = '';

      if (data.length === 0) {
        html = `
        <div class="testimonial-simple-card">
          <h5>No Testimonials</h5>
          <div class="testimonial-simple-role">Client</div>
          <p>No testimonial available right now.</p>
        </div>
      `;
      } else {
        data.forEach(t => {
          html += `
          <div class="testimonial-simple-card">
            <h5>${t.name}</h5>
            <div class="testimonial-simple-role">${t.role || 'Client'}</div>
            <p>${t.message}</p>
          </div>
        `;
        });
      }

      $('#testimonialList').html(html);
      setupTestimonialSlider();
    });
   function setupTestimonialSlider() {
  let currentIndex = 0;

  function getVisibleCards() {
    return 1;
  }

  function updateTestimonialSlider() {
    const $cards = $('#testimonialList .testimonial-simple-card');
    const totalCards = $cards.length;
    const visibleCards = getVisibleCards();

    if (totalCards === 0) return;

    const cardWidth = $cards.outerWidth(true);
    const maxIndex = Math.max(0, totalCards - visibleCards);

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    const moveX = currentIndex * cardWidth;
    $('#testimonialList').css('transform', `translateX(-${moveX}px)`);
  }

  $('#testimonialRightBtn').off('click').on('click', function () {
    const totalCards = $('#testimonialList .testimonial-simple-card').length;
    const maxIndex = Math.max(0, totalCards - 1);

    if (currentIndex < maxIndex) {
      currentIndex++;
      updateTestimonialSlider();
    }
  });

  $('#testimonialLeftBtn').off('click').on('click', function () {
    if (currentIndex > 0) {
      currentIndex--;
      updateTestimonialSlider();
    }
  });

  $(window).off('resize.testimonialSlider').on('resize.testimonialSlider', function () {
    updateTestimonialSlider();
  });

  updateTestimonialSlider();
}
  setInterval(function () {
  const totalCards = $('#testimonialList .testimonial-simple-card').length;
  const visibleCards = getVisibleCards();
  const maxIndex = Math.max(0, totalCards - visibleCards);

  if (currentIndex < maxIndex) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }

  updateTestimonialSlider();
}, 3000);
  
    // ================= RESPONSIVE NAVBAR =================
    $(document).ready(function () {
      $('#menuToggle').on('click', function () {
        $('#navMenu').toggleClass('active');
      });

      $('.dropdown-toggle-custom').on('click', function (e) {
        if ($(window).width() <= 991) {
          e.preventDefault();
          $(this).parent().toggleClass('active');
        }
      });

      $(document).on('click', function (e) {
        if ($(window).width() <= 991) {
          if (!$(e.target).closest('.custom-navbar').length) {
            $('#navMenu').removeClass('active');
            $('.dropdown-item-custom').removeClass('active');
          }
        }
      });

      $(window).on('resize', function () {
        if ($(window).width() > 991) {
          $('#navMenu').removeClass('active');
          $('.dropdown-item-custom').removeClass('active');
        }
      });
    });
  }
});
