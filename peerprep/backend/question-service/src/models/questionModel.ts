import mongoose, { Document, Schema, ObjectId } from 'mongoose';
import Counter from './counterModel';

// Interface for the Question document
interface IQuestion extends Document {
    _id: ObjectId;
    questionId: number;
    title: string;
    description: string;
    categories: string[];
    difficulty: string;
}

// Mongoose schema for the Question model
const questionSchema: Schema = new Schema({
    questionId: { type: Number, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: { type: [String], required: true },  // Array for multiple categories
    difficulty: { type: String, required: true }
});

// Indexing for effecient search
questionSchema.index({ difficulty: 1 });               // Single index for difficulty
questionSchema.index({ categories: 1 });               // Single index for categories
questionSchema.index({ categories: 1, difficulty: 1 }); // Compound index for both

// Middleware to auto-increment questionId before saving
questionSchema.pre('save', async function (next) {
    const question = this as unknown as IQuestion;
  
    if (!question.isNew) return next();
  
    try {
      // Find and increment the counter value
      const counter = await Counter.findOneAndUpdate(
        {},                         
        { $inc: { seq: 1 } },        
        { new: true, upsert: true }
      );
  
      question.questionId = counter!.seq;  // Assign the incremented value to questionId
      next();
    } catch (error: any) {
      next(error as mongoose.CallbackError);
    }
  });

// Index by difficulty by default (custom comparator logic implemented)
questionSchema.post('find', function(docs: IQuestion[], next) {
    const difficultyMap: Record<string, number> = {
      easy: 1,
      medium: 2,
      hard: 3
    };
  
    // Sort the documents in-memory based on the difficultyMap
    docs.sort((a, b) => {
      return difficultyMap[a.difficulty] - difficultyMap[b.difficulty];
    });
  
    next();
  });

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export default Question;
export { IQuestion };
