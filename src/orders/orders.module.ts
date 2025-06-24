import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ORDER_SERVICE  , envs} from 'src/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [OrdersController],
  providers: [],
  imports: [
     ClientsModule.register([
          { 
            name: ORDER_SERVICE,
            transport: Transport.TCP , 
            options: {
              port: envs.ordersMicroservicePort, 
              host: envs.ordersMicroserviceHost}
          
          },
           
        ]),
  ] , 

})
export class OrdersModule {}
