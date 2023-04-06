import { FC } from "react";
import loading from "../../assets/loading.gif";

interface IProps {
	size?: number;
}

const LoadingIcon: FC<IProps> = ({ size = 32 }) => <img src={loading} alt="Loading..." width={size} height={size} />;

export default LoadingIcon;
