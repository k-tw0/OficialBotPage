const chatMessages = document.getElementById("chat-messages");
let idCounter = 1;
const answerElementsArray = []; // Para almacenar las referencias de las respuestas

// Función para generar un ID único para cada mensaje
function generateID() {
  return `ID (#${idCounter++})`;
}

function createMessageContainer() {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message-container");
  return messageContainer;
}

// Función para crear el elemento de pregunta
function createQuestionElement(messageID, message) {
  const messageContainer = createMessageContainer();
  const questionElement = document.createElement("div");
  questionElement.classList.add("message-question-container");
  questionElement.textContent = ` ${message}`;

  const idElement = document.createElement("div");
  idElement.classList.add("message-id");
  idElement.textContent = `${messageID}`;

  messageContainer.appendChild(idElement);
  messageContainer.appendChild(questionElement);

  return messageContainer;
}

// Función para parsear los estilos especiales en la respuesta
function parseSpecialStyles(response) {
  // Reemplazar los símbolos o letras especiales con las etiquetas HTML correspondientes
  let parsedResponse = response.replace(/\/B(.*?)B\//g, "<b>$1</b>"); // negrita
  parsedResponse = parsedResponse.replace(/\/U(.*?)U\//g, "<u>$1</u>"); // subrayado
  parsedResponse = parsedResponse.replace(
    /\/L(.*?)L\//g,
    "<a href='$1' target='_blank'>$1</a>"
  ); // enlace

  // Reemplazar los estilos especiales definidos en el JSON
  parsedResponse = parsedResponse.replace(
    /\/C(.*?)C\//g,
    "<span class='console-pasos'>$1</span>"
  ); // estilo de consola

  return parsedResponse;
}

const answerElement = document.createElement("div");
answerElement.classList.add("response", "message-answer");

const dotsElement = document.createElement("span");
dotsElement.classList.add("span", "puntitos");
dotsElement.textContent = "...";
answerElement.appendChild(dotsElement);

const interval = setInterval(() => {
  dotsElement.textContent =
    dotsElement.textContent.length < 3 ? dotsElement.textContent + "." : ".";
}, 500);

function createAnswerElement(response, codigo, videos, pasos) {
  const newAnswerElement = document.createElement("div");
  newAnswerElement.classList.add("response", "message-answer");

  const dotsElement = document.createElement("span");
  dotsElement.classList.add("span", "puntitos");
  dotsElement.textContent = "...";
  newAnswerElement.appendChild(dotsElement);

  const interval = setInterval(() => {
    dotsElement.textContent =
      dotsElement.textContent.length < 3 ? dotsElement.textContent + "." : ".";
  }, 500);

  setTimeout(() => {
    clearInterval(interval);

    // Parsear los estilos especiales en la respuesta
    const parsedResponse = parseSpecialStyles(response);

    // Crear un elemento <p> con la clase "gpt" y establecer el contenido de la respuesta
    const pElement = document.createElement("p");
    pElement.classList.add("gpt"); // Agregar la clase "gpt" al elemento <p>
    pElement.innerHTML = parsedResponse;

    // Limpiar el contenido actual del contenedor "newAnswerElement"
    newAnswerElement.innerHTML = "";

    // Agregar el elemento <p> con la respuesta al contenedor "newAnswerElement"
    newAnswerElement.appendChild(pElement);

    // Agregar contenedor para los videos
    if (videos) {
      const videoContainer = almacen(videos);
      newAnswerElement.appendChild(videoContainer);
    }

    // Agregar contenedor para el código
    if (codigo) {
      const codeContainer = code(codigo);
      newAnswerElement.appendChild(codeContainer);
    }

    // Agregar contenedor para los pasos
    if (pasos) {
      const stepsContainer = pass(pasos);
      newAnswerElement.appendChild(stepsContainer);
    }

    // Agregar clase adicional para aplicar estilos una vez que se completa la animación
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 3000);

  return newAnswerElement;
}
function pass(pasos) {
  const stepsContainer = document.createElement("div");

  if (pasos && pasos.length > 0) {
    const stepsElement = document.createElement("ul");
    stepsElement.classList.add("steps-list");

    pasos.forEach((paso) => {
      // Parsear los estilos especiales en cada paso
      const parsedStep = parseSpecialStyles(paso);

      const stepItem = document.createElement("li");
      stepItem.classList.add("li-pasos");
      stepItem.innerHTML = parsedStep;

      // Obtener el elemento console-pasos dentro del paso
      const consolePasosElement = stepItem.querySelector(".console-pasos");

      if (consolePasosElement) {
        // Agregar etiqueta de salto de línea antes del elemento console-pasos
        const brElement = document.createElement("br");
        stepItem.insertBefore(brElement, consolePasosElement);
      }

      stepsElement.appendChild(stepItem);
    });

    stepsContainer.appendChild(stepsElement);
  }

  return stepsContainer;
}
function code(codigo) {
  const codeContainer = document.createElement("div");

  if (codigo) {
    const codeElement = document.createElement("code");
    codeElement.textContent = codigo;
    codeElement.classList.add("language-javascript");

    const preElement = document.createElement("pre");
    preElement.appendChild(codeElement);

    codeContainer.classList.add("code-container");
    codeContainer.appendChild(preElement);

    Prism.highlightElement(codeElement);
  }

  return codeContainer;
}

function almacen(videos) {
  const videoContainer = document.createElement("div");

  if (videos) {
    videos.forEach((videoURL) => {
      const videoItem = document.createElement("div");
      videoItem.classList.add("video-item");

      const videoElement = document.createElement("video");
      videoElement.src = `files/videos/${videoURL}`;
      videoElement.controls = false;
      videoElement.autoplay = true;
      videoElement.muted = true;
      videoElement.loop = true;
      videoItem.appendChild(videoElement);

      // Agregar puntero encima del video
      videoItem.style.position = "relative";

      const getCodeTextElement = document.createElement("div");
      getCodeTextElement.textContent = "";
      getCodeTextElement.classList.add("code-text");
      videoItem.appendChild(getCodeTextElement);

      videoItem.addEventListener("mouseenter", () => {
        getCodeTextElement.style.opacity = "0"; // Cambiar la opacidad para mostrar el texto
      });

      videoItem.addEventListener("mouseleave", () => {
        getCodeTextElement.style.opacity = "1"; // Cambiar la opacidad para ocultar el texto
      });

      videoContainer.appendChild(videoItem);
    });

    videoContainer.classList.add("video-container");
  }

  return videoContainer;
}
export class MessageService {
  // Variable para llevar el conteo de elementos de respuesta
  static responseCount = 0;
  // Variable para almacenar el ID del último elemento de respuesta animado
  static lastAnimatedResponseID = null;

  // ... lógica y métodos de la clase MessageService ...

  showQuestionDetails(texto, respuesta, codigo, videos, pasos) {
    console.log(`Texto: ${texto}`);
    console.log(`Respuesta: ${respuesta}`);
    console.log(`Código: ${codigo}`);
    console.log(`Videos: ${videos}`);
    console.log(`Pasos: ${pasos}`);

    MessageService.responseCount++;

    const messageID = generateID();
    const messageContainer = createMessageContainer();
    const userQuestionElement = createQuestionElement(messageID, texto);
    messageContainer.appendChild(userQuestionElement);
    chatMessages.appendChild(messageContainer);

    const similarQuestion = createAnswerElement(
      respuesta,
      codigo,
      videos,
      pasos
    );

    const answerElements = messageContainer.querySelectorAll(
      ".response.message-answer"
    );
    answerElements.forEach((element) => {
      // Eliminar la clase de gradiente animado para todas las respuestas previas
      element.classList.remove("animarGradiente");
    });

    // Eliminar la clase de gradiente animado para todas las respuestas previas
    answerElementsArray.forEach((element) => {
      element.classList.remove("animarGradiente");
    });

    if (similarQuestion) {
      const answerElement = createAnswerElement(
        respuesta,
        codigo,
        videos,
        pasos
      );
      answerElement.id = `response-${MessageService.responseCount}`;
      messageContainer.appendChild(answerElement);
      // Agregar la clase de gradiente animado solo al último elemento de respuesta
      answerElement.classList.add("animarGradiente");
      // Agregar la referencia del elemento de respuesta al arreglo
      answerElementsArray.push(answerElement);
    } else {
      const noAnswerElement = document.createElement("div");
      noAnswerElement.classList.add("response", "message-answer");
      noAnswerElement.textContent =
        "No encontré una respuesta para tu pregunta. Por favor, intenta con otra.";
      messageContainer.appendChild(noAnswerElement);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Puedes realizar acciones con los detalles de la pregunta aquí
  // Por ejemplo, enviarlos a la interfaz de chat, etc.
}
