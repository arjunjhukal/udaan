import { Cancel } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { PATH } from "../../../../routes/PATH";
import {
  useCreateBundleMutation,
  useGetAllTestQuery,
  useGetBundleByIdQuery,
  useGetTestRelatedToBundleQuery,
  useUpdateBundleMutation,
} from "../../../../services/questionApi";
import { showToast } from "../../../../slice/toastSlice";
import { useAppDispatch } from "../../../../store/hook";
import type { DiscountTypeProps } from "../../../../types/course";
import { setInitialValues, type TestProps } from "../../../../types/question";
import TextEditor from "../../../atoms/TextEditor";
import FileDragDrop from "../../../molecules/FileDragDrop";
import FooterAction from "../../../molecules/FooterAction";
import TestCard from "../../../organism/Cards/TestCard";
import EmptyRoute from "../../../organism/EmptyRoute";
import PageHeader from "../../../organism/PageHeader";
import TableFilter from "../../../organism/TableFilter";

const MAX_RECENT_ITEMS = 50; // Fix #4: Limit memory usage

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
  thumbnail: Yup.mixed()
    .nullable()
    .test("thumbnail-required", "Thumbnail is required", function (value) {
      const { thumbnail_url } = this.parent;
      return !!(thumbnail_url?.trim() || value);
    }),
  status: Yup.string()
    .oneOf(["published", "draft"])
    .required("Status is required"),
});

