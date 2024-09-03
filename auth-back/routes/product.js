// routes/products.js
const express = require('express');
const Product = require('../schema/product'); // Asegúrate de que esta ruta sea correcta

const { jsonResponse } = require('../lib/jsonResponse'); // Asegúrate de que esta ruta sea correcta
const router = express.Router();

// Crear un producto
router.post('/', async (req, res) => {
  const { name, price, description, category, stock } = req.body;

  if (!name || price == null) {  // Asegúrate de que `price` pueda ser 0
    return res.status(400).json(
      jsonResponse(400, { error: 'Name and price are required' })
    );
  }

  try {
    const newProduct = new Product({ name, price, description, category, stock });
    await newProduct.save();
    res.status(201).json(
      jsonResponse(201, { message: 'Product created successfully', product: newProduct })
    );
  } catch (err) {
    console.error('Error creating product:', err);  // Añadido para depuración
    res.status(500).json(
      jsonResponse(500, { error: 'Error creating product' })
    );
  }
});

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(
      jsonResponse(200, { products })
    );
  } catch (err) {
    res.status(500).json(
      jsonResponse(500, { error: 'Error fetching products' })
    );
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json(
        jsonResponse(404, { error: 'Product not found' })
      );
    }

    res.status(200).json(
      jsonResponse(200, { product })
    );
  } catch (err) {
    res.status(500).json(
      jsonResponse(500, { error: 'Error fetching product' })
    );
  }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, description, category, stock } = req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, description, category, stock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json(
        jsonResponse(404, { error: 'Product not found' })
      );
    }

    res.status(200).json(
      jsonResponse(200, { message: 'Product updated successfully', product: updatedProduct })
    );
  } catch (err) {
    res.status(500).json(
      jsonResponse(500, { error: 'Error updating product' })
    );
  }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json(
        jsonResponse(404, { error: 'Product not found' })
      );
    }

    res.status(200).json(
      jsonResponse(200, { message: 'Product deleted successfully' })
    );
  } catch (err) {
    res.status(500).json(
      jsonResponse(500, { error: 'Error deleting product' })
    );
  }
});

module.exports = router;
