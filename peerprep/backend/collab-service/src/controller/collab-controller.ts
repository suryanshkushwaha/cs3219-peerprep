import { Request, Response } from 'express';
import { getDocumentCollection } from '../db/client';
import * as Y from 'yjs';

const COLLECTION_NAME = process.env.COLLECTION_NAME || 'collaboration_sessions';

export const createSession = async (req: Request, res: Response) => {
  const { sessionId, initialData } = req.body;
  const collection = await getDocumentCollection(COLLECTION_NAME);

  // Create Yjs document and encode initial state
  const ydoc = new Y.Doc();
  ydoc.getText('codemirror').insert(0, initialData || '');
  const encodedState = Y.encodeStateAsUpdate(ydoc);

  await collection.insertOne({ sessionId, data: encodedState });
  res.status(201).json({ message: 'Session created', sessionId });
};

export const getSession = async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const collection = await getDocumentCollection(COLLECTION_NAME);

  const session = await collection.findOne({ sessionId });
  if (!session) {
    return res.status(404).json({ message: 'Session not found' });
  }

  res.json(session);
};
