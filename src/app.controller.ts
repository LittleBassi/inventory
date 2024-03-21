import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ConflictException,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';
import { User as UserModel, Product as ProductModel, User } from '@prisma/client';
import { UserRoleEnum } from './user/user.enum';
import { AuthDecorator, Decorator, GetUser } from './utils/utils.decorator';
import { CreateUserDto } from './user/dto/create-user.dto';
import { CreateProductDto } from './product/dto/create-product.dto';
import { UpdateProductDto } from './product/dto/update-product.dto';
import { UpdateUserDto } from './user/dto/update-user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly productService: ProductService
  ) {}

  // @Get('filtered-products/:searchString')
  // async getFilteredProducts(@Param('searchString') searchString: string): Promise<ProductModel[]> {
  //   return await this.productService.products({
  //     where: {
  //       OR: [
  //         {
  //           title: { contains: searchString },
  //         },
  //         {
  //           content: { contains: searchString },
  //         },
  //       ],
  //     },
  //   });
  // }

  @Post('user/common')
  @Decorator('user')
  @AuthDecorator(true)
  async createCommonUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    const userAlreadyExists = await this.userService.userLowInfo({ name: userData.name });
    if (userAlreadyExists) {
      throw new ConflictException('Nome de usuário já está sendo usado');
    }
    const newUser = await this.userService.createUser({
      ...userData,
      role: UserRoleEnum.COMMON,
    });
    if (!newUser) {
      throw new ConflictException('Erro ao cadastrar usuário');
    }
    return newUser;
  }

  @Post('user/admin')
  @Decorator('user')
  @AuthDecorator(true)
  async createAdminUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    const userAlreadyExists = await this.userService.userLowInfo({ name: userData.name });
    if (userAlreadyExists) {
      throw new ConflictException('Nome de usuário já está sendo usado');
    }
    const newUser = await this.userService.createUser({
      ...userData,
      role: UserRoleEnum.ADMIN,
    });
    if (!newUser) {
      throw new ConflictException('Erro ao cadastrar usuário');
    }
    return newUser;
  }

  @Get('user/:id')
  @Decorator('user')
  @AuthDecorator(true)
  async getuserById(@Param('id') id: string, @GetUser() user: User): Promise<UserModel> {
    const userExists = await this.userService.userLowInfo({ id: Number(id) });
    if (!userExists) {
      throw new ConflictException('Usuário não encontrado');
    }
    return userExists;
  }

  @Get('users')
  @Decorator('user')
  @AuthDecorator(true)
  async getusers(): Promise<UserModel[]> {
    return await this.userService.usersLowInfo({});
  }

  @Patch('user/:id')
  @Decorator('user')
  @AuthDecorator(true)
  async updateuser(@Param('id') id: string, @Body() userData: UpdateUserDto): Promise<UserModel> {
    const userExists = await this.userService.userLowInfo({ id: Number(id) });
    if (!userExists) {
      throw new ConflictException('Usuário não encontrado');
    }
    const updateResult = await this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
    if (!updateResult) {
      throw new ConflictException('Erro ao editar usuário');
    }
    return updateResult;
  }

  @Delete('user/:id')
  @Decorator('user')
  @AuthDecorator()
  async deleteuser(@Param('id') id: string): Promise<UserModel> {
    const userExists = await this.userService.userLowInfo({ id: Number(id) });
    if (!userExists) {
      throw new ConflictException('Usuário não encontrado');
    }
    const deleteResult = await this.userService.deleteUser({ id: Number(id) });
    if (!deleteResult) {
      throw new ConflictException('Erro ao excluir usuário');
    }
    return deleteResult;
  }

  @Post('product')
  @Decorator('product')
  @AuthDecorator()
  async createProduct(
    @Body() productData: CreateProductDto,
    @GetUser() user: User
  ): Promise<ProductModel> {
    const newProduct = await this.productService.createProduct({
      ...productData,
      user: {
        connect: { id: user.id },
      },
    });
    if (!newProduct) {
      throw new ConflictException('Erro ao cadastrar produto');
    }
    return newProduct;
  }

  @Get('product/:id')
  @Decorator('product')
  @AuthDecorator()
  async getProductById(@Param('id') id: string, @GetUser() user: User): Promise<ProductModel> {
    const productExists = await this.productService.product({ id: Number(id), author_id: user.id });
    if (!productExists) {
      throw new ConflictException('Produto não encontrado');
    }
    return productExists;
  }

  @Get('products')
  @Decorator('product')
  @AuthDecorator()
  async getProducts(@GetUser() user: User): Promise<ProductModel[]> {
    return await this.productService.products({
      where: {
        author_id: user.id,
      },
    });
  }

  @Patch('product/:id')
  @Decorator('product')
  @AuthDecorator()
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
    @GetUser() user: User
  ): Promise<ProductModel> {
    const productExists = await this.productService.product({ id: Number(id), author_id: user.id });
    if (!productExists) {
      throw new ConflictException('Produto não encontrado');
    }
    const updateResult = await this.productService.updateProduct({
      where: { id: Number(id) },
      data: productData,
    });
    if (!updateResult) {
      throw new ConflictException('Erro ao editar produto');
    }
    return updateResult;
  }

  @Delete('product/:id')
  @Decorator('product')
  @AuthDecorator()
  async deleteProduct(@Param('id') id: string, @GetUser() user: User): Promise<ProductModel> {
    const productExists = await this.productService.product({ id: Number(id), author_id: user.id });
    if (!productExists) {
      throw new ConflictException('Produto não encontrado');
    }
    const deleteResult = await this.productService.deleteProduct({ id: Number(id) });
    if (!deleteResult) {
      throw new ConflictException('Erro ao excluir produto');
    }
    return deleteResult;
  }
}
