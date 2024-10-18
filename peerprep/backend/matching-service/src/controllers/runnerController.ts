// import { Request, Response } from 'express';
// import SessionObj from '../models/SessionObj';

// // collaboration session start
// export const startSession = async (req: Request, res: Response): Promise<void> => {
//   const { userId1, userId2, topic, difficulty } = req.body;

//   const newSession: SessionObj = {
//     userId1,
//     userId2,
//     topic,
//     difficulty,
//     sessionId: `${userId1}-${userId2}-${Date.now()}`,
//     startedAt: new Date(),
//   };

//   res.status(200).json({ message: 'Collaboration session started', data: newSession });
// };
