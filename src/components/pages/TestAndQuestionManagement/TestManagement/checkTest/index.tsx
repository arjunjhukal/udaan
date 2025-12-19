import { useParams } from "react-router-dom";

export default function CheckTestPaperRoot() {
	const { id } = useParams();
	return <div>CheckTestPaperRoot</div>;
}
