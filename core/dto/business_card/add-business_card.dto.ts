export class AddBusinessCardDto {
	constructor(
		public fullName: string,
		public link: string,
		public phoneNumber: string,
		public position: string,
		public email: string
	) {}
}