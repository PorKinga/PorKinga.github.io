// leaflet
let map = L.map("map").setView([53.430127, 14.564802], 18);
L.tileLayer.provider("Esri.WorldImagery").addTo(map);

//znacznik
//let marker = L.marker([53.430127, 14.564802]).addTo(map);
//marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");

// 2x2
const rows = 2;
const cols = 2;

// eksport do canvas
//leaflet.html plik
document.getElementById("saveButton").addEventListener("click", function () {
  leafletImage(map, function (err, canvas) {
    let rasterMap = document.getElementById("rasterMap");
    let rasterContext = rasterMap.getContext("2d");

    //czyscimy canvas i rysujemy mape
    rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height);
    rasterContext.drawImage(canvas, 0, 0, 600, 300);

    //tworzymy sloty u gory
    createSlots();
    //tworzymy plansze na dole
    createBoard();
    //tniemy mape na kawalki i wrzucamy do slotow
    spliMap();
    //umozliwiamy odkladanie puzzli do slotow
    puzzleToSlot();
  });
});

// geolokalizacja plik geolocation.html
document.getElementById("getLocation").addEventListener("click", function () {
  if (!navigator.geolocation) {
    console.log("No geolocation.");
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);

      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      document.getElementById("latitude").innerText = lat;
      document.getElementById("longitude").innerText = lon;

      // przesuwamy mape i marker na aktualna lokalizacje
      map.setView([lat, lon], 18);
      marker.setLatLng([lat, lon]);
    },
    (positionError) => {
      console.error(positionError);
    },
  );
});

// tworzenie slotow u gory
function createSlots() {
  const piecesContainer = document.getElementById("piecesContainer");
  piecesContainer.innerHTML = "";

  for (let i = 0; i < rows * cols; i++) {
    const slot = document.createElement("div");
    slot.classList.add("piece-slot");
    slot.dataset.index = i;
    piecesContainer.appendChild(slot);
  }
}

// tworzenie planszy
function createBoard() {
  const boardContainer = document.getElementById("boardContainer");
  boardContainer.innerHTML = "";

  for (let i = 0; i < rows * cols; i++) {
    const plansza = document.createElement("div");
    plansza.classList.add("plansza");
    plansza.dataset.index = i;

    // dragenter plik drag.and.drop.html
    plansza.addEventListener("dragenter", function () {
      this.style.border = "2px solid #000000";
    });

    // dragleave plik drag.and.drop.html
    plansza.addEventListener("dragleave", function () {
      this.style.border = "2px dashed #000000";
    });

    // dragover plik drag.and.drop.html
    plansza.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    // drop plik drag.and.drop.html
    plansza.addEventListener("drop", function (event) {
      event.preventDefault();

      let myElement = document.querySelector(
        "#" + event.dataTransfer.getData("text"),
      );

      // blokujemy mozliwosc dwoch puzzli w 1 miejscu
      if (this.children.length > 0) {
        return;
      }

      this.appendChild(myElement);
      this.style.border = "2px solid #000000";

      // sprawdzanie po kazdym ruchu
      checkWin();
    });

    boardContainer.appendChild(plansza);
  }
}

// odkladanie puzzli do slotow
function puzzleToSlot() {
  const slots = document.querySelectorAll(".piece-slot");

  slots.forEach((slot) => {
    slot.addEventListener("dragover", function (event) {
      event.preventDefault();
    });

    slot.addEventListener("drop", function (event) {
      event.preventDefault();

      const myElement = document.querySelector(
        "#" + event.dataTransfer.getData("text"),
      );

      // blokujemy mozliwosc dwoch puzzli w 1 slocie
      if (this.children.length > 0) {
        return;
      }

      this.appendChild(myElement);

      // sprawdzanie po kazdym ruchu
      checkWin();
    });
  });
}

// dzielenie na kawalki
function spliMap() {
  const rasterMap = document.getElementById("rasterMap");
  //obliczamy rozmiary puzli
  const pieceWidth = rasterMap.width / cols;
  const pieceHeight = rasterMap.height / rows;
  let pieces = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const pieceCanvas = document.createElement("canvas");
      const idx = row * cols + col;

      //wymiary puzzla
      pieceCanvas.width = pieceWidth;
      pieceCanvas.height = pieceHeight;
      //id dla kazdego puzzla  + drag and drop
      pieceCanvas.classList.add("piece");
      pieceCanvas.id = "piece-" + idx;
      //idx dla spr poprawnosci ulozenia
      pieceCanvas.dataset.index = idx;
      //mozliwosc przeciagania
      pieceCanvas.draggable = true;

      const ctx = pieceCanvas.getContext("2d");

      ctx.drawImage(
        rasterMap,
        col * pieceWidth,
        row * pieceHeight,
        pieceWidth,
        pieceHeight,
        0,
        0,
        pieceWidth,
        pieceHeight,
      );

      pieceCanvas.addEventListener("dragstart", function (event) {
        this.style.border = "5px dashed #000000";
        event.dataTransfer.setData("text", this.id);
      });

      pieceCanvas.addEventListener("dragend", function () {
        this.style.borderWidth = "0";
      });

      pieces.push(pieceCanvas);
    }
  }

  // mieszanie puzzli
  pieces.sort(() => Math.random() - 0.5);

  // wrzucanie puzzli do gornych slotow
  const slots = document.querySelectorAll(".piece-slot");
  for (let i = 0; i < pieces.length; i++) {
    slots[i].appendChild(pieces[i]);
  }
}

// sprawdzanie poprawnosci ulozenia
function checkWin() {
  const fields = document.querySelectorAll(".plansza");
  let correct = 0;

  fields.forEach((field) => {
    if (field.children.length === 1) {
      const piece = field.children[0];

      // jesli dobrze ulozone
      if (piece.dataset.index === field.dataset.index) {
        field.style.border = "2px solid green";
        correct++;
      } else {
        // jesli zle ulozone
        field.style.border = "4px solid red";
      }
    } else {
      // puste pole
      field.style.border = "2px solid #000000";
    }
  });

  // jesli wszystko dobrze ulozone
  if (correct === rows * cols) {
    alert("Ułożono poprawnie wszystkie puzzle!");

    // powiadomienie systemowe
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Brawo! Ułożyłaś puzzle poprawnie!");
    }
  }
}

// przycisk do wlaczenia powiadomien
const notifyBtn = document.getElementById("enableNotifications");
//https://developer.mozilla.org/en-US/docs/Web/API/Notification
if (notifyBtn) {
  notifyBtn.addEventListener("click", function () {
    if (!("Notification" in window)) {
      alert("Nie dziala!");
      return;
    }

    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        alert("Powiadomienia włączone.");
      }
    });
  });
}
