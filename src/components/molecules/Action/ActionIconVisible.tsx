import { IconButton, useTheme } from "@mui/material";

export default function ActionIconVisible({ onDelete, onEdit }: { onDelete: () => void, onEdit: () => void }) {
    const theme = useTheme();
    return (
        <div className="action__group flex justify-end gap-3">
            <IconButton className="p-1.5 rounded-md!" sx={{
                border: `1px solid ${theme.palette.separator.darker}`,
                background: theme.palette.primary.contrastText,
                "&:hover": {
                    color: theme.palette.primary.contrastText,
                    background: theme.palette.primary.main
                },
            }} onClick={onEdit}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.84006 2.39982L3.36673 8.19315C3.16006 8.41315 2.96006 8.84649 2.92006 9.14649L2.6734 11.3065C2.58673 12.0865 3.14673 12.6198 3.92006 12.4865L6.06673 12.1198C6.36673 12.0665 6.78673 11.8465 6.9934 11.6198L12.4667 5.82649C13.4134 4.82649 13.8401 3.68649 12.3667 2.29315C10.9001 0.913152 9.78673 1.39982 8.84006 2.39982Z" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M7.92676 3.3667C8.21342 5.2067 9.70676 6.61337 11.5601 6.80003" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M2 14.6665H14" stroke="#9CA3B0" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </IconButton>
            <IconButton className="p-1.5 rounded-md!" sx={{
                border: `1px solid ${theme.palette.separator.darker}`,
                background: theme.palette.primary.contrastText,
                "&:hover": {
                    color: theme.palette.primary.contrastText,
                    background: theme.palette.error.main
                },
            }} onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 3.98665C11.78 3.76665 9.54667 3.65332 7.32 3.65332C6 3.65332 4.68 3.71999 3.36 3.85332L2 3.98665" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M5.66675 3.3135L5.81341 2.44016C5.92008 1.80683 6.00008 1.3335 7.12675 1.3335H8.87341C10.0001 1.3335 10.0867 1.8335 10.1867 2.44683L10.3334 3.3135" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.5667 6.09326L12.1334 12.8066C12.06 13.8533 12 14.6666 10.14 14.6666H5.86002C4.00002 14.6666 3.94002 13.8533 3.86668 12.8066L3.43335 6.09326" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.88672 11H9.10672" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M6.33325 8.3335H9.66659" stroke="#9CA3B0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </IconButton>
        </div>
    )
}
