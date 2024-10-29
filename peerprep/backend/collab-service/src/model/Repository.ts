import { Session, ISession } from './Session';

export const createSession = async (data: ISession) => {
  const session = new Session(data);
  return await session.save();
};

export const findSessionById = async (collabId: string) => {
  return await Session.findOne({ collabId });
};
