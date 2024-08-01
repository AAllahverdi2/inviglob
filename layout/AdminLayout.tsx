import { FunctionComponent } from "react";
import { AdminLayoutProps } from "./AdminLayout.props";
import styles from './AdminLayout.module.scss';
import { AdminFooter } from "./AdminFooter/AdminFooter";


export const AdminLayout = ({ children }: AdminLayoutProps): JSX.Element => {
	return (
		<div className={styles.wrapper}>

			<main>
				{children}
			</main>

			<AdminFooter />
		</div>
	)

};

export const withAdminLayout = <T extends Record<string, unknown>>(Component: FunctionComponent<T>) => {
	return function withAdminLayoutComponent(props: T): JSX.Element {
		return (
			<AdminLayout>
				<Component {...props} />
			</AdminLayout>
		);
	};
};

export default AdminLayout;