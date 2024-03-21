import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthAccessToken, AuthPayload } from './entities/auth.interface';
import { UserService } from '@/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async getDecodedToken(authorization: string): Promise<any> {
    if (!authorization) {
      return null;
    }

    const token = authorization.split('Bearer ')[1];
    if (!token) {
      return null;
    }
    return this.jwtService.decode(token);
  }

  async validateUser(name: string, password: string): Promise<User | null> {
    const user = await this.userService.user({ name });
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.userService.validatePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  // Retorna os dados do usuário (opcional) e o access_token ao fazer login
  async auth(createAuthDto: CreateAuthDto): Promise<AuthAccessToken> {
    // Usuário
    const user = await this.validateUser(createAuthDto.name, createAuthDto.password);
    if (!user) {
      throw new UnauthorizedException('Nome ou senha incorretos.');
    }

    // Payload
    const payload: AuthPayload = {
      id: user.id,
      name: user.name,
    };

    return {
      // Gera um token JWT com base nos dados do usuário
      access_token: this.jwtService.sign(payload),
    };
  }
}
