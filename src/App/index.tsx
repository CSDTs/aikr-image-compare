import * as React from "react";
import styles from "./App.module.scss";
import MLClassifierUI from "../MLClassifierUI";
import Search, { IImage } from "../Search";

import { useReadLocalStorage } from "usehooks-ts";

import NSF from "./nsf.gif";
import logo from "./logo.svg";

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
    return (
      <React.Fragment>
        <nav>
          <div>
            <div className={styles.brand}>
              <a href="http://www.nsf.gov">
                <img src={NSF} width="40" height="40" alt="" />
              </a>
              <a href="/">
                <img src={logo} width="100" height="40" alt="" />
              </a>
            </div>
            <button
              className={styles.toggler}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span></span>
            </button>
            <div className={styles.nav_collapse} id="navbarNav">
              <ul className={styles.nav_list}>
                <li className={styles.nav_list__item}>
                  <a className={styles.nav_link} href="/projects">
                    Projects
                  </a>
                </li>
                <li className={styles.nav_list__item}>
                  <a className={styles.nav_link} href="/news">
                    News
                  </a>
                </li>
                <li className={styles.nav_list__item}>
                  <a className={styles.nav_link} href="/publications">
                    Publications
                  </a>
                </li>
                <li className={styles.nav_list__item}>
                  <a className={styles.nav_link} href="/about">
                    About
                  </a>
                </li>
              </ul>
              {/* <ul className={styles.nav_list}>
                <li className={styles.nav_list__dropdown}>
                  <a
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul aria-labelledby="navbarDropdown">
                    <li>
                      <a href="#">Action</a>
                    </li>
                    <li>
                      <a href="#">Another action</a>
                    </li>
                    <li>
                      <hr />
                    </li>
                    <li>
                      <a href="#">Something else here</a>
                    </li>
                  </ul>
                </li>
              </ul> */}
            </div>
          </div>
        </nav>
        <div
          className={`${styles.classifierContainer} ${
            SHOW_HELP ? null : styles.center
          }`}
        >
          <div
            className={`${styles.app} ${SHOW_HELP ? null : styles.centeredApp}`}
          >
            <MLClassifierUI
              getMLClassifier={this.getMLClassifier}
              onAddDataStart={this.onBeginTraining}
              onTrainComplete={this.onTrainComplete}
              showDownload={!SHOW_DOWNLOAD}
            />
          </div>
          {SHOW_HELP && this.state.training === false && (
            <div className={styles.info}>
              <h2>Instructions</h2>
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
              <div className={styles.imgContainer}>
                <img src="https://github.com/thekevinscott/ml-classifier-ui/raw/master/example/public/example-600.gif" />
              </div>
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
      </React.Fragment>
    );
  }
}

export default App;
