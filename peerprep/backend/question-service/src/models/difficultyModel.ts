import mongoose, { Schema, Document } from 'mongoose';

interface IDifficulty extends Document {
  level: string;
}

const DifficultySchema: Schema = new Schema({
  level: { type: String, required: true, unique: true }
});

export default mongoose.model<IDifficulty>('Difficulty', DifficultySchema);
