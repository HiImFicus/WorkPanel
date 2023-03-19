import Add from "./content/Add";
import List from "./content/List";
import Overview from "./content/Overview";
import Setting from "./content/Setting";
import Gpu from "./Gpu";

const gpuRoute = {
	path: "gpu",
	element: <Gpu />,
	children: [
		{
			path: "",
			element: <Overview />,
		},
		{
			path: "setting",
			element: <Setting />,
		},
		{
			path: "add",
			element: <Add />,
		},
		{
			path: "list",
			element: <List />,
		},
	],
};

export default gpuRoute;
