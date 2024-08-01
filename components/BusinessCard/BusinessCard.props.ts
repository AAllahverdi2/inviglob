import { DetailedHTMLProps, HTMLAttributes } from "react";
import { IBusinessCard } from "../../core/interfaces/business_card.interface";

export interface BusinessCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	card: IBusinessCard;
	index: number;
	onChildMethodCall: () => void;
}