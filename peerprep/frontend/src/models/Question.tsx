export interface Question {
  _id: string;
  title: string;
  description: string;
  categories: string[];
  difficulty: string;
  questionId: number;
}