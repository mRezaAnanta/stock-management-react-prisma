import React, { createContext, useContext, useReducer } from 'react'
import { productsAPI } from '../services/api'

const ProductContext = createContext()

const initialState = {
  products: [],
  loading: false,
  error: null,
}

const productReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false, error: null }
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [action.payload, ...state.products],
        loading: false,
        error: null,
      }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        loading: false,
        error: null,
      }
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter((product) => product.id !== action.payload),
        loading: false,
        error: null,
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, initialState)

  const fetchProducts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await productsAPI.getProducts()
      dispatch({ type: 'SET_PRODUCTS', payload: response.data.products })
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch products'
      dispatch({ type: 'SET_ERROR', payload: message })
    }
  }

  const createProduct = async (productData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const response = await productsAPI.createProduct(productData)
      dispatch({ type: 'ADD_PRODUCT', payload: response.data.product })

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create product'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const updateProduct = async (id, productData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const response = await productsAPI.updateProduct(id, productData)
      dispatch({ type: 'UPDATE_PRODUCT', payload: response.data.product })

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const deleteProduct = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      await productsAPI.deleteProduct(id)
      dispatch({ type: 'DELETE_PRODUCT', payload: id })

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete product'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const updateStock = async (id, stockData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      const response = await productsAPI.updateStock(id, stockData)
      dispatch({ type: 'UPDATE_PRODUCT', payload: response.data.product })

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update stock'
      dispatch({ type: 'SET_ERROR', payload: message })
      return { success: false, error: message }
    }
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value = {
    products: state.products,
    loading: state.loading,
    error: state.error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    clearError,
  }

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}
