export const WS_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://your-production-url.com' 
  : 'ws://localhost:3000';

export const ROOM_NAME = 'plate-collab-room';