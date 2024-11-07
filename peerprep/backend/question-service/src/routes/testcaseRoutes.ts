import express, { Request, Response } from 'express';
import Testcase, { ITestcase } from '../models/testcaseModel';

const router = express.Router();

router.get('/testcases/:title', async (req: Request, res: Response) => {
  const { title } = req.params;
  try {
    const testcase: ITestcase | null = await Testcase.findOne({ title });
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
