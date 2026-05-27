// Gallery functionality
class Gallery {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFilters();
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
            const category = item.dataset.category;
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
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