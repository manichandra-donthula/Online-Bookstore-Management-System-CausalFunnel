const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  author: [{ type: mongoose.Schema.Types.ObjectId, ref: "Author" }],
});

module.exports = mongoose.model("Book", bookSchema);
  