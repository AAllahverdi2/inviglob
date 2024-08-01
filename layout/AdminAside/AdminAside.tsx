import Link from 'next/link';
import styles from './AdminAside.module.scss';
import AuthService from '../../services/auth.service';
import { useRouter } from 'next/router';

export const AdminAside = (): JSX.Element => {
	const router = useRouter();

	const logout = (): void => {
		AuthService.logout();
		router.push('/');
	}

	return (
		<aside className={styles.aside}>
			<img className={styles.logo} src="/admin-panel/icons/logo_with_text.svg" alt="logo with text icon" />

			<nav className={styles.nav}>
				<ul>
					<li>
						<Link href='/Partners' className={styles.link}>
							<img src="/admin-panel/icons/home.svg" alt="home icon" />
							<p>Partner</p>
						</Link>
					</li>

					<li>
						<Link href='/Location' className={styles.link}>
							<img src="/admin-panel/icons/chart.svg" alt="chart icon" />
							<p>Location</p>
						</Link>
					</li>

					<li>
						<Link href='/OurTeam' className={styles.link}>
							<img src="/admin-panel/icons/team.svg" alt="team icon" />
							<p>Our team</p>
						</Link>
					</li>

					<li>
						<Link href='/OurTeamPosition' className={styles.link}>
							<img src="/admin-panel/icons/position.svg" alt="position icon" />
							<p>Team members positions</p>
						</Link>
					</li>

					<li>
						<Link href='BusinessCard' className={styles.link}>
							<img src="/admin-panel/icons/layers.svg" alt="layers icon" />
							<p>Business card</p>
						</Link>
					</li>

					<li>
						<button onClick={logout} className={styles.link}>
							<img src="/admin-panel/icons/logout.svg" alt="logout icon" />
							<p>Logout</p>
						</button>
					</li>
				</ul>
			</nav>
		</aside>
	)
}