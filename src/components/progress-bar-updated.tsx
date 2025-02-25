import { FC } from "react";

type Props = {
	current: number;
	handleClick?: () => void;
};

const ProgressBarUpdated: FC<Props> = ({ current, handleClick }) => {
	const steps = ["Select Images", "Train Model", "Evaluate Images"];

	return (
		<div style={{ width: "100%", padding: "20px 0" }} onClick={handleClick}>
			<div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
				{/* Progress line */}
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "0",
						right: "0",
						height: "2px",
						background: "#ddd",
						zIndex: 0,
					}}
				/>
				{/* Filled progress */}
				<div
					style={{
						position: "absolute",
						top: "50%",
						left: "0",
						width: `${(current / (steps.length - 1)) * 100}%`,
						height: "2px",
						background: "#0d6efd",
						transition: "width 0.3s ease",
						zIndex: 0,
					}}
				/>

				{steps.map((label, index) => (
					<div
						key={label}
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							zIndex: 1,
						}}>
						<div
							style={{
								width: "45px",
								height: "45px",
								borderRadius: "50%",
								background: current >= index ? "#0d6efd" : "#fff",
								border: "2px solid",
								borderColor: current >= index ? "#0d6efd" : "#ddd",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: "8px",
								color: current >= index ? "#fff" : "#666",
								transition: "all 0.3s ease",
							}}>
							{current > index ? "✓" : index + 1}
						</div>
						<div
							style={{
								fontSize: "14px",
								color: current >= index ? "#000" : "#666",
								fontWeight: current === index ? "bold" : "normal",
							}}>
							{label}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProgressBarUpdated;
