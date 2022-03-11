import * as React from "react";
import styles from "./Predictions.module.scss";
import Prediction, { IPrediction } from "./Prediction";
import { Carousel } from "react-bootstrap";
interface IProps {
  predictions: IPrediction[];
}

const Predictions: React.SFC<IProps> = ({ predictions }) => {
  return (
    <Carousel fade>
      {predictions.map((prediction: IPrediction, idx: number) => (
        <Carousel.Item>
          <Prediction prediction={prediction} key={idx} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Predictions;
