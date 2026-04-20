import { useParams } from "react-router-dom";
import DeviceResetDetailPage from "../../../DeviceResetManagement/DeviceResetDetailPage";

export default function DeviceRequestsTab() {
    const { id } = useParams<{ id: string }>();
    return <DeviceResetDetailPage userIdOverride={id} />;
}
