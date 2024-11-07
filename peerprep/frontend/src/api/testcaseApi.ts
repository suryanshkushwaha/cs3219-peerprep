import axios from 'axios';

const API_URL = 'http://localhost:8080/api/testcases';

export interface Testcase {
  questionId: number;
  input1: string;
  output1: string;
  input2: string;
  output2: string;
}

export const getTestcasesByQuestionId = async (questionId: number): Promise<Testcase | null> => {
  try {
    const response = await axios.get<Testcase>(`${API_URL}/${questionId}`);
    console.log('Fetched testcases:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching testcases:', error);
    throw error;
  }
};
