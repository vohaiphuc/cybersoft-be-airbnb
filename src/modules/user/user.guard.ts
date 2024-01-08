import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard('jwt-admin') {
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
                    throw new UnauthorizedException("Token hết hạn")
                case "No auth token":
                    throw new UnauthorizedException("Không có token")
                case "invalid signature":
                    throw new UnauthorizedException("Token không hợp lệ")
                default:
                    throw new UnauthorizedException(`${info.name}: ${info.message}`)
            }
        }
        return user;
    }
}