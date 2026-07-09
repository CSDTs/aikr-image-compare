import { FC } from "react";
import loadingGif from "~/assets/images/loading.gif";

const SIZE = 32;

interface LoadingProps {
	size?: number;
}

const Loading: FC<LoadingProps> = ({ size = SIZE }) => {
	return (
		<img
			src={loadingGif}
			alt="Loading..."
			style={{
				width: size,
				height: size,
			}}
		/>
	);
};

export default Loading;
