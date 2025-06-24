export class PaginatedResponse<T = any> {
  statusCode: number;
  message: string[];
  error: string | null;
  data: T[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };

  constructor(
    items: T[],
    meta: { total: number; page: number; lastPage: number },
    message: string | string[] = ['Successful request'],
    statusCode = 200,
  ) {
    this.statusCode = statusCode;
    this.message = Array.isArray(message) ? message : [message];
    this.error = null;
    this.data = items;
    this.meta = meta;
  }
}