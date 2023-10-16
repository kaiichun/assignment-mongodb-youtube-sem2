const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = require("./user");

const orderSchema = new Schema({
  customerName: {
    type: String,
    required: true,
  },

  customerEmail: {
    type: String,
    required: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  totalPrice: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Paid", "Failed"],
  },

  billplz_id: {
    type: String,
    required: true,
  },

  paid_at: {
    type: Date,
  },
});

const Order = model("Order", orderSchema);
module.exports = Order;
