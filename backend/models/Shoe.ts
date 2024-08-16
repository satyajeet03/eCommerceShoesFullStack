import mongoose, { Document, Schema } from 'mongoose';

export interface IShoe extends Document {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const shoeSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  imageUrl: { type: String },
});

const Shoe = mongoose.model<IShoe>('Shoe', shoeSchema);

export default Shoe;
