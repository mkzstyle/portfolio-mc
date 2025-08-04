const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

class CrosshairCursor {
    constructor() {
        this.crosshair = document.getElementById('crosshair')
        this.isEnabled = window.innerWidth > 768 && !this.isTouchDevice()
        
        if (this.isEnabled) {
            this.init()
        }
    }

    isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0))
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            if (this.crosshair) {
                this.crosshair.style.left = e.clientX + 'px'
                this.crosshair.style.top = e.clientY + 'px'
            }
        })

        document.addEventListener('mouseleave', () => {
            if (this.crosshair) {
                this.crosshair.style.opacity = '0'
            }
        })

        document.addEventListener('mouseenter', () => {
            if (this.crosshair) {
                this.crosshair.style.opacity = '1'
            }
        })
    }

    disable() {
        if (this.crosshair) {
            this.crosshair.style.display = 'none'
            document.body.style.cursor = 'auto'
        }
    }
}

class MobileNavigation {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle')
        this.navMenu = document.getElementById('nav-menu')
        this.navLinks = document.querySelectorAll('.nav-link')
        
        this.init()
    }

    init() {
        if (this.navToggle) {
            this.navToggle.addEventListener('click', (e) => {
                e.preventDefault()
                this.toggleMenu()
            })
        }

        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu()
            })
        })

        document.addEventListener('click', (e) => {
            if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu()
            }
        })

        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768) {
                this.closeMenu()
            }
        }, 250))
    }

    toggleMenu() {
        this.navMenu.classList.toggle('active')
        this.navToggle.classList.toggle('active')
        
        if (this.navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
    }

    closeMenu() {
        this.navMenu.classList.remove('active')
        this.navToggle.classList.remove('active')
        document.body.style.overflow = 'auto'
    }
}

class SmoothScrolling {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault()
                const targetId = anchor.getAttribute('href').substring(1)
                const targetElement = document.getElementById(targetId)
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight
                    const targetPosition = targetElement.offsetTop - headerHeight - 20
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    })
                }
            })
        })
    }
}

class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.skill-card, .project-card, .contact-item')
        this.observer = null
        this.init()
    }

    init() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1'
                    entry.target.style.transform = 'translateY(0)'
                }
            })
        }, observerOptions)

        this.elements.forEach(element => {
            element.style.opacity = '0'
            element.style.transform = 'translateY(30px)'
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease'
            this.observer.observe(element)
        })
    }
}

class ContactForm {
    constructor() {
        this.form = document.getElementById('contact-form')
        this.init()
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault()
                this.handleSubmit()
            })
        }
    }

    async handleSubmit() {
        const formData = new FormData(this.form)
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        }

        if (!this.validateForm(data)) {
            return
        }

        const submitButton = this.form.querySelector('button[type="submit"]')
        const originalText = submitButton.textContent
        submitButton.textContent = 'Sending...'
        submitButton.disabled = true

        try {
            await this.simulateSubmission(data)
            this.showMessage('Thanks for your message! I\'ll get back to you soon. 🎮', 'success')
            this.form.reset()
        } catch (error) {
            this.showMessage('Oops! Something went wrong. Please try again. 😅', 'error')
        } finally {
            submitButton.textContent = originalText
            submitButton.disabled = false
        }
    }

    validateForm(data) {
        const errors = []

        if (!data.name || data.name.trim().length < 2) {
            errors.push('Please enter a valid name')
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address')
        }

        if (!data.message || data.message.trim().length < 10) {
            errors.push('Please enter a message with at least 10 characters')
        }

        if (errors.length > 0) {
            this.showMessage(errors.join('. '), 'error')
            return false
        }

        return true
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    async simulateSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data)
                resolve()
            }, 1500)
        })
    }

    showMessage(message, type) {
        const existingMessage = document.querySelector('.form-message')
        if (existingMessage) {
            existingMessage.remove()
        }

        const messageElement = document.createElement('div')
        messageElement.className = `form-message form-message-${type}`
        messageElement.textContent = message
        
        Object.assign(messageElement.style, {
            padding: '1rem',
            marginTop: '1rem',
            border: '3px solid #2c3e2d',
            backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
            color: type === 'success' ? '#155724' : '#721c24',
            fontWeight: '700',
            textAlign: 'center',
            boxShadow: 'inset 2px 2px 0px rgba(255, 255, 255, 0.3), inset -2px -2px 0px rgba(0, 0, 0, 0.1)'
        })

        this.form.appendChild(messageElement)

        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove()
            }
        }, 5000)
    }
}

