import { Module } from '@nestjs/common';
import { CartProdutEntity } from './entities/cart-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartProductService } from './cart-product.service';

@Module({
  imports: [TypeOrmModule.forFeature([CartProdutEntity])],
  providers: [CartProductService],
  exports: [CartProductService],
})
export class CartProductModule {}
