import { createBrowserRouter, RouteObject } from "react-router-dom";

import { route as homeRoute } from "./content/home/Route";
import gpuRoute from "./content/job/gpu/Route";

function setupRoute(): RouteObject {
	homeRoute.children.push(gpuRoute);
	return homeRoute;
}

function getNavLink() {
	// todo navlink from here.
}

const route = createBrowserRouter([setupRoute()]);

export default route;
