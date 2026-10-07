export interface JwtUserPayload {
  id: string;
  role: 'ADMIN' | 'USER';
  rut: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
