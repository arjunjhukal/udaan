import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useGetTestByIdQuery } from "../../../../services/questionApi";
import PageHeader from "../../../organism/PageHeader";
import TestEnrolledStudents from "./TestEnrolledStudents";

export default function TestEnrollmentPage() {
    const { id } = useParams();
    const { t } = useTranslation();
    const { data } = useGetTestByIdQuery({ id: Number(id) }, { skip: !id });

    return (
        <div className="h-full flex flex-col overflow-auto">
            <div className="page__top">
                <PageHeader
                    breadcrumb={[
                        {
                            title: t("menus.enrollment.root"),
                            icon: (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 4.84969V16.7397C22 17.7097 21.21 18.5997 20.24 18.7197L19.93 18.7597C18.29 18.9797 15.98 19.6597 14.12 20.4397C13.47 20.7097 12.75 20.2197 12.75 19.5097V5.59969C12.75 5.22969 12.96 4.88969 13.29 4.70969C15.12 3.71969 17.89 2.83969 19.77 2.67969H19.83C21.03 2.67969 22 3.64969 22 4.84969Z" fill="#1D82F5" />
                                    <path d="M10.7102 4.70969C8.88023 3.71969 6.11023 2.83969 4.23023 2.67969H4.16023C2.96023 2.67969 1.99023 3.64969 1.99023 4.84969V16.7397C1.99023 17.7097 2.78023 18.5997 3.75023 18.7197L4.06023 18.7597C5.70023 18.9797 8.01023 19.6597 9.87023 20.4397C10.5202 20.7097 11.2402 20.2197 11.2402 19.5097V5.59969C11.2402 5.21969 11.0402 4.88969 10.7102 4.70969Z" fill="#1D82F5" />
                                </svg>
                            ),
                        },
                        { title: data?.data?.name || "" },
                        { title: "Enrolled Students" },
                    ]}
                />
            </div>
            <TestEnrolledStudents id={Number(id)} />
        </div>
    );
}
