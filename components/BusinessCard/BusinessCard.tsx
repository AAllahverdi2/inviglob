import { BusinessCardProps } from './BusinessCard.props';
import styles from './BusinessCard.module.scss';
import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { UpdateBusinessCardDto } from '../../core/dto/business_card/update-business_card.dto';
import BusinessCardService from '../../services/business-card.service';
import { AxiosResponse } from 'axios';
import { BaseResponse } from '../../core/classes/base-response';
import { IBusinessCard } from '../../core/interfaces/business_card.interface';
import { IFile } from '../../core/interfaces/file.interface';
import { saveAs } from 'file-saver';
import Modal from 'react-modal';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from "react-tooltip";


export const BusinessCardItem = ({ card, index, onChildMethodCall, ...props }: BusinessCardProps): JSX.Element => {
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

	const [fullName, setFullName] = useState<string>(card.fullName);
	const [link, setLink] = useState<string>(card.link);
	const [phoneNumber, setPhoneNumber] = useState<string>(card.phoneNumber);
	const [position, setPosition] = useState<string>(card.position);

	const handleFullNameInputChange = (event: any) => {
		setFullName(event.target.value);
	};

	const handleLinkInputChange = (event: any) => {
		setLink(event.target.value);
	};

	const handlePhoneNumberInputChange = (event: any) => {
		setPhoneNumber(event.target.value);
	};

	const handlePositionInputChange = (event: any) => {
		setPosition(event.target.value);
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

	const changeCard = (data: any): void => {
		const dto: UpdateBusinessCardDto = new UpdateBusinessCardDto(card.uuid, data.fullName, data.link, data.phoneNumber, data.position, data.email);
		BusinessCardService.update(dto).then((res: AxiosResponse<BaseResponse<IBusinessCard>>) => {
			closeModal();
			onChildMethodCall();
		});
	}

	const deleteCard = (uuid: string): void => {
		BusinessCardService.remove(uuid).then((res: AxiosResponse<BaseResponse<IBusinessCard>>) => {
			onChildMethodCall();
			alert(res.data.message);
		});
	}

	const uploadFile = (file: File): void => {
		if (file) {
			BusinessCardService.uploadPhoto(file, card.uuid).then((res: AxiosResponse<BaseResponse<IBusinessCard>>) => {
				onChildMethodCall();
				alert(res.data.message);
			});
		} else {
			console.log('Not file');
		}
	}

	const removeFile = (uuid: string): void => {
		BusinessCardService.removePhoto(uuid).then((res: AxiosResponse<BaseResponse<IBusinessCard>>) => {
			onChildMethodCall();
			alert(res.data.message);
		});
	}

	const downloadQR = (uuid: string): void => {
		BusinessCardService.getQRById(uuid).then((res: AxiosResponse<BaseResponse<IFile>>) => {
			// Decode the Base64-encoded string
			const decodedData = atob(res.data.data.fileBody);

			// Convert the decoded data into a Uint8Array
			const uint8Array = new Uint8Array(decodedData.length);
			for (let i = 0; i < decodedData.length; i++) {
				uint8Array[i] = decodedData.charCodeAt(i);
			}

			const blob = new Blob([uint8Array], { type: `application/${res.data.data.fileExtension}` });
			saveAs(blob, `qr-code.${res.data.data.fileExtension}`);
		});
	}

	const generateQR = (uuid: string): void => {
		BusinessCardService.generateQR(uuid).then((res: AxiosResponse<BaseResponse<IFile>>) => {
			alert(res.data.message);
		})
	}

	return (
		<div className={styles.businessCard} {...props}>
			<p>{index}. {card.fullName}</p>
			<p className={styles.position}>{card.position}</p>
			<p className={styles.number}>{card.phoneNumber}</p>

			<div className={styles.icons}>
				<button data-tooltip-id="change-tooltip" className={styles.iconBtn} onClick={openModal}>
					<img src="/admin-panel/icons/change.svg" alt="change icon" />
				</button>
				<ReactTooltip
					id="change-tooltip"
					place="bottom"
					content="Change business card"
					style={{ fontSize: '1.3rem' }}
				/>

				{
					card.photo ? (
						<>
							<button data-tooltip-id="remove-file-tooltip" className={styles.iconBtn} onClick={() => removeFile(card.uuid)} >
								<img src="/admin-panel/icons/remove-file.svg" alt="remove file icon" />
							</button>
							<ReactTooltip
								id="remove-file-tooltip"
								place="bottom"
								content="Remove business card photo"
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
								content="Upload business card photo"
								style={{ fontSize: '1.3rem' }}
							/>
						</>
					)
				}

				<button data-tooltip-id="download-tooltip" className={styles.iconBtn} onClick={() => downloadQR(card.uuid)} >
					<img src="/admin-panel/icons/download.svg" alt="download icon" />
				</button>
				<ReactTooltip
					id="download-tooltip"
					place="bottom"
					content="Download qr code"
					style={{ fontSize: '1.3rem' }}
				/>

				<button data-tooltip-id="generate-tooltip" className={styles.iconBtn} onClick={() => generateQR(card.uuid)} >
					<img src="/admin-panel/icons/qr.svg" alt="QR code icon" />
				</button>
				<ReactTooltip
					id="generate-tooltip"
					place="bottom"
					content="Generate qr code"
					style={{ fontSize: '1.3rem' }}
				/>

				<button data-tooltip-id="remove-tooltip" className={styles.iconBtn} onClick={() => deleteCard(card.uuid)}>
					<img src="/admin-panel/icons/cross.svg" alt="cross icon" />
				</button>
				<ReactTooltip
					id="remove-tooltip"
					place="bottom"
					content="Remove business card"
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
					<form className={styles.form} onSubmit={handleSubmit(changeCard)}>
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
										name="fullName"
										value={fullName}
										onChange={handleFullNameInputChange} />

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
										name="position"
										value={position}
										onChange={handlePositionInputChange} />

									{errors?.position && <span className="helper-text red-text"><>{errors.position.message}</></span>}
								</div>

								<div className={styles.formGroup}>
									<label htmlFor="phoneNumber">Number</label>
									<input {...register('phoneNumber', {
										required: "Phone number can't be empty",
										minLength: {
											value: 5,
											message: "Phone number can't be less than 4 symbols"
										}
									})}
										type="text"
										name="phoneNumber"
										value={phoneNumber}
										onChange={handlePhoneNumberInputChange} />

									{errors?.number && <span className="helper-text red-text"><>{errors.number.message}</></span>}
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
										name="link"
										value={link}
										onChange={handleLinkInputChange} />

									{errors?.link && <span className="helper-text red-text"><>{errors.link.message}</></span>}
								</div>

							</div>
						</div>
						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>
		</div>


	);
};