import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "./common/error/ErrorPage";
import Home from "./content/Home";
import GPURoute from "./content/job/GPU/Route";
import Welcome from "./content/Welcome";

// todo navlink from here.
const route = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "/",
				element: <Welcome />,
			},
			GPURoute,
		],
	},
]);

export default route;
