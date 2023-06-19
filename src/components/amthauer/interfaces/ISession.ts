import {IScoreResult} from 'src/components/amthauer/interfaces/IScoreResult';


export interface ISessionFinish {
  end_time: string | null;
  // score_result?: IScoreResult | null;
}

export interface ISession extends ISessionFinish{
  id?: number;
  participant_id?: number;
  participant?: number;
  title?: string | null;
  test_date: string | null;
  ip_address: string | null;
  test_location: string | null;
  start_time: string | null;
  // end_time: string | null;
  score_result?: IScoreResult | null;
}
