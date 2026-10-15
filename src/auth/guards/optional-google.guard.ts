import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalGoogleAuthGuard implements CanActivate {
  private GuardClass = AuthGuard('google');

  async canActivate(context: ExecutionContext) {
    if (process.env.DISABLE_GOOGLE_AUTH === 'true') {
      throw new NotFoundException();
    }

    const guardInstance: any = new this.GuardClass();
    return guardInstance.canActivate(context);
  }
}
