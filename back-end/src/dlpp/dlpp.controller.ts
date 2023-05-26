import { Body, Controller, Put, UseGuards, Request, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/authentication/decorators/roles.decorator';
import { Role } from 'src/authentication/enums/role.enum';
import { JwtAuthGuard } from 'src/authentication/guards/jwt.guard';
import { RolesGuard } from 'src/authentication/guards/role.guard';
import { DlppService } from './dlpp.service';
import { DLPPTradeToCSSXDTO } from './dtos/storageDLPP.dto';

@ApiBearerAuth()
@ApiTags('DLPP')
@Controller('dlpp')
export class DlppController {
    constructor(private dlppService: DlppService) {}
    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            cssxID: { type: 'string' },
            brandID: { type: 'string' },
            productID: { type: 'string' },
            soluong: { type: 'number' },
          },
        },
    })
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.DLPP)
    @Post('/api/addSoluongToStorageDLPP')
    async addSoluong(@Request() req, @Body() DLPPTradeToCSSXDTo: DLPPTradeToCSSXDTO) {
        console.log(req.user.id)
        return await this.dlppService.addSoluongToStorageDLPP(DLPPTradeToCSSXDTo, req.user.id);
    }
}
