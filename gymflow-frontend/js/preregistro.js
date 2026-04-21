document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("preregistroForm");
  const mensajeExito = document.getElementById("mensajeExito");
  const checkboxAutorizacion = document.getElementById("autorizacion");

  if (!formulario) return;

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    if (mensajeExito) {
      mensajeExito.style.display = "block";
    }

    formulario.reset();

    if (checkboxAutorizacion) {
      checkboxAutorizacion.checked = true;
    }

    if (mensajeExito) {
      mensajeExito.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });
});