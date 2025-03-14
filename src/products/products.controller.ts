import { Controller, Post ,Delete, Patch, Get, Param, Body, Inject, Query, BadRequestException, ParseIntPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { paginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send({ cmd: 'create_product' }, createProductDto);
  }

  @Get()
  findAll(@Query() paginationDto: paginationDto) {
    // return paginationDto;
    return this.productsClient.send({ cmd: 'find_all_product' }, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {

    
    return this.productsClient.send({ cmd: 'find_one_product' }, { id })
    .pipe(catchError(err => {throw new RpcException(err)}));

    /* try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id }),
      );
      return product;
    } catch (error) {

      throw new RpcException(error);
    /*  const message = typeof error === 'string' ? error : error.message || 'Unexpected error';

    throw new BadRequestException({
      statusCode: 400,
      message,
      error: 'Bad Request',
    });  
    }*/
   
  }

  @Patch(':id')
  UpdateProduct(@Param('id') id: string, @Body() body: any) {
    return 'updates a product';
  }

  //@Delete(':id')
  @Delete(':id')
  DeleteProduct(@Param('id') id: string) {
    return 'deletes a product';
  }
}
