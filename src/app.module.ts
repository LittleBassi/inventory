import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { ProductService } from './product/product.service';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [PrismaService, UserService, ProductService],
  exports: [PrismaService, UserService, ProductService],
})
export class AppModule {}
