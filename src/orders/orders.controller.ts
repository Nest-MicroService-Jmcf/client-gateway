import { Controller, Get,Post,Body,Param,Inject,HttpStatus,ParseUUIDPipe, } from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CreateOrderDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { AppResponse } from 'src/common/dto/response.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersClient.send('findAllOrders', {});
  }


  @Get(':id')
  async findOne(@Param('id' ,ParseUUIDPipe ) id: string) {
    try {
      console.log('findOne', id);
      const order = await firstValueFrom(
        this.ordersClient.send('findOneOrder', {id}),
      );

      return new AppResponse(
        order,
        'Orden encontrada correctamente',
        HttpStatus.OK,
      );
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : typeof error.message === 'string'
            ? error.message
            : 'Unexpected error';

      // No lances RpcException desde el Gateway, mejor usa un HttpException
      throw new RpcException({
        statusCode: 400,
        message,
        error: 'Bad Request',
      });
    }
  }
}
