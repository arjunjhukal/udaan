import { Divider, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "../../../../services/userApi";
import UserEnrolledCourses from "./UserEnrolledCourses";
import UserTransactions from "./UserTransactions";

export default function ViewUserRoot() {
    const { id: id } = useParams();
    const { data: user } = useGetUserByIdQuery({ id: id || "" }, { skip: !id })
    return (
        <>
            <Typography variant="h4" fontWeight={600} className="mb-2!">{user?.data?.name || "User Detail"}</Typography>
            <Divider className="mb-6!" />
            <UserEnrolledCourses />
            <div className="mt-4 lg:mt-6">
                <UserTransactions />
            </div>
        </>
    )
}
