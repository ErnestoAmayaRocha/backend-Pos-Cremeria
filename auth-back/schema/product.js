const Mongoose = require("mongoose");

const ProductSchema = new Mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

// Método de instancia para verificar si el producto está en stock
ProductSchema.methods.isInStock = function () {
  return this.stock > 0;
};

// Hook pre-save para asegurar que el precio siempre sea positivo
ProductSchema.pre("save", function (next) {
  if (this.isModified("price") || this.isNew) {
    if (this.price < 0) {
      return next(new Error("Price cannot be negative"));
    }
  }
  next();
});

module.exports = Mongoose.model("Product", ProductSchema);
