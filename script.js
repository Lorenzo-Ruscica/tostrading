document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================================
    // 1. NAVIGAZIONE & MENU
    // ============================================================
    
    // --- Effetto Vetro Navbar allo scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Menu Mobile (Hamburger) ---
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Cambio icona (da righe a X)
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Chiudi menu quando clicchi un link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            if(hamburger) {
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // --- Smooth Scroll (Link interni #) ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            // Se il link ha la classe 'js-close-link', non fare lo scroll qui (lo gestisce la logica modale)
            if (this.classList.contains('js-close-link')) return;

            const targetElement = document.querySelector(targetId);
            if(targetElement){
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // ============================================================
    // 2. ANIMAZIONI & INTERFACCIA
    // ============================================================

    // --- Animazione Ingresso Hero ---
    const heroSection = document.querySelector('.hero-section');
    setTimeout(() => {
        if(heroSection) heroSection.classList.add('hero-visible');
    }, 200);

    // --- Reveal allo Scroll (Intersection Observer) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    });
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // --- Accordion (Sezione Supporto) ---
    const accordions = document.querySelectorAll('.accordion-item');
    accordions.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            // Chiudi gli altri
            accordions.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-body').style.maxHeight = null;
                }
            });
            // Apri/Chiudi corrente
            item.classList.toggle('active');
            const body = item.querySelector('.accordion-body');
            if (item.classList.contains('active')) {
                body.style.maxHeight = body.scrollHeight + "px";
            } else {
                body.style.maxHeight = null;
            }
        });
    });

    // --- Side Navigation Scroll Spy ---
    const sideLinks = document.querySelectorAll('.side-link');
    const sections = document.querySelectorAll('section');

    function changeLinkState() {
        if(sections.length === 0) return;
        
        let index = sections.length;
        while(--index && window.scrollY + 300 < sections[index].offsetTop) {}
        
        sideLinks.forEach((link) => link.classList.remove('active'));
        
        if(index >= 0) {
            const currentId = sections[index].id;
            const activeLink = document.querySelector(`.side-link[href="#${currentId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    if(sideLinks.length > 0) {
        window.addEventListener('scroll', changeLinkState);
        changeLinkState();
    }


    // ============================================================
    // 3. GESTIONE MODAL POPUP (Funzione Universale)
    // ============================================================
    function setupModalGroup(btnClass, modalId, specificCloseClass) {
        const modal = document.getElementById(modalId);
        const buttons = document.querySelectorAll('.' + btnClass);

        if (modal && buttons.length > 0) {
            
            // Cerca il tasto chiudi
            let btnClose = null;
            if (specificCloseClass) {
                let selector = specificCloseClass.startsWith('.') ? specificCloseClass : '.' + specificCloseClass;
                btnClose = modal.querySelector(selector);
            }
            if (!btnClose) {
                btnClose = modal.querySelector('.close-modal');
            }

            // APERTURA
            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            });

            // CHIUSURA (Tasto X)
            if (btnClose) {
                btnClose.addEventListener('click', () => {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                });
            }

            // CHIUSURA (Click Sfondo)
            window.addEventListener('click', (e) => {
                if (e.target == modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    // --- Inizializzazione Pop-up ---
    setupModalGroup('js-open-gold', 'modal-gold', '.close-modal'); 
    setupModalGroup('js-open-platinum', 'modal-platinum', '.close-platinum'); 
    setupModalGroup('js-open-gold-annual', 'modal-gold-annual');
    setupModalGroup('js-open-platinum-annual', 'modal-platinum-annual'); 
    setupModalGroup('js-open-tos-more', 'modal-tos-more');

    // --- Auto-Chiusura Modal al click su link interni ---
    const autoCloseLinks = document.querySelectorAll('.js-close-link');
    if (autoCloseLinks.length > 0) {
        autoCloseLinks.forEach(link => {
            link.addEventListener('click', function() {
                const parentModal = this.closest('.modal-overlay');
                if (parentModal) {
                    parentModal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    
                    // Gestione scroll manuale verso l'ancora
                    const targetId = this.getAttribute('href');
                    if(targetId && targetId.startsWith('#')) {
                        const targetEl = document.querySelector(targetId);
                        if(targetEl) {
                            setTimeout(() => {
                                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 300); // Piccolo ritardo per permettere la chiusura del modal
                        }
                    }
                }
            });
        });
    }


// ============================================================
// 4. FORM CONTATTI, DISCLAIMER & BOX VERDE (AJAX)
// ============================================================
const contactForm = document.getElementById('contact-form');
const modalDisclaimer = document.getElementById('modal-disclaimer');
const btnConfirmSubmit = document.getElementById('btn-confirm-submit');
const btnCloseDisclaimer = document.querySelector('.close-disclaimer');
const successBox = document.getElementById('inline-success');

// A. Quando l'utente clicca "Invia" nel form -> Apri Disclaimer
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Blocca tutto per ora
        if (modalDisclaimer) {
            modalDisclaimer.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
}

// B. Quando l'utente clicca "Sono d'accordo" nel Disclaimer
if (btnConfirmSubmit) {
    btnConfirmSubmit.addEventListener('click', function() {
        
        // 1. Cambia il testo del pulsante per far capire che sta lavorando
        const originalText = btnConfirmSubmit.innerHTML;
        btnConfirmSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Invio in corso...';
        
        // 2. Prepara i dati
        const formData = new FormData(contactForm);

        // 3. Invia a Formspree in BACKGROUND (senza ricaricare la pagina)
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // --- SUCCESSO! ---
                
                // 1. Chiudi il Disclaimer
                modalDisclaimer.classList.remove('active');
                document.body.style.overflow = 'auto';

                // 2. Nascondi il Form
                contactForm.style.display = 'none';
                // Nascondi anche titolo e testo sopra il form (opzionale, per pulizia)
                const formHeading = document.querySelector('.form-heading');
                if(formHeading) formHeading.style.display = 'none';

                // 3. MOSTRA IL BOX VERDE
                if (successBox) {
                    successBox.style.display = 'block';
                    // Scrolla leggermente verso il messaggio per essere sicuri che lo veda
                    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                
            } else {
                // Errore generico Formspree
                alert("C'è stato un problema nell'invio. Riprova o scrivimi su Telegram.");
                btnConfirmSubmit.innerHTML = originalText;
            }
        }).catch(error => {
            // Errore di rete
            alert("Errore di connessione. Controlla la tua rete.");
            btnConfirmSubmit.innerHTML = originalText;
        });
    });
}

// C. Gestione Chiusura Disclaimer (nessuna modifica qui)
if (modalDisclaimer) {
    if (btnCloseDisclaimer) {
        btnCloseDisclaimer.addEventListener('click', () => {
            modalDisclaimer.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    window.addEventListener('click', (e) => {
        if (e.target == modalDisclaimer) {
            modalDisclaimer.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}


    // ============================================================
    // 5. GESTIONE SUCCESSO (Ritorno da Formspree)
    // ============================================================
    
    // Controlla se l'URL contiene "?sent=true"
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('sent')) {
        const successModal = document.getElementById('modal-success');
        
        if (successModal) {
            // Apri il pop-up successo
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Pulisci l'URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
        }
    }

    // Gestione chiusura Modal Successo
    const btnCloseSuccess = document.querySelector('.close-success');
    const successModal = document.getElementById('modal-success');

    if (successModal) {
        if (btnCloseSuccess) {
            btnCloseSuccess.addEventListener('click', () => {
                successModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        }
        window.addEventListener('click', (e) => {
            if (e.target == successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
/* --- AUTO-CONFIGURAZIONE LINK RITORNO FORMSPREE --- */
// Questo codice riempie il campo _next con l'indirizzo esatto in cui ti trovi ora
const redirectInput = document.getElementById('redirect-link');

if (redirectInput) {
    // Prende l'indirizzo attuale (es. www.tuosito.it/contatti.html) e aggiunge ?sent=true
    redirectInput.value = window.location.origin + window.location.pathname + '?sent=true';
}
});