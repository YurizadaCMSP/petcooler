// Script principal para o website PETCool

document.addEventListener('DOMContentLoaded', function() {
    // Manipulação do menu móvel
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });

    // Navegação suave para os links de âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Animação de contadores
    const counters = document.querySelectorAll('.counter');
    const counterSpeed = 200; // Velocidade da animação em milissegundos

    const animateCounter = (counter) => {
        const target = +counter.dataset.target;
        let count = 0;
        const increment = target / (counterSpeed / 16); // 60fps

        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 16);
            } else {
                counter.innerText = target;
            }
        };

        updateCount();
    };

    // Observador de interseção para iniciar a animação quando visível
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Animação de elementos ao rolar a página
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Galeria de imagens com modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            modalImage.src = imgSrc;
            galleryModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Impede o scroll quando o modal está aberto
        });
    });

    closeModal.addEventListener('click', function() {
        galleryModal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Permite o scroll novamente
    });

    // Fechar modal ao clicar fora da imagem
    galleryModal.addEventListener('click', function(e) {
        if (e.target === galleryModal) {
            galleryModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // Fechar modal com tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !galleryModal.classList.contains('hidden')) {
            galleryModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
    });

    // Validação de formulário de contato
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            let valid = true;
            
            if (!name.value.trim()) {
                valid = false;
                highlightInvalidField(name);
            } else {
                removeInvalidHighlight(name);
            }
            
            if (!validateEmail(email.value)) {
                valid = false;
                highlightInvalidField(email);
            } else {
                removeInvalidHighlight(email);
            }
            
            if (!message.value.trim()) {
                valid = false;
                highlightInvalidField(message);
            } else {
                removeInvalidHighlight(message);
            }
            
            if (valid) {
                // Aqui seria implementado o envio do formulário para o backend
                // Por enquanto apenas simulamos uma resposta
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Enviando...';
                
                setTimeout(() => {
                    // Simula resposta do servidor
                    submitButton.innerHTML = '<i class="fas fa-check mr-2"></i> Mensagem Enviada!';
                    submitButton.classList.remove('bg-eco-green');
                    submitButton.classList.add('bg-green-600');
                    
                    // Limpa o formulário
                    contactForm.reset();
                    
                    // Restaura o botão após 3 segundos
                    setTimeout(() => {
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                        submitButton.classList.remove('bg-green-600');
                        submitButton.classList.add('bg-eco-green');
                    }, 3000);
                }, 1500);
            }
        });
    }

    // Funções auxiliares para validação
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function highlightInvalidField(field) {
        field.classList.add('border-red-500');
        field.classList.add('bg-red-50');
        
        // Adiciona mensagem de erro se ainda não existir
        const errorId = field.id + '-error';
        if (!document.getElementById(errorId)) {
            const errorMsg = document.createElement('p');
            errorMsg.id = errorId;
            errorMsg.classList.add('text-red-500', 'text-xs', 'mt-1');
            errorMsg.innerText = 'Este campo é obrigatório';
            field.parentNode.appendChild(errorMsg);
        }
    }

    function removeInvalidHighlight(field) {
        field.classList.remove('border-red-500');
        field.classList.remove('bg-red-50');
        
        // Remove mensagem de erro se existir
        const errorId = field.id + '-error';
        const errorMsg = document.getElementById(errorId);
        if (errorMsg) {
            errorMsg.remove();
        }
    }

    // Efeito parallax suave para seções de destaque
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(element => {
            const position = window.pageYOffset;
            const rate = position * 0.3;
            element.style.transform = 'translateY(' + rate + 'px)';
        });
    });

    // Inicializa tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.dataset.tooltip;
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip', 'absolute', 'bg-eco-dark', 'text-white', 'px-3', 'py-2', 'rounded', 'text-sm', 'z-50');
            tooltip.innerText = tooltipText;
            
            document.body.appendChild(tooltip);
            
            // Posiciona o tooltip
            const rect = this.getBoundingClientRect();
            tooltip.style.top = rect.bottom + 10 + 'px';
            tooltip.style.left = rect.left + (rect.width/2) - (tooltip.offsetWidth/2) + 'px';
            
            // Adiciona seta
            const arrow = document.createElement('div');
            arrow.classList.add('arrow', 'absolute', 'w-3', 'h-3', 'bg-eco-dark', '-top-1', 'left-1/2', '-ml-1.5', 'transform', 'rotate-45');
            tooltip.appendChild(arrow);
            
            // Anima entrada
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            tooltip.style.transition = 'opacity 0.3s, transform 0.3s';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 10);
            
            // Guarda referência para remoção
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.style.opacity = '0';
                this.tooltip.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    if (this.tooltip) {
                        this.tooltip.remove();
                        this.tooltip = null;
                    }
                }, 300);
            }
        });
    });
});

// Tema claro/escuro (para futuras implementações)
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
}

// Verificar preferência salva
if (localStorage.getItem('darkMode') === 'true' || 
    (localStorage.getItem('darkMode') === null && 
     window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
}
