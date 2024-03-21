import { JwtAuthGuard } from '@/auth/guards/auth.guard';
import {
  applyDecorators,
  ConflictException,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor, FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

const allowedExtensions = [
  'jpg',
  'jpeg',
  'png',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'csv',
  'txt',
  'xml',
  'ppt',
  'pptx',
  'rtf',
  'zip',
];

export function Decorator(
  apiTag: string,
  operationSummary?: string,
  operationId?: string
): MethodDecorator {
  return applyDecorators(
    UsePipes(ValidationPipe),
    ApiTags(apiTag),
    ApiOperation({
      summary: operationSummary,
      operationId,
    }),
    ApiCreatedResponse({ description: 'Operação realizada com sucesso.' }),
    ApiBadRequestResponse({
      description: 'Dados inválidos. Verifique os campos preenchidos.',
    }),
    ApiForbiddenResponse({ description: 'Acesso não autorizado.' }),
    ApiUnauthorizedResponse({ description: 'Acesso não autorizado.' }),
    ApiConflictResponse({
      description: 'Operação incorreta ou não permitida.',
    }),
    ApiInternalServerErrorResponse({
      description: 'Erro interno no servidor. Entre em contato com o administrador.',
    })
  );
}

export function AuthDecorator(isAdmin?: boolean): MethodDecorator {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    SetMetadata(IS_ADMIN, isAdmin),
    ApiBearerAuth('JWT'),
    ApiHeader({
      name: 'Authorization',
      required: true,
      schema: { example: 'Bearer <access_token>' },
    })
  );
}

export function UploadDecorator(multipartFileName: string): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FileInterceptor(multipartFileName, {
        fileFilter: (_req, file, callback) => {
          if (!allowedExtensions.includes(file.originalname.split('.').pop().toLowerCase())) {
            return callback(new ConflictException('Extensão de arquivo não permitida.'), false);
          }
          callback(null, true);
        },
      })
    )
  );
}

export function UploadsDecorator(multipartFileName: MulterField[]): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FileFieldsInterceptor(multipartFileName, {
        fileFilter: (_req, file, callback) => {
          if (!allowedExtensions.includes(file.originalname.split('.').pop().toLowerCase())) {
            return callback(new ConflictException('Extensão de arquivo não permitida.'), false);
          }
          callback(null, true);
        },
      })
    )
  );
}

export function DynamicUploadsDecorator(): MethodDecorator {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    UseInterceptors(
      FilesInterceptor('files', null, {
        fileFilter: (_req, file, callback) => {
          if (!allowedExtensions.includes(file.originalname.split('.').pop().toLowerCase())) {
            return callback(new ConflictException('Extensão de arquivo não permitida.'), false);
          }
          callback(null, true);
        },
      })
    )
  );
}

export const GetUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();

  // Passport automatically creates a user object, based on the value we return from the jwt validate() method
  return req.user;
});

// Metadata
export const IS_ADMIN = 'isAdmin';
