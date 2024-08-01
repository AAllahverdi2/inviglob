export class UpdateTeamMemberDto {
	constructor(
		public id: number,
		public fullName: string,
		public positionId: number
	) {}
}