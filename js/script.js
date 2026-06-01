/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById('loginForm');

if (loginForm) {

  loginForm.addEventListener('submit', function(e) {

    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({ usuario, password })

    })

    .then(res => {

      if (!res.ok) {
        throw new Error('Credenciales incorrectas');
      }

      return res.json();

    })

    .then(data => {

      alert('Login exitoso');

      window.location.href = 'dashboard.html';

    })

    .catch(err => {

      alert('Error: ' + err.message);

    });

  });

}

/* =========================
   MENÚ HAMBURGUESA
========================= */

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {

  hamburger.addEventListener('click', () => {

    navMenu.classList.toggle('active');

    hamburger.classList.toggle('active');

});

}

/* =========================
   CAROUSEL
========================= */

const container = document.querySelector('.carousel-container');

if (container) {

  const items = container.querySelectorAll('.carousel-item');
  const prevButton = document.querySelector('.carousel-button.prev');
  const nextButton = document.querySelector('.carousel-button.next');

  let index = 0;

  function showSlide() {
    container.style.transform = `translateX(-${index * 100}%)`;
  }

  // Avance automático cada 4 segundos
  setInterval(() => {
    index = (index < items.length - 1) ? index + 1 : 0;
    showSlide();
  }, 4000);

  if (prevButton && nextButton) {

    prevButton.addEventListener('click', () => {
      index = (index > 0) ? index - 1 : items.length - 1;
      showSlide();
    });

    nextButton.addEventListener('click', () => {
      index = (index < items.length - 1) ? index + 1 : 0;
      showSlide();
    });

  }

}


/* =========================
   NAV ACTIVO
========================= */

const links = document.querySelectorAll('.nav-menu ul li a');
const paginaActual = window.location.pathname.split('/').pop();

links.forEach(link => {
  const href = link.getAttribute('href').split('/').pop();
  if (href === paginaActual) {
    link.classList.add('active');
  }
});