function verificar() {
  const pass = document.getElementById("password").value;
  const claveCorrecta = "ytT45Fo03FF2hf";
  const error = document.getElementById("error");

  if (pass === claveCorrecta) {
    localStorage.setItem("autenticado", "true");
    window.location.href = "aula.html";
  } else {
    error.textContent = "Contraseña incorrecta";
  }
}