import { useEffect, useState } from "react";
import { withAdminLayoutWithAside } from "../../layout/AdminLayoutWithAside/AdminLayoutWithAside";
import styles from './BusinessCard.module.scss';
import Modal from 'react-modal';
import cn from 'classnames';
import { useForm } from "react-hook-form";
import { BusinessCardItem } from "../../components/BusinessCard/BusinessCard";
import { IBusinessCard } from "../../core/interfaces/business_card.interface";
import BusinessCardService from "../../services/business-card.service";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import { AddBusinessCardDto } from "../../core/dto/business_card/add-business_card.dto";
import { Loader } from "../../components/Loader/Loader";


function AdminBusinessCards(): JSX.Element {

	const [cards, setCards] = useState<IBusinessCard[]>([]);
	const [isCardsLoading, setIsCardsLoading] = useState<boolean>(false);

	useEffect(() => {
		getCards();
	}, []);

	const getCards = (): void => {
		try {
			setIsCardsLoading(true);
			BusinessCardService.getAll().then((res: AxiosResponse<BaseResponse<IBusinessCard[]>>) => {
				setCards(res.data.data);
				setIsCardsLoading(false);
			});
		} catch(e) {
			console.error(e);
		}
	}

	const {
		register,
		formState: {
			errors
		},
		handleSubmit
	} = useForm({
		mode: 'onBlur'
	});

	const [modalIsOpen, setModalIsOpen] = useState(false);

	function openModal() {
		setModalIsOpen(true);
	}

	function closeModal() {
		setModalIsOpen(false);
	}

	const handleChildMethodCall = () => {
		getCards();
	}

	const addCard = (data: any): void => {
		try {
			const dto: AddBusinessCardDto = new AddBusinessCardDto(data.fullName, data.link, data.phoneNumber, data.position, data.email);
			BusinessCardService.add(dto).then((res: AxiosResponse<BaseResponse<IBusinessCard>>) => {
				closeModal();
				getCards();
			});
		} catch(e) {
			console.error(e);
		}
	}

	return (
		<>
			<button onClick={openModal} className={styles.addBtn}>
				<img src="/admin-panel/icons/pencil.svg" alt="pencil icon" />
				<span>ADD</span>
			</button>

			<div className={styles.cards}>
				{
					isCardsLoading ? <Loader></Loader> : (
						cards.length !== 0 ? (
							cards.map((card, index) => (
								<BusinessCardItem key={card.uuid} card={card} index={index + 1} onChildMethodCall={handleChildMethodCall}></BusinessCardItem>
							))
						) : <h5 className={styles.emptyText}>No business cards here...</h5>
					)
				}
			</div>

			<Modal
				isOpen={modalIsOpen}
				contentLabel="onRequestClose Example"
				className={cn(styles.modal)}
				overlayClassName={styles.overlay}
			>
				<button className={styles.closeBtn} onClick={closeModal}><img src="/admin-panel/icons/cross.svg" alt="cross icon" /></button>

				<div className={styles.modalContent}>
					<form className={cn(styles.form)} onSubmit={handleSubmit(addCard)}>
						<div className={styles.rows}>
							<div className={styles.col1}>
								<div className={styles.formGroup}>
									<label htmlFor="fullName">Full name</label>
									<input {...register('fullName', {
										required: "Full name can't be empty",
										minLength: {
											value: 5,
											message: "Full name can't be less than 4 symbols"
										}
									})}
										type="text"
										name="fullName" />

									{errors?.fullName && <span className="helper-text red-text"><>{errors.fullName.message}</></span>}
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="position">Position</label>
									<input {...register('position', {
										required: "Position can't be empty",
										minLength: {
											value: 5,
											message: "Position can't be less than 4 symbols"
										}
									})}
										type="text"
										name="position" />

									{errors?.position && <span className="helper-text red-text"><>{errors.position.message}</></span>}
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="phoneNumber">Number</label>
									<input {...register('phoneNumber', {
										required: "Number can't be empty",
										minLength: {
											value: 5,
											message: "Phone number can't be less than 4 symbols"
										}
									})}
										type="text"
										name="phoneNumber" />

									{errors?.phoneNumber && <span className="helper-text red-text"><>{errors.phoneNumber.message}</></span>}
								</div>

								
							</div>

							<div className={styles.col2}>
								<div className={styles.formGroup}>
									<label htmlFor="link">LinkedIn link</label>
									<input {...register('link', {
										required: "LinkedIn link can't be empty",
										minLength: {
											value: 5,
											message: "LinkedIn link can't be less than 4 symbols"
										}
									})}
										type="text"
										name="link" />

									{errors?.link && <span className="helper-text red-text"><>{errors.link.message}</></span>}
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="email">Email</label>
									<input {...register('email', {
										required: "Email can't be empty",
										pattern: {
											value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
											message: 'Please enter correct mail'
										}
									})}
										type="email"
										name="email" />

									{errors?.email && <span className="helper-text red-text"><>{errors.email.message}</></span>}
								</div>

							</div>
						</div>
						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>
		</>
	)
}

export default withAdminLayoutWithAside(AdminBusinessCards);