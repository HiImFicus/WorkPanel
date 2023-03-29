import { useMemo } from "react";
import { Outlet } from "react-router-dom";

import { DatabaseServie } from "./database/DatabaseService";
import { dataServiceContext } from "./database/DataserviceContext";

export default function Gpu() {
	const databaseService = useMemo(() => new DatabaseServie(), []);

	return (
		<dataServiceContext.Provider value={databaseService}>
			<Outlet />
		</dataServiceContext.Provider>
	);
}
