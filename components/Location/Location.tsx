import { LocationProps } from "./Location.props";
import styles from './Location.module.scss';
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UpdateLocationDto } from "../../core/dto/location/update-location.dto";
import LocationService from "../../services/location.service";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import { ILocation } from "../../core/interfaces/location.interface";
import Modal from 'react-modal';
import cn from 'classnames';
import { Tooltip as ReactTooltip } from "react-tooltip";


export const LocationItem = ({ location, index, onChildMethodCall, ...props }: LocationProps): JSX.Element => {

	const inputRef = useRef<HTMLInputElement>(null);
	const [name, setName] = useState<string>(location.name);
	const [address, setAddress] = useState<string>(location.address);

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

	const handleNameInputChange = (event: any) => {
		setName(event.target.value);
	};

	const handleAddressInputChange = (event: any) => {
		setAddress(event.target.value);
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

	const uploadFile = (file: File): void => {
		if (file) {
			LocationService.uploadPhoto(file, location.id).then((res: AxiosResponse<BaseResponse<ILocation>>) => {
				onChildMethodCall();
				alert(res.data.message);
			});
		} else {
			console.log('Not file');
		}
	}

	const removeFile = (id: number): void => {		
		LocationService.removePhoto(id).then((res: AxiosResponse<BaseResponse<ILocation>>) => {
			onChildMethodCall();
			alert(res.data.message);
		}).catch((e) => {
			console.log(e);
		});
	}

	const changeLocation = (data: any): void => {
		const dto: UpdateLocationDto = new UpdateLocationDto(location.id, data.name, data.address);
		LocationService.update(dto).then((res: AxiosResponse<BaseResponse<ILocation>>) => {
			closeModal();
			onChildMethodCall();
		});
	}

	const deleteLocation = (id: number): void => {
		LocationService.remove(id).then((res: AxiosResponse<BaseResponse<ILocation>>) => {
			onChildMethodCall();
			alert(res.data.message);
		});
	}


	return (
		<div className={styles.location} {...props}>
			<p>{index}. {location.name}</p>
			<p className={styles.address}>{location.address}</p>
			<div className={styles.icons}>
				<button data-tooltip-id="change-tooltip" className={styles.iconBtn} onClick={openModal}>
					<img src="/admin-panel/icons/change.svg" alt="change icon" />
				</button>
				<ReactTooltip
					id="change-tooltip"
					place="bottom"
					content="Change location"
					style={{ fontSize: '1.3rem'}}
				/>

				{
					location.photo ? (
						<>
							<button data-tooltip-id="remove-file-tooltip" className={styles.iconBtn} onClick={() => removeFile(location.id)} >
								<img src="/admin-panel/icons/remove-file.svg" alt="remove file icon" />
							</button>
							<ReactTooltip
								id="remove-file-tooltip"
								place="bottom"
								content="Remove location photo"
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
								content="Upload location photo"
								style={{ fontSize: '1.3rem' }}
							/>
						</>
					)
				}

				<button data-tooltip-id="remove-tooltip" className={styles.iconBtn} onClick={() => deleteLocation(location.id)}>
					<img src="/admin-panel/icons/cross.svg" alt="cross icon" />
				</button>
				<ReactTooltip
					id="remove-tooltip"
					place="bottom"
					content="Remove location"
					style={{ fontSize: '1.3rem'}}
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
					<form className={styles.form} onSubmit={handleSubmit(changeLocation)}>
						<div className={styles.formGroup}>
							<label htmlFor="name">Name</label>
							<input {...register('name', {
								required: "Name can't be empty"
							})}
								type="text"
								name="name"
								value={name}
								onChange={handleNameInputChange} />

							{errors?.name && <span className="helper-text red-text"><>{errors.name.message}</></span>}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="address">Address</label>
							<input {...register('address', {
								required: "Address can't be empty"
							})}
								type="text"
								name="address"
								value={address}
								onChange={handleAddressInputChange} />

							{errors?.address && <span className="helper-text red-text"><>{errors.address.message}</></span>}
						</div>

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>

		</div>


	);
};