import Loki from 'lokijs';
import type { Checkout, Session } from '@/types';

const MINUTE = 1000 * 60;
const HOUR = MINUTE * 60;

if (!global.loki) {
  global.loki = new Loki('card-payments.db');
  global.loki.addCollection<Session>('sessions', {
    ttl: HOUR, // 1 hour for the document to be stale
    ttlInterval: 10 * MINUTE, // clear stale docs ever 10 min
  });
  global.loki
    .addCollection<Checkout>('checkouts', {
      ttl: HOUR, // 1 hour for the document to be stale
      ttlInterval: 10 * MINUTE, // clear stale docs ever 10 min
    })
    .on('insert', (doc) => {
      // eslint-disable-next-line no-param-reassign
      doc.id = doc.$loki;
    });
}

const loki = global.loki;

export { loki };
