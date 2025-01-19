const Order = require("../models/Order");
const Book = require("../models/Book");

/**
 * @swagger
 * tags:
 *   - name: "Orders"
 *     description: "Operations related to orders"
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: ["Orders"]
 *     summary: Place an order
 *     description: Allows a customer to place an order, validating book availability and calculating the total cost.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer:
 *                 type: string
 *                 description: Customer's name or ID
 *               books:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     book:
 *                       type: string
 *                       description: Book's unique ID
 *                     quantity:
 *                       type: number
 *                       description: Quantity of the book being ordered
 *                     price:
 *                       type: number
 *                       description: Price per book
 *               shippingAddress:
 *                 type: string
 *                 description: Shipping address for the order
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 customer:
 *                   type: string
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       book:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                 totalCost:
 *                   type: number
 *                 shippingAddress:
 *                   type: string
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Customer and books are required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to place order"
 */
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

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: ["Orders"]
 *     summary: Get all orders
 *     description: Retrieves a list of all orders, including the details of books and total costs.
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   customer:
 *                     type: string
 *                   books:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         book:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         price:
 *                           type: number
 *                   totalCost:
 *                     type: number
 *                   shippingAddress:
 *                     type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to retrieve orders"
 */
// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("books.book", "title price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve orders", details: error.message });
  }
};
