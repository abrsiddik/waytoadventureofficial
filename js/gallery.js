// Gallery functionality
class Gallery {
    constructor() {
        this.currentFilter = 'all';
        this.previewLimit = 6;
        this.isExpanded = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFilters();
        this.applyPendingFilter();
        this.filterGallery(this.currentFilter);
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.setActiveFilter(filter);
                this.filterGallery(filter);
            });
        });

        // Lightbox close
        const lightboxClose = document.getElementById('lightbox-close');
        const lightbox = document.getElementById('lightbox');
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => this.closeLightbox());
        }
        if (lightbox) {
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });
        }

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeLightbox();
        });

        const toggleBtn = document.getElementById('gallery-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                let firstHiddenMatch = null;
                if (!this.isExpanded) {
                    const matchedItems = Array.from(document.querySelectorAll('.gallery-item'))
                        .filter(item => item.dataset.matchesFilter !== '0');
                    firstHiddenMatch = matchedItems[this.previewLimit] || null;
                }

                this.isExpanded = !this.isExpanded;
                this.updateVisibleItems();

                if (firstHiddenMatch) {
                    setTimeout(() => {
                        firstHiddenMatch.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 80);
                }
            });
        }
    }

    setupFilters() {
        const filterContainer = document.querySelector('.gallery-filters');
        if (!filterContainer) return;

        // Add animation to filter buttons
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    setActiveFilter(filter) {
        this.currentFilter = filter;
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === filter) {
                btn.classList.add('active');
            }
        });
    }

    filterGallery(filter) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            const category = (item.dataset.category || '').toLowerCase();
            const tags = (item.dataset.tags || '').toLowerCase().split(/\s+/).filter(Boolean);

            const matches =
                filter === 'all' ||
                category === filter ||
                tags.includes(filter);

            item.dataset.matchesFilter = matches ? '1' : '0';
        });

        this.updateVisibleItems();
    }

    applyPendingFilter() {
        const pending = localStorage.getItem('pendingGalleryFilter');
        if (pending) {
            localStorage.removeItem('pendingGalleryFilter');
            this.setActiveFilter(pending);
            this.filterGallery(pending);
            this.isExpanded = true;
            this.updateVisibleItems();
        }
    }

    updateVisibleItems() {
        const items = Array.from(document.querySelectorAll('.gallery-item'));
        const matchedItems = items.filter(item => item.dataset.matchesFilter !== '0');

        matchedItems.forEach((item, index) => {
            const shouldShow = this.isExpanded || index < this.previewLimit;
            const wasHidden = item.style.display === 'none';
            item.style.display = shouldShow ? 'block' : 'none';

            // Animate only when new items become visible after expansion.
            if (shouldShow && wasHidden && this.isExpanded && index >= this.previewLimit) {
                item.classList.remove('reveal-animate');
                requestAnimationFrame(() => item.classList.add('reveal-animate'));
                setTimeout(() => item.classList.remove('reveal-animate'), 700);
            }
        });

        items
            .filter(item => item.dataset.matchesFilter === '0')
            .forEach(item => {
                item.style.display = 'none';
            });

        this.updateToggleButton(matchedItems.length);
    }

    updateToggleButton(totalMatching) {
        const toggleBtn = document.getElementById('gallery-toggle-btn');
        if (!toggleBtn) return;

        if (totalMatching <= this.previewLimit) {
            toggleBtn.style.display = 'none';
            return;
        }

        toggleBtn.style.display = 'inline-flex';
        toggleBtn.textContent = this.isExpanded ? 'Show Fewer Photos' : 'View More Photos';
    }

    openLightbox(lightboxId) {
        const image = window.images.find(img => img.lightboxId === lightboxId);
        if (!image) return;

        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');

        if (lightboxImage) {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
        }
        
        if (lightboxCaption) {
            lightboxCaption.innerHTML = `
                <h3>${image.title}</h3>
                <p>${image.location}</p>
            `;
        }

        if (lightbox) {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gallery = new Gallery();
}); 