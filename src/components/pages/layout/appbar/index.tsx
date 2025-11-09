import ContrastIcon from "@mui/icons-material/Contrast";
import EmailIcon from "@mui/icons-material/Email";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
	AppBar,
	Box,
	IconButton,
	OutlinedInput,
	Stack,
	Toolbar,
} from "@mui/material";
import { setMode, ThemeMode } from "../../../../slice/themeSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
const drawerWidth = 356;

export default function CustomAppbar({
	handleDrawerToggle,
}: {
	handleDrawerToggle: () => void;
}) {
	const dispatch = useAppDispatch();
	const mode = useAppSelector((state) => state.theme.mode);
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
					<OutlinedInput />

					<Box>
						<IconButton>
							<NotificationsNoneIcon />
						</IconButton>
						<IconButton>
							<EmailIcon />
						</IconButton>
						<IconButton>
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
						</IconButton>
					</Box>
				</Stack>
			</Toolbar>
		</AppBar>
	);
}
