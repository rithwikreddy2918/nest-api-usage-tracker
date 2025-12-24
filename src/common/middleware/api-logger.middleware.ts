import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AnalyticsService } from '../../analytics/analytics.service';

@Injectable()
export class ApiLoggerMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    let userId: number | undefined = undefined;

    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      try {
        const token = authHeader.slice(7);
        const payload: any = this.jwtService.verify(token);

        console.log('JWT PAYLOAD:', payload); // TEMP DEBUG
        userId = payload.sub;
      } catch (err) {
        console.log('JWT VERIFY FAILED');
      }
    }

    res.on('finish', () => {
      this.analyticsService.log({
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        userId,
      });
    });

    next();
  }
}
