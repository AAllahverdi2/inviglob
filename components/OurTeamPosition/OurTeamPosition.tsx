
import styles from './OurTeamPosition.module.scss';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import Modal from 'react-modal';
import cn from 'classnames';
import { OurTeamPositionProps } from './OurTeamPosition.props';
import { UpdateTeamMemberPositionDto } from '../../core/dto/team_member_position/update-team_member_position.dto';
import TeamMemberPositionService from '../../services/team_member_position.service';
import { ITeamMemberPosition } from '../../core/interfaces/team_member_position.interface';
import { Tooltip as ReactTooltip } from "react-tooltip";


export const OurTeamPositionItem = ({ teamMemberPosition, index, onChildMethodCall, ...props }: OurTeamPositionProps): JSX.Element => {

	const [name, setName] = useState<string>(teamMemberPosition.name);

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

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	const changePosition = (data: any): void => {
		const dto: UpdateTeamMemberPositionDto = new UpdateTeamMemberPositionDto(teamMemberPosition.id, data.name);
		TeamMemberPositionService.update(dto).then((res: AxiosResponse<BaseResponse<ITeamMemberPosition>>) => {
			closeModal();
			onChildMethodCall();
		});
	}

	const deletePosition = (id: number): void => {
		TeamMemberPositionService.remove(id).then((res: AxiosResponse<BaseResponse<ITeamMemberPosition>>) => {
			onChildMethodCall();
			alert(res.data.message);
		});
	}


	return (
		<div className={styles.position} {...props}>
			<p>{index}. {teamMemberPosition.name}</p>
			{/* <p className={styles.address}>Central Park Towers, DIFC , Dubai , UAE</p> */}
			<div className={styles.icons}>
				<button data-tooltip-id="change-tooltip" className={styles.iconBtn} onClick={openModal}>
					<img src="/admin-panel/icons/change.svg" alt="change icon" />
				</button>
				<ReactTooltip
					id="change-tooltip"
					place="bottom"
					content="Change position"
					style={{ fontSize: '1.3rem'}}
				/>

				<button data-tooltip-id="remove-tooltip" className={styles.iconBtn} onClick={() => deletePosition(teamMemberPosition.id)}>
					<img src="/admin-panel/icons/cross.svg" alt="cross icon" />
				</button>
				<ReactTooltip
					id="remove-tooltip"
					place="bottom"
					content="Remove position"
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
					<form className={styles.form} onSubmit={handleSubmit(changePosition)}>
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

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>

		</div>


	);
};