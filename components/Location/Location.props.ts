import { DetailedHTMLProps, HTMLAttributes } from "react";
import { ILocation } from "../../core/interfaces/location.interface";

export interface LocationProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	location: ILocation;
	index: number;
	onChildMethodCall: () => void;
}