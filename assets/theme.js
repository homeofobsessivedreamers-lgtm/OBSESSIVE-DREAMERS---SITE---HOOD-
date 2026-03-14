/* ==========================================================================
   HOME OF OBSESSIVE DREAMERS - Theme JavaScript
   ========================================================================== */

(function() {
  'use strict';

  /* ==========================================================================
     Utility Functions
     ========================================================================== */
  
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function getSiblings(element) {
    return Array.from(element.parentElement.children);
  }

  /* ==========================================================================
     Mobile Navigation
     ========================================================================== */
  
  const menuToggle = document.querySelector('.header-menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================================================
     Header Scroll Effect
     ========================================================================== */
  
  const header = document.querySelector('.header');
  
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', debounce(function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, 10));
  }

  /* ==========================================================================
     Search Modal
     ========================================================================== */
  
  const searchToggle = document.querySelector('.search-toggle');
  const searchModal = document.querySelector('.search-modal');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');
  
  if (searchToggle && searchModal) {
    searchToggle.addEventListener('click', function(e) {
      e.preventDefault();
      searchModal.classList.add('active');
      if (searchInput) {
        setTimeout(function() {
          searchInput.focus();
        }, 100);
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', function() {
        searchModal.classList.remove('active');
      });
    }

    searchModal.addEventListener('click', function(e) {
      if (e.target === searchModal) {
        searchModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && searchModal.classList.contains('active')) {
        searchModal.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     Product Card Quick Add
     ========================================================================== */
  
  const quickAddForms = document.querySelectorAll('.quick-add-form');
  
  quickAddForms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const variantId = form.querySelector('[name="id"]').value;
      const quantity = parseInt(form.querySelector('[name="quantity"]')?.value || 1);
      
      fetch(window.routes.cart_add_url + '.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'items': [{
            'id': variantId,
            'quantity': quantity
          }]
        })
      })
      .then(function(response) {
        return response.json();
      })
      .then(function() {
        updateCartCount();
        openCartDrawer();
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
    });
  });

  function updateCartCount() {
    fetch('/cart.js')
      .then(function(response) {
        return response.json();
      })
      .then(function(cart) {
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(function(el) {
          el.textContent = cart.item_count;
        });
      });
  }

  function openCartDrawer() {
    const cartDrawer = document.querySelector('.cart-drawer');
    if (cartDrawer) {
      cartDrawer.classList.add('active');
    }
  }

  /* ==========================================================================
     Product Quantity Selector
     ========================================================================== */
  
  document.querySelectorAll('.quantity-selector').forEach(function(selector) {
    const minusBtn = selector.querySelector('.quantity-minus');
    const plusBtn = selector.querySelector('.quantity-plus');
    const input = selector.querySelector('.quantity-input');
    
    if (minusBtn && input) {
      minusBtn.addEventListener('click', function() {
        let value = parseInt(input.value);
        if (value > 1) {
          input.value = value - 1;
          input.dispatchEvent(new Event('change'));
        }
      });
    }
    
    if (plusBtn && input) {
      plusBtn.addEventListener('click', function() {
        let value = parseInt(input.value);
        input.value = value + 1;
        input.dispatchEvent(new Event('change'));
      });
    }
  });

  /* ==========================================================================
     Variant Selector
     ========================================================================== */
  
  document.querySelectorAll('.product-variant-options').forEach(function(options) {
    const buttons = options.querySelectorAll('.product-variant-btn');
    
    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        const name = this.dataset.optionName;
        const value = this.dataset.optionValue;
        
        getSiblings(this).forEach(function(sib) {
          sib.classList.remove('active');
        });
        this.classList.add('active');
        
        const selectedInput = options.querySelector('input[name="' + name + '"]');
        if (selectedInput) {
          selectedInput.value = value;
          selectedInput.dispatchEvent(new Event('change'));
        }
      });
    });
  });

  /* ==========================================================================
     Image Gallery
     ========================================================================== */
  
  const galleryThumbs = document.querySelectorAll('.product-gallery-thumb');
  const galleryMain = document.querySelector('.product-gallery-main img');
  
  if (galleryThumbs.length > 0 && galleryMain) {
    galleryThumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        const newSrc = this.dataset.src;
        
        galleryThumbs.forEach(function(t) {
          t.classList.remove('active');
        });
        this.classList.add('active');
        
        galleryMain.src = newSrc;
      });
    });
  }

  /* ==========================================================================
     Newsletter Form
   ========================================================================== */
  
  const newsletterForm = document.querySelector('.newsletter-form');
  
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const email = emailInput.value;
      
      fetch(window.routes.cart_add_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'email=' + encodeURIComponent(email) + '&form_type=newsletter'
      })
      .then(function(response) {
        const messageEl = newsletterForm.parentElement.querySelector('.newsletter-message');
        if (messageEl) {
          messageEl.textContent = 'Thank you for subscribing!';
          messageEl.classList.add('success');
        }
        emailInput.value = '';
      })
      .catch(function(error) {
        console.error('Error:', error);
      });
    });
  }

  /* ==========================================================================
     Collection Filter & Sort
   ========================================================================== */
  
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const filterValue = this.dataset.filter;
      
      filterButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      
      const products = document.querySelectorAll('.product-card');
      
      products.forEach(function(product) {
        if (filterValue === 'all' || product.dataset.vendor === filterValue) {
          product.style.display = '';
        } else {
          product.style.display = 'none';
        }
      });
    });
  });

  /* ==========================================================================
     Smooth Scroll for Anchor Links
   ========================================================================== */
  
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ==========================================================================
     Lazy Loading Images
   ========================================================================== */
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(function(img) {
      imageObserver.observe(img);
    });
  }

  /* ==========================================================================
     Initialize
   ========================================================================== */
  
  document.addEventListener('DOMContentLoaded', function() {
    console.log('Home of Obsessive Dreamers Theme Loaded');
    
    document.body.classList.add('loaded');
  });

})();
