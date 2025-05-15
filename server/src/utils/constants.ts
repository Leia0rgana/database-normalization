import { CookieOptions } from 'express';

export const WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: WEEK_IN_MILLISECONDS,
};
