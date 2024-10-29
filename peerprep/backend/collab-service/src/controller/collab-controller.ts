import { Request, Response } from 'express';
import { Session } from '../model/Session';
import * as Y from 'yjs';
import { saveSession, fetchSession } from '../model/Repository';
import { setupYjsDocument } from '../utils/yjs';

export const createSession = async (req: Request, res: Response) => {
  try {
    const { users, language, difficulty } = req.body;
    const collabId = new Date().getTime().toString();

    // Initialize Yjs document
    const ydoc = setupYjsDocument();
    const session = new Session({
      collabId,
      users,
      language,
      difficulty,
      code: Y.encodeStateAsUpdate(ydoc)
    });

    await saveSession(session);
    res.status(201).json({ message: 'Session created', session });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
  
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const { collabId } = req.params;
    const session = await fetchSession(collabId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};
