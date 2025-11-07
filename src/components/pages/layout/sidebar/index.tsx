import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import * as React from "react";

import Toolbar from "@mui/material/Toolbar";
import { Link } from "react-router-dom";
import CustomAppbar from "../appbar";
import PrimaryMenu from "./PrimaryMenu";

const drawerWidth = 356;

interface Props {
	/**
	 * Injected by the documentation to work in an iframe.
	 * Remove this when copying and pasting into your project.
	 */
	window?: () => Window;
	children: React.ReactNode;
}

export default function ResponsiveDrawer(props: Props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [isClosing, setIsClosing] = React.useState(false);

	const handleDrawerClose = () => {
		setIsClosing(true);
		setMobileOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsClosing(false);
	};

	const handleDrawerToggle = () => {
		if (!isClosing) {
			setMobileOpen(!mobileOpen);
		}
	};

	const drawer = (
		<div>
			<Toolbar
				sx={{
					padding: "32px 32px 56px",
					justifyContent: "center",
				}}>
				<Link to={"/"}>
					<img src="/logo.svg" alt="" width={137} height={73} />
				</Link>
			</Toolbar>
			<PrimaryMenu />
		</div>
	);

	// Remove this const when copying and pasting into your project.
	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: "flex" }}>
			<CustomAppbar handleDrawerToggle={handleDrawerToggle} />
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders">
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
					slotProps={{
						root: {
							keepMounted: true, // Better open performance on mobile.
						},
					}}>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", sm: "block" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							backgroundColor: (theme) => theme.palette.background.sidebar,
						},
					}}
					open>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: { sm: `calc(100% - ${drawerWidth}px)`, padding: "32px 24px" },
				}}>
				<Toolbar sx={{ height: 100 }} />
				{props.children}
			</Box>
		</Box>
	);
}
