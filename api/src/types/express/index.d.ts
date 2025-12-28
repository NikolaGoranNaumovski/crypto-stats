// src/types/express/index.d.ts

type TokenPayload = {
  sub: string;
  email: string;
};

declare global {
  namespace Express {
    export interface Request {
      user?: TokenPayload; // This tells TypeScript that 'user' will be available in the request
    }
  }
}
