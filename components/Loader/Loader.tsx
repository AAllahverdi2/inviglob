import { LoaderProps } from "./Loader.props";
import styles from './Loader.module.scss';

export const Loader = ({ ...props }: LoaderProps): JSX.Element => {
	return (
		<div className={styles.ldsRoller} {...props}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
	)
}