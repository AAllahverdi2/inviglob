import { useEffect, useState } from "react";
import { withAdminLayoutWithAside } from "../../layout/AdminLayoutWithAside/AdminLayoutWithAside";
import styles from './OurTeam.module.scss';
import Modal from 'react-modal';
import cn from 'classnames';
import { useForm } from "react-hook-form";
import { OurTeamItem } from "../../components/OurTeam/OurTeam";
import { ITeamMember } from "../../core/interfaces/team_member.interface";
import TeamMemberService from "../../services/team_member.service";
import { AxiosResponse } from "axios";
import { BaseResponse } from "../../core/classes/base-response";
import { AddTeamMemberDto } from "../../core/dto/team_member/add-team_member.dto";
import { Loader } from "../../components/Loader/Loader";
import { ITeamMemberPosition } from "../../core/interfaces/team_member_position.interface";
import TeamMemberPositionService from "../../services/team_member_position.service";


function AdminOurTeam(): JSX.Element {

	const [teams, setTeams] = useState<ITeamMember[]>([]);
	const [isTeamsLoading, setIsTeamsLoading] = useState<boolean>(false);

	const [positions, setPositions] = useState<ITeamMemberPosition[]>([]);

	useEffect(() => {
		getTeamMembers();
		getTeamMembersPositions();
	}, []);

	const getTeamMembers = (): void => {
		try {
			setIsTeamsLoading(true);
			TeamMemberService.getAll().then((res: AxiosResponse<BaseResponse<ITeamMember[]>>) => {
				setTeams(res.data.data);
				setIsTeamsLoading(false);
			});
		} catch (e) {
			console.error(e);
		}
	}

	const getTeamMembersPositions = (): void => {
		try {
			TeamMemberPositionService.getAll().then((res: AxiosResponse<BaseResponse<ITeamMemberPosition[]>>) => {
				setPositions(res.data.data);
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


	const [ModalIsOpen, setModalIsOpen] = useState(false);

	function openModal() {
		setModalIsOpen(true);
	}

	function closeModal() {
		setModalIsOpen(false);
	}


	const handleChildMethodCall = () => {
		getTeamMembers();
	}

	const addTeamMember = (data: any): void => {
		try {
			const dto: AddTeamMemberDto = new AddTeamMemberDto(data.fullName, data.positionId);
			TeamMemberService.add(dto).then((res: AxiosResponse<BaseResponse<ITeamMember>>) => {
				closeModal();
				getTeamMembers();
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

			<div className={styles.teams}>
				{
					isTeamsLoading ? <Loader></Loader> : (
						teams.length !== 0 ? (
							teams.map((teamMember, index) => (
								<OurTeamItem key={teamMember.id} teamMember={teamMember} index={index + 1} onChildMethodCall={handleChildMethodCall}></OurTeamItem>
							))
						) : <h5 className={styles.emptyText}>No partners here...</h5>
					)
				}
			</div>

			<Modal
				isOpen={ModalIsOpen}
				contentLabel="onRequestClose Example"
				className={cn(styles.modal)}
				overlayClassName={styles.overlay}
			>
				<button className={styles.closeBtn} onClick={closeModal}><img src="/admin-panel/icons/cross.svg" alt="cross icon" /></button>

				<div className={styles.modalContent}>
					<form className={styles.form} onSubmit={handleSubmit(addTeamMember)}>
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
							<label htmlFor="positionId">Position</label>
							<select className={styles.select} {...register('positionId', {
								required: "positionId can't be empty"
							})}
								name="positionId">
								{
									positions.map((position) => (
										<option key={position.id} value={position.id}>{position.name}</option>
									))
								}
							</select>

							{errors?.positionId && <span className="helper-text red-text"><>{errors.positionId.message}</></span>}
						</div>

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>

		</>
	)
}

export default withAdminLayoutWithAside(AdminOurTeam);