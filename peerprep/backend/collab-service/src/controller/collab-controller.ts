import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../model/Session';
import * as Y from 'yjs';

export const createSession = async (req: Request, res: Response) => {
  try {
    const { users, language, difficulty } = req.body;
    const collabId = uuidv4();
    const ydoc = new Y.Doc();
    const encodedState = Buffer.from(Y.encodeStateAsUpdate(ydoc)).toString('base64');

    const session = new Session({
      collabId,
      users,
      language,
      difficulty,
      code: encodedState
    });
    await session.save();

    res.status(201).json({ message: 'Session created', session });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await Session.findOne({ collabId: id });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

