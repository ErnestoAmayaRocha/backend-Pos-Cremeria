const express = require('express');
const router = express.Router();
const Proveedor = require('../schema/proveedor'); 

// Ruta para crear un nuevo proveedor
router.post('/crear', async (req, res) => {
  const { nombreCompleto, email, telefono, direccion, razonSocial, productosQueVende } = req.body;

  if (!nombreCompleto || !email || !telefono || !direccion || !razonSocial || !productosQueVende) {
    return res.status(400).json({ error: 'Todos los campos son necesarios' });
  }

  try {
    const nuevoProveedor = new Proveedor({
      nombreCompleto,
      email,
      telefono,
      direccion,
      razonSocial,
      productosQueVende
    });

    const proveedorGuardado = await nuevoProveedor.save();
    res.status(201).json({
      message: 'Proveedor creado exitosamente',
      proveedor: proveedorGuardado
    });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
});

// Ruta para obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.status(200).json(proveedores);
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ error: 'Error al obtener proveedores' });
  }
});

// Ruta para buscar un proveedor por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const proveedor = await Proveedor.findById(id);

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(200).json(proveedor);
  } catch (error) {
    console.error('Error al buscar proveedor:', error);
    res.status(500).json({ error: 'Error al buscar proveedor' });
  }
});

// Ruta para actualizar un proveedor
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombreCompleto, email, telefono, direccion, razonSocial, productosQueVende } = req.body;

  try {
    const proveedorActualizado = await Proveedor.findByIdAndUpdate(
      id,
      { nombreCompleto, email, telefono, direccion, razonSocial, productosQueVende },
      { new: true, runValidators: true }
    );

    if (!proveedorActualizado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(200).json({
      message: 'Proveedor actualizado exitosamente',
      proveedor: proveedorActualizado
    });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
});

// Ruta para eliminar un proveedor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const proveedorEliminado = await Proveedor.findByIdAndDelete(id);

    if (!proveedorEliminado) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(200).json({
      message: 'Proveedor eliminado exitosamente',
      proveedor: proveedorEliminado
    });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
});

module.exports = router;
