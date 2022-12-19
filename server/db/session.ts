import type { Session } from '@/types';
import './loki';

const sessions = () => global.loki.getCollection<Session>('sessions');

const insertSession = (doc: Session) => sessions().insert(doc) as Session;
const findSession = (id: string) =>
  sessions().findOne({
    id: {
      $eq: id,
    },
  });
const removeSession = (id: string) =>
  sessions().removeWhere({
    id: {
      $eq: id,
    },
  });

export { insertSession, findSession, removeSession };
