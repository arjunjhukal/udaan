import { Button, InputLabel, OutlinedInput } from "@mui/material";

export default function RegisterForm() {
    return (
        <form action="">
            <div className="input__field mb-6">
                <InputLabel>Full Name</InputLabel>
                <OutlinedInput
                    fullWidth
                    placeholder="Enter your full name"
                />
            </div>
            <div className="input__field mb-6">
                <InputLabel>Email Address</InputLabel>
                <OutlinedInput
                    fullWidth
                    placeholder="Enter your email address"
                />
            </div>
            <div className="input__field mb-6">
                <InputLabel>Phone No.</InputLabel>
                <OutlinedInput
                    fullWidth
                    placeholder="Enter your phone no."
                />
            </div>

            <Button variant="contained" color="primary" fullWidth>Register</Button>
        </form>
    )
}
