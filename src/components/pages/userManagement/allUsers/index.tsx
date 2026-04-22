import { useEffect } from "react";
import { useMarkNewUsersSeenMutation } from "../../../../services/menuApi";
import AllUserTable from "./AllUserTable";

export default function AllUsers() {
    const [markSeen] = useMarkNewUsersSeenMutation();

    useEffect(() => { markSeen(); }, []);

    return <AllUserTable />;
}
