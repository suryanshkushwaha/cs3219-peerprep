import { Socket } from 'socket.io';

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;
  
  // FIX ME: need to replace with real validation
  if (token === 'valid_token') {
    return next();
  }
  
  const err = new Error('Authentication error');
  next(err);
};
