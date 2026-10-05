const active_style_id = "active-style-id";

//slownik dostepnych stylow str 36
const styles: { [nameofstyle: string]: string } = {
  "Style 1": "/style-1.css",
  "Style 2": "/style-2.css",
  "Style 3": "/style-3.css",
};

//stan apki
const state_app = {
  currentStyleName: "Style 1",
  currentStyleFile: styles["Style 1"],
  availableStyle: styles,
};

//podlaczanie stylu
function changestyle(nameofstyle: string) {
  const filestyle = state_app.availableStyle[nameofstyle];

  const oldstyle = document.getElementById(active_style_id);

  if (oldstyle !== null) {
    oldstyle.remove();
  }

  const link = document.createElement("link");

  link.id = active_style_id;
  link.rel = "stylesheet";
  link.href = filestyle;
  document.head.appendChild(link);

  state_app.currentStyleName = nameofstyle;
  state_app.currentStyleFile = filestyle;
}

//przyciski zmiany stylu
function buttons_change_style() {
  const space_for_buttons = document.createElement("div");

  for (const nameofstyle in state_app.availableStyle) {
    const button = document.createElement("button");
    button.textContent = nameofstyle;
    button.addEventListener("click", function () {
      changestyle(nameofstyle);
    });
    space_for_buttons.appendChild(button);
  }

  const header = document.querySelector("header");
  if (header !== null) {
    header.after(space_for_buttons);
  }
}

buttons_change_style();
changestyle(state_app.currentStyleName);
