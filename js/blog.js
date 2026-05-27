// Blog rendering and modal logic

document.addEventListener('DOMContentLoaded', function() {
  if (!window.blogs) {
    return;
  }
  const blogGrid = document.getElementById('blog-grid');
  if (!blogGrid) return;

  // Render blog cards (standard style)
  blogGrid.innerHTML = window.blogs.map((blog, idx) => `
    <div class="blog-card" data-blog-idx="${idx}">
      <img src="${blog.image}" alt="${blog.title}" class="blog-image" style="height:200px;object-fit:cover;width:100%;display:block;" />
      <div class="blog-content" style="padding:1rem;">
        <h3 class="blog-title" style="margin:0 0 0.5rem 0;">${blog.title}</h3>
        <p class="blog-excerpt" style="margin:0 0 1rem 0;">${blog.excerpt}</p>
        <button class="read-more-btn" data-blog-idx="${idx}">Read More</button>
      </div>
    </div>
  `).join('');

  // Modal HTML
  let modal = document.getElementById('blog-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'blog-modal';
    modal.className = 'blog-modal';
    modal.innerHTML = `
      <div class="blog-modal-content">
        <div class="blog-modal-header">
          <button class="blog-modal-close">&times;</button>
        </div>
        <div class="blog-modal-body">
          <div class="blog-post-image" style="text-align:center;margin-bottom:1rem;">
            <img src="" alt="" style="max-width:100%;max-height:400px;object-fit:contain;border-radius:8px;" />
          </div>
          <h2 class="blog-title"></h2>
          <div class="post-content"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Open modal on Read More
  blogGrid.addEventListener('click', function(e) {
    const btn = e.target.closest('.read-more-btn');
    if (!btn) return;
    const idx = btn.getAttribute('data-blog-idx');
    const blog = window.blogs[idx];
    if (!blog) return;
    // Fill modal
    modal.querySelector('.blog-post-image img').src = blog.image;
    modal.querySelector('.blog-post-image img').alt = blog.title;
    modal.querySelector('h2.blog-title').textContent = blog.title;
    modal.querySelector('.post-content').innerHTML = blog.content.replace(/\n/g, '<br>');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  modal.querySelector('.blog-modal-close').onclick = function() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };
  // Close modal on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  // Close modal on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});