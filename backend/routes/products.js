import express from 'express'
import { getAllProducts, getProductById, createNewProduct, updateProductById, deleteProductById } from '../controllers/productController.js'
const router = express.Router()

// Get all products for the authenticated user
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', createNewProduct)
router.put('/:id', updateProductById)
router.delete('/:id', deleteProductById)

export default router
