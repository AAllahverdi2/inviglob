import { useEffect, useState } from "react";
import { PartnerItem } from "../../components/Partner/Partner";
import { withAdminLayoutWithAside } from "../../layout/AdminLayoutWithAside/AdminLayoutWithAside";
import styles from './Partners.module.scss';
import Modal from 'react-modal';
import cn from 'classnames';
import { useForm } from "react-hook-form";
import { IPartner } from "../../core/interfaces/partner.interface";
import { Loader } from "../../components/Loader/Loader";
import PartnerService from "../../services/partner.service";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import { AddPartnerDto } from "../../core/dto/partner/add-partner.dto";


function AdminPartners(): JSX.Element {

	const [partners, setPartners] = useState<IPartner[]>([]);
	const [isPartnersLoading, setIsPartnersLoading] = useState<boolean>(false);

	useEffect(() => {
		getPartners();
	}, []);

	const getPartners = (): void => {

		try {
			setIsPartnersLoading(true);
			PartnerService.getAll().then((res: AxiosResponse<BaseResponse<IPartner[]>>) => {
				setPartners(res.data.data);
				setIsPartnersLoading(false);
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

	const [modalIsOpen, setIsOpen] = useState(false);

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const handleChildMethodCall = () => {
		getPartners();
	}

	const addPartner = (data: any): void => {
		try {
			const dto: AddPartnerDto = new AddPartnerDto(data.name, data.description);
			PartnerService.add(dto).then((res: AxiosResponse<BaseResponse<IPartner>>) => {
				closeModal();
				getPartners();
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

			<div className={styles.partners}>
				{
					isPartnersLoading ? <Loader></Loader> : (
						partners.length !== 0 ? (
							partners.map((partner, index) => (
								<PartnerItem key={partner.id} partner={partner} index={index + 1} onChildMethodCall={handleChildMethodCall} />
							))
						)  : <h5 className={styles.emptyText}>No partners here...</h5>
					)
				}
			</div>

			<Modal
				id="custom-modal"
				isOpen={modalIsOpen}
				contentLabel="onRequestClose Example"
				className={cn(styles.modal)}
				overlayClassName={styles.overlay}
			>
				<button className={styles.closeBtn} onClick={closeModal}><img src="/admin-panel/icons/cross.svg" alt="cross icon" /></button>

				<div className={styles.modalContent}>
					<form className={styles.form} onSubmit={handleSubmit(addPartner)}>
						<div className={styles.formGroup}>
							<label htmlFor="name">Name</label>
							<input {...register('name', {
								required: "Name can't be empty",
								minLength: {
									value: 5,
									message: "Name can't be less than 4 symbols"
								}
							})}
								type="text"
								name="name" />

							{errors?.name && <span className="helper-text red-text"><>{errors.name.message}</></span>}
						</div>
						
						<div className={styles.formGroup}>
							<label htmlFor="description">Description</label>
							<input {...register('description', {
								required: "Description can't be empty",
								minLength: {
									value: 5,
									message: "Description can't be less than 4 symbols"
								}
							})}
								type="text"
								name="description" />

							{errors?.description && <span className="helper-text red-text"><>{errors.description.message}</></span>}
						</div>

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>


		</>
	)
}

export default withAdminLayoutWithAside(AdminPartners);