const VideoSkeleton = () => (
  <div className="col-span-1 animate-pulse">
    <div className="bg-gray-200 rounded-xl h-48 w-full"></div>
    <div className="mt-3 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

const SelectedTestSkeleton = () => (
  <div className="animate-pulse flex gap-2 items-center p-2 rounded-lg border border-gray-100">
    <div className="bg-gray-200 rounded h-16 w-20 flex-shrink-0"></div>
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function SetManagementForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [days, setDays] = useState<number | null>(null);

  const [qp, setQp] = useState({
    pageIndex: 1,
    pageSize: 12,
  });

  const [selectedQp, setSelectedQp] = useState({
    pageIndex: 1,
    pageSize: 12,
  });

  const [allVisibleTests, setAllVisibleTests] = useState<TestProps[]>([]);
  const [allVisibleSelectedTests, setAllVisibleSelectedTests] = useState<TestProps[]>([]);

  // Fix #2: Track request identity to prevent race conditions
  const testsRequestIdRef = useRef(0);
  const selectedTestsRequestIdRef = useRef(0);
  const seedDoneRef = useRef(false);
  const recentlySelectedRef = useRef<number[]>([]);

  const { data } = useGetBundleByIdQuery({ id: Number(id) }, { skip: !id });
  const [createBundle, { isLoading }] = useCreateBundleMutation();
  const [updateBundle, { isLoading: editing }] = useUpdateBundleMutation();

  const { data: tests, isLoading: loadingTests } = useGetAllTestQuery({
    ...qp,
    search: debouncedSearch,
    ...customRange,
    days,
  });

  const { data: selectedTests, isLoading: loadingSelectedTest } =
    useGetTestRelatedToBundleQuery(
      { ...selectedQp, id: Number(id) },
      { skip: !id }
    );

  const totalPages = tests?.data?.pagination?.total_pages || 0;
  const selectedTotalPages = selectedTests?.data?.pagination?.total_pages || 0;
  const hasMore = qp.pageIndex < totalPages;
  const hasMoreSelected = selectedQp.pageIndex < selectedTotalPages;

  // ── Debounced search ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Reset on filter change ────────────────────────────────────────────────
  useEffect(() => {
    // Increment request ID to invalidate in-flight requests
    testsRequestIdRef.current += 1;
    setAllVisibleTests([]);
    setQp((prev) => ({ ...prev, pageIndex: 1 }));
  }, [debouncedSearch, customRange.startDate, customRange.endDate, days]);

  // ── Fix #1 & #2: Handle tests data with proper deps and race condition guard
  useEffect(() => {
    const currentRequestId = testsRequestIdRef.current;
    const newTests = tests?.data?.data ?? [];

    // Guard against stale responses
    if (currentRequestId !== testsRequestIdRef.current) return;

    if (newTests.length === 0 && qp.pageIndex === 1) {
      setAllVisibleTests([]);
      return;
    }

    setAllVisibleTests((prev) => {
      if (qp.pageIndex === 1) {
        return newTests;
      }

      // Deduplicate using Set
      const existingIds = new Set(prev.map((v) => v.id));
      const uniqueNewTests = newTests.filter(
        (v: TestProps) => !existingIds.has(v.id)
      );

      if (uniqueNewTests.length === 0) return prev;

      return [...prev, ...uniqueNewTests];
    });
  }, [tests?.data?.data, qp.pageIndex]); // Fix #1: Include qp.pageIndex

  // ── Handle selected tests data ────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const currentRequestId = selectedTestsRequestIdRef.current;
    const newSelectedTests = selectedTests?.data?.data ?? [];

    // Guard against stale responses
    if (currentRequestId !== selectedTestsRequestIdRef.current) return;

    if (newSelectedTests.length === 0 && selectedQp.pageIndex === 1) {
      setAllVisibleSelectedTests([]);
      return;
    }

    setAllVisibleSelectedTests((prev) => {
      if (selectedQp.pageIndex === 1) {
        return newSelectedTests;
      }

      const existingIds = new Set(prev.map((v) => v.id));
      const uniqueNewTests = newSelectedTests.filter(
        (v: TestProps) => !existingIds.has(v.id)
      );

      if (uniqueNewTests.length === 0) return prev;

      return [...prev, ...uniqueNewTests];
    });
  }, [selectedTests?.data?.data, selectedQp.pageIndex, id]);

  // ── Seed test_ids from server on edit mode ────────────────────────────────
  useEffect(() => {
    if (!id || seedDoneRef.current) return;

    const serverTests = selectedTests?.data?.data ?? [];
    if (serverTests.length > 0) {
      const serverIds = serverTests.map((t: TestProps) => Number(t.id));
      const currentIds = formik.values.test_ids;

      if (JSON.stringify(serverIds) !== JSON.stringify(currentIds)) {
        formik.setFieldValue("test_ids", serverIds, false);
      }
      seedDoneRef.current = true;
    }
  }, [selectedTests?.data?.data, id]);

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
          status: data.data.status || "draft",
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
      if (values.thumbnail) formData.append("thumbnail", values.thumbnail);
      if (values.thumbnail_url)
        formData.append("thumbnail_url", values.thumbnail_url);
      values.test_ids.forEach((testId) =>
        formData.append("test_ids[]", String(testId))
      );

      try {
        const response = id
          ? await updateBundle({ body: formData, id: Number(id) }).unwrap()
          : await createBundle({ body: formData }).unwrap();

        dispatch(
          showToast({
            message: response?.message || "Success",
            severity: "success",
          })
        );
        navigate(PATH.SET.ROOT);
      } catch (e: any) {
        dispatch(
          showToast({
            message: e?.data?.message || "Error while saving",
            severity: "error",
          })
        );
      }
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFileChange = (file: File | null) => {
    formik.setFieldValue("thumbnail", file);
    if (!file) formik.setFieldValue("thumbnail_url", "");
  };

  const handleResetFilter = () => {
    setCustomRange({ startDate: "", endDate: "" });
    setSearch("");
    setDays(null);
  };

  const handleToggleItem = useCallback(
    (testId: number) => {
      const currentTests = formik.values.test_ids || [];
      const exists = currentTests.includes(testId);

      if (!exists) {
        // Fix #4: Limit recentlySelectedRef size
        recentlySelectedRef.current = [
          testId,
          ...recentlySelectedRef.current.filter((id) => id !== testId),
        ].slice(0, MAX_RECENT_ITEMS);
      } else {
        recentlySelectedRef.current = recentlySelectedRef.current.filter(
          (id) => id !== testId
        );
      }

      const updatedTests = exists
        ? currentTests.filter((id) => id !== testId)
        : [...currentTests, testId];

      formik.setFieldValue("test_ids", updatedTests);
    },
    [formik.values.test_ids]
  );

  const fetchMoreTest = useCallback(() => {
    if (!loadingTests && hasMore) {
      setQp((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  }, [loadingTests, hasMore]);

  const fetchMoreSelectedTests = useCallback(() => {
    if (!loadingSelectedTest && hasMoreSelected) {
      setSelectedQp((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  }, [loadingSelectedTest, hasMoreSelected]);

  // ── Build selected test objects with memoization ──────────────────────────
  const selectedTestObjects = useMemo<TestProps[]>(() => {
    const selectedIds = new Set(formik.values.test_ids.map(Number));

    // Build lookup map from both sources
    const lookup = new Map<number, TestProps>();
    allVisibleTests.forEach((t) => lookup.set(Number(t.id), t));
    allVisibleSelectedTests.forEach((t) => lookup.set(Number(t.id), t));

    // Recent items first (that are still selected)
    const recentItems: TestProps[] = [];
    for (const rid of recentlySelectedRef.current) {
      if (selectedIds.has(rid) && lookup.has(rid)) {
        recentItems.push(lookup.get(rid)!);
      }
    }

    // Then previously selected items (not in recent)
    const recentSet = new Set(recentItems.map((t) => Number(t.id)));
    const previousItems = allVisibleSelectedTests.filter(
      (t) => selectedIds.has(Number(t.id)) && !recentSet.has(Number(t.id))
    );

    return [...recentItems, ...previousItems];
  }, [formik.values.test_ids, allVisibleTests, allVisibleSelectedTests]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="h-full flex flex-col overflow-auto lg:overflow-hidden"
    >
      <PageHeader
        breadcrumb={[
          {
            title: t("menus.test_question_management.test.bundle_test.root"),
            icon: (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 4.85018V16.7402C22 17.7102 21.21 18.6002 20.24 18.7202L19.93 18.7602C18.29 18.9802 15.98 19.6602 14.12 20.4402C13.47 20.7102 12.75 20.2202 12.75 19.5102V5.60018C12.75 5.23018 12.96 4.89018 13.29 4.71018C15.12 3.72018 17.89 2.84018 19.77 2.68018H19.83C21.03 2.68018 22 3.65018 22 4.85018Z"
                  fill="#1D82F5"
                />
                <path
                  d="M10.7102 4.71018C8.88023 3.72018 6.11023 2.84018 4.23023 2.68018H4.16023C2.96023 2.68018 1.99023 3.65018 1.99023 4.85018V16.7402C1.99023 17.7102 2.78023 18.6002 3.75023 18.7202L4.06023 18.7602C5.70023 18.9802 8.01023 19.6602 9.87023 20.4402C10.5202 20.7102 11.2402 20.2202 11.2402 19.5102V5.60018C11.2402 5.22018 11.0402 4.89018 10.7102 4.71018ZM5.00023 7.74018H7.25023C7.66023 7.74018 8.00023 8.08018 8.00023 8.49018C8.00023 8.91018 7.66023 9.24018 7.25023 9.24018H5.00023C4.59023 9.24018 4.25023 8.91018 4.25023 8.49018C4.25023 8.08018 4.59023 7.74018 5.00023 7.74018ZM8.00023 12.2402H5.00023C4.59023 12.2402 4.25023 11.9102 4.25023 11.4902C4.25023 11.0802 4.59023 10.7402 5.00023 10.7402H8.00023C8.41023 10.7402 8.75023 11.0802 8.75023 11.4902C8.75023 11.9102 8.41023 12.2402 8.00023 12.2402Z"
                  fill="#1D82F5"
                />
              </svg>
            ),
            url: PATH.SET.ROOT,
          },
          { title: id ? "Edit Bundle" : "Create Bundle" },
        ]}
      />

      <div className="form__Wrapper flex flex-col gap-4 lg:grid lg:grid-cols-2 h-full overflow-auto pr-4">
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
            <FormHelperText error sx={{ mt: 0.5 }}>
              {formik.errors.name}
            </FormHelperText>
          )}
        </div>

        <div className="input__field col-span-1 flex flex-col gap-4">
          <FileDragDrop
            required
            onFileChange={handleFileChange}
            initialFile={formik.values.thumbnail}
            initialPreview={formik.values.thumbnail_url}
            error={
              formik.touched.thumbnail && Boolean(formik.errors.thumbnail)
            }
            helperText={
              formik.touched.thumbnail && formik.errors.thumbnail
                ? String(formik.errors.thumbnail)
                : ""
            }
            label="Image/Thumbnail"
          />
          <div className="input__field">
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
              <FormHelperText error sx={{ mt: 0.5 }}>
                {formik.errors.price}
              </FormHelperText>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="input__field">
            <TextEditor
              label="Description"
              required
              value={formik.values.description}
              onChange={(value) => formik.setFieldValue("description", value)}
              onBlur={() => formik.setFieldTouched("description")}
            />
            {formik.touched.description && formik.errors.description && (
              <FormHelperText error sx={{ mt: 0.5 }}>
                {formik.errors.description}
              </FormHelperText>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="input_field">
            <InputLabel>Discount</InputLabel>
            <OutlinedInput
              fullWidth
              placeholder="Enter Discount"
              name="discount"
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

        <div className="col-span-1">
          <div className="input_field">
            <InputLabel>Discount Type</InputLabel>
            <Autocomplete
              options={[
                { label: "Percentage", value: "percentage" },
                { label: "Amount", value: "amount" },
              ]}
              value={
                formik.values.discount_type === "percentage"
                  ? { label: "Percentage", value: "percentage" }
                  : { label: "Amount", value: "amount" }
              }
              getOptionLabel={(option) => option.label}
              onChange={(_e, value) => {
                formik.setFieldValue(
                  "discount_type",
                  (value?.value as DiscountTypeProps) || "percentage"
                );
              }}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select discount type" />
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
            <FormHelperText error sx={{ mt: 0.5 }}>
              {formik.errors.set_count}
            </FormHelperText>
          )}
        </div>

        {/* ── Add Sets Section ──────────────────────────────────────────────── */}
        <div className="col-span-2">
          <Typography variant="h5">Add Sets</Typography>
          <Divider className="mt-2! mb-6!" />

          <TableFilter
            search={search}
            setSearch={setSearch}
            categoryLayout
            customRange={customRange}
            setCustomRange={setCustomRange}
            setDays={setDays}
            handleResetFilter={handleResetFilter}
          />

          {formik.touched.test_ids && formik.errors.test_ids && (
            <FormHelperText error sx={{ mb: 1 }}>
              {formik.errors.test_ids as string}
            </FormHelperText>
          )}

          <div className="lg:grid lg:grid-cols-12 flex flex-col gap-4">
            {/* ── Left: All Tests (infinite scroll) ────────────────────────── */}
            <div className="col-span-9">
              <Box
                id="video__listing__wrapper"
                sx={{
                  height: "600px",
                  overflowY: "auto",
                  pr: 1,
                }}
              >
                {loadingTests && qp.pageIndex === 1 ? (
                  <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 2xl:gap-6">
                    {[...Array(6)].map((_, idx) => (
                      <VideoSkeleton key={idx} />
                    ))}
                  </div>
                ) : !loadingTests && allVisibleTests.length === 0 ? (
                  <EmptyRoute
                    title="Test Not Found"
                    message="Oops your test is empty. Please add question to help student gain knowledge."
                  />
                ) : (
                  <InfiniteScroll
                    dataLength={allVisibleTests.length}
                    next={fetchMoreTest}
                    hasMore={hasMore}
                    scrollableTarget="video__listing__wrapper"
                    loader={
                      <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 lg:gap-6 mt-4 lg:mt-6">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <VideoSkeleton key={idx} />
                        ))}
                      </div>
                    }
                    endMessage={
                      <p className="text-center text-gray-400 text-sm py-4">
                        All tests loaded
                      </p>
                    }
                  >
                    <div className="flex flex-col gap-4 md:grid grid-cols-2 xl:grid-cols-3 2xl:gap-6">
                      {allVisibleTests.map((test) => (
                        <div className="flex gap-3 items-center" key={test.id}>
                          <Checkbox
                            color="primary"
                            checked={formik.values.test_ids.includes(
                              Number(test.id)
                            )}
                            onChange={() => handleToggleItem(Number(test.id))}
                          />
                          <div
                            onClick={() => handleToggleItem(Number(test.id))}
                            className="cursor-pointer flex-1"
                          >
                            <TestCard test={test} showActions={false} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                )}
              </Box>
            </div>

            {/* ── Right: Selected Tests Panel ───────────────────────────────── */}
            <div className="col-span-3">
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                  height: "600px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    Selected Tests
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formik.values.test_ids.length} selected
                  </Typography>
                </Box>
                <Divider sx={{ mb: 1.5 }} />

                {loadingSelectedTest && selectedQp.pageIndex === 1 ? (
                  <div className="flex flex-col gap-3 overflow-auto flex-1">
                    {[...Array(4)].map((_, idx) => (
                      <SelectedTestSkeleton key={idx} />
                    ))}
                  </div>
                ) : selectedTestObjects.length === 0 ? (
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "text.disabled",
                      textAlign: "center",
                      px: 2,
                    }}
                  >
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ marginBottom: 8, opacity: 0.4 }}
                    >
                      <path
                        d="M9 11l3 3L22 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <Typography variant="body2">
                      No tests selected yet
                    </Typography>
                    <Typography variant="caption">
                      Check tests on the left to add them
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    id="selected__tests__wrapper"
                    sx={{ flex: 1, overflowY: "auto" }}
                  >
                    <InfiniteScroll
                      dataLength={selectedTestObjects.length}
                      next={fetchMoreSelectedTests}
                      hasMore={hasMoreSelected}
                      scrollableTarget="selected__tests__wrapper"
                      loader={
                        <div className="flex flex-col gap-3 mt-3">
                          {[...Array(2)].map((_, idx) => (
                            <SelectedTestSkeleton key={idx} />
                          ))}
                        </div>
                      }
                    >
                      <div className="flex flex-col gap-3">
                        {selectedTestObjects.map((test, index) => {
                          const isRecent =
                            recentlySelectedRef.current.includes(
                              Number(test.id)
                            );
                          return (
                            <Box
                              key={test.id}
                              sx={{
                                position: "relative",
                                borderRadius: 1.5,
                                border: "1px solid",
                                borderColor: isRecent
                                  ? "primary.light"
                                  : "divider",
                                bgcolor: isRecent
                                  ? "primary.50"
                                  : "background.paper",
                                overflow: "hidden",
                                transition: "border-color 0.2s",
                              }}
                            >
                              {isRecent && index === 0 && (
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: 4,
                                    right: 4,
                                    bgcolor: "primary.main",
                                    color: "white",
                                    borderRadius: 1,
                                    px: 0.75,
                                    py: 0.25,
                                    fontSize: "0.6rem",
                                    fontWeight: 700,
                                    lineHeight: 1.4,
                                    zIndex: 1,
                                  }}
                                >
                                  NEW
                                </Box>
                              )}
                              <Box
                                sx={{ cursor: "pointer" }}
                                onClick={() =>
                                  handleToggleItem(Number(test.id))
                                }
                              >
                                <TestCard test={test} showActions={false} />
                              </Box>
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  left: 4,
                                  zIndex: 1,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  handleToggleItem(Number(test.id))
                                }
                              >
                                <Cancel color="error" fontSize="medium" />
                              </Box>
                            </Box>
                          );
                        })}
                      </div>
                    </InfiniteScroll>
                  </Box>
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>

      <FooterAction
        handleConfirmationChange={() => navigate(PATH.SET.ROOT)}
        isLoading={isLoading}
        isUpdating={editing}
        isEditMode={!!id}
        replaceLabel={
          id
            ? isLoading || editing
              ? "Updating Bundle..."
              : "Update Bundle"
            : isLoading || editing
              ? "Creating Bundle..."
              : "Create Bundle"
        }
      />
    </form>
  );
}