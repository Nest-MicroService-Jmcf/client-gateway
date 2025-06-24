import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const rpcError = exception.getError();

    const errorObj = rpcError as {
      status?: number;
      statusCode?: number;
      message?: string | string[];
      error?: string;
    };

    const statusCode =
      typeof errorObj.status === 'number'
        ? errorObj.status
        : errorObj.statusCode ?? 400;

    const originalMessage = errorObj.message;
    const message = Array.isArray(originalMessage)
      ? originalMessage
      : [originalMessage ?? 'Unexpected error'];

    const errorText = errorObj.error ?? 'Bad Request';

    return response.status(statusCode).json({
      message,
      error: errorText,
      statusCode,
    });
  }
}
