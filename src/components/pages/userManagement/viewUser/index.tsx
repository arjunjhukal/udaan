import { Divider, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useGetUserByIdQuery } from "../../../../services/userApi";
import UserEnrolledCourses from "./UserEnrolledCourses";
import UserTransactions from "./UserTransactions";

export default function ViewUserRoot() {
    const { id: id } = useParams();
    const { data: user } = useGetUserByIdQuery({ id: id || "" }, { skip: !id })
    return (
        <div className="view__user__root h-full overflow-auto">
            <Typography variant="h4" fontWeight={600} >{user?.data?.name || "User Detail"}</Typography>
            <Typography variant="subtitle1" color="text.middle" className="mb-2!">{user?.data?.email} | {user?.data?.phone}</Typography>
            <Divider className="mb-6!" />
            <UserEnrolledCourses />
            <div className="mt-4 lg:mt-6">
                <UserTransactions />
            </div>
        </div>
    )
}
