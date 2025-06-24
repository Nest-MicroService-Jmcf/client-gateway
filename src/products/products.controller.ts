import { AppResponse  } from './../common/dto/response.dto';
import { PaginatedResponse } from 'src/common/dto/response-paginated.dto';
import {
  Controller,
  Post,
  Delete,
  Patch,
  Get,
  Param,
  Body,
  Inject,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { paginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

 @Post()
async createProduct(@Body() createProductDto: CreateProductDto) {
  try {
    const product = await firstValueFrom(
      this.productsClient.send({ cmd: 'create_product' }, createProductDto),
    );

    return new AppResponse(product, 'Producto creado correctamente', 201);
  } catch (error) {
    const message =
      typeof error === 'string' ? error : error.message || 'Unexpected error';

    throw new RpcException({
      statusCode: 400,
      message: [message],
      error: 'Bad Request',
    });
  }
}

@Get()
async findAll(@Query() paginationDto: paginationDto) {
  try {
    const response = await firstValueFrom(
      this.productsClient.send({ cmd: 'find_all_product' }, paginationDto),
    );

    // response = { data: [...], meta: {...} }
    return new PaginatedResponse(
      response.data,
      response.meta,
      'Listado de productos',
    );
  } catch (error) {
    const message =
      typeof error === 'string' ? error : error.message || 'Unexpected error';

    throw new RpcException({
      statusCode: 400,
      message: [message],
      error: 'Bad Request',
    });
  }
}
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send({ cmd: 'find_one_product' }, { id }),
      );
     return new AppResponse(product, 'Producto encontrado correctamente', 200);
    } catch (error) {
      const message =
        typeof error === 'string' ? error : error.message || 'Unexpected error';
      throw new RpcException({
        status: 400,
        message,
        error: 'Bad Request',
      });
    }
  }

@Patch(':id')
async patchProduct(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateProductDto: UpdateProductDto,
) {
  try {
    const updatedProduct = await firstValueFrom(
      this.productsClient.send({ cmd: 'update_product' }, { id, ...updateProductDto }),
    );

    return new AppResponse(updatedProduct, 'Producto actualizado correctamente');
  } catch (error) {
    const message =
      typeof error === 'string' ? error : error.message || 'Unexpected error';

    throw new RpcException({
      statusCode: 400,
      message: [message],
      error: 'Bad Request',
    });
  }
}

  //@Delete(':id')
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    try {
      await firstValueFrom(
        this.productsClient.send({ cmd: 'delete_product' }, { id }),
      );
      return new AppResponse(null, 'Producto eliminado correctamente');
    } catch (error) {
      const message =
        typeof error === 'string' ? error : error.message || 'Unexpected error';

      throw new RpcException({
        statusCode: 400,
        message: [message],
        error: 'Bad Request',
      });
    }
  }
}
