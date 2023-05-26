import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandDTO } from './dtos/brand.dto';
import { ProductDTO } from './dtos/product.dto';
import * as bcrypt from 'bcrypt';
import { UserDTO } from './dtos/user.dto';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { Product, ProductDocument } from './schemas/product.schema';
import { User, UserDocument } from './schemas/user.schema';
import { CssxDTO } from './dtos/cssx.dto';
import { Cssx, CssxDocument } from './schemas/cssx.schema';
import { Dlpp, DlppDocument } from './schemas/dlpp.schema';
import { Ttbh, TtbhDocument } from './schemas/ttbh.schema';
import { DlppDTO } from './dtos/dlpp.dto';
import { TtbhDTO } from './dtos/ttbh.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Product.name) 
        private productModel: Model<ProductDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Brand.name)
        private brandModel: Model<BrandDocument>,
        @InjectModel(Cssx.name)
        private cssxModel: Model<CssxDocument>,
        @InjectModel(Dlpp.name)
        private dlppModel: Model<DlppDocument>,
        @InjectModel(Ttbh.name)
        private ttbhModel: Model<TtbhDocument>,
        
        ) {}

    // Product
    async createProduct(productDto: ProductDTO, fileimage: any): Promise<Product> {
        const product = await (await this.productModel.create(productDto)).updateOne({image: fileimage});
        const brandID = productDto.brand;
        const getbrand = await this.brandModel.findById(brandID)
        const products = await this.productModel.find({brand: productDto.brand})
        const productArr = (await getbrand).product;
        for(let i = 0; i < products.length; i++) {
            productArr.push(products[i]);
        }
        const brand = await this.brandModel.findByIdAndUpdate(brandID, {product: productArr});
        return product;
    }

    async getAllProducts(): Promise<Product[]> {
        return this.productModel.find();
    }

    async updateProduct(id: string, productDto: ProductDTO): Promise<any> {
        const {name, length, weight, width, height, color, price, speed} = productDto;
        await this.productModel.findByIdAndUpdate(id, {name: name, length: length, weight: weight, width: width, height, color: color, price: price, speed: speed});
        const product = await this.productModel.findById(id);
        const brandID = product.brand;
        
        const getbrand = await this.brandModel.findById(brandID)
        const productArr = getbrand.product;
        for(let i = 0; i < productArr.length; i++) {
            console.log(productArr[i]._id.toString())
            if(productArr[i]._id.toString() == id) {
                productArr.splice(i, 1, product)
                productArr.splice(i + 1, 1);
                
            }
        }
        await this.brandModel.findByIdAndUpdate(brandID, {product: productArr});
    }

    async deleteProduct(id: string): Promise<any> {
        const product = await this.productModel.findById(id);
        const brandID = product.brand;
        const getbrand = await this.brandModel.findById(brandID)
        
        
        const productArr = getbrand.product;
        for(let i = 0; i < productArr.length; i++) {
            console.log(productArr[i]._id.toString())
            if(productArr[i]._id.toString() == id) {
                productArr.splice(i, 1)
            }
        }
        await this.productModel.deleteOne({_id: id}).exec();
        await this.brandModel.findByIdAndUpdate(brandID, {product: productArr});
    }

    async findProductById(id: number): Promise<Product> {
        return await this.productModel.findById(id);
    }

    async findProductByIdandUpdate(id: number, soluong: number): Promise<Product> {
        
        return await this.productModel.findByIdAndUpdate(id, {soluong: soluong});
    }

    // Brand
    async createBrand(BrandDto: BrandDTO, image: string): Promise<any> {
        
        return await (await this.brandModel.create(BrandDto)).updateOne({image: image});
    }

    async getAllBrands(): Promise<Brand[]> {
        return this.brandModel.find();
    }

    async updateBrand(id: string, BrandDto: BrandDTO): Promise<Brand> {
        const updatedBrand = await this.brandModel.findByIdAndUpdate(id, {...BrandDto}).exec();
        return updatedBrand;
    }

    async deleteBrand(id: string): Promise<any> {
        return await this.brandModel.deleteOne({_id: id}).exec();
    }

    async getBrand(id: string): Promise<any> {
        return await this.brandModel.findById(id)
    }

    // User
    async createUser(userDto: UserDTO): Promise<User> {
        const newUser = new this.userModel(userDto);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return newUser.save();
    }

    async getAllUsers(): Promise<User[]> {
        return this.userModel.find();
    }

    async updateUser(id: string, userDto: UserDTO): Promise<User> {
        const updatedUser = await this.userModel.findByIdAndUpdate(id, {...userDto}).exec();
        return updatedUser;
    }

    async deleteUser(id: string): Promise<any> {
        return await this.userModel.deleteOne({_id: id}).exec();
    }

    async findUserById(id: string) : Promise<User> {
        return await this.userModel.findById(id);
    }

    async updateUserRFToken(id: string, refreshToken: any, refreshTokenExp: any) : Promise<any> {
        return await this.userModel.findByIdAndUpdate(id, { refreshToken: refreshToken, refreshTokenExp: refreshTokenExp}).exec();
    }

    async findUser(username: string): Promise<User> {
        const user = await this.userModel.findOne({username: username});
        return user;
    }

    async validRefreshToken(email: string, refreshToken: string): Promise<User> {
    let user = await this.userModel.findOne({email, refreshToken});
    
    if(!user) {
        return null;
    }
    
    if( new Date() > new Date((await user).refreshTokenExp)) {
        
        return null
    }
    
    return user;
    }

    // CSSX
    async createCSSX(userDto: CssxDTO): Promise<Cssx> {
        const newUser = new this.cssxModel(userDto);
        return newUser.save();
    }

    async getAllCSSX(): Promise<Cssx[]> {
        return this.cssxModel.find();
    }

    async updateCSSX(id: string, cssxDto: CssxDTO): Promise<Cssx> {
        const updatedUser = await this.cssxModel.findByIdAndUpdate(id, {...cssxDto}).exec();
        return updatedUser;
    }

    async deleteCSSX(id: string): Promise<any> {
        return await this.cssxModel.deleteOne({_id: id}).exec();
    }

    async getACSSX(id: string) : Promise<Cssx> {
        return await this.cssxModel.findById(id);
    }

    //DLPP

    async createDLPP(userDto: DlppDTO): Promise<Dlpp> {
        const newUser = new this.dlppModel(userDto);
        return newUser.save();
    }

    async getAllDLPP(): Promise<Dlpp[]> {
        return this.dlppModel.find();
    }

    async updateDLPP(id: string, cssxDto: DlppDTO): Promise<Dlpp> {
        const updatedUser = await this.dlppModel.findByIdAndUpdate(id, {...cssxDto}).exec();
        return updatedUser;
    }

    async deleteDLPP(id: string): Promise<any> {
        return await this.dlppModel.deleteOne({_id: id}).exec();
    }

    async getADLPP(id: string) : Promise<Dlpp> {
        return await this.dlppModel.findById(id);
    }

    // TTBH

    async createTTBH(userDto: TtbhDTO): Promise<Dlpp> {
        const newUser = new this.ttbhModel(userDto);
        return newUser.save();
    }

    async getAllTTBH(): Promise<Dlpp[]> {
        return this.ttbhModel.find();
    }

    async updateTTBH(id: string, cssxDto: TtbhDTO): Promise<Dlpp> {
        const updatedUser = await this.ttbhModel.findByIdAndUpdate(id, {...cssxDto}).exec();
        return updatedUser;
    }

    async deleteTTBH(id: string): Promise<any> {
        return await this.ttbhModel.deleteOne({_id: id}).exec();
    }

    async getATTBH(id: string) : Promise<Dlpp> {
        return await this.ttbhModel.findById(id);
    }

}
