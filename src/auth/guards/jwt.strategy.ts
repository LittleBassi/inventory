import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_CONSTANTS } from '../auth.constants';
import { AuthPayload } from '../entities/auth.interface';
import { UserService } from '@/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANTS.secret,
    });
  }

  // Valida o conteúdo do token enviado na requisição
  async validate(payload: AuthPayload): Promise<User> {
    const { id } = payload;
    if (!id) {
      throw new UnauthorizedException('Acesso não autorizado. Sem dados de payload.');
    }

    const user = await this.userService.user({ id });
    if (!user) {
      throw new UnauthorizedException('Acesso não autorizado. Credenciais inválidas.');
    }
    delete user.password;

    return user;
  }
}
