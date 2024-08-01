import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ITeamMember } from "../../core/interfaces/team_member.interface";

export interface OurTeamProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	teamMember: ITeamMember;
	index: number;
	onChildMethodCall: () => void;
}