import * as React from "react";
import styles from "./Predictions.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
export interface IPrediction {
  prediction: string;
  label: string;
  src: string;
}

interface IProps {
  prediction: IPrediction;
}

const Prediction: React.SFC<IProps> = ({
  prediction: { src, prediction, label },
}) => (
  <>
    <img src={src} />
    <ul className={styles.info}>
      <li>Prediction: {prediction}</li>
      <li className={styles.label}>Label: {label}</li>
    </ul>
  </>
);

export default Prediction;
