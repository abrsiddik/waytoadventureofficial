document.addEventListener('DOMContentLoaded', function() {
  const grid = document.getElementById('all-video-grid');
  if (!grid) return;
  grid.innerHTML = '';

  function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  function getYouTubeId(url) {
    if (!url) return '';
    const cleaned = String(url).replace('/embed//', '/embed/');
    const embedMatch = cleaned.match(/embed\/([^?&/]+)/i);
    if (embedMatch && embedMatch[1]) return embedMatch[1];
    const shortMatch = cleaned.match(/youtu\.be\/([^?&/]+)/i);
    if (shortMatch && shortMatch[1]) return shortMatch[1];
    const watchMatch = cleaned.match(/[?&]v=([^?&/]+)/i);
    if (watchMatch && watchMatch[1]) return watchMatch[1];
    return '';
  }

  window.videos.forEach((video, index) => {
    const plainText = stripHtml(video.desc);
    const shortDesc = plainText.length > 140 ? `${plainText.substring(0, 140)}...` : plainText;
    const videoId = getYouTubeId(video.src);
    const watchUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : video.src;
    const thumb = videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : 'https://i.ytimg.com/vi/mkI-UAugPuI/hqdefault.jpg';

    grid.innerHTML += `
      <article class="video-item video-card" data-video-index="${index}">
        <div class="video-thumb-wrap">
          <img class="video-thumb" src="${thumb}" alt="${video.title}" loading="lazy">
          <div class="video-thumb-overlay"></div>
          <a class="video-play-badge" href="${watchUrl}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${video.title} on YouTube">
            <i class="fas fa-play"></i>
          </a>
        </div>
        <div class="video-card-body">
          <h3>${video.title}</h3>
          <p class="video-card-desc">${shortDesc}</p>
          <a class="btn btn-primary video-watch-btn" href="${watchUrl}" target="_blank" rel="noopener noreferrer">
            Watch on YouTube
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </article>
    `;
  });
}); 