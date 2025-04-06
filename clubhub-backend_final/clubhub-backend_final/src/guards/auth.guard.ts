import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import { Request } from "express"; 

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            Logger.error('Token not found');
            throw new UnauthorizedException('Token not found');
        }

        try {
            const payload = this.jwtService.verify(token); // Verify token
            request.userId = payload.userId; // Attach the userId to the request object
        } catch (e) {
            Logger.error('Token verification failed:', e.message);
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const authorizationHeader = request.headers.authorization;
    
        // Log the authorization header to see what is coming in
        Logger.log('Authorization header:', authorizationHeader);
    
        if (!authorizationHeader) {
            return undefined;
        }
    
        const parts = authorizationHeader.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1]; // Return the token part
        }
        return undefined;
    }
    
}
