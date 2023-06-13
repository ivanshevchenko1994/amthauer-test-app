import {ISession} from 'src/components/amthauer/interfaces/ISession';
import {Gender} from 'src/components/amthauer/constants/GenderStrings';

export interface IParticipant {
  id?: number;
  user?: number;
  first_name: string ;
  last_name: string;
  gender: Gender | null;
  date_of_birth: string | null;
  email: string | null;
  phone_number: string | null;
  session?: ISession | null;
}
