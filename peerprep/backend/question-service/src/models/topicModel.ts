import mongoose, { Schema, Document } from 'mongoose';

interface ITopic extends Document {
  topic: string;
}

const TopicSchema: Schema = new Schema({
  topic: { type: String, required: true, unique: true }
});

export default mongoose.model<ITopic>('Topic', TopicSchema);
