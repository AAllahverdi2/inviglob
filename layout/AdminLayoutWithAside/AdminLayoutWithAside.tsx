import { FunctionComponent, } from "react";
import styles from './AdminLayoutWithAside.module.scss';
import { AdminFooter } from "../AdminFooter/AdminFooter";
import { AdminLayoutWithAsideProps } from "./AdminLayoutWithAside.props";
import { AdminAside } from "../AdminAside/AdminAside";


export const AdminLayoutWithAside = ({ children }: AdminLayoutWithAsideProps): JSX.Element => {


	return (
		<div className={styles.wrapper}>

			<main>
				<AdminAside />
				<div className={styles.content}>
					{children}
				</div>
			</main>

			<AdminFooter />
		</div>


	)

};

export const withAdminLayoutWithAside = <T extends Record<string, unknown>>(Component: FunctionComponent<T>) => {
	return function withAdminLayoutWithAsideComponent(props: T): JSX.Element {
		return (
			<AdminLayoutWithAside>
				<Component {...props} />
			</AdminLayoutWithAside>
		);
	};
};

export default AdminLayoutWithAside;