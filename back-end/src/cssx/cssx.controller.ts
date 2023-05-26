import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/authentication/decorators/roles.decorator';
import { Role } from 'src/authentication/enums/role.enum';
import { JwtAuthGuard } from 'src/authentication/guards/jwt.guard';
import { RolesGuard } from 'src/authentication/guards/role.guard';
import { CssxService } from './cssx.service';
import { ExportToStoreDTO } from './dto/exportToStore.dto';
import { StorageCSSXDTO } from './dto/storageCSSX.dto';
import { StorageCSSX } from './storageCSSX/storageCSSX.schema';

@ApiBearerAuth()
@ApiTags('CSSX')
@Controller('cssx')
export class CssxController {
    constructor(private cssxService: CssxService) {}

    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            brandID: { type: 'string' },
            productID: { type: 'string' },
            soluong: { type: 'number' },
          },
        },
    })
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CSSX)
    @Put('/api/addSoluongToProduct')
    async addSoluong(@Request() req, @Body() storageCSSXDTO: StorageCSSXDTO) {
        console.log(req.user.id)
        return await this.cssxService.addSoluongToProduct(storageCSSXDTO, req.user.id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.CSSX)
    @Get('api/acceptGetProduct')
    async acceptGetProduct(@Request() req) {
        return await this.cssxService.acceptGetProduct(req.user.id);
    }
}
