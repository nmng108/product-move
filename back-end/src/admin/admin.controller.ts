import { 
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Body,
    Param,
    Query,
    Request,
    UseGuards,
    UploadedFile,
    UseInterceptors,
    Bind
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Roles } from 'src/authentication/decorators/roles.decorator';
import { Role } from 'src/authentication/enums/role.enum';
import { JwtAuthGuard } from 'src/authentication/guards/jwt.guard';
import { RolesGuard } from 'src/authentication/guards/role.guard';
// import path from 'path';
const path = require('path');
import { AdminService } from './admin.service';
import { BrandDTO } from './dtos/brand.dto';
import { CssxDTO } from './dtos/cssx.dto';
import { DlppDTO } from './dtos/dlpp.dto';
import { ProductDTO } from './dtos/product.dto';
import { TtbhDTO } from './dtos/ttbh.dto';
import { UserDTO } from './dtos/user.dto';
@ApiBearerAuth()
@ApiTags('ADMIN')
@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService) {};

    // Product
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            name: { type: 'string' },
            length: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
            weight: { type: 'number' },
            speed: { type: 'number' },
            image: {
                type: 'string',
                format: 'binary',
            },
            color: { type: 'string' },
            price: { type: 'number' },
            brand: { type: 'string' }
          },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('api/product/create')
    @UseInterceptors(FileInterceptor ('image', {
        storage: diskStorage({
            destination: 'src/assets/product/images',
            filename(req, file, callback) {
                const fileName = path.parse(file.originalname).name.replace('/\s/g', '') + Date.now();
                const extension = path.parse(file.originalname).ext;
                callback(null, `${fileName}${extension}`)
            },
        })
    }))
    @Bind(UploadedFile())
    async createProduct(file: any, @Body() productDto: ProductDTO) {
        const linkFile = file.path;
        return await this.adminService.createProduct(productDto, linkFile);
    }

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/product/getAll')
    async getAllProduct() {
        return this.adminService.getAllProducts();
    }

    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            name: { type: 'string' },
            length: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
            weight: { type: 'number' },
            speed: { type: 'number' },
            
            color: { type: 'string' },
            price: { type: 'number' },
          },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('api/product/update/:id')
    
    async updateProduct(@Param('id') id: string, @Body() productDto: ProductDTO) {
        return await this.adminService.updateProduct(id, productDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/api/product/delete/:id')
    async deleteProduct(@Param('id') id: string) {
        return await this.adminService.deleteProduct(id);
    }

    // Brand
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            country: { type: 'string' }, 
            image: {
                type: 'string',
                format: 'binary',
            },
        },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('api/brand/create')
    @UseInterceptors(FileInterceptor ('image', {
        storage: diskStorage({
            destination: 'src/assets/brand/images',
            filename(req, file, callback) {
                const originalname = file.originalname;
               
                const fileName = path.parse(originalname).name.replace('/\s/g', '') + Date.now();
              
                const extension = path.parse(originalname).ext;
             
                callback(null, `${fileName}${extension}`)
            }
        })
    }))
    @Bind(UploadedFile())
    async createBrand(file: any, @Body() brandDto: BrandDTO, @Request() req) {
        console.log(req.user.role)
        
        const linkFile = file.path;
        
        return await this.adminService.createBrand(brandDto, linkFile);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/brand/getAll')
    async getAllBrand() {
        return this.adminService.getAllBrands();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('api/brand/update/:id')
    async updateBrand(@Param('id') id: string, @Body() brandDto: BrandDTO) {
        return await this.adminService.updateBrand(id, {...brandDto});
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/api/brand/delete/:id')
    async deleteBrand(@Param('id') id: string) {
        return await this.adminService.deleteBrand(id);
    }

    //User
    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            numberphone: { type: 'string' },
            role: { type: 'string' },
            address: { type: 'string' },
          },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('api/user/create')
    async createUser( @Body() userDto: UserDTO) {
        return await this.adminService.createUser(userDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/user/getAll')
    async getAllUser() {
        return this.adminService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('api/user/update/:id')
    async updateuser(@Param('id') id: string, @Body() userDto: UserDTO) {
        return await this.adminService.updateUser(id, userDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/api/user/delete/:id')
    async deleteuser(@Param('id') id: string) {
        return await this.adminService.deleteUser(id);
    }

    // CSSX
    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            name: { type: 'string' },
            date_register: { type: 'Date'},
            date_active: {type: 'Date'},
            namePerson: { type: 'string' },
            address: { type: 'string' },
            username: { type: 'string' },
            password: { type: 'string' },
            numberOfWorkers: { type: 'number' },
            contact: { type: 'string' },
            representativeID: { type: 'string' },
          },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('api/cssx/create')
    async createCSSX( @Body() cssxDto: CssxDTO) {
        return await this.adminService.createCSSX(cssxDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles(Role.Admin)
    @Get('api/cssx/getAll')
    async getAllCSSX() {
        return await this.adminService.getAllCSSX();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/cssx/getACSSX/:id')
    async getACSSX(@Param('id') id: string) {
        return await this.adminService.getACSSX(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('api/cssx/update/:id')
    async updateCSSX(@Param('id') id: string, @Body() cssxDto: CssxDTO) {
        return await this.adminService.updateCSSX(id, cssxDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/api/cssx/delete/:id')
    async deleteCSSX(@Param('id') id: string) {
        return await this.adminService.deleteCSSX(id);
    }


    //DLPP

    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            name: { type: 'string' },
            date_register: { type: 'Date'},
            date_active: {type: 'Date'},
            namePerson: { type: 'string' },
            address: { type: 'string' },
            username: { type: 'string' },
            password: { type: 'string' },
            numberOfWorkers: { type: 'number' },
            contact: { type: 'string' },
            representativeID: { type: 'string' },
          },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('api/dlpp/create')
    async createDLPP( @Body() dlppDto: DlppDTO) {
        return await this.adminService.createDLPP(dlppDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/dlpp/getAll')
    async getAllDLPP() {
        return await this.adminService.getAllDLPP();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/dlpp/getADLPP/:id')
    async getADLPP(@Param('id') id: string) {
        return await this.adminService.getADLPP(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('api/dlpp/update/:id')
    async updateDLPP(@Param('id') id: string, @Body() DLPPDto: DlppDTO) {
        return await this.adminService.updateDLPP(id, DLPPDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/api/dlpp/delete/:id')
    async deleteDLPP(@Param('id') id: string) {
        return await this.adminService.deleteDLPP(id);
    }

    //TTBH

    @ApiBody({
        schema: {
        type: 'object',
          properties: {
            name: { type: 'string' },
            date_register: { type: 'Date'},
            date_active: {type: 'Date'},
            namePerson: { type: 'string' },
            address: { type: 'string' },
            username: { type: 'string' },
            password: { type: 'string' },
            numberOfWorkers: { type: 'number' },
            contact: { type: 'string' },
            representativeID: { type: 'string' },
          },
        },
    })
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Post('api/ttbh/create')
    async createTTBH( @Body() TTBHDto: TtbhDTO) {
        return await this.adminService.createTTBH(TTBHDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/ttbnh/getAll')
    async getAllTTBH() {
        return await this.adminService.getAllTTBH();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get('api/ttbnh/getATTBH/:id')
    async getATTBH(@Param('id') id: string) {
        return await this.adminService.getATTBH(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Put('api/ttbnh/update/:id')
    async updateTTBH(@Param('id') id: string, @Body() TTBHDto: TtbhDTO) {
        return await this.adminService.updateTTBH(id, TTBHDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete('/api/ttbnh/delete/:id')
    async deleteTTBH(@Param('id') id: string) {
        return await this.adminService.deleteTTBH(id);
    }



}
