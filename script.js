document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // Theme Toggle Logic
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');
    const bodyElement = document.body;

    // Check system preferences or local storage
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        bodyElement.classList.replace('dark-theme', 'light-theme');
    } else {
        bodyElement.classList.add('dark-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-theme')) {
            bodyElement.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            bodyElement.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // ----------------------------------------------------
    // Mobile Navigation Menu Toggle
    // ----------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('overflow-hidden');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // ----------------------------------------------------
    // Scroll Progress Indicator & Header Scroll Styling
    // ----------------------------------------------------
    const scrollProgress = document.getElementById('scrollProgress');
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Progress Bar
        scrollProgress.style.width = `${scrollPercent}%`;

        // Sticky Header effect
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (scrollTop > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ----------------------------------------------------
    // Interactive Timeline Accordion
    // ----------------------------------------------------
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        const header = item.querySelector('.timeline-header');
        header.addEventListener('click', () => {
            // Close other timeline items if you want accordion effect,
            // or just toggle the clicked one. Let's toggle the clicked one.
            const isActive = item.classList.contains('active');
            
            // To close others, uncomment these:
            // timelineItems.forEach(i => i.classList.remove('active'));
            
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------
    // Scroll Reveal & Active Navigation link tracking
    // ----------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    const sections = document.querySelectorAll('section');
    const skillBars = document.querySelectorAll('.skill-bar');

    const revealOnScroll = () => {
        const triggerBottom = (window.innerHeight / 5) * 4;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('revealed');
                
                // If it contains skill bars, animate their loading width
                if (element.classList.contains('skills-layout')) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                }
            }
        });
    };

    const trackActiveLink = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200; // Offset for header trigger

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', () => {
        revealOnScroll();
        trackActiveLink();
    });

    // Initial triggers on load
    revealOnScroll();
    trackActiveLink();

    // ----------------------------------------------------
    // Contact Form Validation & Submission mockup
    // ----------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formSuccessBox = document.getElementById('formSuccess');

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formName = document.getElementById('formName');
        const formEmail = document.getElementById('formEmail');
        const formSubject = document.getElementById('formSubject');
        const formMessage = document.getElementById('formMessage');

        let isValid = true;

        // Reset previous validation styles
        document.querySelectorAll('.form-group').forEach(grp => grp.classList.remove('invalid'));

        if (!formName.value.trim()) {
            formName.parentElement.classList.add('invalid');
            isValid = false;
        }

        if (!formEmail.value.trim() || !validateEmail(formEmail.value.trim())) {
            formEmail.parentElement.classList.add('invalid');
            isValid = false;
        }

        if (!formSubject.value.trim()) {
            formSubject.parentElement.classList.add('invalid');
            isValid = false;
        }

        if (!formMessage.value.trim()) {
            formMessage.parentElement.classList.add('invalid');
            isValid = false;
        }

        if (isValid) {
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            const telegramToken = '8868299085:AAEIGcZGW3ytB8GE4je23a1h_2kNJMbazCE';
            const chatId = '6037543552';

            const escapeHTML = (str) => {
                return str.replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;');
            };

            const textMessage = `<b>📬 New Message from Portfolio</b>\n\n` +
                                `<b>👤 Name:</b> ${escapeHTML(formName.value.trim())}\n` +
                                `<b>📧 Email:</b> ${escapeHTML(formEmail.value.trim())}\n` +
                                `<b>📝 Subject:</b> ${escapeHTML(formSubject.value.trim())}\n\n` +
                                `<b>💬 Message:</b>\n${escapeHTML(formMessage.value.trim())}`;

            fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: textMessage,
                    parse_mode: 'HTML'
                })
            })
            .then(response => {
                if (response.ok) {
                    contactForm.style.display = 'none';
                    formSuccessBox.style.display = 'flex';
                    contactForm.reset();
                } else {
                    alert('Failed to send message. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error sending message to Telegram:', error);
                alert('An error occurred. Please check your connection and try again.');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        }
    });
});
