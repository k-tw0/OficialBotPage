import { MessageService } from "../boxChat/chat_v2.js";

let currentState = "Inicio"; // Puedes establecer el estado inicial aquí
let options = {}; // Variable para almacenar las opciones

class QuestionApp {
  constructor() {
    this.data = {}; // Inicializa el objeto de datos
    this.messageService = new MessageService();
    this.questionList = document.getElementById("question-list");
    this.userInput = document.getElementById("user-input");
    const searchInput = document.getElementById("search-input");
    // Añade esta línea para declarar dropdownButton como una propiedad
    this.dropdownButton = document.getElementById("droppear");

    // Evento para filtrar las preguntas al ingresar texto en el campo de búsqueda
    searchInput.addEventListener("input", (event) => {
      const searchTerm = event.target.value.toLowerCase();
      this.filterQuestions(searchTerm);
    });

    const menuToggle = document.querySelector(".menu-toggle");
    const body = document.body;

    menuToggle.addEventListener("click", () => {
      body.classList.toggle("menu-open");
      menuToggle.disabled = true;
      setTimeout(() => {
        menuToggle.disabled = false;
      }, 300);
    });
    const dropdownButton = document.getElementById("droppear");
    dropdownButton.addEventListener("click", (event) => {
      this.toggleDropdown(event);
    });

    document.addEventListener("click", (event) => {
      const menu = document.querySelector(".menu-options");
      const target = event.target;

      // Verifica si el clic no proviene de un elemento en el menú desplegable
      if (
        !menu.contains(target) &&
        !menuToggle.contains(target) &&
        !target.classList.contains("dropdown-item")
      ) {
        body.classList.remove("menu-open");
        // Cierra automáticamente el dropdown al hacer clic fuera
        const dropdown = document.getElementById("dropdown");
        dropdown.classList.remove("is-active");
      }
    });

    this.loadOptionsAndQuestions();
    const jsonFile = "/cfg/components/databases/preguntas.json";
    const datos = this.data;
    console.log(datos);
    // Por esta línea:

    // this.loadQuestions(jsonFile);
    this.loadData();
    // Comenta o elimina esta línea para evitar la carga inicial estática
  }
  initializePage() {
    console.log("probando");
  }

  toggleDropdown(event) {
    const dropdown = document.getElementById("dropdown");
    const menuToggle = document.querySelector(".menu-toggle");

    // Verifica si el clic proviene del botón del menú desplegable
    if (
      event.target === this.dropdownButton ||
      dropdown.classList.contains("is-active")
    ) {
      dropdown.classList.toggle("is-active");
    }
  }

