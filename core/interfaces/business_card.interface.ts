import { IFile } from "./file.interface";

export interface IBusinessCard {
	uuid: string;
	fullName: string;
	link: string;
	phoneNumber: string;
	photo: IFile;
	position: string;
	email: string;
}