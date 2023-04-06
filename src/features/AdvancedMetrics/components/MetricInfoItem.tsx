import { FC } from "react";
import styles from "../AdvancedMetrics.module.scss";

interface IMetricsInfoProps {
	title: string;
	data: IDatum[];
}

export interface IDatum {
	data: string | number;
	label: string;
}

/**
 * Dummy component metric info cards that appear in the main advanced metrics component. Showcases basic information
 * about the model like accuracy, images trained per group, etc.
 */
const MetricInfoItem: FC<IMetricsInfoProps> = ({ title, data }) => {
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

export default MetricInfoItem;
