import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ products })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ message: 'Server error while fetching products' })
  }
}

// Get a single product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await prisma.product.findFirst({
      where: { 
        id: productId,
        // FIX: id is undefined
        userId: req.user.id 
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error while fetching product' });
  }
}

// Create a new product
export const createNewProduct = async (req, res) => {
  try {
    const { name, description, price, stock, sku } = req.body;

    // Validation
    if (!name || price === undefined || !sku) {
      return res.status(400).json({ message: 'Please provide name, price, and SKU' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    if (stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Check if SKU already exists
    const existingSku = await prisma.product.findUnique({
      where: { sku }
    });

    if (existingSku) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        sku,
        // FIX: id is undefined
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error while creating product' });
  }
}

export const updateProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const { name, description, price, stock, sku } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: { 
        id: productId,
        userId: req.user.id 
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Validation
    if (price !== undefined && price < 0) {
      return res.status(400).json({ message: 'Price cannot be negative' });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({ message: 'Stock cannot be negative' });
    }

    // Check if new SKU already exists (if SKU is being changed)
    if (sku && sku !== existingProduct.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku }
      });

      if (existingSku) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(sku && { sku })
      }
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error while updating product' });
  }
}

export const deleteProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: { 
        id: productId,
        userId: req.user.id 
      }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id: productId }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error while deleting product' });
  }
}
