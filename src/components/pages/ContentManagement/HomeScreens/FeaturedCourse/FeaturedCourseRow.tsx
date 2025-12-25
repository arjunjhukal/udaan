


export default function FeaturedCourseRow() {
    return (
        <div>FeaturedCourseRow</div>
    )
}

// export default function FeaturedCourseRow({ index, megaCategories, formik, remove }: Props) {

//     const [search, setSearch] = useState("");

//     const handleCourseSearch = (searchTerm: string) => {
//         setSearch(searchTerm);
//     };
//     const [qp, setQp] = useState({
//         pageIndex: 1,
//         pageSize: 10,
//     })
//     const [courseList, setCourseList] = useState<CourseProps[]>([]);
//     const { data: filteredCourses, isLoading } = useGetAllCourseQuery({
//         ...qp,
//         search
//     });
//     const courses = filteredCourses?.data?.data || []
//     useEffect(() => {
//         formik.setFieldValue(`featured[${index}].courses`, []);
//     }, [search]);

//     const coursePagination = filteredCourses?.data?.pagination;
//     const hasMoreCourses = calcHasMore(coursePagination);

//     const fetchMoreCourses = () => {
//         if (hasMoreCourses) {
//             setQp(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
//         }
//     };
//     useEffect(() => {
//         if (!courses) return;

//         setCourseList(prev => {
//             if (qp.pageIndex === 1) {
//                 return courses;
//             }

//             return [...prev, ...courses];
//         });
//     }, [courses, qp.pageIndex]);
//     return (
//         <Box className="flex flex-col gap-4 md:grid md:grid-cols-12 lg:gap-6 mt-2">
//             {/* Megacategory Label */}
//             <div className="col-span-4 lg:col-span-3">
//                 <Box className="rounded-md p-2" sx={{ border: (theme) => `1px solid ${theme.palette.separator.dark}` }}>
//                     <Typography
//                         sx={{ background: (theme) => theme.palette.primary.light, color: (theme) => theme.palette.primary.main }}
//                         className="text-center py-2 px-4 rounded-md"
//                     >
//                         Megacategory
//                     </Typography>
//                     {
//                         megaCategories?.data?.map((mega) => (
//                             <FormControlLabel
//                                 sx={{ m: 0, p: .5, width: "100%" }}
//                                 control={
//                                     <Checkbox
//                                         checked={isSelected}
//                                         disabled={!isSelected && isMaxReached}
//                                         onChange={() => handleToggle(itemId)}
//                                     />
//                                 }
//                                 label={
//                                     <Box>
//                                         <Typography variant="subtitle1">{mega.name}</Typography>
//                                     </Box>
//                                 }
//                             />
//                         ))
//                     }
//                 </Box>
//             </div>

//             {/* Search & Courses */}
//             <div className="col-span-8 lg:col-span-9">
//                 <Box className="rounded-md p-2" sx={{ border: (theme) => `1px solid ${theme.palette.separator.dark}` }}>
//                     <div className="flex gap-4 items-center mb-2">
//                         <OutlinedInput
//                             fullWidth
//                             placeholder="Search courses..."
//                             value={search}
//                             onChange={(e) => handleCourseSearch(e.target.value)}
//                             startAdornment={<SearchIcon />}
//                             sx={{ gap: "8px", padding: "8px 12px" }}
//                         />
//                         <IconButton color="error" onClick={() => remove(index)}>
//                             <Trash size={20} />
//                         </IconButton>
//                     </div>

//                     <InfiniteScrolling
//                         key="notification-course-list"
//                         scrollableId="notification-course-scrollable"
//                         data={courseList || []}
//                         hasMore={hasMoreCourses}
//                         selectedItems={formik.values.course_ids || []}
//                         onSelectionChange={(selectedIds) => {
//                             formik.setFieldValue("course_ids", selectedIds);
//                             formik.setFieldTouched("course_ids", true);
//                         }}
//                         fetchMore={fetchMoreCourses}
//                         onSearch={handleCourseSearch}
//                         loading={isLoading}
//                         maxSelection={10}
//                         itemLabelKey="name"
//                         itemIdKey="id"
//                         placeholder="Search courses..."
//                     />

//                     {formik.touched.featured?.[index]?.courses && formik.errors.featured?.[index]?.courses && (
//                         <Typography color="error" variant="caption">
//                             {formik.errors.featured[index].courses}
//                         </Typography>
//                     )}
//                 </Box>
//             </div>
//         </Box>
//     );
// }
