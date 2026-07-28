/* ============================================
   SALMAN REHMAN - PORTFOLIO SCRIPTS
   All 59 Features Interactive Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ===== #25 Loader / Spinner =====
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        loader.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        initAnimations();
        typewrite();
    }, 1500);

    // ===== #36 Scroll Progress Indicator =====
    const scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });

    // ===== #8 Sidebar Toggle =====
    const sidebar = document.getElementById('sidebar');
    const hamburger = document.getElementById('hamburger');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
        sidebar.classList.toggle('open');
        hamburger.classList.toggle('active');
        sidebarOverlay.classList.toggle('show');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : 'auto';
    }

    hamburger.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // ===== #35 Active Link Highlight (Scroll Spy) =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === id) {
                        link.classList.add('active');
                        breadcrumbCurrent.textContent = link.querySelector('span').textContent;
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', updateActiveLink);

    // Close sidebar on nav link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                toggleSidebar();
            }
        });
    });

    // ===== #11 Theme Toggle =====
    const themeToggle = document.getElementById('themeToggle');
    const themeDropdown = document.getElementById('themeDropdown');
    const themeDropdownMenu = document.getElementById('themeDropdownMenu');
    const themeItems = document.querySelectorAll('.dropdown-item[data-theme]');

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        themeItems.forEach(item => {
            item.style.background = item.dataset.theme === theme ? 'var(--bg-tertiary)' : '';
        });
    }

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    });

    themeDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
        themeDropdown.classList.toggle('active');
        themeDropdownMenu.classList.toggle('show');
    });

    themeItems.forEach(item => {
        item.addEventListener('click', () => {
            setTheme(item.dataset.theme);
            themeDropdown.classList.remove('active');
            themeDropdownMenu.classList.remove('show');
        });
    });

    document.addEventListener('click', () => {
        themeDropdown.classList.remove('active');
        themeDropdownMenu.classList.remove('show');
    });

    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) setTheme(savedTheme);

    // ===== #16 Back to Top =====
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== #31 Floating Action Button =====
    const fabMain = document.getElementById('fabMain');
    const fabContainer = document.querySelector('.fab-container');
    fabMain.addEventListener('click', (e) => {
        e.stopPropagation();
        fabContainer.classList.toggle('active');
        fabMain.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!fabContainer.contains(e.target)) {
            fabContainer.classList.remove('active');
            fabMain.classList.remove('active');
        }
    });

    document.getElementById('fabEmail').addEventListener('click', () => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('fabCv').addEventListener('click', () => downloadCV());
    document.getElementById('fabCall').addEventListener('click', () => {
        showToast('info', 'Phone', 'Call me at +92 300 1234567');
    });

    // ===== CV Download =====
    function downloadCV() {
        showToast('success', 'CV Download', 'Your CV is being prepared for download!');
    }

    document.getElementById('heroDownloadCv')?.addEventListener('click', downloadCV);
    document.getElementById('aboutDownloadCv')?.addEventListener('click', downloadCV);
    document.getElementById('downloadCv')?.addEventListener('click', downloadCV);

    // ===== #14 Animated Counters =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        statNumbers.forEach(num => {
            const target = parseInt(num.dataset.target);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    num.textContent = target;
                    clearInterval(timer);
                } else {
                    num.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // ===== #15 Progress Bars =====
    const progressFills = document.querySelectorAll('.progress-fill');
    let skillsAnimated = false;

    function animateProgressBars() {
        if (skillsAnimated) return;
        skillsAnimated = true;
        progressFills.forEach(fill => {
            const width = fill.dataset.width;
            setTimeout(() => {
                fill.style.width = width + '%';
            }, 200);
        });
    }

    // ===== #13 Scroll Animations (Intersection Observer) =====
    function initAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');

                    if (entry.target.id === 'hero') {
                        animateCounters();
                    }
                    if (entry.target.id === 'skills') {
                        animateProgressBars();
                    }
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.section, .hero-section').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });

        document.querySelectorAll('.project-card, .service-card').forEach((el, i) => {
            el.classList.add('fade-in');
            el.style.transitionDelay = (i * 0.1) + 's';
            observer.observe(el);
        });
    }

    // ===== #59 Typewriter Effect =====
    const typewriterEl = document.getElementById('typewriter');
    const typewriterWords = ['Web Developer', 'UI/UX Designer', 'React Developer', 'Node.js Developer', 'Freelancer'];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function typewrite() {
        const currentWord = typewriterWords[wordIndex];
        if (isDeleting) {
            typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typewriterWords.length;
            speed = 500;
        }

        setTimeout(typewrite, speed);
    }

    // ===== #20 Tabs =====
    document.querySelectorAll('.tab-list').forEach(tabList => {
        const tabs = tabList.querySelectorAll('.tab-btn');
        const tabContainer = tabList.parentElement;

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                tabContainer.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                });

                const targetId = 'tab-' + tab.dataset.tab;
                const targetPane = document.getElementById(targetId);
                if (targetPane) targetPane.classList.add('active');
            });
        });
    });

    // ===== #19 Accordion =====
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isOpen = item.classList.contains('active');

            // Close all
            document.querySelectorAll('.accordion-item').forEach(ai => {
                ai.classList.remove('active');
                ai.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                ai.querySelector('.accordion-content').style.maxHeight = '0';
            });

            if (!isOpen) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // ===== #21 Multi-step Form =====
    const contactForm = document.getElementById('contactForm');
    const formSteps = contactForm.querySelectorAll('.form-step');
    const stepperSteps = document.querySelectorAll('#contactStepper .step');
    let currentStep = 1;

    function goToStep(step) {
        formSteps.forEach(fs => fs.classList.remove('active'));
        stepperSteps.forEach((ss, i) => {
            ss.classList.remove('active', 'completed');
            if (i + 1 < step) ss.classList.add('completed');
            if (i + 1 === step) ss.classList.add('active');
        });

        const targetStep = contactForm.querySelector(`.form-step[data-step="${step}"]`);
        if (targetStep) targetStep.classList.add('active');
        currentStep = step;
    }

    contactForm.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        });
    });

    contactForm.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    // ===== #54 Form Validation =====
    function validateStep(step) {
        const stepEl = contactForm.querySelector(`.form-step[data-step="${step}"]`);
        const inputs = stepEl.querySelectorAll('[required]');
        let valid = true;

        inputs.forEach(input => {
            const error = input.closest('.form-group').querySelector('.form-error');
            if (!input.value.trim()) {
                input.classList.add('error');
                if (error) error.textContent = 'This field is required';
                valid = false;
            } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                input.classList.add('error');
                if (error) error.textContent = 'Please enter a valid email';
                valid = false;
            } else {
                input.classList.remove('error');
                if (error) error.textContent = '';
            }
        });

        if (!valid) {
            showToast('error', 'Validation Error', 'Please fill in all required fields');
        }
        return valid;
    }

    // Real-time validation
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('error');
                const error = input.closest('.form-group')?.querySelector('.form-error');
                if (error) error.textContent = 'This field is required';
            } else {
                input.classList.remove('error');
                const error = input.closest('.form-group')?.querySelector('.form-error');
                if (error) error.textContent = '';
            }
        });
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const error = input.closest('.form-group')?.querySelector('.form-error');
            if (error) error.textContent = '';
        });
    });

    // ===== #55 Form Auto-Save =====
    function autoSave() {
        contactForm.querySelectorAll('[data-autosave]').forEach(input => {
            const key = input.dataset.autosave;
            const saved = localStorage.getItem('portfolio-' + key);
            if (saved) input.value = saved;

            input.addEventListener('input', () => {
                localStorage.setItem('portfolio-' + key, input.value);
            });
        });
    }
    autoSave();

    // Form Submit - Brevo API
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        btnText.hidden = true;
        btnLoader.hidden = false;
        submitBtn.disabled = true;

        try {
            const formData = {
                name: document.getElementById('contactName').value.trim(),
                email: document.getElementById('contactEmail').value.trim(),
                phone: document.getElementById('contactPhone').value.trim(),
                phoneCode: document.getElementById('phoneCode').value,
                subject: document.getElementById('contactSubject').value,
                budget: document.querySelector('input[name="budget"]:checked')?.value || '',
                services: Array.from(document.querySelectorAll('input[name="services"]:checked')).map(cb => cb.value),
                deadline: document.getElementById('contactDeadline').value,
                message: document.getElementById('contactMessage').value.trim(),
                brandColor: document.getElementById('brandColor').value
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showToast('success', 'Message Sent!', 'Thank you for contacting me. I will get back to you soon.');
                goToStep(1);
                contactForm.reset();
                contactForm.querySelectorAll('[data-autosave]').forEach(input => {
                    localStorage.removeItem('portfolio-' + input.dataset.autosave);
                });
            } else {
                showToast('error', 'Error!', result.error || 'Something went wrong.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            showToast('error', 'Error!', 'Network error. Please try again.');
        } finally {
            btnText.hidden = false;
            btnLoader.hidden = true;
            submitBtn.disabled = false;
        }
    });

    // ===== #22 Project Sliders =====
    document.querySelectorAll('.project-slider').forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const dotsContainer = slider.querySelector('.slider-dots');
        let current = 0;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        function goToSlide(index) {
            current = index;
            track.style.transform = `translateX(-${current * 100}%)`;
            dotsContainer.querySelectorAll('.slider-dot').forEach((d, i) => {
                d.classList.toggle('active', i === current);
            });
        }

        prevBtn.addEventListener('click', () => {
            goToSlide(current === 0 ? slides.length - 1 : current - 1);
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(current === slides.length - 1 ? 0 : current + 1);
        });

        // Auto slide with pause on hover
        let slideInterval = setInterval(() => {
            goToSlide(current === slides.length - 1 ? 0 : current + 1);
        }, 4000);

        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                goToSlide(current === slides.length - 1 ? 0 : current + 1);
            }, 4000);
        });
    });

    // ===== Testimonials Carousel =====
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const testimonialPrev = document.getElementById('testimonialPrev');
    const testimonialNext = document.getElementById('testimonialNext');
    const testimonialDots = document.getElementById('testimonialDots');
    let testimonialIndex = 0;

    // Create dots
    testimonialCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(i));
        testimonialDots.appendChild(dot);
    });

    function goToTestimonial(index) {
        testimonialIndex = index;
        testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
        testimonialDots.querySelectorAll('.carousel-dot').forEach((d, i) => {
            d.classList.toggle('active', i === testimonialIndex);
        });
    }

    testimonialPrev.addEventListener('click', () => {
        goToTestimonial(testimonialIndex === 0 ? testimonialCards.length - 1 : testimonialIndex - 1);
    });

    testimonialNext.addEventListener('click', () => {
        goToTestimonial(testimonialIndex === testimonialCards.length - 1 ? 0 : testimonialIndex + 1);
    });

    // Auto slide testimonials with pause on hover
    const testimonialSection = document.querySelector('.testimonials-carousel') || testimonialTrack?.parentElement;
    let testimonialInterval = setInterval(() => {
        goToTestimonial(testimonialIndex === testimonialCards.length - 1 ? 0 : testimonialIndex + 1);
    }, 5000);

    if (testimonialSection) {
        testimonialSection.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
        testimonialSection.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                goToTestimonial(testimonialIndex === testimonialCards.length - 1 ? 0 : testimonialIndex + 1);
            }, 5000);
        });
    }

    // ===== #38 Pagination =====
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return;
            pageBtns.forEach(b => b.classList.remove('active'));
            if (btn.dataset.page !== 'prev' && btn.dataset.page !== 'next') {
                btn.classList.add('active');
                showToast('info', 'Page ' + btn.dataset.page, 'Loading projects...');
            }
        });
    });

    // ===== #17 Modal =====
    const authModal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const modalClose = document.getElementById('modalClose');

    loginBtn.addEventListener('click', () => {
        authModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    modalClose.addEventListener('click', closeModal);

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeModal();
    });

    function closeModal() {
        authModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // ===== Auth Forms =====
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            showToast('error', 'Error', 'Email aur password dono zaroori hain');
            return;
        }

        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (data.success && data.token) {
                localStorage.setItem('portfolio-token', data.token);
                localStorage.setItem('portfolio-logged-in', 'true');
                localStorage.setItem('portfolio-user-email', email);
                localStorage.setItem('portfolio-user-name', data.user.name);
                showToast('success', 'Login Successful', `Welcome back, ${data.user.name}!`);
                closeModal();
                updateAuthUI(true, data.user.name);
            } else if (data.status === 'pending') {
                showToast('info', 'Request Pending', 'Aapka account approved nahi hua. Owner ka wait karein.');
            } else if (data.status === 'denied') {
                showToast('error', 'Access Denied', 'Aapka access deny ho chuka hai.');
            } else {
                showToast('error', 'Login Failed', data.error || 'Login nahi ho paya.');
            }
        } catch (err) {
            showToast('error', 'Error', 'Network error. Please try again.');
        } finally {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const pw = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;

        if (pw !== confirm) {
            showToast('error', 'Error', 'Passwords do not match');
            return;
        }
        if (!document.getElementById('signupTerms').checked) {
            showToast('error', 'Error', 'Please agree to Terms & Conditions');
            return;
        }

        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const origText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: pw })
            });
            const data = await res.json();

            if (data.status === 'pending') {
                showToast('info', 'Account Created', 'Owner ko email gaya hai. Approval ke baad login kar sakte hain.');
                closeModal();
            } else if (data.success) {
                showToast('success', 'Welcome!', data.message);
                closeModal();
            } else {
                showToast('error', 'Error', data.error || 'Account nahi ban paya.');
            }
        } catch (err) {
            showToast('error', 'Error', 'Network error. Please try again.');
        } finally {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
        }
    });

    // Update auth UI based on login state
    function updateAuthUI(isLoggedIn, userName) {
        const loginBtn = document.getElementById('loginBtn');
        if (isLoggedIn) {
            loginBtn.innerHTML = `<i data-lucide="user"></i> ${userName || 'Logged In'}`;
            loginBtn.classList.remove('btn-primary');
            loginBtn.classList.add('btn-outline');
        } else {
            loginBtn.innerHTML = `<i data-lucide="log-in"></i> Login`;
            loginBtn.classList.add('btn-primary');
            loginBtn.classList.remove('btn-outline');
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // Check on page load if already logged in
    (function checkAuthState() {
        const token = localStorage.getItem('portfolio-token');
        const userName = localStorage.getItem('portfolio-user-name');
        if (token && userName) {
            updateAuthUI(true, userName);
        }
    })();

    // ===== #50 Show/Hide Password Toggle =====
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }
            lucide.createIcons();
        });
    });

    // ===== #51 Password Strength =====
    function checkPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    }

    function updateStrengthUI(input, strengthEl) {
        const password = input.value;
        const fill = strengthEl.querySelector('.strength-fill');
        const text = strengthEl.querySelector('.strength-text');

        if (!password) {
            fill.style.width = '0%';
            text.textContent = '';
            return;
        }

        const strength = checkPasswordStrength(password);
        const colors = ['', '#ef4444', '#f59e0b', '#06b6d4', '#10b981'];
        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const widths = ['0%', '25%', '50%', '75%', '100%'];

        fill.style.width = widths[strength];
        fill.style.background = colors[strength];
        text.textContent = labels[strength];
        text.style.color = colors[strength];
    }

    document.getElementById('loginPassword')?.addEventListener('input', function() {
        updateStrengthUI(this, document.getElementById('loginStrength'));
    });

    document.getElementById('signupPassword')?.addEventListener('input', function() {
        updateStrengthUI(this, document.getElementById('signupStrength'));
    });

    // ===== #52 Tag Input (Chips) =====
    const tagInputContainer = document.getElementById('interestTags');
    if (tagInputContainer) {
        const chipsContainer = tagInputContainer.querySelector('.tag-chips');
        const input = tagInputContainer.querySelector('.tag-input-field');
        const tags = [];

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                e.preventDefault();
                const value = input.value.trim();
                if (!tags.includes(value)) {
                    tags.push(value);
                    renderTags();
                }
                input.value = '';
            }
            if (e.key === 'Backspace' && !input.value && tags.length) {
                tags.pop();
                renderTags();
            }
        });

        tagInputContainer.addEventListener('click', () => input.focus());

        function renderTags() {
            chipsContainer.innerHTML = tags.map(tag =>
                `<span class="tag-chip">${tag}<button class="tag-chip-remove" data-tag="${tag}">&times;</button></span>`
            ).join('');

            chipsContainer.querySelectorAll('.tag-chip-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = tags.indexOf(btn.dataset.tag);
                    if (idx > -1) tags.splice(idx, 1);
                    renderTags();
                });
            });
        }
    }

    // ===== #53 File Upload with Drag & Drop =====
    const dropZone = document.getElementById('fileDropZone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadedFiles = [];

    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
        });

        function handleFiles(files) {
            Array.from(files).forEach(file => {
                if (file.size > 10 * 1024 * 1024) {
                    showToast('error', 'File Too Large', `${file.name} exceeds 10MB limit`);
                    return;
                }
                uploadedFiles.push(file);
            });
            renderFiles();
        }

        function renderFiles() {
            fileList.innerHTML = uploadedFiles.map((file, i) =>
                `<div class="file-item">
                    <span class="file-item-name"><i data-lucide="file"></i> ${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
                    <button class="file-remove" data-index="${i}"><i data-lucide="trash-2"></i></button>
                </div>`
            ).join('');
            lucide.createIcons();

            fileList.querySelectorAll('.file-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    uploadedFiles.splice(parseInt(btn.dataset.index), 1);
                    renderFiles();
                });
            });
        }
    }

    // ===== #46 Star Rating =====
    const starRating = document.getElementById('starRating');
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        let selectedRating = 0;

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const rating = parseInt(star.dataset.rating);
                stars.forEach(s => {
                    s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
                });
            });

            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
            });
        });

        starRating.addEventListener('mouseleave', () => {
            stars.forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.rating) <= selectedRating);
            });
        });
    }

    // ===== #47 Color Picker =====
    const colorPicker = document.getElementById('brandColor');
    const colorValue = document.getElementById('colorValue');
    if (colorPicker) {
        colorPicker.addEventListener('input', () => {
            colorValue.textContent = colorPicker.value;
        });
    }

    // ===== #49 OTP Input =====
    const otpDigits = document.querySelectorAll('.otp-digit');
    otpDigits.forEach((digit, index) => {
        digit.addEventListener('input', (e) => {
            if (e.target.value && index < otpDigits.length - 1) {
                otpDigits[index + 1].focus();
            }
        });

        digit.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpDigits[index - 1].focus();
            }
        });

        // Only allow numbers
        digit.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    });

    // ===== #57 Search with Autocomplete =====
    const searchInput = document.getElementById('searchInput');
    const autocompleteResults = document.getElementById('autocompleteResults');

    const searchableItems = [
        { section: 'hero', title: 'Home', icon: 'home' },
        { section: 'about', title: 'About Me', icon: 'user' },
        { section: 'skills', title: 'My Skills', icon: 'code-2' },
        { section: 'projects', title: 'Projects', icon: 'briefcase' },
        { section: 'services', title: 'Services', icon: 'settings' },
        { section: 'testimonials', title: 'Testimonials', icon: 'message-square' },
        { section: 'faq', title: 'FAQ', icon: 'help-circle' },
        { section: 'contact', title: 'Contact Me', icon: 'mail' },
    ];

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            autocompleteResults.classList.remove('show');
            return;
        }

        const filtered = searchableItems.filter(item =>
            item.title.toLowerCase().includes(query)
        );

        if (filtered.length) {
            autocompleteResults.innerHTML = filtered.map(item =>
                `<div class="autocomplete-item" data-section="${item.section}">
                    <i data-lucide="${item.icon}"></i> ${item.title}
                </div>`
            ).join('');
            autocompleteResults.classList.add('show');
            lucide.createIcons();

            autocompleteResults.querySelectorAll('.autocomplete-item').forEach(item => {
                item.addEventListener('click', () => {
                    document.getElementById(item.dataset.section)?.scrollIntoView({ behavior: 'smooth' });
                    searchInput.value = '';
                    autocompleteResults.classList.remove('show');
                });
            });
        } else {
            autocompleteResults.classList.remove('show');
        }
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => autocompleteResults.classList.remove('show'), 200);
    });

    // ===== #58 CAPTCHA =====
    const captchaQuestion = document.getElementById('captchaQuestion');
    const captchaInput = document.getElementById('captchaInput');
    const captchaBtn = document.getElementById('captchaBtn');
    let captchaAnswer = 0;

    function generateCaptcha() {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        captchaAnswer = a + b;
        captchaQuestion.textContent = `${a} + ${b} =`;
        captchaInput.value = '';
    }

    if (captchaBtn) {
        generateCaptcha();
        captchaBtn.addEventListener('click', () => {
            if (parseInt(captchaInput.value) === captchaAnswer) {
                showToast('success', 'Verified', 'CAPTCHA verified successfully!');
                generateCaptcha();
            } else {
                showToast('error', 'Failed', 'Incorrect answer. Try again.');
                generateCaptcha();
            }
        });
    }

    // ===== #23 Lightbox =====
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');

    const gradientColors = [
        'linear-gradient(135deg, #667eea, #764ba2)',
        'linear-gradient(135deg, #a18cd1, #fbc2eb)',
        'linear-gradient(135deg, #43e97b, #38f9d7)',
        'linear-gradient(135deg, #ff9a9e, #fecfef)',
        'linear-gradient(135deg, #ffecd2, #fcb69f)',
        'linear-gradient(135deg, #89f7fe, #66a6ff)',
    ];

    const projectNames = [
        'E-Commerce Platform',
        'Task Management App',
        'Fitness Tracker App',
        'Brand Identity Design',
        'Social Media Dashboard',
        'Food Delivery App',
    ];

    document.querySelectorAll('.project-lightbox').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.project);
            lightboxImage.style.background = gradientColors[index] || gradientColors[0];
            lightboxCaption.textContent = projectNames[index] || '';
            lightboxOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    document.getElementById('aboutLightbox')?.addEventListener('click', () => {
        lightboxImage.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        lightboxCaption.textContent = 'Salman Rehman - Web Developer';
        lightboxOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    document.getElementById('lightboxClose')?.addEventListener('click', closeLightbox);
    lightboxOverlay?.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });

    function closeLightbox() {
        lightboxOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // ===== #27 Toast Notifications =====
    const toastContainer = document.getElementById('toastContainer');

    function showToast(type, title, message) {
        const icons = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i data-lucide="${icons[type]}" class="toast-icon"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close"><i data-lucide="x"></i></button>
        `;

        toastContainer.appendChild(toast);
        lucide.createIcons({ nodes: [toast] });

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        });

        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // ===== #32 Shortcuts Panel (Ctrl+K) =====
    const shortcutsPanel = document.getElementById('shortcutsPanel');

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            shortcutsPanel.classList.toggle('show');
        }
        if (e.key === 'Escape') {
            shortcutsPanel.classList.remove('show');
            closeModal();
            closeLightbox();
        }
    });

    document.querySelectorAll('.shortcut-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.tagName === 'A') {
                const href = item.getAttribute('href');
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
            shortcutsPanel.classList.remove('show');
        });
    });

    document.addEventListener('click', (e) => {
        if (!shortcutsPanel.contains(e.target) && !e.ctrlKey) {
            shortcutsPanel.classList.remove('show');
        }
    });

    // ===== Hero Particles =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--primary);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Add float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); }
            25% { transform: translateY(-20px) translateX(10px); }
            50% { transform: translateY(-10px) translateX(-10px); }
            75% { transform: translateY(-30px) translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // ===== Show initial toast =====
    setTimeout(() => {
        showToast('info', 'Welcome!', 'Press Ctrl+K for quick navigation');
    }, 2500);

    // ===== #10 Custom 404 Page =====
    const page404 = document.getElementById('page404');
    const goHome404 = document.getElementById('goHome404');
    if (page404) {
        goHome404?.addEventListener('click', (e) => {
            e.preventDefault();
            page404.classList.remove('show');
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        });
        // Check for invalid hash targets
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1);
            if (hash && !document.getElementById(hash)) {
                page404.classList.add('show');
            } else {
                page404.classList.remove('show');
            }
        });
    }

    // ===== #45 Collapsible Sidebar =====
    const sidebarCollapseBtn = document.getElementById('sidebarCollapseBtn');
    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            const icon = sidebarCollapseBtn.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.classList.replace('chevrons-left', 'chevrons-right');
            } else {
                icon.classList.replace('chevrons-right', 'chevrons-left');
            }
        });
    }

    // ===== #46 Bottom Navigation (Mobile) =====
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item[data-section]');
    const bottomNavLogin = document.getElementById('bottomNavLogin');
    if (bottomNavLogin) {
        bottomNavLogin.addEventListener('click', (e) => {
            e.preventDefault();
            authModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Sync bottom nav with scroll
    window.addEventListener('scroll', () => {
        if (window.innerWidth > 480) return;
        const scrollY = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                bottomNavItems.forEach(item => {
                    item.classList.toggle('active', item.dataset.section === id);
                });
            }
        });
    });

    // Bottom nav click smooth scroll
    document.querySelectorAll('.bottom-nav-item[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(item.dataset.section);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== #80 Context Menu =====
    const contextMenu = document.getElementById('contextMenu');
    let selectedText = '';

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        selectedText = window.getSelection().toString();

        contextMenu.style.left = Math.min(e.clientX, window.innerWidth - 200) + 'px';
        contextMenu.style.top = Math.min(e.clientY, window.innerHeight - 180) + 'px';
        contextMenu.classList.add('show');
    });

    document.addEventListener('click', () => {
        contextMenu.classList.remove('show');
    });

    document.getElementById('ctxCopy')?.addEventListener('click', () => {
        if (selectedText) {
            navigator.clipboard.writeText(selectedText).then(() => {
                showToast('success', 'Copied', 'Text copied to clipboard');
            });
        } else {
            showToast('info', 'Info', 'No text selected');
        }
    });

    document.getElementById('ctxShare')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({ title: document.title, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                showToast('success', 'Link Copied', 'URL copied to clipboard');
            });
        }
    });

    document.getElementById('ctxPrint')?.addEventListener('click', () => window.print());

    document.getElementById('ctxScrollTop')?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== #68 Copy to Clipboard Buttons =====
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const text = btn.dataset.copy;
            navigator.clipboard.writeText(text).then(() => {
                showToast('success', 'Copied!', 'Project info copied to clipboard');
            }).catch(() => {
                showToast('error', 'Error', 'Could not copy text');
            });
        });
    });

    // ===== Image Preview Overlay =====
    const imagePreviewOverlay = document.getElementById('imagePreviewOverlay');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    const imagePreviewClose = document.getElementById('imagePreviewClose');

    document.querySelectorAll('.avatar img, .avatar-hero img, .about-image img').forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            imagePreviewImg.src = img.src;
            imagePreviewOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    imagePreviewClose?.addEventListener('click', () => {
        imagePreviewOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    });

    imagePreviewOverlay?.addEventListener('click', (e) => {
        if (e.target === imagePreviewOverlay) {
            imagePreviewOverlay.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    document.getElementById('previewDownload')?.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = imagePreviewImg.src;
        a.download = 'preview.jpg';
        a.click();
    });

    document.getElementById('previewShare')?.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({ title: 'Profile Photo', url: imagePreviewImg.src });
        } else {
            navigator.clipboard.writeText(imagePreviewImg.src).then(() => {
                showToast('success', 'Link Copied', 'Image URL copied');
            });
        }
    });

    // ===== #76 Lazy Load Images (Intersection Observer) =====
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window && lazyImages.length) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ===== #73 Debounced Search =====
    let searchDebounceTimer;
    searchInput?.removeEventListener('input', searchInput?._debouncedHandler);
    const debouncedSearchHandler = () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            // Search logic already runs on input, debounce adds a delay
        }, 300);
    };
    if (searchInput) {
        searchInput._debouncedHandler = debouncedSearchHandler;
    }

    // ===== #84 Touch Swipe Gestures =====
    function addSwipeListener(element, onSwipeLeft, onSwipeRight) {
        let startX = 0, startY = 0;
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) onSwipeLeft();
                else onSwipeRight();
            }
        }, { passive: true });
    }

    // Swipe on testimonials carousel
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    if (testimonialsCarousel) {
        addSwipeListener(
            testimonialsCarousel,
            () => goToTestimonial(testimonialIndex === testimonialCards.length - 1 ? 0 : testimonialIndex + 1),
            () => goToTestimonial(testimonialIndex === 0 ? testimonialCards.length - 1 : testimonialIndex - 1)
        );
    }

    // Swipe on project sliders
    document.querySelectorAll('.project-slider').forEach((slider, sliderIndex) => {
        const track = slider.querySelector('.slider-track');
        const slides = slider.querySelectorAll('.slide');
        let current = 0;

        function goToSlideSwipe(index) {
            current = index;
            track.style.transform = `translateX(-${current * 100}%)`;
        }

        addSwipeListener(
            slider,
            () => goToSlideSwipe(current === slides.length - 1 ? 0 : current + 1),
            () => goToSlideSwipe(current === 0 ? slides.length - 1 : current - 1)
        );
    });

    // ===== #77 Web Share API =====
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'Salman Rehman - Portfolio',
                    text: 'Check out this amazing portfolio website!',
                    url: window.location.href
                }).then(() => {
                    showToast('success', 'Shared', 'Thanks for sharing!');
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showToast('success', 'Link Copied', 'Portfolio URL copied to clipboard');
                });
            }
        });
    }

    // ===== #79 Keyboard Shortcuts (Enhanced) =====
    document.addEventListener('keydown', (e) => {
        // Ctrl+H = Home
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        }
        // Ctrl+P = Projects
        if ((e.ctrlKey || e.metaKey) && e.key === 'p' && !e.shiftKey) {
            e.preventDefault();
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }
        // Ctrl+M = Contact
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        }
        // Ctrl+D = Dark mode toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        }
        // / key = Focus search
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInput?.focus();
        }
    });

    // ===== #46 Floating Labels (auto-add to form groups) =====
    document.querySelectorAll('.form-group').forEach(group => {
        const input = group.querySelector('input:not([type="radio"]):not([type="checkbox"]):not([type="color"]):not([type="file"]):not(.otp-digit):not(.captcha-input):not(.tag-input-field):not(.password-toggle)');
        const select = group.querySelector('select');
        const textarea = group.querySelector('textarea');

        if (input && input.placeholder) {
            input.placeholder = ' ';
            group.classList.add('floating');
        }
        if (textarea && textarea.placeholder) {
            textarea.placeholder = ' ';
            group.classList.add('floating');
        }
    });

    // ===== Smooth Section Reveal on Scroll =====
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.05 });

    document.querySelectorAll('.section-header, .contact-card, .accordion-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ===== Custom Cursor Follower =====
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    if (cursorDot && cursorOutline && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        function animateCursorOutline() {
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;
            cursorOutline.style.left = outlineX + 'px';
            cursorOutline.style.top = outlineY + 'px';
            requestAnimationFrame(animateCursorOutline);
        }
        animateCursorOutline();

        document.querySelectorAll('a, button, .project-card, .flip-card, .tab-btn, .theme-toggle, .hamburger').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorOutline.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorOutline.classList.remove('hover');
            });
        });
    }

    // ===== 3D Tilt Effect on Project Cards =====
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});
