export class ApiError extends Error {
  public constructor(public readonly statusCode: number, message?: string) {
    super(message);
  }
}
