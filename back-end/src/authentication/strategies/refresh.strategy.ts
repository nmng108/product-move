

import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from 'src/admin/admin.service';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {} from 'dotenv/config';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private adminService: AdminService, private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: process.env.REFRESHTOKEN_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    if(!payload) {
        throw new BadRequestException('Invalid jwt token');
    }
    // console.log(payload);

    let refreshToken = req.body.refreshToken;
    console.log(req.params.refreshToken);
    const userFromToken = await this.jwtService.verify(refreshToken);
    
    const refreshTokenOfUser = await this.adminService.findUserById(userFromToken._id)
    
    
    
    if(!refreshTokenOfUser?.refreshToken) {
        throw new BadRequestException('Invalid refresh token')
    }

    let user = await this.adminService.validRefreshToken(userFromToken.email, refreshTokenOfUser.refreshToken);
    
    if(!user) {
        throw new BadRequestException('Token expired')
    }

    return payload;
  }
}
