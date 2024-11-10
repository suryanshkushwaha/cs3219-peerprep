import axios from 'axios';

const API_URL = 'http://localhost:8080/api/testcases';

export interface Testcase {
  questionId: number;
  title: string;
  input1: string;
  output1: string;
  input2: string;
  output2: string;
}

export const getTestcasesByTitle = async (title: string): Promise<Testcase | null> => {
  try {
    const response = await axios.get<Testcase>(`${API_URL}/${title}`);
    console.log('Fetched testcases:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching testcases:', error);
    throw error;
  }
};
