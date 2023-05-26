import { 
    Controller,
    Post, 
    Get,
    Body,
    Request,
    UseGuards,
    Res,
    Param,
    BadRequestException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/role.guard';
import { Response } from 'express';
import { RefreshJwtAuthGuard } from './guards/refresh.guard';
import { AdminService } from 'src/admin/admin.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService, 
        private adminService: AdminService
    ) {}

    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            username: { type: 'string' },
            password: { type: 'string' }
        },
        },
    })
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() req, @Res({ passthrough: true }) res: Response) {
        const accessToken = await this.authService.getJwtToken(req.user);
        
        const refreshToken = await this.authService.getRefreshToken(req.user._id, req.user);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }

    }

    @UseGuards(RefreshJwtAuthGuard)
    @Post('/refreshToken')
    async generateAccessToken(@Request() req, @Body() refreshTokenParam: string ) {
        const user = await this.adminService.findUserById(req.user._id);
        let refreshTokenInDB = user.refreshToken;
        console.log(refreshTokenInDB)
        let refreshToken = Object.values(refreshTokenParam).toString()
        if(refreshToken == refreshTokenInDB ) {
            
            const accessToken = await this.authService.getJwtToken(req.user);
            return { accessToken: accessToken}
        }
    }
}