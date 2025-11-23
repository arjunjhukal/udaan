import { Add, Delete } from "@mui/icons-material";
import {
    Autocomplete,
    Button,
    FormControlLabel,
    IconButton,
    InputLabel,
    OutlinedInput,
    Radio,
    TextField,
    Typography
} from "@mui/material";
import { useFormik } from "formik";
import TextEditor from "../../../atoms/TextEditor";
import FooterAction from "../../../molecules/FooterAction";


export interface Props {
    open: boolean;
    setOpen: (newValue: boolean) => void;
}


const questionTypes = [
    { label: "MCQ", value: "mcq" },
    { label: "Subjective", value: "subjective" }
];

const megaCategories = [
    { label: "Science", value: "science" },
    { label: "Mathematics", value: "mathematics" },
    { label: "English", value: "english" },
    { label: "Social Studies", value: "social_studies" },
    { label: "General Knowledge", value: "general_knowledge" }
];

export default function QuestionManagementForm({ setopen }: Props) {
    const formik = useFormik({
        initialValues: {
            questionType: null,
            megaCategory: null,
            mark: "",
            question: "",
            options: [{ text: "", isCorrect: false }],
            correctAnswer: 0
        },
        onSubmit: (values) => {
            console.log("Form values:", values);
            alert(JSON.stringify(values, null, 2));
        }
    });

    const addOption = () => {
        if (formik.values.options.length < 4) {
            formik.setFieldValue("options", [
                ...formik.values.options,
                { text: "", isCorrect: false }
            ]);
        }
    };

    const removeOption = (index) => {
        const newOptions = formik.values.options.filter((_, i) => i !== index);
        formik.setFieldValue("options", newOptions);
        if (formik.values.correctAnswer === index) {
            formik.setFieldValue("correctAnswer", 0);
        } else if (formik.values.correctAnswer > index) {
            formik.setFieldValue("correctAnswer", formik.values.correctAnswer - 1);
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formik.values.options];
        newOptions[index].text = value;
        formik.setFieldValue("options", newOptions);
    };

    const handleCorrectAnswerChange = (index) => {
        formik.setFieldValue("correctAnswer", index);
    };

    const isMCQ = formik.values.questionType?.value === "mcq";

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2">
                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel>Question Type</InputLabel>
                        <Autocomplete
                            disableClearable
                            options={questionTypes}
                            value={formik.values.questionType}
                            onChange={(_, newValue) => {
                                formik.setFieldValue("questionType", newValue);
                                if (newValue?.value === "subjective") {
                                    formik.setFieldValue("options", []);
                                    formik.setFieldValue("correctAnswer", 0);
                                } else if (newValue?.value === "mcq" && formik.values.options.length === 0) {
                                    formik.setFieldValue("options", [{ text: "", isCorrect: false }]);
                                }
                            }}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Select Question Type" />
                            )}
                            fullWidth
                        />
                    </div>
                </div>

                <div className="col-span-1">
                    <div className="input__field">
                        <InputLabel>
                            Question Weight{" "}
                            <Typography variant="subtitle2" color="text.secondary" className="inline-block">
                                Marks this question holds.
                            </Typography>
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="mark"
                            value={formik.values.mark}
                            onChange={formik.handleChange}
                            placeholder="Enter Total Marks"
                            type="number"
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="input__field">
                        <InputLabel>Mega Category</InputLabel>
                        <Autocomplete
                            disableClearable
                            options={megaCategories}
                            value={formik.values.megaCategory}
                            onChange={(_, newValue) => formik.setFieldValue("megaCategory", newValue)}
                            disableClearable
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Select Mega Category" />
                            )}
                            fullWidth
                        />
                    </div>
                </div>

                <div className="col-span-2">
                    <div className="input__field">
                        <InputLabel>Question</InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="question"
                            value={formik.values.question}
                            onChange={formik.handleChange}
                            placeholder="Enter Question"
                            multiline
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {isMCQ && (
                <>
                    <div className="gap-6 grid grid-cols-12 mt-6">
                        <div className="col-span-7">
                            <Typography variant="subtitle1" color="text.primary">
                                Answer Options
                            </Typography>
                        </div>
                        <div className="col-span-5">
                            <Typography variant="subtitle1" color="text.primary">
                                Mark Correct Answer
                            </Typography>
                        </div>
                    </div>

                    {formik.values.options.map((option, index) => (
                        <div key={index} className="gap-6 grid grid-cols-12 mt-6 items-end">
                            <div className="col-span-7">
                                <TextEditor
                                    label={`Option ${index + 1}`}
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    name={`options[${index}].text`}
                                />
                            </div>
                            <div className="col-span-4">
                                <FormControlLabel
                                    label=""
                                    control={
                                        <Radio
                                            color="success"
                                            checked={formik.values.correctAnswer === index}
                                            onChange={() => handleCorrectAnswerChange(index)}
                                        />
                                    }
                                />
                            </div>
                            <div className="col-span-1">
                                {formik.values.options.length > 1 && (
                                    <IconButton
                                        onClick={() => removeOption(index)}
                                        color="error"
                                        size="small"
                                    >
                                        <Delete />
                                    </IconButton>
                                )}
                            </div>
                        </div>
                    ))}

                    {formik.values.options.length < 4 && (
                        <Button
                            variant="text"
                            color="primary"
                            className="font-medium! mt-4"
                            startIcon={<Add />}
                            onClick={addOption}
                        >
                            Add Options
                        </Button>
                    )}
                </>
            )}

            <FooterAction
                handleComfirmationChange={() => setopen(false)}
                isLoading={false}
                isEditMode={false}
                isUpdating={false}
                buttonLabel="Question"
            />

        </form>
    );
}