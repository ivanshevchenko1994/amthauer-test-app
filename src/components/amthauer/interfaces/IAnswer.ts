export interface IAnswer {
  id?: number;
  question: number;
  answer_text: string;
  is_correct: boolean;
  order: number | null;
  is_active: boolean;
}
