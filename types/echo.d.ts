interface EchoResponse<T = unknown> {
  headers: Record<string, string>;
  url: string;
  json: T;
  method: string;
}

export type { EchoResponse };
