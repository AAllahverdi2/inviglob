export class UpdateLocationDto {
	constructor(
		public id: number,
		public name: string,
		public address: string
	) {}
}