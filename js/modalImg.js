document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("modalImagen");
  const modalImg = document.getElementById("imgAmpliada");
  const cerrar = document.querySelector(".cerrar-modal");

const imagenes = document.querySelectorAll(".abrir-modal");

  imagenes.forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = img.src;
    });
  });

  cerrar.onclick = () => {
    modal.style.display = "none";
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

});