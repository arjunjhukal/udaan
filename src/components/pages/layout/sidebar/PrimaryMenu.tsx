import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
	Box,
	Collapse,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";

export default function PrimaryMenu() {
	const { t } = useTranslation();
	const location = useLocation();
	const navigate = useNavigate();
	const [content, setContent] = React.useState<boolean>(false);

	const isActive = (path: string) => location.pathname === path;
	const isChildActive = (basePath: string) =>
		location.pathname.startsWith(basePath);

	// Auto-expand category management if any child is active
	React.useEffect(() => {
		if (location.pathname.includes("/category")) {
			setContent(true);
		}
	}, [location.pathname]);

	return (
		<Box sx={{ padding: "0 32px 32px" }}>
			{/* <Typography variant='body2' mb={1}>{t("messages.overview")}</Typography> */}
			<List>
				<ListItem disablePadding>
					<ListItemButton
						onClick={() => navigate(PATH.DASHBOARD.ROOT)}
						className={isActive(PATH.DASHBOARD.ROOT) ? "active" : ""}>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary={t("menus.dashboard")} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton
						onClick={() => navigate(PATH.ROLES.ROOT)}
						className={isChildActive(PATH.ROLES.ROOT) ? "active" : ""}>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary={t("menus.role.root")} />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton
						onClick={() => setContent((prev) => !prev)}
						className={isChildActive("/category") ? "active" : ""}>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary={t("menus.category_management.root")} />
						{content ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>

					<Collapse in={content} timeout="auto" unmountOnExit>
						<List component="div" disablePadding sx={{ pl: 3 }}>
							<ListItem disablePadding>
								<ListItemButton
									onClick={() => navigate("/category/mega")}
									className={isActive("/category/mega") ? "active-nested" : ""}>
									<ListItemIcon>
										<CategoryIcon />
									</ListItemIcon>
									<ListItemText
										primary={t("menus.category_management.mega_category.root")}
									/>
								</ListItemButton>
							</ListItem>
							<ListItem disablePadding>
								<ListItemButton
									onClick={() => navigate("/category/main")}
									className={isActive("/category/main") ? "active-nested" : ""}>
									<ListItemIcon>
										<DashboardIcon />
									</ListItemIcon>
									<ListItemText
										primary={t("menus.category_management.category.root")}
									/>
								</ListItemButton>
							</ListItem>

							<ListItem disablePadding>
								<ListItemButton
									onClick={() => navigate("/category/sub")}
									className={isActive("/category/sub") ? "active-nested" : ""}>
									<ListItemIcon>
										<DashboardIcon />
									</ListItemIcon>
									<ListItemText
										primary={t("menus.category_management.sub_category.root")}
									/>
								</ListItemButton>
							</ListItem>

							<ListItem disablePadding>
								<ListItemButton
									onClick={() => navigate("/category/position")}
									className={
										isActive("/category/position") ? "active-nested" : ""
									}>
									<ListItemIcon>
										<DashboardIcon />
									</ListItemIcon>
									<ListItemText
										primary={t("menus.category_management.position.root")}
									/>
								</ListItemButton>
							</ListItem>
						</List>
					</Collapse>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton
						onClick={() => navigate("/content")}
						className={isActive("/content") ? "active" : ""}>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary={t("menus.content.root")} />
					</ListItemButton>
				</ListItem>

				<ListItem disablePadding>
					<ListItemButton
						onClick={() => navigate("/teachers")}
						className={isActive("/teachers") ? "active" : ""}>
						<ListItemIcon>
							<DashboardIcon color="primary" />
						</ListItemIcon>
						<ListItemText
							primary={t("menus.teachers.root")}
							className="menu__item"
						/>
					</ListItemButton>
				</ListItem>
			</List>

			{/* <Typography variant='body2' my={1}>{t("messages.master_data")}</Typography> */}
		</Box>
	);
}
