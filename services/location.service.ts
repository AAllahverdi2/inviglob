import { AxiosResponse } from "axios";
import { BaseResponse } from "../core/classes/base-response";
import { AddLocationDto } from "../core/dto/location/add-location.dto";
import $api from "../http";
import { ILocation } from "../core/interfaces/location.interface";
import { UpdateLocationDto } from "../core/dto/location/update-location.dto";

export default class LocationService {
	static async add(dto: AddLocationDto): Promise<AxiosResponse<BaseResponse<ILocation>>> {
		return $api.post<BaseResponse<ILocation>>('/location/add', dto);
	}

	static async getAll(): Promise<AxiosResponse<BaseResponse<ILocation[]>>> {
		return $api.get<BaseResponse<ILocation[]>>('/location/all');
	}

	static async getById(id: number): Promise<AxiosResponse<BaseResponse<ILocation>>> {
		return $api.get<BaseResponse<ILocation>>(`/location/by-id/${id}`);
	}

	static async remove(id: number): Promise<AxiosResponse<BaseResponse<ILocation>>> {
		return $api.delete<BaseResponse<ILocation>>(`/location/remove/${id}`);
	}

	static async update(dto: UpdateLocationDto): Promise<AxiosResponse<BaseResponse<ILocation>>> {
		return $api.put<BaseResponse<ILocation>>('/location/update', dto);
	}

	static async removePhoto(locationId: number): Promise<AxiosResponse<BaseResponse<ILocation>>> {
		return $api.delete<BaseResponse<ILocation>>('/location/photo/remove', { params: { locationId } })
	}

	static async uploadPhoto(file: File, locationId: number): Promise<AxiosResponse<BaseResponse<ILocation>>> {
		const fd = new FormData();
		fd.append('file', file);
		return $api.post<BaseResponse<ILocation>>('/location/photo/upload', fd, { params: { locationId } })
	}
}