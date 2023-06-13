import {defineStore} from 'pinia';
import {api} from 'boot/axios';
import {handleError} from 'src/utils/error-handle';
import {IComponent} from 'src/components/amthauer/interfaces/IComponent';
import {IParticipant} from 'src/components/amthauer/interfaces/IParticipant';
import {ISession} from "components/amthauer/interfaces/ISession";
import {IScoreResult} from "components/amthauer/interfaces/IScoreResult";

interface IAmthauerState {
  components: IComponent[];
  session: ISession;
  participant: IParticipant;
  participants: IParticipant[]
}

const initComponents: IComponent[] = []
const initParticipants: IParticipant[] = []
const initSession: ISession = {
  id: 0,
  participant: 0,
  title: null,
  test_date: null,
  ip_address: null,
  test_location: null,
  start_time: null,
  end_time: null,
  score_result: null,
}
const initParticipant: IParticipant = {
  id: 0,
  first_name: '',
  last_name: '',
  gender: null,
  date_of_birth: null,
  email: null,
  phone_number: null,
  session: null,
}


export const useAmthauerStore = defineStore('amthauer', {
  state: (): IAmthauerState => ({
    components: initComponents,
    participants: initParticipants,
    participant: initParticipant,
    session: initSession
  }),
  actions: {
    async fetchAmthauerTest(): Promise<void> {
      try {
        const response = await api.get<IComponent[]>('/api/v1/amthauer/get_test_data');
        this.components = response.data;
      } catch (error: any) {
        await handleError(error);
      }
    },
    async fetchParticipants(): Promise<void> {
      try {
        const response = await api.get<IParticipant[]>('/api/v1/amthauer/participant/all');
        this.participants = response.data;
      } catch (error: any) {
        await handleError(error);
      }
    },
    async createParticipant(participant: IParticipant): Promise<void> {
      try {
        const response = await api.post<IParticipant>('/api/v1/amthauer/participant/create', participant);
        this.participants.push(response.data);
        this.participant = response.data;
        if (this.participant.id) {
          const session: ISession = {
            participant: this.participant.id,
            participant: number;
            test_date: string | null;
            ip_address: string | null;
            test_location: string | null;
            start_time: string | null;
            end_time: string | null;
          }
          await this.createSession(session: ISession);

        }
      } catch (error: any) {
        await handleError(error);
      }
    },
    async createSession(session: ISession): Promise<void> {
      try {
        const response = await api.post<ISession>('/api/v1/amthauer/session/create', session);
        this.session = response.data;
        this.participant.session = response.data;
      } catch (error: any) {
        await handleError(error);
      }
    },
  }
});
