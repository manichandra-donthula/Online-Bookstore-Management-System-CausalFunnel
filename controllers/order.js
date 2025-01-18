const Order = require("../models/Order");
const Book = require("../models/Book");

// Place an order
exports.placeOrder = async (req, res) => {
  const { customer, books, shippingAddress } = req.body;

  if (!customer || !books || books.length === 0) {
    return res.status(400).json({ error: "Customer and books are required" });
  }

  try {
    let totalCost = 0;

    // Validate books and calculate total cost
    const orderBooks = await Promise.all(
      books.map(async (orderItem) => {
        const book = await Book.findById(orderItem.book);
        if (!book || book.quantity < orderItem.quantity) {
          throw new Error(`Invalid quantity for book: ${book?.title || orderItem.book}`);
        }
        book.quantity -= orderItem.quantity;
        await book.save();

        totalCost += book.price * orderItem.quantity;
        return { book: book._id, quantity: orderItem.quantity, price: book.price };
      })
    );

    // Create the order
    const order = await Order.create({
      customer,
      books: orderBooks,
      totalCost,
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to place order", details: error.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("books.book", "title price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve orders", details: error.message });
  }
};
