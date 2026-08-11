import type { EbookProps } from "../types/ebook";

export const createEbookFormData = (values: EbookProps): FormData => {
    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("status", values.status);
    formData.append("is_downloadable", values.is_downloadable ? "1" : "0");
    formData.append("price", values.price);
    formData.append("discount", values.discount.toString());
    formData.append("discount_type", values.discount_type);

    if (values.thumbnail) {
        formData.append("thumbnail", values.thumbnail);
    } else if (values.thumbnail_url) {
        formData.append("thumbnail_url", values.thumbnail_url);
    }

    if (values.file) {
        formData.append("file", values.file);
    } else if (values.file_url) {
        formData.append("file_url", values.file_url);
    }

    values.selections.mega_category.forEach((id, index) => {
        formData.append(`selections[mega_category][${index}]`, id.toString());
    });

    Object.entries(values.selections.category).forEach(([megaId, categoryIds]) => {
        categoryIds.forEach((catId, index) => {
            formData.append(`selections[category][${megaId}][${index}]`, catId.toString());
        });
    });

    Object.entries(values.selections.sub_category).forEach(([catId, subCatIds]) => {
        subCatIds.forEach((subId, index) => {
            formData.append(`selections[sub_category][${catId}][${index}]`, subId.toString());
        });
    });

    values.selections.position_ids.forEach((id, index) => {
        formData.append(`selections[position_ids][${index}]`, id.toString());
    });

    return formData;
};
