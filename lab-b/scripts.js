const wyszukiwarka = document.getElementById("search");

document.todo = {
  tasks: [],
  //LOCALSTORAGE
init: function() {
    const savedTasks = localStorage.getItem("shoppingList");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    } else {
      this.tasks = [
        { text: "banany", data: "2026-03-25" },
        { text: "mleko", data: "2026-03-26" },
        { text: "jablka", data: "2026-03-27" },
      ];
    }
    this.drawTasks();
  },
  //ZAPIS PO ZMIANIE DO PAMIECI
  save: function() {
    localStorage.setItem("shoppingList", JSON.stringify(this.tasks));
  },

  add: function (text, data) {
    //dodawanie zadania
    this.tasks.push({ text, data });
    this.save();
    this.drawTasks(); //odswiezanie listy

  },
    //usuwanie
  removeTask: function (index) {
    this.tasks.splice(index, 1);
    this.save();
    this.drawTasks();
  },

drawTasks: function (filteredTasks, term = "") {
    const taskList = document.getElementById("Lista");
    taskList.innerHTML = "";
  
    const tasksToDisplay = filteredTasks || this.tasks;

    tasksToDisplay.forEach((task, index) => {
      const li = document.createElement("li");
      
      let tekstZadania = task.text;
      if (term.length >= 2) {
        const reg = new RegExp(`(${term})`, "gi");
        tekstZadania = task.text.replace(reg, "<mark>$1</mark>");
      }
      li.innerHTML = `
          <span class="task-info"><strong>${tekstZadania}</strong> - ${task.data}</span>
          <button onclick="document.todo.removeTask(${index})">Usuń</button>
      `;
      taskList.appendChild(li);
    });
  }
};

//wyszukiwanie
document.getElementById("wyszukiwarka").addEventListener("input", function () {
  const searchTerm = this.value.toLowerCase();
  if (searchTerm.length >= 2) {
    const filtered = document.todo.tasks.filter((task) =>
      task.text.toLowerCase().includes(searchTerm),
    );
    document.todo.drawTasks(filtered, searchTerm);
  } else {
    document.todo.drawTasks();
  }
});

//dodawanie
document.getElementById("dodawanie").addEventListener("submit", function (e) {
  e.preventDefault();
  const textInput = document.getElementById("nowaPozycja");
  const dataInput = document.getElementById("DataDodanie");

  if (textInput.value.trim() && dataInput.value) {
    document.todo.add(textInput.value, dataInput.value);
    textInput.value = ""; // Czyszczenie pola
    dataInput.value = ""; // Czyszczenie daty
  }
});
document.todo.init();

//MOTYW DODATKOWO
function zmienTlo(tło) {
  const element = document.querySelector("body");
  element.classList.remove(
    "motyw-wroc",
    "motyw-zabka",
    "motyw-biedronka",
    "motyw-netto",
  );
  element.classList.add(tło);
}

document.todo.drawTasks();
