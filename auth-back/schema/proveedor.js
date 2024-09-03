const mongoose = require('mongoose');

// Definir el esquema de Proveedor
const proveedorSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true }, // Campo de dirección simple
  razonSocial: { type: String, required: true },
  productosQueVende: { type: [String], required: true } // Array de strings para productos
});

// Exportar el modelo basado en el esquema
module.exports = mongoose.model('Proveedor', proveedorSchema);
