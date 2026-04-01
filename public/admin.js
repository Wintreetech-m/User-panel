$(document).ready(function () {
  // ---------------- LOGIN ----------------
  $('#loginForm').on('submit', function (e) {
    e.preventDefault();

    const data = {
      username: $('#loginUsername').val().trim(),
      password: $('#loginPassword').val().trim()
    };

    $.ajax({
      url: '/api/login',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (res) {
        $('#loginMsg').html('<span class="text-success">Login successful</span>');

        // Hide login card after successful login
        $('#loginCard').slideUp(300, function () {
          $('#dashboardArea').fadeIn();
        });

        loadProducts();
        loadTestimonials();
      },
      error: function (xhr) {
        $('#loginMsg').html('<span class="text-danger">Invalid username or password</span>');
      }
    });
  });

  // ---------------- PRODUCT FUNCTIONS ----------------
  function loadProducts() {
    $.ajax({
      url: '/api/products',
      type: 'GET',
      success: function (data) {
        let html = `
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        `;

        if (data.length === 0) {
          html += `
            <tr>
              <td colspan="6" class="text-center">No products found</td>
            </tr>
          `;
        } else {
          data.forEach(function (p) {
            html += `
              <tr>
                <td>${p.id}</td>
                <td>
                  <img src="${p.image && p.image.trim() !== '' ? p.image : 'https://via.placeholder.com/80x60'}" 
                       alt="${p.name}" 
                       style="width:60px;height:45px;object-fit:cover;border-radius:6px;">
                </td>
                <td>${p.name}</td>
                <td>${p.category || ''}</td>
                <td>${p.price}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-1 edit-product"
                    data-id="${p.id}"
                    data-name="${encodeURIComponent(p.name || '')}"
                    data-category="${encodeURIComponent(p.category || '')}"
                    data-price="${p.price}"
                    data-image="${encodeURIComponent(p.image || '')}"
                    data-description="${encodeURIComponent(p.description || '')}">
                    Edit
                  </button>

                  <button class="btn btn-sm btn-danger delete-product" data-id="${p.id}">
                    Delete
                  </button>
                </td>
              </tr>
            `;
          });
        }

        $('#productTable').html(html);
      },
      error: function () {
        alert('Failed to load products');
      }
    });
  }

  $('#productForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#productId').val().trim();

    const data = {
      name: $('#name').val().trim(),
      category: $('#category').val().trim(),
      price: $('#price').val().trim(),
      image: $('#image').val().trim(),
      description: $('#description').val().trim()
    };

    if (!data.name || !data.price) {
      alert('Please enter product name and price');
      return;
    }

    if (id) {
      $.ajax({
        url: '/api/products/' + id,
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function () {
          alert('Product updated successfully');
          clearProductForm();
          loadProducts();
        },
        error: function (xhr) {
          console.log(xhr.responseText);
          alert('Failed to update product');
        }
      });
    } else {
      $.ajax({
        url: '/api/products',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function () {
          alert('Product added successfully');
          clearProductForm();
          loadProducts();
        },
        error: function (xhr) {
          console.log(xhr.responseText);
          alert('Failed to add product');
        }
      });
    }
  });

  $(document).on('click', '.edit-product', function () {
    $('#productId').val($(this).data('id'));
    $('#name').val(decodeURIComponent($(this).data('name')));
    $('#category').val(decodeURIComponent($(this).data('category')));
    $('#price').val($(this).data('price'));
    $('#image').val(decodeURIComponent($(this).data('image')));
    $('#description').val(decodeURIComponent($(this).data('description')));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $(document).on('click', '.delete-product', function () {
    const id = $(this).data('id');

    if (confirm('Delete this product?')) {
      $.ajax({
        url: '/api/products/' + id,
        type: 'DELETE',
        success: function () {
          alert('Product deleted successfully');
          loadProducts();
        },
        error: function () {
          alert('Failed to delete product');
        }
      });
    }
  });

  function clearProductForm() {
    $('#productForm')[0].reset();
    $('#productId').val('');
  }

  $('#clearProductBtn').on('click', function () {
    clearProductForm();
  });

  // ---------------- TESTIMONIAL FUNCTIONS ----------------
  function loadTestimonials() {
    $.ajax({
      url: '/api/testimonials',
      type: 'GET',
      success: function (data) {
        let html = `
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        `;

        if (data.length === 0) {
          html += `
            <tr>
              <td colspan="5" class="text-center">No testimonials found</td>
            </tr>
          `;
        } else {
          data.forEach(function (t) {
            html += `
              <tr>
                <td>${t.id}</td>
                <td>${t.name}</td>
                <td>${t.role || ''}</td>
                <td>${t.message}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-1 edit-test"
                    data-id="${t.id}"
                    data-name="${encodeURIComponent(t.name || '')}"
                    data-role="${encodeURIComponent(t.role || '')}"
                    data-message="${encodeURIComponent(t.message || '')}">
                    Edit
                  </button>

                  <button class="btn btn-sm btn-danger delete-test" data-id="${t.id}">
                    Delete
                  </button>
                </td>
              </tr>
            `;
          });
        }

        $('#testTable').html(html);
      },
      error: function () {
        alert('Failed to load testimonials');
      }
    });
  }

  $('#testForm').on('submit', function (e) {
    e.preventDefault();

    const id = $('#testId').val().trim();

    const data = {
      name: $('#tname').val().trim(),
      role: $('#trole').val().trim(),
      message: $('#message').val().trim()
    };

    if (!data.name || !data.message) {
      alert('Please enter testimonial name and message');
      return;
    }

    if (id) {
      $.ajax({
        url: '/api/testimonials/' + id,
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function () {
          alert('Testimonial updated successfully');
          clearTestForm();
          loadTestimonials();
        },
        error: function (xhr) {
          console.log(xhr.responseText);
          alert('Failed to update testimonial');
        }
      });
    } else {
      $.ajax({
        url: '/api/testimonials',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function () {
          alert('Testimonial added successfully');
          clearTestForm();
          loadTestimonials();
        },
        error: function (xhr) {
          console.log(xhr.responseText);
          alert('Failed to add testimonial');
        }
      });
    }
  });

  $(document).on('click', '.edit-test', function () {
    $('#testId').val($(this).data('id'));
    $('#tname').val(decodeURIComponent($(this).data('name')));
    $('#trole').val(decodeURIComponent($(this).data('role')));
    $('#message').val(decodeURIComponent($(this).data('message')));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  $(document).on('click', '.delete-test', function () {
    const id = $(this).data('id');

    if (confirm('Delete this testimonial?')) {
      $.ajax({
        url: '/api/testimonials/' + id,
        type: 'DELETE',
        success: function () {
          alert('Testimonial deleted successfully');
          loadTestimonials();
        },
        error: function () {
          alert('Failed to delete testimonial');
        }
      });
    }
  });

  function clearTestForm() {
    $('#testForm')[0].reset();
    $('#testId').val('');
  }

  $('#clearTestBtn').on('click', function () {
    clearTestForm();
  });
});

