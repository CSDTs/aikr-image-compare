import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { SelectionProvider } from "./context/SelectionContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<SelectionProvider>
			<App />
		</SelectionProvider>
	</React.StrictMode>
);
