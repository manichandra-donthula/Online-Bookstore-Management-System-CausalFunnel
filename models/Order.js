const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: String, required: true },
  books: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalCost: { type: Number, required: true },
  shippingAddress: { type: String },
});

module.exports = mongoose.model("Order", orderSchema);
