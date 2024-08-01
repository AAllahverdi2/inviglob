export class AddTeamMemberDto {
	constructor(
		public fullName: string,
		public positionId: number
	) {}
}