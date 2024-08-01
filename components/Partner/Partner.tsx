import { PartnerProps } from "./Partner.props";
import styles from './Partner.module.scss';
import { useForm } from "react-hook-form";
import Modal from 'react-modal';
import { UpdatePartnerDto } from "../../core/dto/partner/update-partner.dto";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import { IPartner } from "../../core/interfaces/partner.interface";
import PartnerService from "../../services/partner.service";
import cn from 'classnames';
import { useRef, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

export const PartnerItem = ({ partner, index, onChildMethodCall, ...props }: PartnerProps): JSX.Element => {

	const inputRef = useRef<HTMLInputElement>(null);

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

	const [name, setName] = useState<string>(partner.name);
	const [description, setDesciption] = useState<string>(partner.name);

	const handleNameInputChange = (event: any) => {
		setName(event.target.value);
	};

	const handleDescriptionInputChange = (event: any) => {
		setDesciption(event.target.value);
	};

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const triggerClick = (): void => {
		if (inputRef.current) {
			inputRef.current.click();
		}
	};

	const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {

		if (!e.target.files || !e.target) {
			return;
		}
		const currentFile = e.target.files[0];

		const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'image/jpe'];

		if (currentFile && !allowedFormats.includes(currentFile.type)) {
			alert('Incorrect file format');
			return;
		}

		uploadFile(currentFile);
	};

	const changePartner = (data: any): void => {
		const dto: UpdatePartnerDto = new UpdatePartnerDto(partner.id, data.name, data.description);
		PartnerService.update(dto).then((res: AxiosResponse<BaseResponse<IPartner>>) => {
			closeModal();
			onChildMethodCall();
		});
	}

	const deletePartner = (id: number): void => {
		PartnerService.remove(id).then((res: AxiosResponse<BaseResponse<IPartner>>) => {
			onChildMethodCall();
			alert(res.data.message);
		});
	}

	const uploadFile = (file: File): void => {
		if (file) {
			PartnerService.uploadLogo(file, partner.id).then((res: AxiosResponse<BaseResponse<IPartner>>) => {
				alert(res.data.message);
				onChildMethodCall();
			});
		} else {
			console.log('Not file');
		}
	}

	const removeFile = (id: number) => {
		PartnerService.removeLogo(id).then((res: AxiosResponse<BaseResponse<IPartner>>) => {
			alert(res.data.message);
			onChildMethodCall();
		}).catch((e) => {
			console.log(e);
		});;
	}

	return (
		<div className={styles.partner} {...props}>
			<p>{index}. {partner.name}</p>

			<div className={styles.icons}>
				<button data-tooltip-id="change-tooltip" className={styles.iconBtn} onClick={openModal}>
					<img src="/admin-panel/icons/change.svg" alt="change icon" />
				</button>
				<ReactTooltip
					id="change-tooltip"
					place="bottom"
					content="Change partner"
					style={{ fontSize: '1.3rem' }}
				/>



				{
					partner.logo ? (
						<>
							<button data-tooltip-id="remove-file-tooltip" className={styles.iconBtn} onClick={() => removeFile(partner.id)} >
								<img src="/admin-panel/icons/remove-file.svg" alt="remove file icon" />
							</button>
							<ReactTooltip
								id="remove-file-tooltip"
								place="bottom"
								content="Remove partner logo"
								style={{ fontSize: '1.3rem' }}
							/>
						</>
					) : (
						<>
							<input type="file" accept="image/png, image/jpeg, image/jpg, image/jpe" ref={inputRef} className={styles.dn} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onFileUpload(e)} />

							<button data-tooltip-id="upload-tooltip" className={styles.iconBtn} onClick={triggerClick} >
								<img src="/admin-panel/icons/upload.svg" alt="upload icon" />
							</button>
							<ReactTooltip
								id="upload-tooltip"
								place="bottom"
								content="Upload partner logo"
								style={{ fontSize: '1.3rem' }}
							/>
						</>
					)
				}

				<button data-tooltip-id="remove-tooltip" className={styles.iconBtn} onClick={() => deletePartner(partner.id)}>
					<img src="/admin-panel/icons/cross.svg" alt="cross icon" />
				</button>
				<ReactTooltip
					id="remove-tooltip"
					place="bottom"
					content="Remove partner"
					style={{ fontSize: '1.3rem' }}
				/>
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
					<form className={styles.form} onSubmit={handleSubmit(changePartner)}>
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
								name="name"
								value={name}
								onChange={handleNameInputChange} />

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
								name="description"
								value={description}
								onChange={handleDescriptionInputChange} />

							{errors?.description && <span className="helper-text red-text"><>{errors.description.message}</></span>}
						</div>

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>
		</div>


	);
};