// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Animate Skills Progress Bars
const animateSkills = () => {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
};

// Intersection Observer for Skills Animation
const skillsSection = document.querySelector('.skills');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Scroll to Top Button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Create alert message
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.5s ease;
        font-family: 'Cairo', sans-serif;
    `;
    alertDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
            <div>
                <strong>تم الإرسال بنجاح!</strong>
                <p style="margin: 5px 0 0 0; font-size: 0.9rem;">شكراً ${name}، سأتواصل معك قريباً</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 500);
    }, 5000);
    
    // Reset form
    contactForm.reset();
    
    // Log form data (in real application, send to server)
    console.log('Form Data:', { name, email, subject, message });
});

// Add CSS animations for alert
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth Scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add fade-in animation to sections on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in to all sections except hero
document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    sectionObserver.observe(section);
});

// Typing Effect for Hero Title (Optional Enhancement)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    // Start typing effect after page load
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 500);
    });
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Counter animation for statistics (if needed in future)
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
};

// Add hover effect to cards
const cards = document.querySelectorAll('.experience-card, .cert-card, .language-card, .hobby-item');
cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// Print CV functionality (optional)
const addPrintButton = () => {
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        const printBtn = document.createElement('a');
        printBtn.href = '#';
        printBtn.className = 'btn btn-secondary';
        printBtn.innerHTML = '<i class="fas fa-download"></i> تحميل السيرة الذاتية';
        printBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
        // Uncomment to add print button
        // heroButtons.appendChild(printBtn);
    }
};

// Initialize all functions
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully!');
    console.log('Developer: Samer Al-Abed');
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Easter egg - Console message
console.log('%c مرحباً بك في موقعي الشخصي! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c تم تطويره بواسطة: سامر العابد ', 'color: #2563eb; font-size: 14px; font-weight: bold;');
console.log('%c 📧 samer.alabed@example.com ', 'color: #64748b; font-size: 12px;');
