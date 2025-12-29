import { InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from "yup";
import { PATH } from '../../../../routes/PATH';
import { useCreatePageMutation, useGetSinglePageByIdentifierQuery, useUpdatePageByIdentifierMutation } from '../../../../services/pageApi';
import { showToast } from '../../../../slice/toastSlice';
import { useAppDispatch } from '../../../../store/hook';
import { generateSlug } from '../../../../utils/generateSlug';
import TextEditor from '../../../atoms/TextEditor';
import FooterAction from '../../../molecules/FooterAction';

const validationSchema = Yup.object({
    heading: Yup.string().required("Page Heading is required"),
    slug: Yup.string().required("Slug is required"),
    content: Yup.string().required("Content is required"),
});

export default function PageCreationForm() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
    const [updatePage, { isLoading: isUpdating }] = useUpdatePageByIdentifierMutation();
    const { data } = useGetSinglePageByIdentifierQuery(id || "", { skip: !id });

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const isInitialized = useRef(false);

    const formik = useFormik({
        initialValues: data ? data?.data : { heading: "", slug: "", content: "" },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                let response;
                if (id) {
                    response = await updatePage({
                        identifier: id,
                        data: values
                    }).unwrap();
                } else {
                    response = await createPage(values).unwrap();
                }

                dispatch(showToast({
                    message: response.message || `Page ${id ? 'Updated' : 'Created'} Successfully`,
                    severity: "success"
                }));
                navigate(PATH.CONTENT_MANAGEMENT.PAGES.ROOT);
            }
            catch (e: any) {
                dispatch(showToast({
                    message: e?.data?.message || `Unable to ${id ? 'update' : 'create'} page`,
                    severity: "error"
                }));
            }
        }
    });

    useEffect(() => {
        if (id && data && !isInitialized.current) {
            setIsSlugManuallyEdited(true);
            isInitialized.current = true;
        }
    }, [id, data]);


    useEffect(() => {

        if (!id && !isSlugManuallyEdited && formik.values.heading) {
            const autoSlug = generateSlug(formik.values.heading);
            formik.setFieldValue("slug", autoSlug);
        }
    }, [formik.values.heading, isSlugManuallyEdited, id]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSlugManuallyEdited(true);
        formik.handleChange(e);
    };

    const isLoading = isCreating || isUpdating;

    return (
        <form className="page__creation__root flex flex-col justify-between h-full" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:gap-6">
                <div className="col-span-1">
                    <InputLabel className="required">Heading</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="heading"
                        value={formik.values.heading}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.heading && Boolean(formik.errors.heading)}
                        placeholder='Enter Title'
                    />
                    {formik.touched.heading && formik.errors.heading && (
                        <Typography color="error">{formik.errors.heading}</Typography>
                    )}
                </div>

                <div className="col-span-1">
                    <InputLabel className="required">Slug</InputLabel>
                    <OutlinedInput
                        fullWidth
                        name="slug"
                        value={formik.values.slug}
                        onChange={handleSlugChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.slug && Boolean(formik.errors.slug)}
                        placeholder='Enter Slug'
                    />
                    {formik.touched.slug && formik.errors.slug && (
                        <Typography color="error">{formik.errors.slug}</Typography>
                    )}
                </div>

                <div className="col-span-2">
                    <TextEditor
                        value={formik.values.content}
                        onChange={(newValue) => formik.setFieldValue("content", newValue)}
                        onBlur={(newValue) => formik.setFieldValue("content", newValue)}
                    />
                    {formik.touched.content && formik.errors.content && (
                        <Typography color="error">{formik.errors.content}</Typography>
                    )}
                </div>
            </div>
            <FooterAction
                handleConfirmationChange={() => { }}
                isEditMode={!!id}
                isLoading={isLoading}
                isUpdating={isLoading}
                replaceLabel={isLoading ? "Creating Page..." : "Create Page"}
            />
        </form>
    );
}