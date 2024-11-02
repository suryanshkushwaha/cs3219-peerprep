import mongoose, { Schema, Document } from 'mongoose';

interface ITopic extends Document {
  name: string;
}

const TopicSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true }
});

export default mongoose.model<ITopic>('Topic', TopicSchema);
