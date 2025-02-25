import { Accordion } from "react-bootstrap";

import styles from "../styles/Metrics.module.css";

import { IDatum } from "../types";
import InfoItem from "./info-item";
import Logs from "./logs";

export interface ImageError {
	image: any;
	error: Error;
	file?: any;
	index: number;
}

interface IProps {
	labels?: string[];
	downloading: boolean;
	onDownload?: Function;
	errors?: ImageError[];
	logs: {
		[index: string]: any;
	};
	accuracy: IDatum[];
}

const getData = (labels: string[] = []) => {
	const numOfLabels = labels.reduce(
		(obj: { [key: string]: number }, label) => ({
			...obj,
			[label]: (obj[label] || 0) + 1,
		}),
		{}
	);

	return Object.keys(numOfLabels).map((label) => ({
		label,
		data: numOfLabels[label] || 0,
	}));
};

const getErrors = (errors: ImageError[] = []) =>
	errors.map(({ file }, key) => (
		<p key={key} className={styles.error}>
			Error loading image: {`${file.path}/${file.file.name}`}
		</p>
	));

const Metrics: React.FC<IProps> = ({ labels, onDownload, downloading, accuracy, logs, errors }) => {
	return (
		<Accordion hidden>
			<Accordion.Item eventKey="0">
				<Accordion.Header>Model Information</Accordion.Header>
				<Accordion.Body>
					<div className={styles.container}>
						<InfoItem title="Model Data" data={getData(labels)} />
						<div className={styles.errors}>{errors && getErrors(errors)}</div>
						<InfoItem title="Accuracy" data={accuracy} />
						<div className={styles.footer}>
							<Logs logs={logs} />
							{onDownload && (
								<button disabled={downloading} onClick={() => onDownload()}>
									Download
								</button>
							)}
						</div>
					</div>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
};

export default Metrics;
