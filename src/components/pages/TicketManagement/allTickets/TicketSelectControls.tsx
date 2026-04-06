import { Box, Divider, MenuItem, Select, Stack, Typography } from "@mui/material";
import { ArrowDown2, Clock, InfoCircle, TickCircle } from "iconsax-reactjs";
import React from "react";
import type { TicketPriority, TicketStatus } from "../../../../types/ticket";
import { TICKET_PRIORITY_OPTIONS, TICKET_STATUS_OPTIONS } from "../../../../types/ticket";

export const statusColor: Record<TicketStatus, string> = {
	open: "#3B82F6",
	assigned: "#8B5CF6",
	waiting_for_reply: "#F59E0B",
	resolved: "#10B981",
};

export const statusIcon: Record<TicketStatus, React.ElementType> = {
	open: InfoCircle,
	assigned: TickCircle,
	waiting_for_reply: Clock,
	resolved: TickCircle,
};

export const priorityDot: Record<TicketPriority, { dot: string; text: string }> = {
	low: { dot: "#6B7280", text: "#6B7280" },
	medium: { dot: "#F59E0B", text: "#92400E" },
	high: { dot: "#F97316", text: "#7C2D12" },
	urgent: { dot: "#EF4444", text: "#7F1D1D" },
};

interface TicketSelectControlsProps {
	status: TicketStatus;
	priority: TicketPriority;
	onStatusChange: (status: TicketStatus) => void;
	onPriorityChange: (priority: string) => void;
	iconSize?: number;
	fontSize?: number;
	fontWeight?: number;
	stopPropagation?: boolean;
	/** Render a vertical Divider between the two selects (for card list use) */
	innerDivider?: boolean;
}

export default function TicketSelectControls({
	status,
	priority,
	onStatusChange,
	onPriorityChange,
	iconSize = 16,
	fontSize = 13,
	fontWeight = 500,
	stopPropagation = false,
	innerDivider = false,
}: TicketSelectControlsProps) {
	const StatusIcon = statusIcon[status];
	const pCfg = priorityDot[priority] ?? priorityDot.medium;
	const dotSize = iconSize - 6;

	const maybeStop = (e: React.SyntheticEvent) => {
		if (stopPropagation) e.stopPropagation();
	};

	return (
		<>
			<Select
				variant="standard"
				disableUnderline
				value={status}
				onChange={(e:any) => {
					maybeStop(e);
					onStatusChange(e.target.value as TicketStatus);
				}}
				onClick={maybeStop}
				IconComponent={({ className }) => (
					<Box component="span" className={className} sx={{ display: "flex", alignItems: "center", right: 0 }}>
						<ArrowDown2 size={iconSize} color={statusColor[status]} />
					</Box>
				)}
				renderValue={() => (
					<Stack direction="row" alignItems="center" spacing={0.5}>
						<StatusIcon size={iconSize} color={statusColor[status]} variant="Bold" />
						<Typography sx={{ fontSize, color: statusColor[status], fontWeight, textTransform: "capitalize" }}>
							{TICKET_STATUS_OPTIONS.find((o) => o.value === status)?.label ?? status}
						</Typography>
					</Stack>
				)}
				sx={{
					"& .MuiSelect-select": { py: 0, pl: 0, pr: "28px !important" },
					"&:before, &:after": { display: "none" },
				}}
			>
				{TICKET_STATUS_OPTIONS.map((opt) => (
					<MenuItem key={opt.value} value={opt.value} sx={{ fontSize }}>
						<Stack direction="row" alignItems="center" gap={1}>
							<Box sx={{ width: dotSize, height: dotSize, borderRadius: "2px", bgcolor: statusColor[opt.value] }} />
							{opt.label}
						</Stack>
					</MenuItem>
				))}
			</Select>

			{innerDivider && (
				<Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
			)}

			<Select
				variant="standard"
				disableUnderline
				value={priority}
				onChange={(e:any) => {
					maybeStop(e);
					onPriorityChange(e.target.value);
				}}
				onClick={maybeStop}
				IconComponent={({ className }) => (
					<Box component="span" className={className} sx={{ display: "flex", alignItems: "center", right: 0 }}>
						<ArrowDown2 size={iconSize} color={pCfg.dot} />
					</Box>
				)}
				renderValue={() => (
					<Stack direction="row" alignItems="center" gap={0.5}>
						<Box sx={{ width: dotSize, height: dotSize, borderRadius: "2px", bgcolor: pCfg.dot, flexShrink: 0 }} />
						<Typography sx={{ fontSize, color: pCfg.text, fontWeight, textTransform: "capitalize" }}>
							{priority}
						</Typography>
					</Stack>
				)}
				sx={{
					"& .MuiSelect-select": { py: 0, pl: 0, pr: "28px !important" },
					"&:before, &:after": { display: "none" },
				}}
			>
				{TICKET_PRIORITY_OPTIONS.map((opt) => (
					<MenuItem key={opt.value} value={opt.value} sx={{ fontSize }}>
						<Stack direction="row" alignItems="center" gap={1}>
							<Box sx={{ width: dotSize, height: dotSize, borderRadius: "2px", bgcolor: priorityDot[opt.value as TicketPriority]?.dot ?? "#6B7280" }} />
							{opt.label}
						</Stack>
					</MenuItem>
				))}
			</Select>
		</>
	);
}
