import type { EbookProps } from "../types/ebook";

export interface EbookPricing {
    isFree: boolean;
    hasDiscount: boolean;
    markedPrice: number;
    salePrice: number;
}

export const getEbookPricing = (ebook: Pick<EbookProps, "price" | "discount" | "discount_type" | "marked_price" | "sale_price">): EbookPricing => {
    const markedPrice = Number(ebook.marked_price ?? ebook.price ?? 0) || 0;
    const discount = Number(ebook.discount ?? 0) || 0;

    if (markedPrice <= 0) {
        return { isFree: true, hasDiscount: false, markedPrice: 0, salePrice: 0 };
    }

    if (ebook.sale_price !== undefined && ebook.sale_price !== null && ebook.sale_price !== "") {
        const salePrice = Number(ebook.sale_price) || 0;
        return { isFree: false, hasDiscount: salePrice < markedPrice, markedPrice, salePrice };
    }

    const deduction = ebook.discount_type === "percentage" ? (markedPrice * discount) / 100 : discount;
    const salePrice = Math.max(0, markedPrice - deduction);

    return { isFree: false, hasDiscount: deduction > 0, markedPrice, salePrice };
};

export const formatNpr = (value: number) => `Rs. ${Number(value || 0).toLocaleString("en-IN")}`;
