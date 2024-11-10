import mongoose, { Document, Schema } from 'mongoose';

export interface ITestcase extends Document {
  questionId: number;
  title: string;
  input1: string;
  output1: string;
  input2: string;
  output2: string;
}

const TestcaseSchema: Schema = new Schema({
  questionId: { type: Number, unique: true },
  title: { type: String, unique: true },
  input1: { type: String, required: true },
  output1: { type: String, required: true },
  input2: { type: String, required: true },
  output2: { type: String, required: true },
});

export default mongoose.model<ITestcase>('Testcase', TestcaseSchema);
