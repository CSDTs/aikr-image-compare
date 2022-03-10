import * as React from "react";
import classNames from "../utils/classNames";
import transformFiles from "./transformFiles";
import styles from "./Dropzone.module.scss";

interface IProps {
  onDrop?: Function;
  onParseFiles: Function;
  onParseObject: Function;
  style?: any;
  children?: any;
}

interface IState {
  over: boolean;
}

class Dropzone extends React.Component<IProps, IState> {
  private timeout: number;
  constructor(props: IProps) {
    super(props);

    this.state = {
      over: false,
    };
  }

  public handleDrop = async (e: React.DragEvent) => {
    if (this.props.onDrop) {
      this.props.onDrop();
    }
    e.preventDefault();
    e.persist();

    // console.log('pre transforming files');
    const folders = await transformFiles(e);
    // console.log('post transforming files');
    if (e.dataTransfer.items) {
      e.dataTransfer.items.clear();
    } else {
      e.dataTransfer.clearData();
    }
    this.props.onParseFiles(folders);
  };

  public handleDrag = (over: boolean) => {
    return (e: React.DragEvent) => {
      e.preventDefault();
      this.setState({
        over,
      });
    };
  };

  public handleOnClick = () => {
    const groupA = document.querySelectorAll("textarea")[0];
    const groupB = document.querySelectorAll("textarea")[1];
    const groupAValues = JSON.parse(groupA.value);
    const groupBValues = JSON.parse(groupB.value);

    let dataURLtoFile = (dataurl: any, filename: any) => {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    };

    const getBase64FromUrl = async (url: string) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
      });
    };

    const getAllUrls = async () => {
      let arr = new Array<object>();

      for (let img of groupAValues) {
        await getBase64FromUrl(img.src).then((data) => {
          arr.push({
            src: data,
            file: dataURLtoFile(data, "test.png"),
            label: "groupA",
          });
        });
      }

      for (let img of groupBValues) {
        await getBase64FromUrl(img.src).then((data) => {
          arr.push({
            src: data,
            file: dataURLtoFile(data, "test.png"),
            label: "groupB",
          });
        });
      }

      return arr;
    };

    getAllUrls()
      .then((urls) => {
        let convertedImagesNeh = urls.map((val: any) => {
          return {
            label: val.label,
            src: val.src,
            file: val.file,
          };
        });
        return convertedImagesNeh;
      })
      .then((arr) => {
        // console.log(arr);
        this.props.onParseObject(arr);
      });
  };
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  public stop = (e: any) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.state.over === false) {
      this.setState({
        over: true,
      });
    }
    this.timeout = window.setTimeout(() => {
      this.setState({
        over: false,
      });
    }, 50);
    e.preventDefault();
  };

  public render() {
    const className = classNames(styles.container, {
      [styles.over]: this.state.over,
    });
    return (
      <>
        <div
          className={className}
          draggable={true}
          // onDragStart={this.handleDrag(true)}
          // onDragEnd={this.handleDrag(false)}
          onDrop={this.handleDrop}
          onClick={this.handleOnClick}
          onDragOver={this.stop}
          style={this.props.style}
        >
          {this.props.children || <span>Drop Images To Begin Training</span>}
          <input
            className={styles.input}
            type="file"
            name="files[]"
            data-multiple-caption="{count} files selected"
            multiple={true}
          />
        </div>
        <button onClick={this.handleOnClick}>Train Model</button>
      </>
    );
  }
}

export default Dropzone;
