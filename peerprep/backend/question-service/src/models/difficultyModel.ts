import mongoose, { Schema, Document } from 'mongoose';

interface IDifficulty extends Document {
  difficulty: string;
}

const DifficultySchema: Schema = new Schema({
  difficulty: { type: String, required: true, unique: true }
});

export default mongoose.model<IDifficulty>('Difficulty', DifficultySchema);