  loadData() {
    const optionData = options[currentState];

    if (optionData && optionData.data) {
      const jsonFile = `cfg/components/databases/${optionData.data}`;
      const decodedJsonFile = decodeURI(jsonFile);

      fetch(decodedJsonFile)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al cargar el archivo JSON");
          }
        })
        .then((jsonData) => {
          this.data = jsonData; // Asigna los datos a this.data
          this.loadQuestions(jsonFile); // Pasar la ruta correcta del archivo JSON
        })
        .catch((error) => console.error("Error al cargar los datos:", error));
    }
  }

  loadQuestions(jsonFile) {
    const decodedJsonFile = decodeURI(jsonFile);

    fetch(decodedJsonFile)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al cargar el archivo JSON");
        }
      })
      .then((data) => {
        const questions = data.preguntas; // Acceder a las preguntas utilizando data.preguntas

        this.showQuestions(questions);
      })
      .catch((error) => console.error("Error al cargar las preguntas:", error));
  }

  closeDropdown() {
    const body = document.body;
    body.classList.remove("menu-open");
  }

  showQuestions(questions) {
    this.questionList.innerHTML = "";

    questions.forEach((question) => {
      const questionLink = document.createElement("a");
      questionLink.classList.add("panel-block");
      questionLink.innerText = question.texto;
      questionLink.addEventListener("click", () => {
        this.closeDropdown();
        this.userInput.value = question.texto;

        // Pasa los atributos de la pregunta a la función en MessageService
        this.messageService.showQuestionDetails(
          question.texto,
          question.respuesta,
          question.codigo,
          question.videos,
          question.pasos
        );

        this.userInput.value = "";
        console.log(
          question.texto + " " + " " + question.respuesta + " " + question.btn
        );
      });
      this.questionList.appendChild(questionLink);
    });
  }

  loadOptionsAndQuestions() {
    const dropdownContent = document.getElementById("dropdown-content");

    fetch("options.json")
      .then((response) => response.json())
      .then((data) => {
        options = data.opciones; // Almacena las opciones en la variable global

        const buttonSeguridad = document.getElementById("btn-secinform1");
        const buttonProgramacion = document.getElementById("btn-secinform2");
        const buttonInicio = document.getElementById("btn-secinform3");

        const seguridadButtonName = data.opciones["btn1"]; // Obtener el nombre "Seguridad informatica"
        const programacionButtonName = data.opciones["btn2"]; // Obtener el nombre "Programacion"
        const inicioButtonName = data.opciones["btn3"]; // Obtener el nombre "Seguridad informatica"

        buttonSeguridad.textContent = seguridadButtonName;
        buttonProgramacion.textContent = programacionButtonName;
        buttonInicio.textContent = inicioButtonName;

        // Agregar escuchadores de eventos para los botones
        // Agregar escuchadores de eventos para los botones
        buttonSeguridad.addEventListener("click", () => {
          if (!buttonSeguridad.classList.contains("seleccionado")) {
            this.changeState("Seguridad informatica");
            this.toggleButtonStyle(buttonSeguridad);
            this.toggleButtonStyle(buttonProgramacion, true); // Deseleccionar otro botón
            this.toggleButtonStyle(buttonInicio, true); // Deseleccionar otro botón
            this.selectFirstDropdownItem();
          }
        });

        buttonProgramacion.addEventListener("click", () => {
          if (!buttonProgramacion.classList.contains("seleccionado")) {
            this.toggleButtonStyle(buttonProgramacion);
            this.toggleButtonStyle(buttonSeguridad, true); // Deseleccionar otro botón
            this.toggleButtonStyle(buttonInicio, true); // Deseleccionar otro botón
            this.changeState("Programacion");
            this.selectFirstDropdownItem();
          }
        });

        buttonInicio.addEventListener("click", () => {
          if (!buttonInicio.classList.contains("seleccionado")) {
            this.toggleButtonStyle(buttonInicio);
            this.toggleButtonStyle(buttonSeguridad, true); // Deseleccionar otro botón
            this.toggleButtonStyle(buttonProgramacion, true); // Deseleccionar otro botón
            this.changeState("Inicio");
            this.selectFirstDropdownItem();
          }
        });

        this.selectOption;

        this.selectFirstDropdownItem();
        this.changeState("Seguridad informatica");

        this.selectFirstDropdownItem();
        buttonSeguridad.click();
        // Resto del código...
      })
      .catch((error) => {
        console.error("Error al cargar las opciones:", error);
      });
  }
  toggleButtonStyle(buttonElement, removeOthers = false) {
    // Agregar o quitar la clase "seleccionado" del botón
    buttonElement.classList.toggle("seleccionado");

    if (removeOthers) {
      // Si removeOthers es verdadero, deseleccionar el botón
      buttonElement.classList.remove("seleccionado");
    }
  }
  // Función para cambiar el estado
  changeState(newState) {
    currentState = newState;

    console.log("Estado actual:", currentState);
    this.updateDropdown(options[currentState]);

    // Aquí puedes llamar a funciones o realizar otras acciones según el nuevo estado
  }
  updateDropdown(options) {
    const dropdownContent = document.getElementById("dropdown-content");
    dropdownContent.innerHTML = "";

    for (const key in options) {
      if (key !== "tema" && key !== "data") {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#";
        dropdownItem.textContent = options[key].tema;
        dropdownItem.addEventListener("click", (event) => {
          this.selectOption(event.target);
        });
        dropdownContent.appendChild(dropdownItem);
      }

      // Actualizar el texto del botón principal (dropdown)
      this.dropdownButton.textContent = options[Object.keys(options)[0]].tema;
    }
  }

  loadQuestionsFromJsonFile(jsonFile) {
    const decodedJsonFile = decodeURI(jsonFile);

    fetch(decodedJsonFile)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al cargar el archivo JSON");
        }
      })
      .then((data) => {
        const questions = data.preguntas; // Acceder a las preguntas utilizando data.preguntas

        this.showQuestions(questions);
      })
      .catch((error) => console.error("Error al cargar las preguntas:", error));
  }

  selectOption(optionElement) {
    const selectedOption = optionElement.textContent;

    // Utiliza options[currentState] para acceder a las opciones del estado actual
    const optionData = options[currentState][selectedOption];

    if (optionData && optionData.data) {
      const jsonFile = `cfg/components/databases/${optionData.data}`;
      this.loadQuestionsFromJsonFile(jsonFile);

      // Cambiar el nombre del botón principal (dropdown)
      const dropdownButton = document.getElementById("droppear");
      dropdownButton.textContent = selectedOption;

      // Cierra automáticamente el dropdown
      this.toggleDropdown({ target: dropdownButton });
      console.log(selectedOption);
    } else {
      console.error(
        `No se encontraron datos para la opción: ${selectedOption}`
      );
      this.showQuestions([]);
    }
  }
  filterQuestions(searchTerm) {
    const normalizedSearchTerm = this.normalizeString(searchTerm);
    const optionData = options[currentState];

    if (optionData && optionData.data) {
      const jsonFile = `cfg/components/databases/${optionData.data}`;
      const decodedJsonFile = decodeURI(jsonFile);

      fetch(decodedJsonFile)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Error al cargar el archivo JSON");
          }
        })
        .then((data) => {
          const questions = data.preguntas;

          const filteredQuestions = questions.filter((question) => {
            const normalizedQuestion = this.normalizeString(question.texto);
            return normalizedQuestion.includes(normalizedSearchTerm);
          });

          this.showQuestions(filteredQuestions);
        })
        .catch((error) =>
          console.error("Error al cargar las preguntas:", error)
        );
    }
  }

  // Función para normalizar una cadena de texto
  normalizeString(str) {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }
  // Agrega este nuevo método
  selectFirstDropdownItem() {
    const firstDropdownItem = document.querySelector(".dropdown-item");
    if (firstDropdownItem) {
      this.selectOption(firstDropdownItem);
    }
  }
}

export default QuestionApp;
