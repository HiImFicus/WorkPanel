import Overview from './Overview';
import Setting from './Setting';
import Add from './Add';
import List from './List';

const router = {
    path: "gpu",
    // element: <Root />,
    children: [
        {
            path: "",
            element: <Overview />
        },
        {
            path: "setting",
            element: <Setting />
        },
        {
            path: "add",
            element: <Add />
        },
        {
            path: "list",
            element: <List />
        },
    ],
}

export default router;
