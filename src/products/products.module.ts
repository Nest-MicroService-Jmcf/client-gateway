import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCT_SERVICE } from 'src/config';
import { options } from 'joi';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: PRODUCT_SERVICE,
        transport: Transport.TCP , 
        options: {
          port: envs.ordersMicroservicePort, 
          host: envs.ordersMicroserviceHost}
      
      },
       
    ]),
  ]
})
export class ProductsModule {}
