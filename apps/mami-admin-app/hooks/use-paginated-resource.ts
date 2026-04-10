import { useCallback, useEffect, useRef, useState } from 'react';

type LoadMode = 'replace' | 'append';

type UsePaginatedResourceParams<T> = {
  pageSize?: number;
  deps: readonly unknown[];
  loadPage: (page: number, pageSize: number) => Promise<{ items: T[]; total: number }>;
};

export function usePaginatedResource<T>({
  pageSize = 20,
  deps,
  loadPage,
}: UsePaginatedResourceParams<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const loadPageRef = useRef(loadPage);

  const hasMore = items.length < total;

  useEffect(() => {
    loadPageRef.current = loadPage;
  }, [loadPage]);

  const load = useCallback(
    async (nextPage = 1, mode: LoadMode = 'replace') => {
      try {
        if (mode === 'replace') {
          if (!refreshing) {
            setLoading(true);
          }
          setError('');
        } else {
          setLoadingMore(true);
        }

        const result = await loadPageRef.current(nextPage, pageSize);
        setItems((current) => (mode === 'append' ? [...current, ...result.items] : result.items));
        setTotal(result.total);
        setPage(nextPage);
      } catch (nextError) {
        if (mode === 'replace') {
          setItems([]);
          setTotal(0);
          setPage(1);
          setError(nextError instanceof Error ? nextError.message : 'Gagal memuat data.');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [pageSize, refreshing]
  );

  useEffect(() => {
    void load(1, 'replace');
  }, [pageSize, ...deps]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await load(1, 'replace');
  }, [load]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || !hasMore || error) {
      return;
    }

    void load(page + 1, 'append');
  }, [error, hasMore, load, loading, loadingMore, page]);

  return {
    items,
    total,
    page,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}
