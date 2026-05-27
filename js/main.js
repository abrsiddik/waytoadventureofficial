// Main JavaScript for Travel Website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initThemeToggle();
    initSmoothScrolling();
    initScrollEffects();
    initAnimations();
    initFormValidation();
    renderVideoPreviews();
    renderGalleryImages();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }

    // Navbar background on scroll
    function updateNavbarBackground() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', function() {
        updateActiveNavLink();
        updateNavbarBackground();
    });

    // Initial call
    updateActiveNavLink();
    updateNavbarBackground();
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeIcon, savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(themeIcon, newTheme);
        });
    }
}

function updateThemeIcon(icon, theme) {
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll effects and animations
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.gallery-item, .video-item, .blog-card, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize animations
function initAnimations() {
    // Add animation classes to elements when they come into view
    const animatedElements = document.querySelectorAll('.section-header, .gallery-grid, .video-grid, .blog-grid');
    
    const animationObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        animationObserver.observe(el);
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simulate form submission
                showSuccessMessage(this);
            }
        });
    });
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(input);
        }
    });
    
    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(input, message) {
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#ef4444';
}

function clearError(input) {
    const existingError = input.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.style.borderColor = '';
}

function showSuccessMessage(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Success!';
    submitButton.style.backgroundColor = '#10b981';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.style.backgroundColor = '';
        submitButton.disabled = false;
        form.reset();
    }, 2000);
}

// Utility functions
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

// Performance optimization: Throttle scroll events
const throttledScrollHandler = debounce(function() {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close lightbox if open
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    }
});

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

function renderVideoPreviews() {
  const grid = document.getElementById('video-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Function to strip HTML tags for character counting
  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  // Show first 5 videos
  window.videos.slice(0, 5).forEach((video, index) => {
    // Strip HTML for character counting
    const plainText = stripHtml(video.desc);
    const shortDesc = plainText.length > 100 ? plainText.substring(0, 100) + '...' : video.desc;
    
    grid.innerHTML += `
      <div class="video-item" data-video-index="${index}">
        <div class="video-container">
          <iframe src="${video.src}" title="${video.title}" frameborder="0" allowfullscreen></iframe>
        </div>
        <h3>${video.title}</h3>
        <div class="video-description">
          <p class="short-desc">${shortDesc}</p>
          <p class="full-desc" style="display: none;">${video.desc}</p>
          ${plainText.length > 100 ? '<span class="read-more-btn" style="color: var(--primary-color); cursor: pointer; font-weight: 500; text-decoration: underline;">Read More</span>' : ''}
        </div>
      </div>
    `;
  });

  // 6th card: Watch More
  grid.innerHTML += `
    <a href="video.html" class="video-item-link" style="text-decoration:none;">
      <div class="video-item watch-more-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:220px;">
        <div style="font-size:3rem;color:var(--primary-color);margin-bottom:1rem;"><i class="fas fa-play-circle"></i></div>
        <div style="font-size:1.2rem;font-weight:600;color:var(--primary-color);">Watch More Videos</div>
      </div>
    </a>
  `;

  // Add click event listeners for Read More buttons
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const videoItem = this.closest('.video-item');
      const shortDesc = videoItem.querySelector('.short-desc');
      const fullDesc = videoItem.querySelector('.full-desc');
      const videoContainer = videoItem.querySelector('.video-container');
      
      // Toggle description
      if (fullDesc.style.display === 'none') {
        shortDesc.style.display = 'none';
        fullDesc.style.display = 'block';
        this.textContent = 'Read Less';
        
        // Expand video container
        videoContainer.style.height = '400px';
        videoContainer.style.transition = 'height 0.3s ease';
      } else {
        shortDesc.style.display = 'block';
        fullDesc.style.display = 'none';
        this.textContent = 'Read More';
        
        // Collapse video container
        videoContainer.style.height = '220px';
      }
    });
  });
}

function renderGalleryImages() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  grid.innerHTML = '';

  window.images.forEach(image => {
    grid.innerHTML += `
      <div class="gallery-item" data-category="${image.category}" onclick="gallery.openLightbox(${image.lightboxId})">
        <div class="gallery-image">
          <img src="${image.src}" alt="${image.alt}" loading="lazy">
          <div class="gallery-overlay">
            <div class="gallery-info">
              <h3>${image.title}</h3>
              <p>${image.location}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
} 