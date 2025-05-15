import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: 'Not authorized. Login again' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET!);
    if (
      typeof tokenDecode === 'object' &&
      tokenDecode !== null &&
      'id' in tokenDecode
    ) {
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: 'Not authorized. Login again',
      });
    }

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};
