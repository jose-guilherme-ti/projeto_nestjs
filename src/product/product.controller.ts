import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { UserType } from 'src/user/enum/user-type.enum';
import { ReturnProduct } from './dtos/return-product.dto';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult } from 'typeorm';
import { UpdateProductDTO } from './dtos/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Roles(UserType.Admin, UserType.User)
  @Get()
  async findAll(): Promise<ReturnProduct[]> {
   return (await this.productService.findAll([], true)).map(
      (product) => new ReturnProduct(product),
    );
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Post()
  async createProduct(
    @Body() createProduct: CreateProductDTO,
  ): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Roles(UserType.Admin)
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId') productId: number,
  ): Promise<{  affected: number, product: ProductEntity }> {
    const {deleted, product} =  await this.productService.deleteProduct(productId);
     return {
     affected: deleted.affected ?? 0, // Garante que é um número,
     product,
  };
  }

  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  @Put('/:productId')
  async updateProduct(
    @Body() updateProduct: UpdateProductDTO,
    @Param('productId') productId: number,
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }

  @Get('/:idProduct/delivery/:cep')
  async findPriceDelivery(
    @Param('idProduct') idProduct: number,
    @Param('cep') cep: string,
  ): Promise<any> {
    return this.productService.findPriceDelivery(cep, idProduct);
  }
}