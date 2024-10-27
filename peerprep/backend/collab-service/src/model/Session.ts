import mongoose, { Document, Schema } from 'mongoose';

// FIX ME
interface ISession extends Document {
  sessionId: string; 
  participants: string[]; 
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>({
  sessionId: { type: String, required: true, unique: true },
  participants: { type: [String], required: true }, // An array of user IDs or usernames
}, {
  timestamps: true, // Automatically handles createdAt and updatedAt
});

const Session = mongoose.model<ISession>('Session', SessionSchema);

export default Session;
