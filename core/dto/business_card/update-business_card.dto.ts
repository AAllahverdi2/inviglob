export class UpdateBusinessCardDto {
	constructor(
		public uuid: string,
		public fullName: string,
		public link: string,
		public phoneNumber: string,
		public position: string,
		public email: string
	) {}
}