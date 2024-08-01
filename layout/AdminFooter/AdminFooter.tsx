import styles from './AdminFooter.module.scss';
import Link from 'next/link';

export const AdminFooter = (): JSX.Element => {
	return (
		<footer className={styles.footer}>
			<div className={styles.logo}>
				<img src="/admin-panel/icons/logo_with_text.svg" alt="logo with text icon" />
			</div>

			<p className={styles.rights}>© 2023 All rights reserved.</p>

			<div className={styles.contact}>
				<p>Contact us</p>
				<Link href='#'>
					<img src="/admin-panel/icons/linkedin.svg" alt="linkedin icon" />
				</Link>
				<p className={styles.email}>cooperation@inviglob.com</p>
			</div>
		</footer>
	)
}