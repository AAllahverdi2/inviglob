import { IFile } from "./file.interface";

export interface IPartner {
	id: number;
	name: string;
	description: string;
	logo: IFile;
}