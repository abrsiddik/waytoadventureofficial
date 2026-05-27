document.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('all-video-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Function to strip HTML tags for character counting
  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  window.videos.forEach((video, index) => {
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
}); 