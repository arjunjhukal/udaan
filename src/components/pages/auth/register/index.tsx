import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PATH } from "../../../../routes/PATH";
import AuthHeader from "../../../molecules/AuthHeader";
import RegisterForm from "../../../organism/RegisterForm";

export default function Register() {
    return (
        <>
            <AuthHeader
                title="Register Account"
                description="Register with your personal details to continue."
            />
            <RegisterForm />
            <div className="mt-14 text-center">
                <Typography variant="subtitle2" color="text.light">Already have an account? <Link to={PATH.AUTH.LOGIN.ROOT} className="inline-block"><Typography color="primary" variant="subtitle2">Login</Typography></Link></Typography>
            </div>
        </>
    )
}
