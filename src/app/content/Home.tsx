import { Outlet } from "react-router-dom";

import { Container, createStyles, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconGauge, IconHeartRateMonitor } from "@tabler/icons-react";

import HeaderSearch from "../common/layouts/HeaderSearch";
import NavbarNested from "../common/layouts/Navbar";

const useStyles = createStyles((theme) => ({
	content: {
		width: "100%",
	},
}));

//fake data def
const headerLinks: { link: string; label: string }[] = [
	{ link: "", label: "headerLink1" },
];

const navbarLinks = [
	{
		label: "Home",
		icon: IconGauge,
		initiallyOpened: true,
		links: [{ label: "Dashboard", link: "/" }],
	},
	{
		label: "GPU management",
		icon: IconHeartRateMonitor,
		initiallyOpened: false,
		links: [
			{ label: "Overview", link: "/gpu" },
			{ label: "List", link: "/gpu/list" },
			{ label: "Add", link: "/gpu/add" },
			{ label: "Setting", link: "/gpu/setting" },
		],
	},
];

const version = "v0.0.1";

function Home() {
	const [navIsShowing, navToggle] = useDisclosure(true);
	const { classes } = useStyles();

	return (
		<Container fluid>
			<Flex>
				{navIsShowing && (
					<NavbarNested linksData={navbarLinks} version={version} />
				)}
				<Flex direction="column" className={classes.content}>
					<HeaderSearch
						links={headerLinks}
						navbarState={navIsShowing}
						navbarToggle={() => {
							navToggle.toggle();
						}}
					/>
					<Outlet />
				</Flex>
			</Flex>
		</Container>
	);
}

export default Home;
