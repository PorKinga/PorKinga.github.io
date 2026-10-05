var express = require("express");
var router = express.Router();
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const dbPath = path.resolve(__dirname, "..", "data.db");
const db = new DatabaseSync(dbPath);

router.get("/", function (req, res, next) {
    const pizzas = db.prepare("SELECT * FROM pizza").all();

    res.render("pizzas/index", {
      title: "Lista PIZZA",
      pizzas: pizzas,
    });
});

router.get("/create", function (req, res, next) {
  res.render("pizzas/create", {
    title: "Dodaj pizzę",
  });
});

router.post("/create", function (req, res, next) {
    const { name, description, price } = req.body;

    const result = db
      .prepare("INSERT INTO pizza (name, description, price) VALUES (?, ?, ?)")
      .run(name, description, price);

    res.redirect("/pizzas");
});

router.get("/:id", function (req, res, next) {
    const pizza = db
      .prepare("SELECT * FROM pizza WHERE id = ?")
      .get(req.params.id);

    if (!pizza) {
      return next();
    }

    res.render("pizzas/show", {
      title: "Podgląd pizzy",
      pizza: pizza,
    });
});

router.get("/:id/edit", function (req, res, next) {
    const pizza = db
      .prepare("SELECT * FROM pizza WHERE id = ?")
      .get(req.params.id);

    if (!pizza) {
      return next();
    }

    res.render("pizzas/edit", {
      title: "Edytuj pizzę",
      pizza: pizza,
    });
});

router.post("/:id/edit", function (req, res, next) {
    const { name, description, price } = req.body;

    db.prepare(
      "UPDATE pizza SET name = ?, description = ?, price = ? WHERE id = ?",
    ).run(name, description, price, req.params.id);

    res.redirect("/pizzas/" + req.params.id);
});

router.post("/:id/delete", function (req, res, next) {
    db.prepare("DELETE FROM pizza WHERE id = ?").run(req.params.id);

    res.redirect("/pizzas");
});

module.exports = router;