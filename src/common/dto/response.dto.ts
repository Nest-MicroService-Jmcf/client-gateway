export class AppResponse<T = any> {
  statusCode: number;
  message: string[];
  error: string | null;
  data: T;

  constructor(
    data: T,
    message: string | string[] = ['Successful request'],
    statusCode = 200,
  ) {
    this.statusCode = statusCode;
    this.message = Array.isArray(message) ? message : [message];
    this.error = null;
    this.data = data;
  }
}