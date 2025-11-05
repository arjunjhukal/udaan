import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { useState } from "react";

export default function Password() {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <div className="input__field mb-6">
            <InputLabel>Password</InputLabel>
            <OutlinedInput
                fullWidth
                type={showPassword ? "text" : "password"}
                placeholder="Enter your Password"
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            sx={{
                                p: 0
                            }}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </div>
    );
}