import Add from "./Add";
import List from "./List";
import Overview from "./Overview";
import Setting from "./Setting";

const GPURoute = {
	path: "gpu",
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

export default GPURoute;
