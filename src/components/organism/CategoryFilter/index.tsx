import {
    Box,
    Checkbox,
    Divider,
    FormControlLabel,
    InputLabel,
    Skeleton,
    Typography,
    useTheme,
} from "@mui/material";
import type { CategoryProps } from "../../../types/category";
import type { SelectionType } from "../../../types/course";
import type { positionProps } from "../../../types/position";

interface Props {
    megaCategories: CategoryProps[];
    categories: CategoryProps[];
    subCategories: CategoryProps[];
    positions?: positionProps[];
    selections: SelectionType;
    onChange: (
        type: "mega" | "category" | "sub" | "position",
        ids: number[],
        parentId?: number
    ) => void;
    loadingMegaCategory?: boolean;
}

const toggleArray = (arr: number[], id: number) =>
    arr.includes(id) ? arr.filter((sid) => sid !== id) : [...arr, id];

export default function CategoryFilter({
    megaCategories = [],
    categories = [],
    subCategories = [],
    positions = [],
    selections,
    onChange,
    loadingMegaCategory,
}: Props) {
    const theme = useTheme();

    return (
        <div className="input__field flex flex-col">
            <InputLabel className="required">Category</InputLabel>
            <div className=" flex gap-3 h-full">
                {/* Mega Categories */}
                {megaCategories ? <Box
                    sx={{
                        border: `1px solid ${theme.palette.seperator.dark}`,
                        borderRadius: "8px",
                        padding: "8px",
                    }}
                    className="w-full"
                >
                    <Typography
                        variant="caption"
                        color="primary.main"
                        className="w-full text-center block mb-2.5!"
                        sx={{
                            padding: "8px 24px",
                            background: theme.palette.primary.light,
                            borderRadius: "8px",
                        }}
                    >
                        Mega-Categories
                    </Typography>
                    <div className="item__listing min-h-[120px]">
                        {loadingMegaCategory
                            ? Array.from({ length: 4 }).map((_, i) => (
                                <Box
                                    key={i.toString()}
                                    sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}
                                >
                                    <Skeleton variant="rectangular" width={20} height={20} />
                                    <Skeleton variant="text" width="80%" />
                                </Box>
                            ))
                            : megaCategories.map((item) => (
                                <FormControlLabel
                                    key={item.id}
                                    control={
                                        <Checkbox
                                            color="primary"
                                            checked={selections.mega_category.includes(Number(item.id))}
                                            onChange={() =>
                                                onChange(
                                                    "mega",
                                                    toggleArray(selections.mega_category, Number(item.id))
                                                )
                                            }
                                        />
                                    }
                                    label={item.name}
                                />
                            ))}
                    </div>
                </Box> : ""
                }
                {/* Categories, grouped by mega categories */}
                {categories ? <Box
                    sx={{
                        border: `1px solid ${theme.palette.seperator.dark}`,
                        borderRadius: "8px",
                        padding: "8px",
                    }}
                    className="w-full"
                >
                    <Typography
                        variant="caption"
                        color="success.main"
                        className="w-full text-center block mb-2.5!"
                        sx={{
                            padding: "8px 24px",
                            background: theme.palette.success.light,
                            borderRadius: "8px",
                        }}
                    >
                        Categories
                    </Typography>
                    <div className="item__listing min-h-[120px]">
                        {categories.length === 0 ? (
                            <div className="text-center">
                                {/* Empty state */}
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto mb-1.5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.66658 1.3335C2.82564 1.3335 1.33325 2.82588 1.33325 4.66683V11.3335C1.33325 13.1744 2.82564 14.6668 4.66658 14.6668H11.3333C13.1742 14.6668 14.6666 13.1744 14.6666 11.3335V4.66683C14.6666 2.82588 13.1742 1.3335 11.3333 1.3335H4.66658ZM7.90992 10.1635L11.0766 6.99683C11.3033 6.77016 11.3033 6.4035 11.0766 6.17016C10.8499 5.9435 10.4766 5.9435 10.2499 6.17016L7.49658 8.9235L6.32992 7.75683C6.10325 7.53016 5.72992 7.53016 5.50325 7.75683C5.27658 7.9835 5.27658 8.35016 5.50325 8.5835L7.08992 10.1635C7.20325 10.2768 7.34992 10.3302 7.49658 10.3302C7.64992 10.3302 7.79658 10.2768 7.90992 10.1635Z"
                                        fill="#059467"
                                    />
                                </svg>
                                <p
                                    className="text-center"
                                    style={{
                                        fontWeight: 400,
                                        fontSize: "12px",
                                        lineHeight: "16.2px",
                                    }}
                                >
                                    Please Select Megacategories to get Categories
                                </p>
                            </div>
                        ) : (
                            categories.map((megaCategory) => (
                                <div className="category__item" key={megaCategory.id}>
                                    <Typography
                                        variant="caption"
                                        color="text.dark"
                                        className="px-2 py-0.5"
                                    >
                                        {megaCategory.name}
                                    </Typography>
                                    <Divider className="mb-1.5!" />
                                    {megaCategory.sub_category?.length
                                        ? megaCategory.sub_category.map((cat) => {
                                            const selectedCategory = selections.category[Number(megaCategory.id)] || [];
                                            return (
                                                <FormControlLabel
                                                    key={cat.id}
                                                    control={
                                                        <Checkbox
                                                            sx={{ color: theme.palette.success.main }}
                                                            checked={selectedCategory.includes(Number(cat.id))}
                                                            onChange={() =>
                                                                onChange(
                                                                    "category",
                                                                    toggleArray(selectedCategory, Number(cat.id)),
                                                                    Number(megaCategory.id)
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={cat.name}
                                                />
                                            );
                                        })
                                        : null}
                                </div>
                            ))
                        )}
                    </div>
                </Box> : ""}

                {/* Sub Categories */}
                {subCategories ? <Box
                    sx={{
                        border: `1px solid ${theme.palette.seperator.dark}`,
                        borderRadius: "8px",
                        padding: "8px",
                    }}
                    className="w-full"
                >
                    <Typography
                        variant="caption"
                        color="warning.main"
                        className="w-full text-center block mb-2.5!"
                        sx={{
                            padding: "8px 24px",
                            background: theme.palette.warning.light,
                            borderRadius: "8px",
                        }}
                    >
                        Sub- Categories
                    </Typography>
                    <div className="item__listing min-h-[120px]">
                        {subCategories.length === 0 ? (
                            <div>
                                {/* Empty state */}
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mx-auto mb-1.5"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.66658 1.3335C2.82564 1.3335 1.33325 2.82588 1.33325 4.66683V11.3335C1.33325 13.1744 2.82564 14.6668 4.66658 14.6668H11.3333C13.1742 14.6668 14.6666 13.1744 14.6666 11.3335V4.66683C14.6666 2.82588 13.1742 1.3335 11.3333 1.3335H4.66658ZM7.90992 10.1635L11.0766 6.99683C11.3033 6.77016 11.3033 6.4035 11.0766 6.17016C10.8499 5.9435 10.4766 5.9435 10.2499 6.17016L7.49658 8.9235L6.32992 7.75683C6.10325 7.53016 5.72992 7.53016 5.50325 7.75683C5.27658 7.9835 5.27658 8.35016 5.50325 8.5835L7.08992 10.1635C7.20325 10.2768 7.34992 10.3302 7.49658 10.3302C7.64992 10.3302 7.79658 10.2768 7.90992 10.1635Z"
                                        fill="#F97415"
                                    />
                                </svg>
                                <p
                                    className="text-center"
                                    style={{
                                        fontWeight: 400,
                                        fontSize: "12px",
                                        lineHeight: "16.2px",
                                    }}
                                >
                                    Please Select Category to get Categories
                                </p>
                            </div>
                        ) : (
                            subCategories.map((cat) => (
                                <div className="category__item" key={cat.id}>
                                    <Typography
                                        variant="caption"
                                        color="text.dark"
                                        className="px-2 py-0.5"
                                    >
                                        {cat.name}
                                    </Typography>
                                    <Divider className="mb-1.5!" />
                                    {cat.sub_category?.length
                                        ? cat.sub_category.map((subCat) => {
                                            const selectedSubCategory = selections.sub_category[Number(cat.id)] || [];
                                            return (
                                                <FormControlLabel
                                                    key={subCat.id}
                                                    control={
                                                        <Checkbox
                                                            sx={{ color: theme.palette.warning.main }}
                                                            checked={selectedSubCategory.includes(Number(subCat.id))}
                                                            onChange={() =>
                                                                onChange(
                                                                    "sub",
                                                                    toggleArray(selectedSubCategory, Number(subCat.id)),
                                                                    Number(cat.id)
                                                                )
                                                            }
                                                        />
                                                    }
                                                    label={subCat.name}
                                                />
                                            );
                                        })
                                        : null}
                                </div>
                            ))
                        )}
                    </div>
                </Box> : ""
                }
                {/* Level (positions) */}
                {positions.length > 0 ? <Box
                    sx={{
                        border: `1px solid ${theme.palette.seperator.dark}`,
                        borderRadius: "8px",
                        padding: "8px",
                    }}
                    className="w-full"
                >
                    <Typography
                        variant="caption"
                        color="error.main"
                        className="w-full text-center block mb-2.5!"
                        sx={{
                            padding: "8px 24px",
                            background: theme.palette.error.light,
                            borderRadius: "8px",
                        }}
                    >
                        Level
                    </Typography>
                    <div className="item__listing min-h-[120px]">
                        {positions.map((item) => (
                            <FormControlLabel
                                key={item.id}
                                control={
                                    <Checkbox
                                        color="primary"
                                        checked={selections.position_ids.includes(Number(item.id))}
                                        onChange={() =>
                                            onChange(
                                                "position",
                                                toggleArray(selections.position_ids, Number(item.id))
                                            )
                                        }
                                    />
                                }
                                label={item.name}
                            />
                        ))}
                    </div>
                </Box> : ""}
            </div>
        </div>
    );
}
