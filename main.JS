
const formulario = document.getElementById("formRegistro");
const botonEnviar = document.getElementById("botonEnviar");
const mensajeResultado = document.getElementById("mensajeResultado");

const EDAD_MINIMA = 16;
const EDAD_MAXIMA = 65;
const patronNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]{2,50}$/;
const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const patronTelefono = /^9\d{8}$/;

const campos = {
  nombres: document.getElementById("nombres"),
  apellidos: document.getElementById("apellidos"),
  correo: document.getElementById("correo"),
  telefono: document.getElementById("telefono"),
  edad: document.getElementById("edad"),
  carrera: document.getElementById("carrera"),
  acepto: document.getElementById("acepto"),
};

function mostrarError(campo, mensaje) {
  campo.classList.add("is-invalid");
  campo.classList.remove("is-valid");
  document.getElementById("error-" + campo.id).textContent = mensaje;
}

function marcarValido(campo) {
  campo.classList.remove("is-invalid");
  campo.classList.add("is-valid");
}

function mostrarMensaje(tipo, texto) {
  mensajeResultado.className =
    "alert campo-completo " +
    (tipo === "exito" ? "alert-success" : "alert-danger");
  mensajeResultado.textContent = texto;
}

function validarNombre(campo) {
  const valor = campo.value.trim();
  if (valor === "") {
    mostrarError(campo, "Este campo es obligatorio.");
    return false;
  } else if (!patronNombre.test(valor)) {
    mostrarError(campo, "Usa solo letras (entre 2 y 50 caracteres).");
    return false;
  }
  marcarValido(campo);
  return true;
}

function validarCorreo(campo) {
  const valor = campo.value.trim();
  if (valor === "") {
    mostrarError(campo, "El correo es obligatorio.");
    return false;
  } else if (!patronCorreo.test(valor)) {
    mostrarError(
      campo,
      "Escribe un correo válido, por ejemplo nombre@correo.com.",
    );
    return false;
  }
  marcarValido(campo);
  return true;
}

function validarTelefono(campo) {
  const valor = campo.value.trim();
  if (valor === "") {
    mostrarError(campo, "El teléfono es obligatorio.");
    return false;
  } else if (!patronTelefono.test(valor)) {
    mostrarError(campo, "Ingresa un celular de 9 dígitos que empiece con 9.");
    return false;
  }
  marcarValido(campo);
  return true;
}

function validarEdad(campo) {
  const edad = Number(campo.value);
  if (campo.value.trim() === "") {
    mostrarError(campo, "La edad es obligatoria.");
    return false;
  } else if (
    !Number.isInteger(edad) ||
    edad < EDAD_MINIMA ||
    edad > EDAD_MAXIMA
  ) {
    mostrarError(
      campo,
      "Ingresa una edad entre " + EDAD_MINIMA + " y " + EDAD_MAXIMA + " años.",
    );
    return false;
  }
  marcarValido(campo);
  return true;
}

function validarCarrera(campo) {
  if (campo.value === "") {
    mostrarError(campo, "Selecciona una carrera.");
    return false;
  }
  marcarValido(campo);
  return true;
}

function validarAcepto(campo) {
  if (!campo.checked) {
    mostrarError(campo, "Debes aceptar para continuar.");
    return false;
  }
  marcarValido(campo);
  return true;
}

const validadores = {
  nombres: validarNombre,
  apellidos: validarNombre,
  correo: validarCorreo,
  telefono: validarTelefono,
  edad: validarEdad,
  carrera: validarCarrera,
  acepto: validarAcepto,
};

function validarFormulario() {
  const resultados = [];
  for (const nombre in campos) {
    resultados.push(validadores[nombre](campos[nombre]));
  }
  return resultados.every(function (ok) {
    return ok === true;
  });
}

campos.telefono.addEventListener("input", function () {
  campos.telefono.value = campos.telefono.value.replace(/\D/g, "").slice(0, 9);
});

for (const nombre in campos) {
  const tipoEvento =
    nombre === "carrera" || nombre === "acepto" ? "change" : "blur";
  campos[nombre].addEventListener(tipoEvento, function () {
    validadores[nombre](campos[nombre]);
  });
  campos[nombre].addEventListener("input", function () {
    if (campos[nombre].classList.contains("is-invalid")) {
      validadores[nombre](campos[nombre]);
    }
  });
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (!validarFormulario()) {
    mostrarMensaje("error", "Revisa los campos marcados en rojo.");
    return;
  }

  const datos = Object.fromEntries(new FormData(formulario));
  console.log("Datos que se enviarían por POST:", datos);

  botonEnviar.disabled = true;
  botonEnviar.textContent = "Enviando...";
  setTimeout(function () {
    mostrarMensaje("exito", "¡Registro enviado! Pronto te contactaremos.");
    formulario.reset();
    for (const nombre in campos) {
      campos[nombre].classList.remove("is-valid", "is-invalid");
    }
    botonEnviar.disabled = false;
    botonEnviar.textContent = "Enviar registro";
  }, 800);
});