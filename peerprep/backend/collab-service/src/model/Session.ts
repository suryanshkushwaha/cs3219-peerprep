import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  collabId: string;
  users: string[];
  language: string;
  difficulty: string;
  code: string;
}

const sessionSchema: Schema = new Schema({
  collabId: { type: String, required: true, unique: true },
  users: { type: [String], required: true },
  language: { type: String, required: true },
  difficulty: { type: String, required: true },
  code: { type: String, default: '' }
});

export const Session = mongoose.model<ISession>('Session', sessionSchema);
