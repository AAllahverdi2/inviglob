import { withAdminLayout } from "../layout/AdminLayout";
import styles from './Auth.module.scss';
import { useForm } from "react-hook-form";
import cn from 'classnames';
import { useRouter } from "next/router";
import AuthService from "../services/auth.service";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../core/classes/base-response";

function AdminLogin(): JSX.Element {

	const {
		register,
		formState: {
			errors
		},
		handleSubmit
	} = useForm({
		mode: 'onBlur'
	});

	const router = useRouter();

	const login = (dto: any): void => {
		try {
			AuthService.login(dto).then((res: AxiosResponse<BaseResponse<string>>) => {
				localStorage.setItem('jwt', res.data.data);
				router.push('/Partners');
			}, () => {
				alert('Incorrect data');
			})
		} catch(e) {
			console.error(e);
		}
	}

	return (
		<div className={styles.loginWrapper}>
			<img className={styles.logo} src="/admin-panel/icons/logo_with_text.svg" alt="logo with text icon" />

			<form className={cn(styles.form, styles.small)} onSubmit={handleSubmit(login)}>
				<div className={styles.formGroup}>
					<label htmlFor="login">Login</label>
					<input {...register('login', {
						required: "Login can't be empty"
					})}
						type="text"
						name="login" />

					{errors?.login && <span className="helper-text red-text"><>{errors.login.message}</></span>}
				</div>

				<div className={styles.formGroup}>
					<label htmlFor="password">Password</label>
					<input {...register('password', {
						required: "Password can't be empty",
						minLength: {
							value: 4	,
							message: "Password can't be less than 4 symbols"
						}
					})}
						type="password"
						name="password" />

					{errors?.password && <span className="helper-text red-text"><>{errors?.password.message}</></span>}
				</div>

				<input type="submit" className={styles.submitBtn} value='Log in' />
			</form>
		</div>
	);
}

export default withAdminLayout(AdminLogin);