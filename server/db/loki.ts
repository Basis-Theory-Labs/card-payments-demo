import Loki from 'lokijs';
import type { Checkout, Session } from '@/types';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

const COLLECTION_TTL = 8 * HOUR;
const COLLECTION_TTL_INTERVAL = 10 * MINUTE;

if (!global.loki) {
  global.loki = new Loki('card-payments.db');
  global.loki.addCollection<Session>('sessions', {
    ttl: COLLECTION_TTL, // 1 hour for the document to be stale
    ttlInterval: COLLECTION_TTL_INTERVAL, // clear stale docs ever 10 min
  });
  global.loki
    .addCollection<Checkout>('checkouts', {
      ttl: COLLECTION_TTL, // 1 hour for the document to be stale
      ttlInterval: COLLECTION_TTL_INTERVAL, // clear stale docs ever 10 min
    })
    .on('insert', (doc) => {
      // eslint-disable-next-line no-param-reassign
      doc.id = doc.$loki;
    });
}

const loki = global.loki;

export { loki };
