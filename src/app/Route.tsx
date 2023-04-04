import { createBrowserRouter } from "react-router-dom";

import ErrorPage from "./common/error/ErrorPage";
import Welcome from "./content/home/content/Welcome";
import Home from "./content/home/Home";
import Add from "./content/job/gpu/content/Add";
import List from "./content/job/gpu/content/List";
import Overview from "./content/job/gpu/content/Overview";
import SellList from "./content/job/gpu/content/SellList";
import Setting from "./content/job/gpu/content/Setting";
import Update from "./content/job/gpu/content/Update";
import Gpu from "./content/job/gpu/Gpu";

function getNavLink() {
	// todo navlink from here.
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: "",
				index: true,
				element: <Welcome />,
			},
			{
				path: "gpu",
				element: <Gpu />,
				children: [
					{ path: "", element: <Overview /> },
					{ path: "setting", element: <Setting /> },
					{ path: "add", element: <Add /> },
					{ path: "list", element: <List /> },
					{ path: "sell-prepare", element: <SellList /> },
					{ path: ":id", element: <Update /> },
				],
			},
		],
	},
]);

export default router;
