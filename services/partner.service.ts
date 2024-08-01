import { AxiosResponse } from "axios";
import { AddPartnerDto } from "../core/dto/partner/add-partner.dto";
import { BaseResponse } from "../core/classes/base-response";
import { IPartner } from "../core/interfaces/partner.interface";
import $api from "../http";
import { UpdatePartnerDto } from "../core/dto/partner/update-partner.dto";

export default class PartnerService {
	static async add(dto: AddPartnerDto): Promise<AxiosResponse<BaseResponse<IPartner>>> {
		return $api.post<BaseResponse<IPartner>>('/partner/add', dto);
	}

	static async getAll(): Promise<AxiosResponse<BaseResponse<IPartner[]>>> {
		return $api.get<BaseResponse<IPartner[]>>('/partner/all');
	}

	static async getById(id: number): Promise<AxiosResponse<BaseResponse<IPartner>>> {
		return $api.get<BaseResponse<IPartner>>(`/partner/by-id/${id}`);
	}

	static async removeLogo(partnerId: number): Promise<AxiosResponse<BaseResponse<IPartner>>> {
		return $api.delete<BaseResponse<IPartner>>('/partner/logo/remove', { params: { partnerId } })
	}

	static async uploadLogo(file: File, partnerId: number): Promise<AxiosResponse<BaseResponse<IPartner>>> {
		const fd = new FormData();
		fd.append('file', file);
		return $api.post<BaseResponse<IPartner>>('/partner/logo/upload', fd, { params: {partnerId} })
	}

	static async remove(id: number): Promise<AxiosResponse<BaseResponse<IPartner>>> {
		return $api.delete<BaseResponse<IPartner>>(`/partner/remove/${id}`);
	}

	static async update(dto: UpdatePartnerDto): Promise<AxiosResponse<BaseResponse<IPartner>>> {
		return $api.put<BaseResponse<IPartner>>('/partner/update', dto);
	}
}