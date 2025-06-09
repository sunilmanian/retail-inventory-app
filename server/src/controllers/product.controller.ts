import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (_: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, quantity, price } = req.body;

  if (!name || quantity == null || price == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const product = await prisma.product.create({
      data: { name, quantity, price },
    });
    res.status(201).json(product);
  } catch {
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;

  try {
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, quantity, price },
    });
    res.json(product);
  } catch {
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.product.delete({ where: { id: Number(id) } });
    res.status(204).end();
  } catch {
    res.status(500).json({ message: 'Error deleting product' });
  }
};
