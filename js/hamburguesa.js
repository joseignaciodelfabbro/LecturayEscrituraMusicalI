const hamburger = document.getElementById('hamburger');
const navContenido = document.getElementById('nav-contenido');

if (hamburger && navContenido) {
  hamburger.addEventListener('click', () => {
    const abierto = navContenido.classList.toggle('abierto');
    hamburger.classList.toggle('abierto');
    hamburger.setAttribute('aria-expanded', abierto);
  });
}