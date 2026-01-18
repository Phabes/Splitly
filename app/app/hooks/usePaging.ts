import { useState } from "react";

export const usePaging = () => {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  return {
    page,
    setPage,
    isLoadingMore,
    setIsLoadingMore,
    hasMore,
    setHasMore,
  };
};

export default usePaging;
