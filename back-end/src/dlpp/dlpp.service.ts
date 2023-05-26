import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminService } from 'src/admin/admin.service';
import { getProduct, getProductDocument } from './schema/getProduct.schema';
import { StorageDLPP, StorageDLPPDocument } from './schema/storageDLPP.schema';

@Injectable()
export class DlppService {
    constructor(
        @InjectModel(StorageDLPP.name)
        private storageDLPPModel: Model<StorageDLPPDocument>,
        @InjectModel(getProduct.name)
        private getProductModel: Model<getProductDocument>,
        private adminService: AdminService
    ) {}

    async addSoluongToStorageDLPP(DLPPTradeToCSSXDTo: any, dlppId:  any): Promise<any> {
        const getProduct = {
            dlppID: dlppId,
            cssxID: DLPPTradeToCSSXDTo.cssxID,
            brandID: DLPPTradeToCSSXDTo.brandID,
            productID: DLPPTradeToCSSXDTo.productID,
            soluong: DLPPTradeToCSSXDTo.soluong,
            status: false
        }
        return await this.getProductModel.create(getProduct)
    }

    async getRequireProduct(cssxId: any): Promise<any> {
        return await this.getProductModel.find({cssxID: cssxId})
    }

    async update(cssxId: any, status: any ): Promise<any> {
        return await this.getProductModel.findByIdAndUpdate(cssxId, {status: status})
    }
    async updatetoStorageDLPP(id, data:any): Promise<any> {
        return await this.storageDLPPModel.find({dlppID: id}).updateOne({brand: data})
    }

    async createStorageDLPP(newStorage: any): Promise<any> {
        return await this.storageDLPPModel.create(newStorage)
    }

    async getStorageDLPP(dlppID: any): Promise<any> {
        return await this.storageDLPPModel.find({dlppID: dlppID})
    }
}
