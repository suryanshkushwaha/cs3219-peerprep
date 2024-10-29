import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  sessionId: string;
  userId1: string;
  userId2: string;
  topic: string;
  difficulty: string;
  timestamp: number;
  code: Uint8Array;
}

const sessionSchema = new Schema<ISession>({
  sessionId: { type: String, required: true },
  userId1: { type: String, required: true },
  userId2: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  timestamp: { type: Number, required: true },
  code: { type: Buffer, required: true }, // Using Buffer for Uint8Array
});

export const Session = mongoose.model<ISession>('Session', sessionSchema);
