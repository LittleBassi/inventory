import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './guards/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_CONSTANTS } from './auth.constants';
import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma/prisma.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: JWT_CONSTANTS.secret,
      signOptions: { expiresIn: '7d' }, // Expiração do token
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PassportModule, JwtModule, UserService, PrismaService],
  exports: [AuthService],
})
export class AuthModule {}
