import type { ReactNode } from "react";
import { useGetControlsQuery } from "./services/controlsApi";
import ScreenProtection from "./ScreenProtection";

export default function ScreenProtectionGate({ children }: { children: ReactNode }) {
	const { data } = useGetControlsQuery();
	const enabled = data?.data?.screen_protection ?? false;

	if (enabled) {
		return <ScreenProtection>{children}</ScreenProtection>;
	}
	return <>{children}</>;
}
