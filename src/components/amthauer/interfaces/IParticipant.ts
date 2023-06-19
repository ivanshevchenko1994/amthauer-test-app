import {ISession} from 'src/components/amthauer/interfaces/ISession';

export interface IParticipant {
  id?: number;
  user?: number;
  first_name: string ;
  last_name: string;
  gender: number | null;
  date_of_birth: string | null;
  email: string | null;
  phone_number: string | null;
  session?: ISession;
}

export interface IParticipantTable {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone_number: string;
  test_date: string | null;
  start_time: string | null;
  end_time: string | null;
  raw_score: number | null;
  standardized_score: number | null;
  percentile_rank: number | null;
  time_taken_seconds: number | null;
}
