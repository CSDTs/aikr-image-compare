import * as React from "react";
import Dropzone from "../../Dropzone";
import { IFileData, getFilesAsImageArray } from "../../utils/getFilesAsImages";
import Predictions from "./Predictions";
import { IPrediction } from "./Predictions/Prediction";

interface IProps {
  predict: Function;
  predictions: IPrediction[];
}

interface IState {
  imagesParsed: number;
  totalFiles: number;
}

class Evaluator extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      imagesParsed: 0,
      totalFiles: 0,
    };
  }

  private onParseFiles = async (files: FileList) => {
    const imageFiles: IFileData[] = await getFilesAsImageArray(files);
    this.props.predict(imageFiles);
  };

  private onParseObject = async (files: any) => {
    // const imageFiles: IFileData[] = await getFilesAsImageArray(files);
    this.props.predict(files);
  };

  render() {
    return (
      <React.Fragment>
        <Dropzone
          onParseFiles={this.onParseFiles}
          onParseObject={this.onParseObject}
          mode="Evaluate Images"
          style={{
            borderRadius: "0 0 5px 5px",
            marginTop: "-2px",
            height: "300px",
          }}
        >
          Drop Images to test
        </Dropzone>
        <Predictions predictions={this.props.predictions} />
      </React.Fragment>
    );
  }
}

export default Evaluator;
