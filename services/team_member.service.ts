import { AxiosResponse } from "axios";
import $api from "../http";
import { BaseResponse } from "../core/classes/base-response";
import { AddTeamMemberDto } from "../core/dto/team_member/add-team_member.dto";
import { ITeamMember } from "../core/interfaces/team_member.interface";
import { UpdateTeamMemberDto } from "../core/dto/team_member/update-team_member.dto";

export default class TeamMemberService {
	static async add(dto: AddTeamMemberDto): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		return $api.post<BaseResponse<ITeamMember>>('/team-member/add', dto);
	}

	static async getAll(): Promise<AxiosResponse<BaseResponse<ITeamMember[]>>> {
		return $api.get<BaseResponse<ITeamMember[]>>('/team-member/all');
	}

	static async getById(id: number): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		return $api.get<BaseResponse<ITeamMember>>(`/team-member/by-id/${id}`);
	}

	static async removeDossier(teamMemberId: number): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		return $api.delete<BaseResponse<ITeamMember>>('/team-member/dossier/remove', { params: { teamMemberId } })
	}

	static async uploadDossier(file: File, teamMemberId: number): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		const fd = new FormData();
		fd.append('file', file);
		return $api.post<BaseResponse<ITeamMember>>('/team-member/dossier/upload', fd, { params: { teamMemberId } })
	}

	static async removePhoto(teamMemberId: number): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		return $api.delete<BaseResponse<ITeamMember>>('/team-member/photo/remove', { params: { teamMemberId } })
	}

	static async uploadPhoto(file: File, teamMemberId: number): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		const fd = new FormData();
		fd.append('file', file);
		return $api.post<BaseResponse<ITeamMember>>('/team-member/photo/upload', fd, { params: { teamMemberId } })
	}

	static async remove(id: number): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		return $api.delete<BaseResponse<ITeamMember>>(`/team-member/remove/${id}`);
	}

	static async update(dto: UpdateTeamMemberDto): Promise<AxiosResponse<BaseResponse<ITeamMember>>> {
		return $api.put<BaseResponse<ITeamMember>>('/team-member/update', dto);
	}
}