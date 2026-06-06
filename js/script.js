/* =========================
   LOGIN
========================= */

const loginForm = document.getElementById('loginForm');

if (loginForm) {

  loginForm.addEventListener('submit', function (e) {

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

    container.style.transform =
      `translateX(-${index * 100}%)`;

  }

  // Avance automático cada 4 segundos
  setInterval(() => {

    index = (index < items.length - 1)
      ? index + 1
      : 0;

    showSlide();

  }, 4000);

  if (prevButton && nextButton) {

    prevButton.addEventListener('click', () => {

      index = (index > 0)
        ? index - 1
        : items.length - 1;

      showSlide();

    });

    nextButton.addEventListener('click', () => {

      index = (index < items.length - 1)
        ? index + 1
        : 0;

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

/* =========================
   INVENTARIO
========================= */

const formInventario = document.querySelector('.form-inventario');
const tbodyInventario = document.querySelector('.tabla-inventario tbody');
const btnActualizar = document.getElementById('actualizar-inventario');

/* Cargar Inventario */

function cargarInventario() {

  if (!tbodyInventario) return;

  fetch('/productos')

    .then(res => res.json())

    .then(data => {

      tbodyInventario.innerHTML = '';

      data.forEach(p => {

        tbodyInventario.innerHTML += `
          <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.categoria}</td>
            <td>${p.unidad}</td>
            <td>${p.stock}</td>
            <td>${p.precio}</td>
          </tr>
        `;

      });

    })

    .catch(err => {

      console.error('Error cargando inventario:', err);

    });

}

/* Guardar Producto */

if (formInventario) {

  formInventario.addEventListener('submit', function (e) {

    e.preventDefault();

    const inputs = formInventario.querySelectorAll('input');
    const select = formInventario.querySelector('select');

    const nombre = inputs[0].value;
    const categoria = select.value;
    const unidad = inputs[1].value;
    const precio = inputs[2].value;

    fetch('/productos', {

      method: 'POST',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        nombre,
        categoria,
        unidad,
        precio
      })

    })

      .then(res => res.json())

      .then(data => {

        alert('Producto guardado ✅');

        formInventario.reset();

        cargarInventario();

      })

      .catch(err => {

        alert('Error: ' + err.message);

      });

  });

  cargarInventario();

}

/* =========================
   ACTUALIZAR INVENTARIO
========================= */

if (btnActualizar) {

  btnActualizar.addEventListener('click', () => {

    cargarInventario();

  });

}