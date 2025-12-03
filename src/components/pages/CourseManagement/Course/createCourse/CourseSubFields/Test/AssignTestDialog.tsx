import { Box, Button, Checkbox, Dialog, DialogContent, Divider, IconButton, Skeleton, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAssignTestToCourseMutation } from "../../../../../../../services/courseApi";
import { useGetAllTestQuery } from "../../../../../../../services/questionApi";
import { showToast } from "../../../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../../../store/hook";
import type { TestProps } from "../../../../../../../types/question";
import TablePagination from "../../../../../../molecules/Table/Pagination";
import TestCard from "../../../../../../organism/Cards/TestCard";
import EmptyRoute from "../../../../../../organism/EmptyRoute";
import TableFilter from "../../../../../../organism/TableFilter";

interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
    selectedTestIds: number[];

}
export default function AssignTestDialog({ open, setOpen, selectedTestIds }: Props) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { id } = useParams();
    const [search, setSearch] = useState("");
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
    const [qp, setQp] = useState({
        pageIndex: 1,
        pageSize: 50,
    });

    const { data, isLoading } = useGetAllTestQuery({ ...qp, search, });
    const [assignTest, { isLoading: assigningTest }] = useAssignTestToCourseMutation();
    const items = data?.data?.data || [];

    const handleClose = () => {
        setOpen(false);
        setSelectedItems(new Set());
    };

    useEffect(() => {
        if (open && selectedTestIds?.length) {
            setSelectedItems(new Set(selectedTestIds));
        }
    }, [open, selectedTestIds]);

    const handleToggleItem = (id: number) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);

            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);

            return newSet;
        });
    };

    const handleTestAddition = async () => {
        try {
            const response = await assignTest({
                id: Number(id),
                body: Array.from(selectedItems)
            }).unwrap();
            dispatch(
                showToast({
                    message: response?.message || "Unable to assign test to course. Try again Later.",
                    severity: "success"
                })
            )
            handleClose();
        }
        catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Unable to assign test to course. Try again Later.",
                    severity: "error"
                })
            )
        }
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            sx={{
                "& .MuiPaper-root": {
                    minWidth: {
                        md: "664px",
                        xl: "1041px"
                    }
                }
            }}
        >
            <DialogContent
                className="p-6!  rounded-2xl"
                sx={{
                    boxShadow: "0 4px 20px 0 rgba(0, 8, 251, 0.20)",
                    background: theme.palette.primary.contrastText
                }}
            >
                <div className="flex justify-between items-center pb-1">
                    <Typography variant="h5" className="text.dark">
                        Add Test
                    </Typography>
                    <IconButton onClick={handleClose}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.492 1.66675H6.50866C3.47533 1.66675 1.66699 3.47508 1.66699 6.50841V13.4834C1.66699 16.5251 3.47533 18.3334 6.50866 18.3334H13.4837C16.517 18.3334 18.3253 16.5251 18.3253 13.4917V6.50841C18.3337 3.47508 16.5253 1.66675 13.492 1.66675ZM12.8003 11.9167C13.042 12.1584 13.042 12.5584 12.8003 12.8001C12.6753 12.9251 12.517 12.9834 12.3587 12.9834C12.2003 12.9834 12.042 12.9251 11.917 12.8001L10.0003 10.8834L8.08366 12.8001C7.95866 12.9251 7.80033 12.9834 7.64199 12.9834C7.48366 12.9834 7.32533 12.9251 7.20033 12.8001C6.95866 12.5584 6.95866 12.1584 7.20033 11.9167L9.11699 10.0001L7.20033 8.08341C6.95866 7.84175 6.95866 7.44175 7.20033 7.20008C7.44199 6.95842 7.84199 6.95842 8.08366 7.20008L10.0003 9.11675L11.917 7.20008C12.1587 6.95842 12.5587 6.95842 12.8003 7.20008C13.042 7.44175 13.042 7.84175 12.8003 8.08341L10.8837 10.0001L12.8003 11.9167Z" fill="#E21D48" />
                        </svg>
                    </IconButton>
                </div>
                <Divider className="mb-6!" />
                <Box
                    className="media__wrapper rounded-2xl"
                // sx={{
                //     border: `1px solid ${theme.palette.textField.border}`
                // }}
                >
                    <TableFilter
                        search={search}
                        setSearch={setSearch}
                        selectedRows={selectedItems}
                        handleRoleDelete={() => { }}
                        categoryLayout={true}
                    />
                    {!isLoading && !items.length &&
                        <EmptyRoute title={`Test Not Found`} message="" />
                    }
                    <div className="flex flex-col gap-4 md:grid lg:grid-cols-2 2xl:gap-9">
                        {isLoading ? (
                            [...Array(6)].map((_, idx) => (
                                <div key={idx} className="col-span-1">
                                    <div className="flex gap-3 items-center">
                                        <Checkbox color="primary" disabled />
                                        <Box className="w-full">
                                            <Skeleton variant="rectangular" height={120} className="rounded-xl" />
                                        </Box>
                                    </div>
                                </div>
                            ))
                        ) : (
                            items.map((item: TestProps) => (
                                <div className="col-span-1" key={item.id}>
                                    <div className="flex gap-3 items-center">
                                        <Checkbox
                                            color="primary"
                                            checked={selectedItems.has(Number(item.id))}
                                            onChange={() => handleToggleItem(Number(item.id))}
                                        />
                                        <div onClick={() => handleToggleItem(Number(item.id))} className="cursor-pointer flex-1">
                                            <TestCard test={item} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <TablePagination qp={qp} setQp={setQp} totalPages={data?.data?.pagination?.total_pages || 0} />
                    <Box
                        className="footer__action flex justify-end items-center gap-2 pt-6 mt-8 sticky -bottom-5"
                        sx={{
                            borderTop: `1px solid ${theme.palette.seperator.dark}`,
                            background: theme.palette.primary.contrastText,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleClose}
                            sx={{
                                background: theme.palette.seperator.dark,
                                color: theme.palette.text.middle
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleTestAddition}
                            disabled={selectedItems.size === 0}
                        >
                            {assigningTest ? "Assigning" : "Assign"} Test {selectedItems.size > 0 && `(${selectedItems.size})`}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    )
}
