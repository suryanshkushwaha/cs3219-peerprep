import express, { Request, Response } from 'express';
import Testcase, { ITestcase } from '../models/Testcase';

const router = express.Router();

router.get('/testcases/:questionId', async (req: Request, res: Response) => {
  const { questionId } = req.params;
  try {
    const testcase: ITestcase | null = await Testcase.findOne({ questionId });
    if (!testcase) {
      return res.status(404).json({ message: 'Testcases not found' });
    }
    res.json(testcase);
  } catch (error) {
    console.error('Error fetching testcases:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
