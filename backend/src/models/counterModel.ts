import mongoose, { Schema, Document } from 'mongoose';

// Interface for the Counter
interface ICounter extends Document {
  seq: number;
}

// Schema for the counter to track question IDs
const counterSchema: Schema = new Schema({
  seq: { type: Number, required: true },
});

const Counter = mongoose.model<ICounter>('Counter', counterSchema);

export default Counter;
