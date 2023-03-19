import { Outlet } from "react-router-dom";

export default function Motherborard() {
	// const databaseService = useMemo(() => new DatabaseServie(), []);

	return (
		<>
			<h1>Mother Board</h1>
			<Outlet />
		</>
	);
}
