import * as React from "react";

import styles from "./App.module.scss";
import MLClassifierUI from "../MLClassifierUI";
import Search, { IImage } from "../Search";

import Modal from "../components/Modal";
import Navigation from "../components/Navigation";
import ImageSelect from "../components/ImageSelect";
import "bootstrap/dist/css/bootstrap.min.css";

const CORS_BYPASS = "https://fast-cove-30289.herokuapp.com/";

const qs: {
  SHOW_HELP?: string;
  SHOW_DOWNLOAD?: string;
} = (window.location.search.split("?").pop() || "")
  .split("&")
  .filter((p) => p)
  .map((p) => p.split("="))
  .reduce(
    (obj, [key, val]) => ({
      ...obj,
      [key]: val === "1" || val === "true" ? true : false,
    }),
    {}
  );

const SHOW_HELP = qs.SHOW_HELP !== undefined ? qs.SHOW_HELP : true;
const SHOW_DOWNLOAD = qs.SHOW_DOWNLOAD !== undefined ? qs.SHOW_DOWNLOAD : true;

const splitImagesFromLabels = async (images: IImage[]) => {
  const origData: {
    images: string[];
    labels: string[];
  } = {
    images: [],
    labels: [],
  };

  return images.reduce(
    (data, image: IImage) => ({
      images: data.images.concat(`${CORS_BYPASS}${image.src}`),
      // images: data.images.concat(`${image.src}`),
      labels: data.labels.concat(image.label),
    }),
    origData
  );
};

interface IState {
  training: boolean;
  evalImages?: IImage[];
}

class App extends React.Component {
  public state: IState = {
    training: false,
    evalImages: undefined,
  };

  private classifier: any;

  public getMLClassifier = (classifier: any) => {
    this.classifier = classifier;
  };

  public onBeginTraining = () => {
    this.setState({
      training: true,
    });
  };

  public train = async (trainImages: IImage[], evalImages?: IImage[]) => {
    this.onBeginTraining();
    const { images, labels } = await splitImagesFromLabels(trainImages);

    this.setState({
      evalImages,
    });

    await this.classifier.addData(images, labels, "train");
  };

  public onTrainComplete = async () => {
    if (this.state.evalImages && this.state.evalImages.length) {
      const { images, labels } = await splitImagesFromLabels(
        this.state.evalImages
      );

      for (let i = 0; i < images.length; i++) {
        const src = images[i];
        const label = labels[i];

        this.classifier.predict(src, label);

        // const prediction = await this.predictSingleImage(src, label);
        // callback({
        //   src,
        //   label,
        //   prediction,
        // });
      }

      // return await this.classifier.addData(images, labels, 'eval');
    }
  };

  public render() {
    const processedImages = "My Context Value";
    const currentUserValue = localStorage.getItem("currentUser");
    if (typeof currentUserValue === "string") {
      // const parse = JSON.parse(value); // ok
      console.log("currentUser: ", JSON.parse(currentUserValue));
    }
    return (
      <>
        <Navigation user={currentUserValue}></Navigation>

        <div className="container">
          <h2>AI App 1: Joe's Lunch</h2>
          <div className="row">
            <div className="col-md-4">
              <ImageSelect label="A" currentGroup="good"></ImageSelect>
              <ImageSelect label="B" currentGroup="bad"></ImageSelect>
            </div>

            <div className="col-md-4">
              <MLClassifierUI
                getMLClassifier={this.getMLClassifier}
                onAddDataStart={this.onBeginTraining}
                onTrainComplete={this.onTrainComplete}
                showDownload={!SHOW_DOWNLOAD}
              />
            </div>

            <div className="col-md-4">
              <p>
                Drag and drop some labeled images below to begin training your
                classifier.{" "}
              </p>
              <p>
                <em>
                  Organize your images into folders, where the folders' names
                  are the desired labels.
                </em>
              </p>
            </div>

            <Modal />
          </div>
        </div>

        <div className={styles.classifierContainer}>
          <div className={`row ${SHOW_HELP ? null : styles.center}`}>
            <div
              className={`${styles.app} ${
                SHOW_HELP ? null : styles.centeredApp
              }`}
            ></div>
            {SHOW_HELP && this.state.training === false && (
              <div className={styles.info}>
                <p>
                  Drag and drop some labeled images below to begin training your
                  classifier.{" "}
                </p>
                <p>
                  <em>
                    Organize your images into folders, where the folders' names
                    are the desired labels.
                  </em>
                </p>
                {/* <div className={styles.imgContainer}>
                <img src="https://github.com/thekevinscott/ml-classifier-ui/raw/master/example/public/example-600.gif" />
              </div> */}
              </div>
            )}
          </div>
          {/* {SHOW_HELP && this.state.training === false && (
          <React.Fragment>
            <hr />
            <div className={styles.info}>
              <p>
                Don't have any images handy? Search below for some images.
                Select up to 10 that match your query.
              </p>
              <p>
                <em>
                  <strong>Note</strong> This can be a little buggy at the moment
                  due to CORS issues. Working on making it better!
                </em>
              </p>
            </div>
            <Search train={this.train} />
          </React.Fragment>
        )} */}
        </div>
      </>
    );
  }
}

export default App;
