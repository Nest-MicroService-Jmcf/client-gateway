import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  HttpStatus,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';

import { CreateOrderDto } from './dto';
import { firstValueFrom } from 'rxjs';
import { AppResponse } from 'src/common/dto/response.dto';
import { handleRpcError } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  private readonly logger = new Logger('OrdersService');
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersClient.send('findAllOrders', {});
  }

  @Get(':id')
async findOne(@Param('id', ParseUUIDPipe) id: string) {
  try {
    console.log('findOne', id);
    const order = await firstValueFrom(
      this.ordersClient.send('findOneOrder', { id }),
    );

    return new AppResponse(
      order,
      'Orden encontrada correctamente',
      HttpStatus.OK,
    );
  } catch (error) {
    handleRpcError(error); // 👈 Aquí limpias el código
  }
}
}