class InteractiveElements {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll('.menkrep-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.createClickEffect(e.target, e)
            })
        })

        document.querySelectorAll('.menkrep-btn, .skill-card, .project-card').forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.simulateHoverEffect(element)
            })
        })
    }

    createClickEffect(element, event) {
        const ripple = document.createElement('span')
        const rect = element.getBoundingClientRect()
        const size = 60
        const x = event.clientX - rect.left - size / 2
        const y = event.clientY - rect.top - size / 2

        ripple.style.cssText = `
            position: absolute
            width: ${size}px
            height: ${size}px
            left: ${x}px
            top: ${y}px
            background: rgba(255, 255, 255, 0.6)
            border-radius: 50%
            transform: scale(0)
            animation: ripple 0.6s linear
            pointer-events: none
        `

        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style')
            style.id = 'ripple-styles'
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4)
                        opacity: 0
                    }
                }
            `
            document.head.appendChild(style)
        }

        element.style.position = 'relative'
        element.style.overflow = 'hidden'
        element.appendChild(ripple)

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove()
            }
        }, 600)
    }

    simulateHoverEffect(element) {
        element.style.transition = 'all 0.3s ease'
        element.style.filter = 'brightness(1.05)'
        
        setTimeout(() => {
            element.style.filter = ''
        }, 300)
    }
}

class PerformanceOptimizer {
    constructor() {
        this.init()
    }

    init() {
        this.setupLazyLoading()
        this.optimizeScrollEvents()
        this.preloadResources()
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]')
        
        if (images.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target
                        img.src = img.dataset.src
                        img.removeAttribute('data-src')
                        imageObserver.unobserve(img)
                    }
                })
            })

            images.forEach(img => imageObserver.observe(img))
        }
    }

    optimizeScrollEvents() {
        let ticking = false

        const updateScrollEffects = () => {
            const header = document.querySelector('.header')
            if (header) {
                const scrollY = window.scrollY
                if (scrollY > 100) {
                    header.style.background = 'rgba(34, 49, 35, 0.98)'
                } else {
                    header.style.background = 'rgba(34, 49, 35, 0.95)'
                }
            }
            ticking = false
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects)
                ticking = true
            }
        })
    }

    preloadResources() {
        const fontUrls = [
            'https://fonts.googleapis.com/css2?family=Orbitron:wght@400700900&display=swap'
        ]

        fontUrls.forEach(url => {
            const link = document.createElement('link')
            link.rel = 'preload'
            link.as = 'style'
            link.href = url
            document.head.appendChild(link)
        })
    }
}

class AccessibilityEnhancements {
    constructor() {
        this.init()
    }

    init() {
        this.setupKeyboardNavigation()
        this.setupFocusManagement()
        this.setupAriaLabels()
        this.handleReducedMotion()
    }

    setupKeyboardNavigation() {
        document.querySelectorAll('.menkrep-btn').forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    button.click()
                }
            })
        })

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const mobileNav = new MobileNavigation()
                mobileNav.closeMenu()
            }
        })
    }

    setupFocusManagement() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav')
            }
        })

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav')
        })
    }

    setupAriaLabels() {
        const navToggle = document.getElementById('nav-toggle')
        if (navToggle) {
            navToggle.setAttribute('aria-label', 'Toggle navigation menu')
            navToggle.setAttribute('aria-expanded', 'false')
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = mutation.target.classList.contains('active')
                    navToggle.setAttribute('aria-expanded', isActive.toString())
                }
            })
        })

        const navMenu = document.getElementById('nav-menu')
        if (navMenu) {
            observer.observe(navMenu, { attributes: true })
        }
    }

    handleReducedMotion() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style')
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important
                    animation-iteration-count: 1 !important
                    transition-duration: 0.01ms !important
                }
            `
            document.head.appendChild(style)
        }
    }
}

class MinecraftPortfolio {
    constructor() {
        this.components = []
        this.init()
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents()
            })
        } else {
            this.initializeComponents()
        }
    }

    initializeComponents() {
        try {
            this.components.push(new CrosshairCursor())
            this.components.push(new MobileNavigation())
            this.components.push(new SmoothScrolling())
            this.components.push(new ScrollAnimations())
            this.components.push(new ContactForm())
            this.components.push(new InteractiveElements())
            this.components.push(new PerformanceOptimizer())
            this.components.push(new AccessibilityEnhancements())

            console.log('🎮 Minecraft Portfolio initialized successfully!')
            
            if (this.isDevelopment()) {
                this.addDevelopmentHelpers()
            }
        } catch (error) {
            console.error('Error initializing portfolio:', error)
        }
    }

    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.port !== ''
    }

    addDevelopmentHelpers() {
        window.portfolio = {
            components: this.components,
            reload: () => window.location.reload(),
            toggleCrosshair: () => {
                const crosshair = document.getElementById('crosshair')
                if (crosshair) {
                    crosshair.style.display = crosshair.style.display === 'none' ? 'block' : 'none'
                }
            }
        }

        console.log('🔧 Development helpers available via window.portfolio')
    }
}

new MinecraftPortfolio()