import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { FormHelperText, InputLabel } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useUploadMediaImageMutation } from "../../services/mediaApi";

export default function TextEditor({
    label,
    error,
    value,
    onChange,
    onBlur,
    required
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
    const [uploadImage] = useUploadMediaImageMutation();

    // Synchronize local state when value prop changes
    useEffect(() => {
        if (value !== prevValueRef.current) {
            setData(value || "");
            prevValueRef.current = value;
        }
    }, [value]);

    // Custom upload adapter for CKEditor
    function CustomUploadAdapterPlugin(editor: any) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
            return {
                upload: async () => {
                    try {
                        const file = await loader.file;
                        const formData = new FormData();
                        formData.append('upload', file);

                        const response = await uploadImage({ body: formData }).unwrap();

                        console.log('Image uploaded:', response?.data.url);

                        return {
                            default: response?.data.url
                        };
                    } catch (error) {
                        console.error('Upload failed:', error);
                        throw error;
                    }
                },
                abort: () => {
                    // Handle upload abort if needed
                    console.log('Upload aborted');
                }
            };
        };
    }

    return (
        <div className="input__field">
            <InputLabel className="required">
                {label || "Description"}
            </InputLabel>

            <div
                className="editor__wrapper"
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
                        extraPlugins: [CustomUploadAdapterPlugin],
                        toolbar: [
                            'heading', '|',
                            'bold', 'italic', 'link', '|',
                            'bulletedList', 'numberedList', '|',
                            'imageUpload', 'blockQuote', '|',
                            'undo', 'redo'
                        ]
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