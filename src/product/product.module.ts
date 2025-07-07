import { forwardRef, Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryModule } from 'src/category/category.module';
import { CorreiosModule } from 'src/correios/correios.module';

@Module({
  imports: [
    CorreiosModule,
    TypeOrmModule.forFeature([ProductEntity]),
    forwardRef(() => CategoryModule),
  ],
  providers: [ProductService],
  controllers: [ProductController],
   exports: [ProductService],
})
export class ProductModule {}
