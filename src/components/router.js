import {
    createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "../common/error/ErrorPage";
import Welcome from './features/Welcome';
import App from "./App";
import GPURooter from "./features/GPU/router";

const rootRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Welcome />
            },
            GPURooter
        ],
    },
]);

export default rootRouter;
