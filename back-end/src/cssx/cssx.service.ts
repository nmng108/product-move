import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminService } from 'src/admin/admin.service';
import { DlppService } from 'src/dlpp/dlpp.service';
import { StatusCSSXtoDLPP, StatusCSSXtoDLPPDocument } from './storageCSSX/statusCSSXtoDLPP.schema';
import { StorageCSSX, StorageCSSXDocument } from './storageCSSX/storageCSSX.schema';

@Injectable()
export class CssxService {
    
    constructor(
        @InjectModel(StorageCSSX.name)
        private storageCSSXModel: Model<StorageCSSXDocument>,
        @InjectModel(StatusCSSXtoDLPP.name)
        private StatusCSSXtoDLPPModel: Model<StatusCSSXtoDLPPDocument>,
        private adminService: AdminService,
        private dlppService: DlppService
    ) {}


    async addSoluongToProduct(storageCSSXDTO: any, cssxId: any) {
        const {brandID, productID, soluong} = storageCSSXDTO;
        let product = await this.adminService.findProductById(productID);
       

        let brandToAdd = await this.adminService.getBrand(brandID)
        let newbrandCssx = [];

        newbrandCssx.push(brandToAdd);
        let StorageCSSX = {cssxID: cssxId, brand: newbrandCssx};
        const checkcssx = await this.storageCSSXModel.find({cssxID: cssxId});
        
        if(checkcssx.length == 0 ) {
            console.log("not exist")
            await this.storageCSSXModel.create(StorageCSSX);
        } else if(checkcssx.length == 1) {
            console.log("existed")
            const getcssx = await this.storageCSSXModel.find({cssxID: cssxId});
            const cssx = getcssx.shift();
            
            
            const brands = cssx.brand;
            for(let j = 0; j < brands.length; j++) {
                let productArrNew = brands[j].product;
                for(let i = 0; i < productArrNew.length; i++) {
            
                    if(productArrNew[i]._id.toString() == productID) {
                        if(!productArrNew[i].soluong) {
                            console.log(1)
                            productArrNew[i].soluong = soluong;
                            console.log(brands[j])
                    
                                
                                await this.storageCSSXModel.find({cssxID: cssxId}).updateOne({brand: brands[j]})
                            
                        } else if(productArrNew[i].soluong) {
                            console.log(2)
                            
                            productArrNew[i].soluong += soluong;
                                console.log(brands[j])
                                await this.storageCSSXModel.find({cssxID: cssxId}).updateOne({brand: brands[j]})
                        }                     
                    }
                }              
            }
        }       
    }

    async acceptGetProduct(id: any) {
        const requireFromDLPP = await this.dlppService.getRequireProduct(id)
        let {dlppID, brandID, productID, soluong, status} = requireFromDLPP.shift();
        
        const getstorageCSSX = await this.storageCSSXModel.find({cssxID: id})
        const storageCSSX = getstorageCSSX.shift();
        
        const brandArr = storageCSSX.brand;
        
        for(let i = 0; i < brandArr.length; i++) {
            if(brandArr[i]._id.toString() == brandID) {
                
                for(let j = 0; j < brandArr[i].product.length; j++) {
                    if(brandArr[i].product[j]._id.toString() == productID) {
                        brandArr[i].product[j].soluong -= soluong; 
                        
                        await this.storageCSSXModel.find({cssxID: id}).updateOne({brand: brandArr[i]})
                        status = true;
                        await this.dlppService.update(id, status);

                        //update to dlpp storage
                        const storageDLPP = await this.dlppService.getStorageDLPP(dlppID)
                        if (storageDLPP.length == 0) {
                            brandArr[i].product[j].soluong = soluong;
                            let brand = [];
                            brand.push(brandArr[i])
                            const newStorage = {
                                dlppID: dlppID,
                                brand: brand
                            }
                            await this.dlppService.createStorageDLPP(newStorage);
                            
                        } else if (storageDLPP.length > 0) {
                            const storageDLPP = await this.dlppService.getStorageDLPP(dlppID)
                            console.log(storageDLPP);
                            let brands = storageDLPP.shift().brand;
                            // console.log(brands)
                            for(let i = 0; i < brands.length; i++) {
                                console.log(brands[i].product[j].soluong)
                                brands[i].product[j].soluong = brands[i].product[j].soluong + soluong;
                                console.log(brands[i].product[j].soluong)
                                console.log(brands[i].product[j])
                                await this.dlppService.updatetoStorageDLPP(dlppID, brands[i])
                            }
                        }
                        
                        
                    }
                }
            }
        }
    }
}
