import Overview from './Overview';
import Setting from './Setting';
import Add from './Add';
import Root from './Root'

const router = {
    path: "gpu",
    element: <Root />,
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
    ],
}

export default router;
