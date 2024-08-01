import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IPartner } from "../../core/interfaces/partner.interface";

export interface PartnerProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	partner: IPartner;
	index: number;
	onChildMethodCall: () => void;
}