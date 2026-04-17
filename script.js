/* ═══════════════════════════════════════════════
   script.js — Portfolio Rafael Jongerlynck
   BTS SIO · MyDigitalSchool Caen
═══════════════════════════════════════════════ */

/* ─────────────────────────────────────────────
   1. NAVIGATION SPA
   Gère l'affichage des pages sans rechargement
───────────────────────────────────────────── */

/**
 * Affiche la page demandée et met à jour la nav.
 * @param {string} id - L'id de la section cible
 */
function showPage(id) {
  // Masquer toutes les pages
  document.querySelectorAll('.page').forEach(function(page) {
    page.classList.remove('active');
  });

  // Retirer la classe active sur tous les liens nav
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.classList.remove('active');
  });

  // Afficher la page cible
  var target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Activer le lien nav correspondant
  var navEl = document.getElementById('nav-' + id);
  if (navEl) {
    navEl.classList.add('active');
  }

  // Si on affiche la page école, lancer l'animation des barres
  if (id === 'school') {
    setTimeout(animateSkillBars, 200);
  }
}

/* ─────────────────────────────────────────────
   2. MENU MOBILE
   Burger toggle pour les petits écrans
───────────────────────────────────────────── */

var burgerBtn   = document.getElementById('nav-burger');
var mobileMenu  = document.getElementById('mobile-menu');

if (burgerBtn) {
  burgerBtn.addEventListener('click', function() {
    var isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      mobileMenu.classList.add('open');
      burgerBtn.textContent = '✕';
    }
  });
}

/**
 * Ferme le menu mobile.
 */
function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.classList.remove('open');
  }
  if (burgerBtn) {
    burgerBtn.innerHTML = '&#9776;';
  }
}

/* ─────────────────────────────────────────────
   3. ANIMATION DES BARRES DE COMPÉTENCES
   Déclenché à l'affichage de la page École
───────────────────────────────────────────── */

var skillsAnimated = false;

/**
 * Anime les barres de compétences une seule fois.
 */
function animateSkillBars() {
  if (skillsAnimated) return;

  var fills = document.querySelectorAll('.skill-fill');
  fills.forEach(function(fill) {
    var targetWidth = fill.getAttribute('data-width');
    if (targetWidth) {
      fill.style.width = targetWidth + '%';
    }
  });

  skillsAnimated = true;
}

/* ─────────────────────────────────────────────
   4. FORMULAIRE DE CONTACT
   Validation + retour visuel à l'envoi
───────────────────────────────────────────── */

var submitBtn = document.getElementById('btn-submit');
if (submitBtn) {
  submitBtn.addEventListener('click', handleSubmit);
}

/**
 * Valide le formulaire et simule un envoi.
 */
function handleSubmit() {
  // Récupération des champs
  var nameInput    = document.getElementById('f-name');
  var emailInput   = document.getElementById('f-email');
  var messageInput = document.getElementById('f-message');

  var name    = nameInput    ? nameInput.value.trim()    : '';
  var email   = emailInput   ? emailInput.value.trim()   : '';
  var message = messageInput ? messageInput.value.trim() : '';

  // Réinitialiser les erreurs précédentes
  clearFormErrors();

  var valid = true;

  // Validation nom
  if (!name) {
    showFieldError('err-name', 'Veuillez entrer votre nom.', 'f-name');
    valid = false;
  }

  // Validation email
  if (!email) {
    showFieldError('err-email', 'Veuillez entrer votre email.', 'f-email');
    valid = false;
  } else if (!isValidEmail(email)) {
    showFieldError('err-email', 'Format d\'email invalide.', 'f-email');
    valid = false;
  }

  // Validation message
  if (!message) {
    showFieldError('err-message', 'Veuillez écrire un message.', 'f-message');
    valid = false;
  }

  if (!valid) return;

  // Désactiver le bouton pendant l'envoi
  var btn = document.getElementById('btn-submit');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  // Récupérer le sujet
  var subjectInput = document.getElementById('f-subject');
  var subject = subjectInput ? subjectInput.value.trim() : '';

  // Envoi via Formspree
  fetch('https://formspree.io/f/xaqlvand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name:    name,
      email:   email,
      subject: subject,
      message: message
    })
  })
  .then(function(response) {
    if (response.ok) {
      showSuccessMessage();
      resetForm();
    } else {
      alert('Une erreur est survenue. Merci de réessayer.');
    }
  })
  .catch(function() {
    alert('Impossible d\'envoyer le message. Vérifie ta connexion internet.');
  })
  .finally(function() {
    btn.disabled = false;
    btn.textContent = 'Envoyer le message →';
  });
}

/**
 * Affiche une erreur sous un champ.
 * @param {string} errorId  - l'id du span d'erreur
 * @param {string} message  - le texte d'erreur
 * @param {string} inputId  - l'id du champ concerné
 */
function showFieldError(errorId, message, inputId) {
  var errorEl = document.getElementById(errorId);
  if (errorEl) errorEl.textContent = message;

  var inputEl = document.getElementById(inputId);
  if (inputEl) inputEl.classList.add('input-error');
}

/**
 * Efface tous les messages d'erreur du formulaire.
 */
function clearFormErrors() {
  ['err-name', 'err-email', 'err-message'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['f-name', 'f-email', 'f-message'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('input-error');
  });
}

/**
 * Vérifie qu'un email est valide.
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Affiche le message de succès puis le masque après 5s.
 */
function showSuccessMessage() {
  var successEl = document.getElementById('form-success');
  if (!successEl) return;

  successEl.style.display = 'block';
  setTimeout(function() {
    successEl.style.display = 'none';
  }, 5000);
}

/**
 * Vide tous les champs du formulaire.
 */
function resetForm() {
  ['f-name', 'f-email', 'f-subject', 'f-message'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
}

/* ─────────────────────────────────────────────
   5. SUPPRESSION DES ERREURS EN TEMPS RÉEL
   Quand l'utilisateur commence à corriger un champ
───────────────────────────────────────────── */

['f-name', 'f-email', 'f-message'].forEach(function(id) {
  var el = document.getElementById(id);
  if (!el) return;

  el.addEventListener('input', function() {
    el.classList.remove('input-error');
    // Effacer l'erreur associée
    var errMap = { 'f-name': 'err-name', 'f-email': 'err-email', 'f-message': 'err-message' };
    var errEl = document.getElementById(errMap[id]);
    if (errEl) errEl.textContent = '';
  });
});

/* ─────────────────────────────────────────────
   6. OBSERVER INTERSECTION — ANIMATIONS SCROLL
   Les cartes projet apparaissent au scroll
───────────────────────────────────────────── */

var cardObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

// Préparer les cartes projets
document.querySelectorAll('.project-card').forEach(function(card, index) {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(32px)';
  card.style.transition = 'opacity .5s ' + (index * 0.1) + 's, transform .5s ' + (index * 0.1) + 's';
  cardObserver.observe(card);
});

/* ─────────────────────────────────────────────
   7. ANNÉE DYNAMIQUE DANS LE FOOTER
───────────────────────────────────────────── */

(function() {
  var footerSpans = document.querySelectorAll('footer span');
  if (footerSpans.length > 0) {
    var currentYear = new Date().getFullYear();
    footerSpans[0].textContent = '© ' + currentYear + ' Rafael Jongerlynck';
  }
})();

/* ─────────────────────────────────────────────
   8. GESTION DES PARAMÈTRES URL
   Redirection vers une section spécifique
───────────────────────────────────────────── */

(function() {
  var urlParams = new URLSearchParams(window.location.search);
  var section = urlParams.get('section');
  if (section) {
    showPage(section);
  }
})();