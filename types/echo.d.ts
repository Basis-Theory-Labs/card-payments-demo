interface EchoResponse<T = unknown> {
  headers: Record<string, string>;
  url: string;
  json: T;
  method: string;
}

interface Connection {
  id: string;
  name: string;
}

export type { EchoResponse, Connection };
