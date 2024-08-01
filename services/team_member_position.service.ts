import { AxiosResponse } from "axios";
import { BaseResponse } from "../core/classes/base-response";
import { ITeamMemberPosition } from "../core/interfaces/team_member_position.interface";
import $api from "../http";
import { AddTeamMemberPositionDto } from "../core/dto/team_member_position/add-team_member-position.dto";
import { UpdateTeamMemberPositionDto } from "../core/dto/team_member_position/update-team_member_position.dto";

export default class TeamMemberPositionService {
	static async add(dto: AddTeamMemberPositionDto): Promise<AxiosResponse<BaseResponse<ITeamMemberPosition>>> {
		return $api.post<BaseResponse<ITeamMemberPosition>>('/team-member-position/add', dto);
	}

	static async getAll(): Promise<AxiosResponse<BaseResponse<ITeamMemberPosition[]>>> {
		return $api.get<BaseResponse<ITeamMemberPosition[]>>('/team-member-position/all');
	}

	static async getById(id: number): Promise<AxiosResponse<BaseResponse<ITeamMemberPosition>>> {
		return $api.get<BaseResponse<ITeamMemberPosition>>(`/team-member-position/by-id/${id}`);
	}

	static async remove(id: number): Promise<AxiosResponse<BaseResponse<ITeamMemberPosition>>> {
		return $api.delete<BaseResponse<ITeamMemberPosition>>(`/team-member-position/remove/${id}`);
	}

	static async update(dto: UpdateTeamMemberPositionDto): Promise<AxiosResponse<BaseResponse<ITeamMemberPosition>>> {
		return $api.put<BaseResponse<ITeamMemberPosition>>('/team-member-position/update', dto);
	}
}