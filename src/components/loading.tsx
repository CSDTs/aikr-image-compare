import { FC } from "react";

const SIZE = 32;

interface LoadingProps {
	size?: number;
}

const Loading: FC<LoadingProps> = ({ size = SIZE }) => {
	return (
		<img
			src={"/loading.gif"}
			alt="Loading..."
			style={{
				width: size,
				height: size,
			}}
		/>
	);
};

export default Loading;
