export default function EbookIcon({ variant = "outlined" }: { variant?: "outlined" | "filled" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            {variant === "outlined" && (
                <path
                    d="M21 17.6667V2.66667C21 1.7462 20.2538 1 19.3333 1H6.66667C4.08934 1 2 3.08934 2 5.66667V18.3333C2 20.9107 4.08934 23 6.66667 23H19.3333C20.2538 23 21 22.2538 21 21.3333V17.6667Z"
                    fill="#1D82F5"
                />
            )}
            <path
                d="M21 17.6667V2.66667C21 1.7462 20.2538 1 19.3333 1H6.66667C4.08934 1 2 3.08934 2 5.66667V18.3333C2 20.9107 4.08934 23 6.66667 23H19.3333C20.2538 23 21 22.2538 21 21.3333V20.6667M21 17.6667H6.66667C5.19391 17.6667 4 18.8606 4 20.3333C4 21.8061 5.19391 23 6.66667 23M21 17.6667V20.6667M7.5 6H15.5"
                stroke={variant === "outlined" ? "#FFFFFF" : "#1D82F5"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
