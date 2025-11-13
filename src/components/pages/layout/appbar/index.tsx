import EmailIcon from "@mui/icons-material/Email";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
	AppBar,
	Box,
	IconButton,
	OutlinedInput,
	Stack,
	Toolbar,
	useTheme
} from "@mui/material";
import SearchIcon from "../../../../icons/SearchIcon";
import Profile from "./Profile";
import Setting from "./Setting";
const drawerWidth = 356;

export default function CustomAppbar({
	handleDrawerToggle,
}: {
	handleDrawerToggle: () => void;
}) {
	const theme = useTheme();

	return (
		<AppBar
			position="fixed"
			sx={{
				width: { sm: `calc(100% - ${drawerWidth}px)` },
				ml: { sm: `${drawerWidth}px` },
				borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
				borderRadius: 0,
				padding: " 20px 24px",
				backgroundColor: (theme) => theme.palette.primary.contrastText,
			}}
			color="default"
			elevation={0}>
			<Toolbar sx={{ px: 3 }}>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { sm: "none" }, minHeight: "44px" }}>
					<MenuIcon />
				</IconButton>
				<Stack
					sx={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						width: "100%",
					}}>
					<OutlinedInput
						placeholder="Search"
						name="search"
						id="search"
						startAdornment={<SearchIcon />}
						sx={{
							gap: "8px"
						}}
					/>

					<Box className="flex gap-4">
						<IconButton sx={{
							background: theme.palette.seperator.dark,
							minWidth: "44px",
						}}>
							<NotificationsNoneIcon />
						</IconButton>
						<IconButton sx={{
							background: theme.palette.seperator.dark,
							minWidth: "44px",
						}}>
							<EmailIcon />
						</IconButton>
						{/* <IconButton sx={{
							background: theme.palette.seperator.dark,
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
