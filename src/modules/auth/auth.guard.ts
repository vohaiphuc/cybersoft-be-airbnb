import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Message } from 'src/common/const/message.const';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        if (err) {
            throw err
        }
        if (!user && info) {
            switch (info.message) {
                case "jwt expired":
                    throw new UnauthorizedException(Message.TOKEN.FAIL_EXPIRED)
                case "No auth token":
                    throw new UnauthorizedException(Message.TOKEN.FAIL_MISSING)
                case "invalid signature":
                    throw new UnauthorizedException(Message.TOKEN.FAIL)
                default:
                    throw new UnauthorizedException(`${info.name}: ${info.message}`)
            }
        }
        return user;
    }
}