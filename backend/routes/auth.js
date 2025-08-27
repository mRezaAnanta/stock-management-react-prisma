import express from 'express'
import { registerUser, loginUser, currentUser } from '../controllers/authController.js'
const routerAuth = express.Router()
import auth from '../middleware/auth.js'

routerAuth.post('/register', registerUser)
routerAuth.post('/login', loginUser)
routerAuth.get('/me', auth, currentUser)

export default routerAuth
