import { Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwt: JwtService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (authorization) {
      const token = authorization.split('Bearer ')[1];
      try {
        await this.jwt.verify(token);
      } catch (error) {
        throw new HttpException(`Token error: ${error.message || error.name}`, HttpStatus.FORBIDDEN);
      }
      return true;
    }
    return false;
  }

  // private async validateToken(token: string): Promise<any> {
  //   try {
  //     const parsedToken = await this.jwt.verify(token);
  //   } catch (error) {
  //     throw new HttpException(`Token error: ${error.message || error.name}`, HttpStatus.FORBIDDEN);
  //   }
  // }
}
