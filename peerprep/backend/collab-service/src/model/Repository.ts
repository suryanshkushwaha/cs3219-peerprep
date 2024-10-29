import { Session } from './Session';

export const saveSession = async (sessionData: any) => {
  const session = new Session(sessionData);
  await session.save();
};

export const fetchSession = async (sessionId: string) => {
  return await Session.findOne({ sessionId });
};
