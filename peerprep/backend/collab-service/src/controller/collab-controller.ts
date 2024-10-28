import { Request, Response } from 'express';
import Session from '../model/Session';

// Create a new collaboration session
export const createSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(201).json({ sessionId: session._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating session', error });
  }
};

// Retrieve session details
export const getSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving session', error });
  }
};

// End a session
export const endSession = async (req: Request, res: Response): Promise<void> => {
  try {
    await Session.findByIdAndDelete(req.params.sessionId);
    res.status(200).json({ message: 'Session ended' });
  } catch (error) {
    res.status(500).json({ message: 'Error ending session', error });
  }
};

// Example endpoint to receive data, perform operation, and respond
export const processData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data } = req.body;

    // Perform a sample operation (e.g., reversing a string)
    const result = data.split('').reverse().join('');

    // Send back the processed result
    res.status(200).json({ original: data, processed: result });
  } catch (error) {
    res.status(500).json({ message: 'Error processing data', error });
  }
};

