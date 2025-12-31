import MenuIcon from "@mui/icons-material/Menu";
import {
	AppBar,
	Box,
	IconButton,
	Stack,
	Toolbar
} from "@mui/material";
import Profile from "./Profile";
import Setting from "./Setting";
const drawerWidth = 356;

export default function CustomAppbar({
	handleDrawerToggle,
}: {
	handleDrawerToggle: () => void;
}) {

	return (
		<AppBar
			position="fixed"
			sx={{
				width: { lg: `calc(100% - ${drawerWidth}px)` },
				ml: { lg: `${drawerWidth}px` },
				borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 0,
				padding: " 20px 24px",
				backgroundColor: (theme) => theme.palette.primary.contrastText,
			}}
			color="default"
			elevation={0}>
			<Toolbar className="px-0!">
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { lg: "none" }, minHeight: "44px" }}>
					<MenuIcon />
				</IconButton>
				<Stack
					sx={{
						flexDirection: "row",
						alignItems: "center",
						// justifyContent: "space-between",
						justifyContent: "end",
						width: "100%",
					}}>
					{/* <OutlinedInput
						placeholder="Search"
						name="search"
						id="search"
						startAdornment={<SearchIcon />}
						sx={{
							gap: "8px"
						}}
					/> */}

					<Box className="flex gap-4">
						{/* <IconButton sx={{
							background: theme.palette.separator.dark,
							minWidth: "44px",
						}}>
							<NotificationsIcon />
						</IconButton> */}
						{/* <IconButton sx={{
							background: theme.palette.separator.dark,
							minWidth: "44px",
						}}>
							<EmailIcon />
						</IconButton> */}
						{/* <IconButton sx={{
							background: theme.palette.separator.dark,
							minWidth: "44px",
						}}>
							<SettingsIcon />
						</IconButton>
						<IconButton
							onClick={() => {
								dispatch(
									setMode(
										mode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK,
									),
								);
							}}
							color="inherit">
							{mode !== "dark" ? <ContrastIcon /> : <WbSunnyIcon />}
						</IconButton> */}
						<Setting />
						<Profile />
					</Box>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}
