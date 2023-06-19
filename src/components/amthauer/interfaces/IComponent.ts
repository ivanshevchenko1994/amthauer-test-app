import {IQuestion} from 'src/components/amthauer/interfaces/IQuestion';

export interface IComponent {
  id: number;
  component_name: string;
  component_description: string | null;
  component_title: string;
  order: number;
  is_active: boolean;
  questions: IQuestion[];
}
