import {IAnswer} from 'src/components/amthauer/interfaces/IAnswer';

export interface IQuestion {
  id?: number;
  component: number;
  question_text: string | null;
  difficulty_level: number | null;
  order: number | null;
  is_active: boolean;
  answers: IAnswer[];
}
