import { Button, Divider, FormHelperText, InputLabel, OutlinedInput } from "@mui/material";
import { useFormik } from "formik";
import { useGetTestSampleQuery, useSubmitTestSampleMutation } from "../../../../../services/questionApi";
import { showToast } from "../../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../../store/hook";
import FileDragDrop from "../../../../molecules/FileDragDrop";

export default function TestSampleForm({ id }: { id: string }) {
  const [submitTestSample, { isLoading }] = useSubmitTestSampleMutation();
  const { data } = useGetTestSampleQuery({ id: Number(id) }, { skip: !id });
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: data ? data?.data : {
      sample: null,
      sample_url: "",
      video_url: ""
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        if (values.sample) {
          formData.append("sample", values.sample)
        }
        if (values.sample_url) {
          formData.append("sample_url", values.sample_url)
        }
        if (values.video_url) {
          formData.append("video_url", values.video_url)
        }

        const response = await submitTestSample({ id: Number(id), body: formData }).unwrap();

        dispatch(
          showToast({
            message: response?.message || "Successfully Updated Samples",
            severity: "success"
          })
        )
      }
      catch (e: any) {
        dispatch(
          showToast({
            message: e?.data?.message || "Error Updating Samples. Try Again.",
            severity: "error"
          })
        )
      }
    }
  })
  return (
    <form className="flex flex-col gap-4 mt-4" onSubmit={formik.handleSubmit}>
      <div className="input__field">
        <InputLabel htmlFor="video_url">Sample Video URL</InputLabel>
        <OutlinedInput
          fullWidth
          name="video_url"
          placeholder="Sample Video URL"
          value={formik.values.video_url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.video_url && Boolean(formik.errors.video_url)}
        />
        {
          formik.touched.video_url && formik.errors.video_url ? <FormHelperText error>{formik.errors.video_url}</FormHelperText> : ""
        }
      </div>
      <div className="input__field">
        <FileDragDrop
          onFileChange={(file) => formik.setFieldValue("sample", file)}
          label="Sample Video"
          initialPreview={formik.values.sample_url || ""}
          initialFile={formik.values.sample || null}
        />
      </div>
      <div className="text-end">
        <Divider className="my-4!" />
        <Button type="submit" disabled={isLoading} variant="contained" color="primary">{data?.data?.sample_url || data?.data?.video_url ? `${isLoading ? "Updating" : "Update"} Sample` : `${isLoading ? "Addding" : "Add"} Sample`}</Button>
      </div>
    </form>
  )
}
