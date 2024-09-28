import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Question document
interface IQuestion extends Document {
    questionId: number;
    title: string;
    description: string;
    category: string;
    complexity: string;
}

// Mongoose schema for the Question model
const questionSchema: Schema = new Schema({
    questionId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    complexity: { type: String, required: true }
});

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;
