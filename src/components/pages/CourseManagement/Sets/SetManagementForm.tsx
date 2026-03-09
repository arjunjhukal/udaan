
import { Autocomplete, Checkbox, Divider, FormHelperText, InputLabel, OutlinedInput, Skeleton, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Box } from "iconsax-reactjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import { useCreateBundleMutation, useGetAllTestQuery, useGetBundleByIdQuery, useUpdateBundleMutation } from "../../../../services/questionApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { DiscountTypeProps } from "../../../../types/course";
import { setInitialValues } from "../../../../types/question";
import TextEditor from "../../../atoms/TextEditor";
import FileDragDrop from "../../../molecules/FileDragDrop";
import FooterAction from "../../../molecules/FooterAction";
import TestCard from "../../../organism/Cards/TestCard";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";

const validationSchema = Yup.object({
  name: Yup.string().required("Title is required"),

  description: Yup.string().required("Description is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required"),

  set_count: Yup.number()
    .typeError("Set Count must be a number")
    .required("Set Count is required"),

  test_ids: Yup.array()
    .of(Yup.number())
    .min(1, "At least one test must be selected"),

  thumbnail: Yup.mixed().nullable().test(
    "thumbnail-required",
    "Thumbnail is required",
    function (value) {
      const { thumbnail_url } = this.parent;
      if (thumbnail_url && thumbnail_url.trim() !== "") return true;
      if (value) return true;
      return false;
    }
  ),

  status: Yup.string()
    .oneOf(["published", "draft"])
    .required("Status is required")
});
export default function SetManagementForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const { data } = useGetBundleByIdQuery({ id: Number(id) }, { skip: !id })
  const [createBundle, { isLoading }] = useCreateBundleMutation();
  const [updateBundle, { isLoading: editing }] = useUpdateBundleMutation();

  const [qp, setQp] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: ""
  });

  const [days, setDays] = useState<number | null>(null);

  const { data: tests, isLoading: loadingTests } = useGetAllTestQuery({
    ...qp,
    search: debouncedSearch,
    ...customRange,
    days,
  });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 1000);
    return () => clearTimeout(timer);
  }, [search]);



  const formik = useFormik({
    enableReinitialize: true,
    initialValues:
      id && data
        ? {
          id: data.data.id,
          name: data.data.name || "",
          description: data.data.description || "",
          price: String(data.data.price ?? ""),
          discount: String(data.data.discount ?? ""),
          discount_type: data.data.discount_type || "percentage",
          set_count: String(data.data.set_count ?? ""),
          test_ids: data.data.test_ids ?? [],
          thumbnail: data?.data?.thumbnail || null,
          thumbnail_url: data.data.thumbnail_url || "",
          status: data.data.status || "draft"
        }
        : setInitialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("discount", values.discount);
      formData.append("discount_type", values.discount_type);
      formData.append("set_count", values.set_count);
      formData.append("status", values.status);

      if (values.thumbnail) {
        formData.append("thumbnail", values.thumbnail);
      }
      if (values.thumbnail_url) {
        formData.append("thumbnail_url", values.thumbnail_url);
      }

      values.test_ids.forEach((id) => {
        formData.append("test_ids[]", String(id));
      });

      try {
        const response = id
          ? await updateBundle({ body: formData, id: Number(id) }).unwrap()
          : await createBundle({ body: formData }).unwrap();

        dispatch(
          showToast({
            message: response?.message || "Success",
            severity: "success"
          })
        );

        navigate(PATH.SET.ROOT);
      } catch (e: any) {
        dispatch(
          showToast({
            message: e?.data?.message || "Error while saving",
            severity: "error"
          })
        );
      }
    }

  })

  const handleFileChange = (file: File | null) => {
    formik.setFieldValue("thumbnail", file);
    if (!file) {
      formik.setFieldValue("thumbnail_url", "");
    }
  };

  const handleResetFilter = () => {
    setCustomRange({ startDate: "", endDate: "" });
    setSearch("");
    setDays(null);
    setQp((prev) => ({ ...prev, pageIndex: 1 }));
  };
  const allTests = tests?.data?.data || [];

  const handleToggleItem = (testId: number) => {
    const currentTests = formik.values.test_ids || [];

    const exists = currentTests.includes(testId);

    const updatedTests = exists
      ? currentTests.filter((id) => id !== testId)
      : [...currentTests, testId];

    formik.setFieldValue("test_ids", updatedTests);
  };
  return (
    <form onSubmit={formik.handleSubmit} className="h-full flex flex-col">
      <PageHeader
        breadcrumb={[
          {
            title: t("menus.test_question_management.test.bundle_test.root"),
            icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 4.85018V16.7402C22 17.7102 21.21 18.6002 20.24 18.7202L19.93 18.7602C18.29 18.9802 15.98 19.6602 14.12 20.4402C13.47 20.7102 12.75 20.2202 12.75 19.5102V5.60018C12.75 5.23018 12.96 4.89018 13.29 4.71018C15.12 3.72018 17.89 2.84018 19.77 2.68018H19.83C21.03 2.68018 22 3.65018 22 4.85018Z" fill="#1D82F5" />
              <path d="M10.7102 4.71018C8.88023 3.72018 6.11023 2.84018 4.23023 2.68018H4.16023C2.96023 2.68018 1.99023 3.65018 1.99023 4.85018V16.7402C1.99023 17.7102 2.78023 18.6002 3.75023 18.7202L4.06023 18.7602C5.70023 18.9802 8.01023 19.6602 9.87023 20.4402C10.5202 20.7102 11.2402 20.2202 11.2402 19.5102V5.60018C11.2402 5.22018 11.0402 4.89018 10.7102 4.71018ZM5.00023 7.74018H7.25023C7.66023 7.74018 8.00023 8.08018 8.00023 8.49018C8.00023 8.91018 7.66023 9.24018 7.25023 9.24018H5.00023C4.59023 9.24018 4.25023 8.91018 4.25023 8.49018C4.25023 8.08018 4.59023 7.74018 5.00023 7.74018ZM8.00023 12.2402H5.00023C4.59023 12.2402 4.25023 11.9102 4.25023 11.4902C4.25023 11.0802 4.59023 10.7402 5.00023 10.7402H8.00023C8.41023 10.7402 8.75023 11.0802 8.75023 11.4902C8.75023 11.9102 8.41023 12.2402 8.00023 12.2402Z" fill="#1D82F5" />
            </svg>
            ),
            url: PATH.SET.ROOT
          },
          {
            title: "Create Bundle"
          }
        ]}
      />

      <div className="form__Wrapper flex flex-col gap-4 lg:grid lg:grid-cols-2 h-full overflow-auto">
        <div className="input__field col-span-2">
          <InputLabel className="required">Title</InputLabel>
          <OutlinedInput
            fullWidth
            placeholder="Enter Title"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          {formik.touched.name && formik.errors.name && (
            <FormHelperText error={true} sx={{ mt: 0.5 }}>
              {formik.errors.name}
            </FormHelperText>
          )}
        </div>
        <div className="input__field col-span-1 flex flex-col gap-4">
          <FileDragDrop
            required={true}
            onFileChange={handleFileChange}
            initialFile={formik.values.thumbnail}
            initialPreview={formik.values.thumbnail_url}
            error={formik.touched.thumbnail && Boolean(formik.errors.thumbnail)}
            helperText={formik.touched.thumbnail && formik.errors.thumbnail ? String(formik.errors.thumbnail) : ""} label="Image/Thumbnail" />
          <div className="input__field ">
            <InputLabel className="required">Price</InputLabel>
            <OutlinedInput
              fullWidth
              placeholder="Enter Price"
              name="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.price && Boolean(formik.errors.price)}
            />
            {formik.touched.price && formik.errors.price && (
              <FormHelperText error={true} sx={{ mt: 0.5 }}>
                {formik.errors.price}
              </FormHelperText>
            )}
          </div>
        </div>
        <div className="col-span-1">
          <div className="input__field">
            <TextEditor
              label="Description"
              required={true}
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue("description", value)}
              onBlur={() => formik.setFieldTouched("description")}
            />
            {formik.touched.description && formik.errors.description && (
              <FormHelperText error={true} sx={{ mt: 0.5 }}>
                {formik.errors.description}
              </FormHelperText>
            )}
          </div>
        </div>
        {/* Discount */}
        <div className="col-span-1">
          <div className="input_field">
            <InputLabel >Discount</InputLabel>
            <OutlinedInput
              fullWidth
              placeholder='Enter Discount'
              name='discount'
              type="number"
              value={formik.values.discount}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched?.discount && formik.errors?.discount && (
              <FormHelperText error sx={{ mt: 0.5 }}>
                {formik.errors.discount}
              </FormHelperText>
            )}
          </div>
        </div>

        {/* Discount Type */}
        <div className="col-span-1">
          <div className="input_field">
            <InputLabel >Discount Type</InputLabel>
            <Autocomplete
              options={[
                { label: "Percentage", value: "percentage" },
                { label: "Amount", value: "amount" },
              ]}
              value={formik.values.discount_type === 'percentage' ? { label: "Percentage", value: "percentage" } : { label: "Amount", value: "amount" }}
              getOptionLabel={(option) => option.label}
              onChange={(_e, value) => {
                formik.setFieldValue('discount_type', value?.value as DiscountTypeProps || 'percentage');
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select discount type"
                />
              )}
            />
            {formik.touched?.discount_type && formik.errors?.discount_type && (
              <FormHelperText error sx={{ mt: 0.5 }}>
                {formik.errors.discount_type}
              </FormHelperText>
            )}
          </div>
        </div>

        <div className="input__field col-span-1">
          <InputLabel className="required">Set Count</InputLabel>
          <OutlinedInput
            fullWidth
            placeholder="Enter Set Count"
            name="set_count"
            value={formik.values.set_count}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.set_count && Boolean(formik.errors.set_count)}
          />
          {formik.touched.set_count && formik.errors.set_count && (
            <FormHelperText error={true} sx={{ mt: 0.5 }}>
              {formik.errors.set_count}
            </FormHelperText>
          )}
        </div>

        <div className="col-span-2">
          <Typography variant="h5" >Add Sets</Typography>
          <Divider className="mt-2! mb-6!" />
          <TableFilter
            search={search}
            setSearch={setSearch}
            categoryLayout={true}
            customRange={customRange}
            setCustomRange={setCustomRange}
            setDays={setDays}
            handleResetFilter={handleResetFilter}
          />

          <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 2xl:gap-6">
            {loadingTests ? (
              [...Array(6)].map((_, idx) => (
                <div key={idx} className="col-span-1">
                  <div className="flex gap-3 items-center">
                    <Box className="w-full">
                      <Skeleton variant="rectangular" height={120} className="rounded-xl" />
                    </Box>
                  </div>
                </div>
              ))
            ) :
              (allTests.map((test) => (
                <div className="flex gap-3 items-center" key={test.id} >
                  <Checkbox
                    color="primary"
                    checked={formik.values.test_ids.includes(Number(test.id))}
                    onChange={() => handleToggleItem(Number(test.id))}
                  />
                  <div onClick={() => handleToggleItem(Number(test.id))} className="cursor-pointer flex-1">
                    <TestCard test={test} showActions={false} />
                  </div>
                </div>
              )))}
          </div>
        </div>
      </div>
      <FooterAction
        handleConfirmationChange={() => navigate(PATH.SET.ROOT)}
        isLoading={isLoading}
        isUpdating={editing}
        isEditMode={!!id}
        replaceLabel={id ? isLoading || editing
          ? "Updating Bundle..."
          : "Update Bundle"
          : isLoading || editing
            ? "Creating Bundle..."
            : "Create Bundle"}
      />
    </form>
  )
}
