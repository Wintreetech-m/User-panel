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

    if (data.length > 0) {
      const t = data[0];
      html = `
        <div class="testimonial-simple-card">
          <h5>${t.name}</h5>
          <div class="testimonial-simple-role">${t.role || 'Client'}</div>
          <p>${t.message}</p>
        </div>
      `;
    }

    $('#testimonialList').html(html);
  });
}
});

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