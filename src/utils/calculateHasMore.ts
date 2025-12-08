export const calcHasMore = (pagination?: { current_page?: number; total_pages?: number }) => {
    if (!pagination?.current_page || !pagination?.total_pages) return false;
    return pagination.current_page < pagination.total_pages;
};