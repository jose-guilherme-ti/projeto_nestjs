import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoryService } from 'src/category/category.service';
import { CreateProductDTO } from './dtos/create-product.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { CountProduct } from './dtos/count-product.dto';
import { CorreiosService } from 'src/correios/correios.service';
import { SizeProductDTO } from 'src/correios/dtos/size-product.dto';
import { CdServiceEnum } from 'src/correios/enum/cd-service.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,
    private readonly correiosService: CorreiosService,
  ) { }

  async findPriceDelivery(cep: string, idProduct: number): Promise<any> {
    const product = await this.findProductById(idProduct);

    const sizeProduct = new SizeProductDTO(product);

    const returnCorreios = await this.correiosService.priceDelivery(
      CdServiceEnum.PAC,
      cep,
      sizeProduct,
    );

    return returnCorreios;
  }

  async findAll(
    productId?: number[],
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId),
        },
      };
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        },
      };
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products');
    }

    return products;
  }

  async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
    });
  }

  async findProductById(productId: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async deleteProduct(productId: number): Promise<{ deleted: DeleteResult, product: ProductEntity }> {
    const product = await this.findProductById(productId);
    const deleted = await this.productRepository.delete({ id: productId })
    return {
      deleted,
      product
    };
  }

  async updateProduct(
    updateProduct: UpdateProductDTO,
    productId: number,
  ): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...updateProduct,
    });
  }

  async countProdutsByCategoryId(): Promise<CountProduct[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }
}