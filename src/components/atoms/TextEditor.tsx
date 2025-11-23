import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FormHelperText, InputLabel } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function TextEditor({
    label,
    error,
    value,
    onChange,
    onBlur
    , required
}: {
    label?: string;
    error?: string;
    value?: string;
    onChange?: (value: string) => void;
    onBlur?: (value: string) => void;
    required?: boolean
}) {
    const [data, setData] = useState(value || "");
    const prevValueRef = useRef(value);

    // Synchronize local state when value prop changes (Formik reinitializes or tab changes)
    useEffect(() => {
        if (value !== prevValueRef.current) {
            setData(value || "");
            prevValueRef.current = value;
        }
    }, [value]);

    console.log(required);

    return (
        <div className="input__field">
            <InputLabel className="required">
                {label || "Description"}
            </InputLabel>

            <div className="editor__wrapper"
                style={{
                    border: "1px solid #E5E7EB",
                    height: "251px",
                    padding: "16px",
                    borderRadius: "8px",
                    overflowY: "auto",
                }}
            >
                <CKEditor
                    editor={ClassicEditor as any}
                    data={data}
                    config={{
                        ckfinder: {
                            uploadUrl: "/api/upload-image",
                        }
                    }}
                    onChange={(_, editor) => {
                        const val = editor.getData();
                        setData(val);
                        if (onChange) onChange(val);
                    }}
                    onBlur={(_, editor) => {
                        const val = editor.getData();
                        if (onBlur) onBlur(val);
                    }}
                />
            </div>

            {error && <FormHelperText error>{error}</FormHelperText>}
        </div>
    );
}
