export interface Question {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  difficulty: string;
  questionId: number;
  input1: string;
  output1: string;
  input2: string;
  output2: string;
}