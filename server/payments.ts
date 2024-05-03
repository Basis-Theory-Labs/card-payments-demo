import { Client, JWTScope } from '@gr4vy/node';
import * as fs from 'fs';
import * as process from 'process';

// const key = String(fs.readFileSync('server/private.key'));

const client = new Client({
  gr4vyId: 'example',
  // This version of Next.js has issues with multi line .env
  privateKey: (process.env.GR4VY_PRIVATE_KEY as string).replaceAll('\\n', '\n'),
});

export const getBearerToken = () => {
  // @ts-ignore
  return client.getBearerToken(['transactions.write']);
};
