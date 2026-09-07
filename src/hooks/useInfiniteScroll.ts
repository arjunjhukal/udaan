import { useEffect, useRef } from "react";

/**
 * Returns a ref for a sentinel element rendered at the end of a list. The
 * sentinel is observed against the viewport rather than a named scroll
 * container, so it keeps working regardless of which ancestor actually scrolls.
 */
export function useInfiniteScroll(onLoadMore: () => void, enabled: boolean) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const onLoadMoreRef = useRef(onLoadMore);

    useEffect(() => {
        onLoadMoreRef.current = onLoadMore;
    }, [onLoadMore]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || !enabled) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) onLoadMoreRef.current();
            },
            { rootMargin: "120px" }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [enabled]);

    return sentinelRef;
}
