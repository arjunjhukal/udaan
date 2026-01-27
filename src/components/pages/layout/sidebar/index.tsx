import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import * as React from "react";

import { useTheme } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import { Link, useLocation } from "react-router-dom";
import CustomAppbar from "../appbar";
import PrimaryMenu from "./PrimaryMenu";

const drawerWidth = 356;

interface Props {
	window?: () => Window;
	children: React.ReactNode;
}

export default function ResponsiveDrawer(props: Props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [isClosing, setIsClosing] = React.useState(false);
	const location = useLocation();
	const pathname = location.pathname;
	const theme = useTheme();

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

	React.useEffect(() => {
		if (mobileOpen) {
			handleDrawerClose();
		}
	}, [pathname]);

	const drawer = (
		<div>
			<Toolbar
				sx={{
					padding: {
						xs: "32px 32px 16px",
						"2xl": "32px 32px 56px"
					},
					justifyContent: "center",
				}}>
				<Link to={"/"}>
					<img src="/logo.svg" alt="" width={137} height={73} className="max-w-120 mx-auto" />
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
				sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}
				aria-label="mailbox folders">
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onTransitionEnd={handleDrawerTransitionEnd}
					onClose={handleDrawerClose}
					sx={{
						display: { xs: "block", lg: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
							backgroundColor: (theme) => theme.palette.background.sidebar,
						},
					}}
					slotProps={{
						root: {
							keepMounted: true,
						},
					}}>
					{drawer}
				</Drawer>
				<Drawer
					variant="permanent"
					sx={{
						display: { xs: "none", lg: "block" },
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
					width: { lg: `calc(100% - ${drawerWidth}px)`, padding: "32px 16px 16px" },
					overflowX: "hidden"
				}}>
				<Toolbar sx={{ height: 70 }} />
				<Box className="content p-4 lg:p-6 rounded-2xl overflow-y-auto flex flex-col" sx={{
					background: theme.palette.primary.contrastText,
					height: "calc(100vh - 125px)"

				}}>
					{props.children}
				</Box>
			</Box>
		</Box>
	);
}
