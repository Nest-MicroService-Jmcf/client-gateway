import { Controller, Post ,Delete, Patch, Get, Param, Body, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { paginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';


@Controller('products')
export class ProductsController {
  constructor(

    @Inject(PRODUCT_SERVICE) private readonly productsClient :  ClientProxy

  ) {}

  @Post()
  createProduct(){
    return 'creates a product'
  }

  @Get()
  findAll(@Query() paginationDto: paginationDto) {
    // return paginationDto;
    return this.productsClient.send({ cmd: 'find_all_product' }, paginationDto);
  }

  @Get(':id')
  findOne( @Param('id') id:string){
   return this.productsClient.send({ cmd: 'find_one_product' }, {id:id});
  }
  

  
  @Patch(':id') 

  UpdateProduct(
    @Param('id') id:string , 
    @Body() body : any )

   { 
    return 'updates a product'
  }

  //@Delete(':id')
  @Delete(':id')
   DeleteProduct(@Param('id') id:string){
    return 'deletes a product'
  }

}
