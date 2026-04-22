import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Switch,
    Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Add } from "iconsax-reactjs";
import { useState } from "react";
import {
    useCreateZoomAccountMutation,
    useDeleteZoomAccountMutation,
    useGetZoomAccountsQuery,
    useToggleZoomAccountMutation,
    useUpdateZoomAccountMutation,
} from "../../../../../services/settingApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import type { ZoomAccount } from "../../../../../types/setting";
import ActionIconVisible from "../../../../molecules/Action/ActionIconVisible";
import Password from "../../../../atoms/Password";

function SecretField({ name, value, onChange, placeholder }: { name: string; value: string; onChange: any; placeholder: string }) {
    const [show, setShow] = useState(false);
    return (
        <OutlinedInput
            fullWidth
            name={name}
            type={show ? "text" : "password"}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton onClick={() => setShow((v) => !v)} edge="end">
                        {show ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            }
        />
    );
}

function ZoomAccountDialog({ open, account, onClose }: { open: boolean; account: ZoomAccount | null; onClose: () => void }) {
    const dispatch = useAppDispatch();
    const [createAccount, { isLoading: creating }] = useCreateZoomAccountMutation();
    const [updateAccount, { isLoading: updating }] = useUpdateZoomAccountMutation();

    const isEdit = !!account;
    const isLoading = creating || updating;

    const formik = useFormik({
        initialValues: {
            name: account?.name ?? "",
            email: account?.email ?? "",
            account_id: account?.account_id ?? "",
            client_id: account?.client_id ?? "",
            client_secret: "",
            sdk_key: account?.sdk_key ?? "",
            sdk_secret: "",
        },
        enableReinitialize: true,
        onSubmit: async (values, { resetForm }) => {
            try {
                if (isEdit) {
                    const payload: Parameters<typeof updateAccount>[0] = { id: account.id };
                    if (values.name) payload.name = values.name;
                    if (values.email) payload.email = values.email;
                    if (values.account_id) payload.account_id = values.account_id;
                    if (values.client_id) payload.client_id = values.client_id;
                    if (values.client_secret) payload.client_secret = values.client_secret;
                    if (values.sdk_key) payload.sdk_key = values.sdk_key;
                    if (values.sdk_secret) payload.sdk_secret = values.sdk_secret;
                    const res = await updateAccount(payload).unwrap();
                    dispatch(showToast({ message: res?.message || "Zoom account updated", severity: "success" }));
                } else {
                    const required = ["account_id", "client_id", "client_secret", "sdk_key", "sdk_secret"] as const;
                    const missing = required.filter((k) => !values[k]);
                    if (missing.length) {
                        dispatch(showToast({ message: "All credential fields are required", severity: "error" }));
                        return;
                    }
                    const res = await createAccount({
                        name: values.name,
                        email: values.email,
                        account_id: values.account_id,
                        client_id: values.client_id,
                        client_secret: values.client_secret,
                        sdk_key: values.sdk_key,
                        sdk_secret: values.sdk_secret,
                    }).unwrap();
                    dispatch(showToast({ message: res?.message || "Zoom account added", severity: "success" }));
                }
                resetForm();
                onClose();
            } catch (e: any) {
                dispatch(showToast({ message: e?.data?.message || "Failed to save Zoom account", severity: "error" }));
            }
        },
    });

    const handleClose = () => { formik.resetForm(); onClose(); };

    const editHint = isEdit ? <span style={{ fontWeight: 400, fontSize: 12, marginLeft: 4 }}>(blank = keep existing)</span> : null;

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" scroll="paper">
            <form onSubmit={formik.handleSubmit} style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <DialogTitle>{isEdit ? "Edit Zoom Account" : "Add Zoom Account"}</DialogTitle>
                <Divider />
                <DialogContent dividers className="flex flex-col gap-5!" sx={{ overflowY: "auto" }}>

                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <InputLabel>Account Name</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                placeholder="e.g. Primary, Backup"
                            />
                        </div>
                        <div>
                            <InputLabel>Zoom Account Email</InputLabel>
                            <OutlinedInput
                                fullWidth
                                name="email"
                                type="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                placeholder="host@example.com"
                            />
                        </div>
                    </div>

                    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} className="uppercase tracking-wide">
                            Server App — Create &amp; Host Meetings
                        </Typography>
                        <div className="grid grid-cols-1 gap-4 mt-3">
                            <div>
                                <InputLabel>Account ID {editHint}</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="account_id"
                                    value={formik.values.account_id}
                                    onChange={formik.handleChange}
                                    placeholder="Zoom Account ID"
                                />
                            </div>
                            <div>
                                <InputLabel>Client ID {editHint}</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="client_id"
                                    value={formik.values.client_id}
                                    onChange={formik.handleChange}
                                    placeholder="OAuth Client ID"
                                />
                            </div>
                            <div>
                                <InputLabel>Client Secret {editHint}</InputLabel>
                                <Password
                                    name="client_secret"
                                    value={formik.values.client_secret}
                                    onChange={formik.handleChange}
                                    placeholder={isEdit ? "Enter new Client Secret to replace" : "OAuth Client Secret"}
                                />
                            </div>
                        </div>
                    </Box>

                    {/* ── Meeting SDK app ──────────────────────────────────── */}
                    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, p: 2 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={500} className="uppercase tracking-wide">
                            SDK App — Public Join
                        </Typography>
                        <div className="grid grid-cols-1 gap-4 mt-3">
                            <div>
                                <InputLabel>SDK Key {editHint}</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    name="sdk_key"
                                    value={formik.values.sdk_key}
                                    onChange={formik.handleChange}
                                    placeholder="Meeting SDK Key"
                                />
                            </div>
                            <div>
                                <InputLabel>SDK Secret {editHint}</InputLabel>
                                <SecretField
                                    name="sdk_secret"
                                    value={formik.values.sdk_secret}
                                    onChange={formik.handleChange}
                                    placeholder={isEdit ? "Enter new SDK Secret to replace" : "Meeting SDK Secret"}
                                />
                            </div>
                        </div>
                    </Box>

                </DialogContent>
                <Divider />
                <DialogActions className="px-6! py-3!">
                    <Button onClick={handleClose} variant="outlined" disabled={isLoading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isLoading}>
                        {isLoading ? "Saving..." : isEdit ? "Update" : "Add Account"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default function ZoomSettingRoot() {
    const dispatch = useAppDispatch();
    const { data } = useGetZoomAccountsQuery();
    const [toggleAccount] = useToggleZoomAccountMutation();
    const [deleteAccount, { isLoading: deleting }] = useDeleteZoomAccountMutation();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<ZoomAccount | null>(null);

    const accounts = data?.data ?? [];

    const handleToggle = async (account: ZoomAccount) => {
        try {
            await toggleAccount(account.id).unwrap();
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Failed to update account status", severity: "error" }));
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const res = await deleteAccount(id).unwrap();
            dispatch(showToast({ message: res?.message || "Zoom account removed", severity: "success" }));
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Failed to remove account", severity: "error" }));
        }
    };

    const openAdd = () => { setEditTarget(null); setDialogOpen(true); };
    const openEdit = (account: ZoomAccount) => { setEditTarget(account); setDialogOpen(true); };

    return (
        <div className="app__settings__page__root pb-4 lg:pb-6">
            <div className="flex items-center justify-between">
                <Typography variant="h5">Zoom Accounts</Typography>
                <Button variant="contained" startIcon={<Add size={18} />} onClick={openAdd}>
                    Add Account
                </Button>
            </div>
            <Divider className="mt-4! mb-6!" />

            {accounts.length === 0 ? (
                <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 2, p: 4, textAlign: "center" }}>
                    <Typography color="text.secondary" variant="body2">
                        No Zoom accounts configured. Add one to get started.
                    </Typography>
                </Box>
            ) : (
                <div className="flex flex-col gap-3">
                    {accounts.map((account) => (
                        <Box
                            key={account.id}
                            sx={{
                                border: "1px solid",
                                borderColor: account.is_active ? "primary.main" : "divider",
                                borderRadius: 2,
                                px: 3,
                                py: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <Box flex={1}>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <Typography variant="subtitle2" fontWeight={500}>
                                        {account.name || "Unnamed Account"}
                                    </Typography>
                                    <Chip
                                        label={account.is_active ? "Active" : "Inactive"}
                                        size="small"
                                        color={account.is_active ? "success" : "default"}
                                        variant="outlined"
                                    />
                                </div>
                                <Typography variant="caption" color="text.secondary">
                                    {account.email} &nbsp;·&nbsp; Account ID: {account.account_id} &nbsp;·&nbsp; SDK Key: {account.sdk_key}
                                </Typography>
                            </Box>
                            <Switch
                                checked={account.is_active}
                                onChange={() => handleToggle(account)}
                                size="small"
                            />
                            <ActionIconVisible
                                onEdit={() => openEdit(account)}
                                onDelete={() => handleDelete(account.id)}
                                deleting={deleting}
                            />
                        </Box>
                    ))}
                </div>
            )}

            <ZoomAccountDialog
                open={dialogOpen}
                account={editTarget}
                onClose={() => setDialogOpen(false)}
            />
        </div>
    );
}
