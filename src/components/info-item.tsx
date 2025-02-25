import { FC } from "react";
import styles from "~/styles/Metrics.module.css";
import { IDatum } from "~/types";

interface Props {
	title: string;
	data: IDatum[];
}

const InfoItem: FC<Props> = ({ title, data }) => {
	return (
		<>
			<h2 className={styles.header}>{title}</h2>
			<ul className={styles.data}>
				{data.map((datum: IDatum) => (
					<li className={styles.datum} key={datum.label}>
						<data>{datum.data}</data>
						<label>{datum.label}</label>
					</li>
				))}
			</ul>
		</>
	);
};

export default InfoItem;
