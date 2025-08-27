import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide name, email, and password'})

    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long'})

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) return res.status(400).json({ message: 'User already exists with this email'})

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: { id: true, name: true, email: true, createdAt: true }
    })

    // FIX: server 500
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error during registration' })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) return res.status(400).json({ message: 'Please provide email, and password'})

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) return res.status(400).json({ message: 'Invalid credentials'})

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials'})

    // FIX: status 500
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error during login' })
  }
}

export const currentUser = async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
