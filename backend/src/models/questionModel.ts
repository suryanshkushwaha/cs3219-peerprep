import mongoose, { Document, Schema } from 'mongoose';

// Interface for the Question document
interface IQuestion extends Document {
    questionId: number;
    title: string;
    description: string;
    categories: string[];
    complexity: string;
}

// Mongoose schema for the Question model
const questionSchema: Schema = new Schema({
    questionId: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },  // Array for multiple categories
    complexity: { type: String, required: true }
});

// Indexing for effecient search
questionSchema.index({ complexity: 1 });               // Single index for complexity
questionSchema.index({ categories: 1 });               // Single index for categories
questionSchema.index({ categories: 1, complexity: 1 }); // Compound index for both

// Index by difficulty by default (custom comparator logic implemented)
questionSchema.post('find', function(docs: IQuestion[], next) {
    const difficultyMap: Record<string, number> = {
      Easy: 1,
      Medium: 2,
      Hard: 3
    };
  
    // Sort the documents in-memory based on the difficultyMap
    docs.sort((a, b) => {
      return difficultyMap[a.complexity] - difficultyMap[b.complexity];
    });
  
    next();
  });

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export default Question;
export { IQuestion };
