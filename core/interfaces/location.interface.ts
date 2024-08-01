import { IFile } from "./file.interface";

export interface ILocation {
	id: number;
	name: string;
	address: string;
	photo: IFile;
}