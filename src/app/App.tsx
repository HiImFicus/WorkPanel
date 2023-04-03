import { useState } from "react";
import { RouterProvider } from "react-router-dom";

import {
	ColorScheme,
	ColorSchemeProvider,
	MantineProvider,
} from "@mantine/core";

import router from "./Route";

export default function App() {
	const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{ colorScheme }}
			>
				<RouterProvider router={router} />
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
