import { Injectable } from '@nestjs/common';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
const bcrypt = require('bcrypt')

@Injectable()
export class AuthService {
    constructor(
        private readonly adminService: AdminService, 
        private readonly jwtService: JwtService,

        ) {}

        async validateUser(username: string, password: string): Promise<any> {
            const user = await this.adminService.findUser(username);
            console.log(password)
            
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            
            if(user && isPasswordMatch) {
                console.log(user)
                return user;
            }
            return null;
        }
    
        async getJwtToken(user: any) {
            const payload = { 
                id: user._id,
                username: user.username,
                numberphone: user.numberphone,
                name: user.name,
                email: user.email, 
                roles: user.role,
                address: user.address
            };
            
            return await this.jwtService.signAsync(payload)
          
        }
    
        async getRefreshToken(userId: any, user: any): Promise<string> {
            var expiresIn = new Date();
            const payload = { 
                _id: user._id,
                username: user.username,
                email: user.email, 
                role: user.role,
            };
            const userDataToUpdate = {
                refreshToken: await this.jwtService.signAsync(payload),
                refreshTokenExp: expiresIn.setDate(expiresIn.getDate() + 3),
              };
        
            await this.adminService.updateUserRFToken(userId, userDataToUpdate.refreshToken, userDataToUpdate.refreshTokenExp);
            return userDataToUpdate.refreshToken;
        }
}