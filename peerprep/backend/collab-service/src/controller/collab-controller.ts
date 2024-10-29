import axios from 'axios';
import { Request, Response } from 'express';
import { Session } from '../model/Session';
import * as Y from 'yjs';
import { saveSession, fetchSession } from '../model/Repository';
import { setupYjsDocument } from '../utils/yjs';

const MATCHING_SERVICE_URL = process.env.MATCHING_SERVICE_URL || 'http://localhost:3001/api';

// Creates a collaboration session by using the existing sessionId from matching-service
export const createCollabSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Fetch session data from matching-service API
    const response = await axios.get(`${MATCHING_SERVICE_URL}/session/${sessionId}`);
    const sessionData = response.data.session;

    if (!sessionData) {
      return res.status(404).json({ message: 'Session not found in matching service' });
    }

    // Initialize Yjs document for real-time collaboration
    const ydoc = setupYjsDocument();
    const encodedState = Y.encodeStateAsUpdate(ydoc);

    // Create a new session document including Yjs code state
    const collabSession = new Session({
      ...sessionData,
      code: encodedState, // Yjs encoded document state
    });

    // Save collaboration session in MongoDB
    await saveSession(collabSession);

    res.status(201).json({ message: 'Collaboration session created', session: collabSession });
  } catch (error) {
    console.error("Error in createCollabSession:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch an existing collaboration session by sessionId
export const getCollabSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    // Retrieve the session from MongoDB
    const session = await fetchSession(sessionId);

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in getCollabSession:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


