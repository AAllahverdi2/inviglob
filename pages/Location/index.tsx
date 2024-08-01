import { useEffect, useState } from "react";
import { withAdminLayoutWithAside } from "../../layout/AdminLayoutWithAside/AdminLayoutWithAside";
import styles from './Location.module.scss';
import Modal from 'react-modal';
import cn from 'classnames';
import { useForm } from "react-hook-form";
import { LocationItem } from "../../components/Location/Location";
import { ILocation } from "../../core/interfaces/location.interface";
import LocationService from "../../services/location.service";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import { AddLocationDto } from "../../core/dto/location/add-location.dto";
import { Loader } from "../../components/Loader/Loader";


function AdminLocation(): JSX.Element {
	const [locations, setLocations] = useState<ILocation[]>([]);
	const [isLocationsLoading, setIsLocationsLoading] = useState<boolean>(false);

	useEffect(() => {
		getLocations();
	}, []);

	const getLocations = (): void => {
		try {
			setIsLocationsLoading(true);
			LocationService.getAll().then((res: AxiosResponse<BaseResponse<ILocation[]>>) => {
				setLocations(res.data.data);
				setIsLocationsLoading(false);
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
		getLocations();
	}

	const addLocation = (data: any): void => {
		try {
			const dto: AddLocationDto = new AddLocationDto(data.name, data.address);
			LocationService.add(dto).then((res: AxiosResponse<BaseResponse<ILocation>>) => {
				closeModal();
				getLocations();
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

			<div className={styles.locations}>
				{
					isLocationsLoading ? <Loader></Loader> : (
						locations.length !== 0 ? (
							locations.map((location, index) => (
								<LocationItem key={location.id} location={location} index={index + 1} onChildMethodCall={handleChildMethodCall}/>
							))
						):  <h5 className={styles.emptyText}>No locations here...</h5>
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
					<form className={styles.form} onSubmit={handleSubmit(addLocation)}>

						<div className={styles.formGroup}>
							<label htmlFor="name">Name</label>
							<input {...register('name', {
								required: "Name can't be empty"
							})}
								type="text"
								name="name" />

							{errors?.name && <span className="helper-text red-text"><>{errors.name.message}</></span>}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="address">Address</label>
							<input {...register('address', {
								required: "Address can't be empty"
							})}
								type="text"
								name="address" />

							{errors?.address && <span className="helper-text red-text"><>{errors.address.message}</></span>}
						</div>

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>
		</>
	)
}

export default withAdminLayoutWithAside(AdminLocation);