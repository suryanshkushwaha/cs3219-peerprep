export interface Request {
    userId: string;
    topic: string;
    difficulty: string;
    status: 'pending' | 'matched';
    createdAt: Date;
  }