import { Request, Response } from 'express';
import Shoe, { IShoe } from '../models/Shoe';

export const getShoes = async (req: Request, res: Response): Promise<void> => {
  const shoes: IShoe[] = await Shoe.find({});
  res.json(shoes);
};

export const createShoe = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, price, description, imageUrl } = req.body;
  
      const shoe = new Shoe({ name, price, description, imageUrl });
      const createdShoe = await shoe.save();
  
      res.status(201).json(createdShoe);
    } catch (error) {
      console.error('Failed to create shoe:', error);
      res.status(500).json({ message: 'Failed to create shoe'});
    }
  };
  

export const getShoeById = async (req: Request, res: Response): Promise<void> => {
  const shoe = await Shoe.findById(req.params.id);
  if (shoe) {
    res.json(shoe);
  } else {
    res.status(404);
    throw new Error('Shoe not found');
  }
};
