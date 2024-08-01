import { useEffect, useState } from "react";
import { withAdminLayoutWithAside } from "../../layout/AdminLayoutWithAside/AdminLayoutWithAside";
import styles from './OurTeamPosition.module.scss';
import Modal from 'react-modal';
import cn from 'classnames';
import { useForm } from "react-hook-form";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import { Loader } from "../../components/Loader/Loader";
import { ITeamMemberPosition } from "../../core/interfaces/team_member_position.interface";
import TeamMemberPositionService from "../../services/team_member_position.service";
import { AddTeamMemberPositionDto } from "../../core/dto/team_member_position/add-team_member-position.dto";
import { OurTeamPositionItem } from "../../components/OurTeamPosition/OurTeamPosition";


function AdminOurTeamPositions(): JSX.Element {
	const [positions, setPositions] = useState<ITeamMemberPosition[]>([]);
	const [isPositionsLoading, setIsPositionsLoading] = useState<boolean>(false);

	useEffect(() => {
		getPositions();
	}, []);

	const getPositions = (): void => {
		try {
			setIsPositionsLoading(true);
			TeamMemberPositionService.getAll().then((res: AxiosResponse<BaseResponse<ITeamMemberPosition[]>>) => {
				setPositions(res.data.data);
				setIsPositionsLoading(false);
			});
		} catch (e) {
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
		getPositions();
	}

	const addPosition = (data: any): void => {
		try {
			const dto: AddTeamMemberPositionDto = new AddTeamMemberPositionDto(data.name);
			TeamMemberPositionService.add(dto).then((res: AxiosResponse<BaseResponse<ITeamMemberPosition>>) => {
				closeModal();
				getPositions();
			});
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<>
			<button onClick={openModal} className={styles.addBtn}>
				<img src="/admin-panel/icons/pencil.svg" alt="pencil icon" />
				<span>ADD</span>
			</button>

			<div className={styles.positions}>
				{
					isPositionsLoading ? <Loader></Loader> : (
						positions.length !== 0 ? (
							positions.map((position, index) => (
								<OurTeamPositionItem key={position.id} teamMemberPosition={position} index={index + 1} onChildMethodCall={handleChildMethodCall} />
							))
						) : <h5 className={styles.emptyText}>No positions here...</h5>
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
					<form className={styles.form} onSubmit={handleSubmit(addPosition)}>

						<div className={styles.formGroup}>
							<label htmlFor="name">Name</label>
							<input {...register('name', {
								required: "Name can't be empty"
							})}
								type="text"
								name="name" />

							{errors?.name && <span className="helper-text red-text"><>{errors.name.message}</></span>}
						</div>

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>
		</>
	)
}

export default withAdminLayoutWithAside(AdminOurTeamPositions);