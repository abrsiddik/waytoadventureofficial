 const form = document.getElementById('contactForm');
        const successMessage = document.getElementById('successMessage');
        const errorMessage = document.getElementById('errorMessage');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('.submit-btn');
            
            // Hide any previous messages
            successMessage.style.display = 'none';
            errorMessage.style.display = 'none';
            
            // Show loading state
            submitBtn.textContent = '✈️ Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const data = await response.json();
                    
                    if (data.success) {
                        successMessage.style.display = 'block';
                        form.reset();
                        // Scroll to success message
                        successMessage.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        throw new Error(data.message || 'Form submission failed');
                    }
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                errorMessage.style.display = 'block';
                errorMessage.textContent = 'Thanks for contacting with us we will reply as soon as possible!';
                // Scroll to error message
                errorMessage.scrollIntoView({ behavior: 'smooth' });
            } finally {
                // Reset button
                submitBtn.textContent = '✈️ Send Message';
                submitBtn.disabled = false;
            }
        });

        // Add smooth animations to form elements
        const formElements = document.querySelectorAll('input, select, textarea');
        formElements.forEach(element => {
            element.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            element.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });