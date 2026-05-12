import type { ReactNode } from "react";
import { useMediaQuery } from "@mui/material";
import { useGetControlsQuery } from "./services/controlsApi";
import ScreenProtection from "./ScreenProtection";

export default function ScreenProtectionGate({ children }: { children: ReactNode }) {
	const { data } = useGetControlsQuery();
	const enabled = data?.data?.screen_protection ?? false;
	// Disable on mobile/tablet — virtual keyboards shrink innerHeight and false-trigger the DevTools size heuristic.
	const isMobile = useMediaQuery("(max-width:1200px)");

	if (enabled && !isMobile) {
		return <ScreenProtection>{children}</ScreenProtection>;
	}
	return <>{children}</>;
}
