import sqlite3
from flask import Flask, render_template, request, redirect, url_for, g

app = Flask(__name__)
DATABASE = "data.db"


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(error):
    db = g.pop("db", None)
    if db is not None:
        db.close()


@app.route("/")
def home():
    return redirect(url_for("pizza_index"))


@app.route("/pizza")
def pizza_index():
    db = get_db()
    pizzas = db.execute("SELECT * FROM pizza").fetchall()
    return render_template("pizza/index.html", pizzas=pizzas)


@app.route("/pizza/<int:id>")
def pizza_show(id):
    db = get_db()
    pizza = db.execute("SELECT * FROM pizza WHERE id = ?", (id,)).fetchone()
    return render_template("pizza/show.html", pizza=pizza)


@app.route("/pizza/create", methods=["GET", "POST"])
def pizza_create():
    if request.method == "POST":
        db = get_db()
        db.execute(
            "INSERT INTO pizza (name, price, description) VALUES (?, ?, ?)",
            (
                request.form["name"],
                request.form["price"],
                request.form["description"]
            )
        )
        db.commit()
        return redirect(url_for("pizza_index"))

    return render_template("pizza/create.html")


@app.route("/pizza/<int:id>/edit", methods=["GET", "POST"])
def pizza_edit(id):
    db = get_db()
    pizza = db.execute("SELECT * FROM pizza WHERE id = ?", (id,)).fetchone()

    if request.method == "POST":
        db.execute(
            "UPDATE pizza SET name = ?, price = ?, description = ? WHERE id = ?",
            (
                request.form["name"],
                request.form["price"],
                request.form["description"],
                id
            )
        )
        db.commit()
        return redirect(url_for("pizza_show", id=id))

    return render_template("pizza/edit.html", pizza=pizza)


@app.route("/pizza/<int:id>/delete", methods=["POST"])
def pizza_delete(id):
    db = get_db()
    db.execute("DELETE FROM pizza WHERE id = ?", (id,))
    db.commit()
    return redirect(url_for("pizza_index"))


if __name__ == "__main__":
    app.run(port=57919, debug=True)