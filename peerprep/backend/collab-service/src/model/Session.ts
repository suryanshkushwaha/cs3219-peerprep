import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
  collabId: string;
  users: string[];
  language: string;
  difficulty: string;
  code: Uint8Array;
}

const sessionSchema = new Schema<ISession>({
  collabId: { type: String, required: true },
  users: { type: [String], required: true },
  language: { type: String, required: true },
  difficulty: { type: String, required: true },
  code: { type: Buffer, required: true } // Buffer to store Yjs Uint8Array data
});

export const Session = mongoose.model<ISession>('Session', sessionSchema);

