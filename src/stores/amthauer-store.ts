import {defineStore} from 'pinia';
import {api} from 'boot/axios';
import {handleError} from 'src/utils/error-handle';
import {IComponent} from 'src/components/amthauer/interfaces/IComponent';
import {IParticipant, IParticipantTable} from 'src/components/amthauer/interfaces/IParticipant';
import {ISession, ISessionFinish} from 'components/amthauer/interfaces/ISession';
import {IParticipantAnswer} from 'components/amthauer/interfaces/IParticipantAnswer';
import {IScoreResult} from 'components/amthauer/interfaces/IScoreResult';

interface IAmthauerState {
  components: IComponent[];
  session: ISession;
  participant: IParticipant;
  participants: IParticipant[];
  scoreResult: IScoreResult;
}

const initComponents: IComponent[] = []
const initParticipants: IParticipant[] = []

const initScoreResult: IScoreResult = {
  id: 0,
  session: 0,
  raw_score: 0,
  standardized_score: 0,
  percentile_rank: 0,
  time_taken_seconds: 0
}

const initSession: ISession = {
  id: 0,
  participant: 0,
  title: null,
  test_date: null,
  ip_address: null,
  test_location: null,
  start_time: null,
  end_time: null,
  score_result: initScoreResult,
}
const initParticipant: IParticipant = {
  id: 0,
  first_name: '',
  last_name: '',
  gender: null,
  date_of_birth: null,
  email: null,
  phone_number: null,
  session: initSession,
}

export const useAmthauerStore = defineStore('amthauer', {
  state: (): IAmthauerState => ({
    components: initComponents,
    participants: initParticipants,
    participant: initParticipant,
    session: initSession,
    scoreResult: initScoreResult
  }),
  getters: {
    getComponentLength(state): number {
      return state.components.length;
    },
    getParticipantTableData(state): IParticipantTable[] {

      const participantData = state.participants.map((participant) => {
        const session = participant.session ? participant.session : null;
        const scoreResult = session && session.score_result ? session.score_result : null;

        return {
          id: participant.id,
          first_name: participant.first_name,
          last_name: participant.last_name,
          date_of_birth: participant.date_of_birth,
          email: participant.email,
          phone_number: participant.phone_number,
          test_date: session && session.test_date ? session.test_date.slice(0, 10) : null,
          start_time: session && session.start_time ? session.start_time : null,
          end_time: session && session.end_time ? session.end_time : null,
          raw_score: scoreResult ? scoreResult.raw_score : null,
          standardized_score: scoreResult ? scoreResult.standardized_score : null,
          percentile_rank: scoreResult ? scoreResult.percentile_rank : null,
          time_taken_seconds: scoreResult ? scoreResult.time_taken_seconds : null,
        }
      });

      console.log(participantData)
      return participantData;
    },
  },
  actions: {
    async fetchAmthauerTest(): Promise<void> {
      try {
        const response = await api.get<IComponent[]>('/api/v1/amthauer/get_test_data');
        this.components = response.data.sort((a, b) => a.order - b.order);
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
            participant_id: this.participant.id,
            test_date: this.getCurrentDateTime(),
            ip_address: null,
            test_location: null,
            start_time: this.getCurrentDateTime(),
            end_time: null
          }
          console.log(session)
          await this.createSession(session);
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
    async updateSession(sessionId: number, sessionFinish: ISessionFinish): Promise<void> {
      console.log(sessionFinish)
      try {
        const response = await api.patch<ISession>(`/api/v1/amthauer/session/update/${sessionId}`, sessionFinish);
        this.session = response.data;
        this.participant.session = response.data;
      } catch (error: any) {
        await handleError(error);
      }
    },
    getCurrentDate(): string {
      const currentDate: Date = new Date();
      return currentDate.toLocaleDateString('sv-SE');
    },
    getCurrentDateTime(): string {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    async createParticipantAnswer(participantAnswer: IParticipantAnswer) {
      console.log('IParticipantAnswer', participantAnswer)
      try {
        const response = await api.post<IParticipantAnswer>('/api/v1/amthauer/participant_answer/create', participantAnswer);
        console.log('IParticipantAnswer RESP', response)
      } catch (error: any) {
        await handleError(error);
      }
    },
    async calculateScoreResult(sessionId: number) {
      try {
        const response = await api.get<IScoreResult>(`/api/v1/amthauer/score_result/calculate_score_result/${sessionId}`);
        this.scoreResult = response.data;
        this.session.score_result = response.data;
      } catch (error: any) {
        await handleError(error);
      }
    },
  }
});
