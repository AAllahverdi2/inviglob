import { OurTeamProps } from './OurTeam.props';
import styles from './OurTeam.module.scss';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UpdateTeamMemberDto } from '../../core/dto/team_member/update-team_member.dto';
import TeamMemberService from '../../services/team_member.service';
import { AxiosResponse } from 'axios';
import { BaseResponse } from '../../core/classes/base-response';
import { ITeamMember } from '../../core/interfaces/team_member.interface';
import Modal from 'react-modal';
import cn from 'classnames';
import { ITeamMemberPosition } from '../../core/interfaces/team_member_position.interface';
import TeamMemberPositionService from '../../services/team_member_position.service';
import { Tooltip as ReactTooltip } from "react-tooltip";


export const OurTeamItem = ({ teamMember, index, onChildMethodCall, ...props }: OurTeamProps): JSX.Element => {

	const inputRef = useRef<HTMLInputElement>(null);
	const inputDossierRef = useRef<HTMLInputElement>(null);

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

	const [fullName, setFullName] = useState<string>(teamMember.fullName);
	const [positionId, setPositionId] = useState<number>(teamMember.positionId);
	const [positions, setPositions] = useState<ITeamMemberPosition[]>([]);

	useEffect(() => {
		getPositions();
	}, []);

	const getPositions = (): void => {
		TeamMemberPositionService.getAll().then((res: AxiosResponse<BaseResponse<ITeamMemberPosition[]>>) => {
			setPositions(res.data.data);
		});
	}

	const handleFullNameInputChange = (event: any) => {
		setFullName(event.target.value);
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

	const triggerDossierClick = (): void => {
		if (inputDossierRef.current) {
			inputDossierRef.current.click();
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

	const onDossierFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {

		if (!e.target.files || !e.target) {
			return;
		}
		const currentFile = e.target.files[0];

		const allowedFormats = ['text/plain', 'application/pdf', 'text/html'];

		if (currentFile && !allowedFormats.includes(currentFile.type)) {
			alert('Incorrect file format');
			return;
		}

		uploadDossierFile(currentFile);
	};

	const changeTeamMember = (data: any): void => {
		const dto: UpdateTeamMemberDto = new UpdateTeamMemberDto(teamMember.id, data.fullName, data.positionId);
		TeamMemberService.update(dto).then((res: AxiosResponse<BaseResponse<ITeamMember>>) => {
			closeModal();
			onChildMethodCall();
		});
	}

	const deleteTeamMember = (id: number): void => {
		TeamMemberService.remove(id).then((res: AxiosResponse<BaseResponse<ITeamMember>>) => {
			onChildMethodCall();
			alert(res.data.message);
		});
	}

	const uploadFile = (file: File): void => {
		if (file) {
			TeamMemberService.uploadPhoto(file, teamMember.id).then((res: AxiosResponse<BaseResponse<ITeamMember>>) => {
				onChildMethodCall();
				alert(res.data.message);
			});
		} else {
			console.log('Not file');
		}
	}

	const removeFile = (id: number): void => {		
		TeamMemberService.removePhoto(id).then((res: AxiosResponse<BaseResponse<ITeamMember>>) => {
			onChildMethodCall();
			alert(res.data.message);
		}).catch((e) => {
			console.log(e);
		});
	}

	const uploadDossierFile = (file: File): void => {
		if (file) {
			TeamMemberService.uploadDossier(file, teamMember.id).then((res: AxiosResponse<BaseResponse<ITeamMember>>) => {
				onChildMethodCall();
				alert(res.data.message);
			});
		} else {
			console.log('Not file');
		}
	}

	const removeDossier = (id: number): void => {
		
		TeamMemberService.removeDossier(id).then((res: AxiosResponse<BaseResponse<ITeamMember>>) => {			
			onChildMethodCall();
			alert(res.data.message);
		}).catch((e) => {
			console.log(e);
		});;
	}

	return (
		<div className={styles.ourTeam} {...props}>
			<p>{index}. {teamMember.fullName}</p>
			<p className={styles.position}>{teamMember.positionName}</p>
			<div className={styles.icons}>
				<button data-tooltip-id="change-tooltip" id='change-btn' className={styles.iconBtn} onClick={openModal}>
					<img src="/admin-panel/icons/change.svg" alt="change icon" />
				</button>
				<ReactTooltip
					id="change-tooltip"
					place="bottom"
					content="Change team member"
					style={{ fontSize: '1.3rem' }}
				/>

				{
					teamMember.photo ? (
						<>
							<button data-tooltip-id="remove-file-tooltip" className={styles.iconBtn} onClick={() => removeFile(teamMember.id)} >
								<img src="/admin-panel/icons/remove-file.svg" alt="remove file icon" />
							</button>
							<ReactTooltip
								id="remove-file-tooltip"
								place="bottom"
								content="Remove team member photo"
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
								content="Upload team member photo"
								style={{ fontSize: '1.3rem' }}
							/>
						</>
					)
				}

				{
					teamMember.dossier ? (
						<>
							<button data-tooltip-id="remove-dossier-tooltip" className={styles.iconBtn} onClick={() => removeDossier(teamMember.id)} >
								<img src="/admin-panel/icons/remove-file.svg" alt="remove file icon" />
							</button>
							<ReactTooltip
								id="remove-dossier-tooltip"
								place="bottom"
								content="Remove team member dossier"
								style={{ fontSize: '1.3rem' }}
							/>
						</>
					) : (
						<>
							<input type="file" accept=".html, .htm, .txt, .pdf" ref={inputDossierRef} className={styles.dn} onChange={(e: React.ChangeEvent<HTMLInputElement>): void => onDossierFileUpload(e)} />

							<button data-tooltip-id="upload-dossier-tooltip" className={styles.iconBtn} onClick={triggerDossierClick} >
								<img src="/admin-panel/icons/dossier.svg" alt="dossier icon" />
							</button>
							<ReactTooltip
								id="upload-dossier-tooltip"
								place="bottom"
								content="Upload team member dossier"
								style={{ fontSize: '1.3rem' }}
							/>
						</>
					)
				}



				<button data-tooltip-id="remove-tooltip" className={styles.iconBtn} onClick={() => deleteTeamMember(teamMember.id)}>
					<img src="/admin-panel/icons/cross.svg" alt="cross icon" />
				</button>
				<ReactTooltip
					id="remove-tooltip"
					place="bottom"
					content="Remove team member"
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
					<form className={styles.form} onSubmit={handleSubmit(changeTeamMember)}>
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

							{errors?.name && <span className="helper-text red-text"><>{errors.name.message}</></span>}
						</div>

						<div className={styles.formGroup}>
							<label htmlFor="positionId">Position</label>
							<select className={styles.select} {...register('positionId', {
								required: "positionId can't be empty"
							})}
								name="positionId">
								{
									positions.map((position) => (
										position.id === positionId ? (
											<option key={position.id} value={position.id} selected>{position.name}</option>
										) : <option key={position.id} value={position.id}>{position.name}</option>
									))
								}
							</select>

							{errors?.positionId && <span className="helper-text red-text"><>{errors.positionId.message}</></span>}
						</div>

						<input type="submit" className={styles.submitBtn} value='Save' />
					</form>
				</div>

			</Modal>
		</div>


	);
};