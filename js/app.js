// ===============================
// CONFIGURACIÓN DEL ENCUENTRO
// ===============================

const proximoEncuentro = {
  
  modalidad: "virtual", // "virtual" o "presencial"
  fecha: "-LUNES HORARIO A CONVENIR-",
  tema: "Armonías cromáticas",
  link: "https://meet.google.com/axw-gbst-xbf",
  aula: "Aula 3 – Conservatorio"
};

// ===============================
// GENERADOR DEL BLOQUE
// ===============================

function generarProximoEncuentro() {
  const contenedor = document.getElementById("proximo-encuentro");

  let contenido = `
    <div class="encuentro-box">
      <h2>- Próxima Clase Virtual – </h2>
      <p><strong>Modalidad:</strong> ${proximoEncuentro.modalidad}</p>
      <p><strong>Fecha:</strong> ${proximoEncuentro.fecha}</p>
      <p><strong>Tema:</strong> ${proximoEncuentro.tema}</p>
  `;

  if (proximoEncuentro.modalidad === "virtual") {
    contenido += `
      <a class="boton" href="${proximoEncuentro.link}" target="_blank">
        Ingresar a Google Meet
      </a>
    `;
  } else {
    contenido += `
      <p><strong>Ubicación:</strong> ${proximoEncuentro.aula}</p>
    `;
  }

  contenido += `</div>`;

  contenedor.innerHTML = contenido;
}

generarProximoEncuentro();