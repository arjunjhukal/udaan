import { Button, InputLabel, OutlinedInput } from "@mui/material";
import Password from "../../atoms/Password";

export default function LoginForm() {
    return (
        <div className="login__form">
            <div className="input__field mb-6">
                <InputLabel>Email Address/ Phone Number</InputLabel>
                <OutlinedInput
                    fullWidth
                    placeholder="Enter your email address or Phone Number"
                />
            </div>
            <Password />

            <Button variant="contained" color="primary" fullWidth>Sign In</Button>
        </div>
    )
}
