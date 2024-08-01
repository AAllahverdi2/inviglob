import { IFile } from "./file.interface";

export interface ITeamMember {
	id: number
	dossier: IFile;
	fullName: string;
	photo: IFile;
	positionId: number;
	positionName: string;
}