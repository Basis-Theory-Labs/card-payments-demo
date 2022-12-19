interface Session {
  id: string;
  publicApiKey: string;
  privateApiKey: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
}

export type { Session };
