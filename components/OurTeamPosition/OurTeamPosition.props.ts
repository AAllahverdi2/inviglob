import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ILocation } from "../../core/interfaces/location.interface";
import { ITeamMemberPosition } from "../../core/interfaces/team_member_position.interface";

export interface OurTeamPositionProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	teamMemberPosition: ITeamMemberPosition;
	index: number;
	onChildMethodCall: () => void;
}