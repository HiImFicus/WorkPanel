import ErrorPage from "../../common/error/ErrorPage";
import Welcome from "./content/Welcome";
import Home from "./Home";

export const route = {
	path: "/",
	element: <Home />,
	errorElement: <ErrorPage />,
	children: [
		{
			path: "/",
			element: <Welcome />,
		},
	],
};
