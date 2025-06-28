import { RpcException } from '@nestjs/microservices';

export function handleRpcError(error: any): never {
  console.error('Gateway recibió error:', error);

  const extracted = error;

  const statusCode = extracted?.statusCode ?? 400;

  const message = Array.isArray(extracted?.message)
    ? extracted.message.join(', ')
    : typeof extracted?.message === 'string'
      ? extracted.message
      : typeof extracted === 'string'
        ? extracted
        : 'Unexpected error';

  throw new RpcException({
    statusCode,
    message,
    error: extracted?.error ?? 'Bad Request',
  });
}