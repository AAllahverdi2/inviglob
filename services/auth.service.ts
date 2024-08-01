import { AxiosResponse } from "axios";
import { LoginDto } from "../core/dto/login.dto";
import { BaseResponse } from "../core/classes/base-response";
import $api from "../http";

export default class AuthService {
	static async login(dto: LoginDto): Promise<AxiosResponse<BaseResponse<string>>> {
		return $api.post<BaseResponse<string>>('/auth/login', dto);
	}

	static async logout(): Promise<void> {
		localStorage.removeItem('jwt');
	}
}