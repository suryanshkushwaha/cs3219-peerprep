import { Request, Response, NextFunction } from 'express';

export const normalizeQuestionData = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) {
    if (Array.isArray(req.body.categories)) {
      req.body.categories = req.body.categories.map((cat: string) => cat.toLowerCase());
    }
    if (typeof req.body.difficulty === 'string') {
      req.body.difficulty = req.body.difficulty.toLowerCase();
    }
  }
  next();
};
