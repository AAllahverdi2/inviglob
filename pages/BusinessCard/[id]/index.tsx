import { useEffect, useRef, useState } from 'react';
import { withAdminLayout } from '../../../layout/AdminLayout';
import styles from './Detail.module.scss';
import { IBusinessCard } from '../../../core/interfaces/business_card.interface';
import { useRouter } from 'next/router';
import BusinessCardService from '../../../services/business-card.service';
import { AxiosResponse } from 'axios';
import { BaseResponse } from '../../../core/classes/base-response';
import clipboardy from 'clipboardy';

import Link from 'next/link';
import { Loader } from '../../../components/Loader/Loader';
function DetailBusinessCard(): JSX.Element {

	const [showCopyMessage, setShowCopyMessage] = useState(false);
	const router = useRouter();
	const { id } = router.query;
	const [card, setCard] = useState<IBusinessCard>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		setIsLoading(true);
		if (id) {
			BusinessCardService.getById(id as string).then((res: AxiosResponse<BaseResponse<IBusinessCard>>) => {
				setIsLoading(false);
				setCard(res.data.data);
			});
		}
	}, [id]);

	const saveContact = (name: string, phone: string, email?: string) => {
		const contact = `BEGIN:VCARD
			VERSION:3.0
			N:${name}
TEL;TYPE=CELL:${phone}
EMAIL;TYPE=WORK:${email ?? ''}
END:VCARD`;

		const vcardBlob = new Blob([contact], { type: 'text/vcard' });
		const vcardURL = URL.createObjectURL(vcardBlob);

		const downloadLink = document.createElement('a');
		downloadLink.href = vcardURL;
		downloadLink.download = 'contact.vcf';
		downloadLink.click();
	}

	const copy = async (text: string) => {
		if (!text) {
			return;
		}
		const textarea = document.createElement('textarea');
		textarea.value = text;

		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);

		setShowCopyMessage(true);
		alert('Message copied to clipboard!');
	}

	return (

		<div className={styles.detail}>
			{
				isLoading ? <Loader></Loader> : (
					<>
						<img className={styles.logo} src="/admin-panel/icons/logo_with_text.svg" alt="logo with text icon" />

						<img className={styles.avatar} src={card?.photo ? `data:image/png;base64, ${card?.photo.fileBody}` : undefined} alt="avatar image" />

						<div className={styles.mainInfo}>
							<Link href={card?.link ?? '#'}>
								<img className={styles.linkedIn} src="/admin-panel/icons/linkedin.svg" alt="linkedIn icon" />
							</Link>

							<h1>{card?.fullName}</h1>
						</div>

						<p className={styles.position}>{card?.position}</p>


						<div className={styles.email}>
							<p>{card?.email}</p>
							<button onClick={() => copy(card!.email)}>
								<img className={styles.copy} src="/admin-panel/icons/copy.svg" alt="copy icon" />
							</button>
						</div>

						<div className={styles.phoneNumber}>
							<p>{card?.phoneNumber}</p>
							<button onClick={() => copy(card!.phoneNumber)}>
								<img className={styles.copy} src="/admin-panel/icons/copy.svg" alt="copy icon" />
							</button>
						</div>

						<button className={styles.saveBtn} onClick={() => saveContact(card?.fullName ?? '', card?.phoneNumber ?? '', card?.email)}>Save the number</button></>
				)
			}

		</div>
	);
}

export default withAdminLayout(DetailBusinessCard);