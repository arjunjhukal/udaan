import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    OutlinedInput,
    Skeleton,
    Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import {
    useGetEmailTemplatesQuery,
    useUpdateEmailTemplateMutation,
} from "../../../../services/settingApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { EmailTemplateMethod, EmailTemplateProps } from "../../../../types/setting";
import { TEMPLATE_VARIABLES } from "../../../../types/setting";
import type { TextEditorHandle } from "../../../atoms/TextEditor";
import TextEditor from "../../../atoms/TextEditor";
import TabController from "../../../molecules/TabController";


function toLabel(key: string) {
    return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const TAB_OPTIONS: { label: string; value: EmailTemplateMethod }[] = [
    { label: "Email", value: "email" },
    { label: "SMS", value: "sms" },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────

interface AccordionItemProps {
    method: EmailTemplateMethod;
    serverData: EmailTemplateProps;
    expanded: boolean;
    onToggle: () => void;
}

function TemplateAccordionItem({ method, serverData, expanded, onToggle }: AccordionItemProps) {
    const dispatch = useAppDispatch();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editorRef = useRef<TextEditorHandle>(null);

    const [enabled, setEnabled] = useState(serverData.is_enabled ?? true);
    const [subject, setSubject] = useState(serverData.subject ?? "");
    const [body, setBody] = useState(serverData.body ?? "");

    // Sync when server data updates (e.g. after a save refetch)
    const synced = useRef(false);
    useEffect(() => {
        if (!synced.current) {
            setEnabled(serverData.is_enabled ?? true);
            setSubject(serverData.subject ?? "");
            setBody(serverData.body ?? "");
            synced.current = true;
        }
    }, [serverData]);

    const [updateTemplate, { isLoading: isSaving }] = useUpdateEmailTemplateMutation();
    const [toggleTemplate, { isLoading: isToggling }] = useUpdateEmailTemplateMutation();

    // Prefer variables from backend; fall back to frontend map
    const variables = serverData.variables?.length
        ? serverData.variables
        : (TEMPLATE_VARIABLES[serverData.template_key] ?? []);

    const insertVariable = (variable: string) => {
        const tag = `{{${variable}}}`;

        if (method === "email") {
            editorRef.current?.insertAtCursor(tag);
        } else if (textareaRef.current) {
            const el = textareaRef.current;
            const start = el.selectionStart ?? body.length;
            const end = el.selectionEnd ?? body.length;
            const next = body.slice(0, start) + tag + body.slice(end);
            setBody(next);
            setTimeout(() => {
                el.selectionStart = el.selectionEnd = start + tag.length;
                el.focus();
            }, 0);
        }
    };

    const handleToggleEnabled = async (nextVal: boolean) => {
        setEnabled(nextVal);
        try {
            await toggleTemplate({
                actor: "user",
                method,
                template_key: serverData.template_key,
                subject: method === "email" ? subject : undefined,
                body,
                is_enabled: nextVal,
            }).unwrap();
        } catch (e: any) {
            setEnabled(!nextVal); // revert on failure
            dispatch(showToast({ message: e?.data?.message || "Unable to update status", severity: "error" }));
        }
    };

    const handleSave = async () => {
        try {
            const res = await updateTemplate({
                actor: "user",
                method,
                template_key: serverData.template_key,
                subject: method === "email" ? subject : undefined,
                body,
                is_enabled: enabled,
            }).unwrap();
            dispatch(showToast({ message: res?.message || "Template saved", severity: "success" }));
        } catch (e: any) {
            dispatch(showToast({ message: e?.data?.message || "Unable to save template", severity: "error" }));
        }
    };

    return (
        <Accordion
            expanded={expanded}
            onChange={onToggle}
            disableGutters
            elevation={0}
            sx={{
                mb: 1.5,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "10px !important",
                "&:before": { display: "none" },
                "&.Mui-expanded": { borderColor: "primary.main" },
            }}
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 2.5, py: 0.5 }}>
                {/* Wrapper stops the checkbox click from bubbling to the accordion toggle */}
                <div
                    className="flex items-center justify-between w-full pr-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Typography
                        variant="h6"
                        onClick={onToggle}
                        sx={{ cursor: "pointer", flex: 1 }}
                    >
                        {toLabel(serverData.template_key)}
                    </Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size="small"
                                checked={enabled}
                                disabled={isToggling}
                                onChange={(e) => handleToggleEnabled(e.target.checked)}
                            />
                        }
                        label={
                            <Typography variant="body2" color="text.secondary">
                                {method === "email" ? "Send via Email" : "Send via SMS"}
                            </Typography>
                        }
                        sx={{ mr: 0 }}
                    />
                </div>
            </AccordionSummary>

            <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                <Divider className="mb-4!" />

                {/* Variable chips — click inserts at cursor */}
                {variables.length > 0 && (
                    <div className="mb-5">
                        <Typography variant="caption" color="text.secondary">
                            Click a variable to insert it at your cursor:
                        </Typography>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {variables.map((v) => (
                                <Chip
                                    key={v}
                                    label={`{{${v}}}`}
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => insertVariable(v)}
                                    sx={{ fontFamily: "monospace", fontSize: "0.7rem", cursor: "pointer" }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Subject — email only */}
                {method === "email" && (
                    <div className="mb-4">
                        <Typography variant="caption" fontWeight={600} color="text.secondary" className="mb-1! block">
                            Subject
                        </Typography>
                        <OutlinedInput
                            fullWidth
                            size="small"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Enter email subject line"
                        />
                    </div>
                )}

                {/* Body */}
                <div className="mb-5">
                    <Typography variant="caption" fontWeight={600} color="text.secondary" className="mb-2! block">
                        {method === "email" ? "Email Body" : "SMS Message"}
                    </Typography>

                    {method === "email" ? (
                        <TextEditor ref={editorRef} value={body} onChange={setBody} />
                    ) : (
                        <OutlinedInput
                            fullWidth
                            multiline
                            minRows={4}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Write your SMS message. Click a variable above to insert it."
                            inputRef={textareaRef}
                            inputProps={{ style: { resize: "vertical" } }}
                        />
                    )}
                </div>

                <div className="flex justify-end">
                    <Button variant="contained" size="small" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving…" : "Save Template"}
                    </Button>
                </div>
            </AccordionDetails>
        </Accordion>
    );
}

export default function EmailTemplatesRoot() {
    const [activeTab, setActiveTab] = useState<EmailTemplateMethod>("email");
    const [expandedKey, setExpandedKey] = useState<string | false>(false);

    const { data, isFetching } = useGetEmailTemplatesQuery({ actor: "user", method: activeTab });

    const handleTabChange = (tab: EmailTemplateMethod) => {
        setActiveTab(tab);
        setExpandedKey(false);
    };

    const templates = data?.data ?? [];

    return (
        <div className="app__settings__page__root pb-4 lg:pb-6">
            <Typography variant="h5">Message Templates</Typography>
            <Divider className="mt-4! mb-2!" />

            <TabController<EmailTemplateMethod>
                options={TAB_OPTIONS}
                currentActive={activeTab}
                setActiveTab={handleTabChange}
            />

            <div className="mt-6">
                {isFetching ? (
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 7 }, (_, i) => (
                            <Skeleton key={i} variant="rounded" height={56} />
                        ))}
                    </div>
                ) : templates.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        No templates configured for this channel.
                    </Typography>
                ) : (
                    templates.map((tpl) => (
                        <TemplateAccordionItem
                            key={`${activeTab}-${tpl.template_key}`}
                            method={activeTab}
                            serverData={tpl}
                            expanded={expandedKey === tpl.template_key}
                            onToggle={() =>
                                setExpandedKey(expandedKey === tpl.template_key ? false : tpl.template_key)
                            }
                        />
                    ))
                )}
            </div>
        </div>
    );
}
