import { AxiosResponse } from "axios";
import $api from "../http";
import { BaseResponse } from "../core/classes/base-response";
import { IBusinessCard } from "../core/interfaces/business_card.interface";
import { AddBusinessCardDto } from "../core/dto/business_card/add-business_card.dto";
import { UpdateBusinessCardDto } from "../core/dto/business_card/update-business_card.dto";
import { IFile } from "../core/interfaces/file.interface";

export default class BusinessCardService {
	static async add(dto: AddBusinessCardDto): Promise<AxiosResponse<BaseResponse<IBusinessCard>>> {
		return $api.post<BaseResponse<IBusinessCard>>('/business-card/add', dto);
	}

	static async getAll(): Promise<AxiosResponse<BaseResponse<IBusinessCard[]>>> {
		return $api.get<BaseResponse<IBusinessCard[]>>('/business-card/all');
	}

	static async getById(uuid: string): Promise<AxiosResponse<BaseResponse<IBusinessCard>>> {
		return $api.get<BaseResponse<IBusinessCard>>(`/business-card/by-id/${uuid}`);
	}

	static async removePhoto(cardUUID: string): Promise<AxiosResponse<BaseResponse<IBusinessCard>>> {
		return $api.delete<BaseResponse<IBusinessCard>>('/business-card/photo/remove', { params: { cardUUID } });
	}

	static async getQRById(uuid: string): Promise<AxiosResponse<BaseResponse<IFile>>> {
		return $api.get<BaseResponse<IFile>>(`/business-card/qr/by-id/${uuid}`);
	}

	static async generateQR(cardUUID: string): Promise<AxiosResponse<BaseResponse<IFile>>> {
		return $api.post<BaseResponse<IFile>>('/business-card/qr/generate', {}, { params: { cardUUID } })
	}

	static async uploadPhoto(file: File, cardUUID: string): Promise<AxiosResponse<BaseResponse<IBusinessCard>>> {
		const fd = new FormData();
		fd.append('file', file);
		return $api.post<BaseResponse<IBusinessCard>>('/business-card/photo/upload', fd, { params: { cardUUID } })
	}

	static async remove(uuid: string): Promise<AxiosResponse<BaseResponse<IBusinessCard>>> {
		return $api.delete<BaseResponse<IBusinessCard>>(`/business-card/remove/${uuid}`);
	}

	static async update(dto: UpdateBusinessCardDto): Promise<AxiosResponse<BaseResponse<IBusinessCard>>> {
		return $api.put<BaseResponse<IBusinessCard>>('/business-card/update', dto);
	}
}