const db = require("../config/db");

const Car = {
  addCar: async ({ model, brand, year, price, availability = 1, image = null }) => {
    const [result] = await db.execute(
      "INSERT INTO cars (model, brand, year, price, availability, image) VALUES (?, ?, ?, ?, ?, ?)",
      [model, brand, year, price, availability, image]
    );
    return result.insertId;
  },

  getCars: async () => {
    const [results] = await db.execute("SELECT * FROM cars ORDER BY id DESC");
    return results;
  },

  getCarById: async (id) => {
    const [results] = await db.execute("SELECT * FROM cars WHERE id = ?", [id]);
    return results[0] || null;
  },

  updateCar: async (id, data) => {
    const { model, brand, year, price, availability, image } = data;
    const [result] = await db.execute(
      "UPDATE cars SET model = ?, brand = ?, year = ?, price = ?, availability = ?, image = ? WHERE id = ?",
      [model, brand, year, price, availability ?? 1, image ?? null, id]
    );
    return result.affectedRows;
  },

  deleteCar: async (id) => {
    const [result] = await db.execute("DELETE FROM cars WHERE id = ?", [id]);
    return result.affectedRows;
  }
};

module.exports = Car;
