import { useState, useMemo, useEffect } from 'react';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function DataTable({ columns, data, searchable = true, pageSize: defaultPageSize = 10 }) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filtered = useMemo(() => {
    const dataArray = Array.isArray(data) ? data : [];
    if (!search) return dataArray;
    const lower = search.toLowerCase();
    return dataArray.filter(row =>
      columns.some(col => {
        const val = col.accessor ? (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor]) : '';
        return String(val ?? '').toLowerCase().includes(lower);
      })
    );
  }, [data, search, columns]);

  const sorted = useMemo(() => {
    const arr = Array.isArray(filtered) ? filtered : [];
    if (!sortKey) return arr;
    const col = columns.find(c => c.key === sortKey);
    if (!col) return arr;
    return [...arr].sort((a, b) => {
      const aVal = typeof col.accessor === 'function' ? col.accessor(a) : a[col.accessor];
      const bVal = typeof col.accessor === 'function' ? col.accessor(b) : b[col.accessor];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil((sorted?.length || 0) / pageSize));
  const paginated = Array.isArray(sorted) ? sorted.slice((page - 1) * pageSize, page * pageSize) : [];

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {searchable && (
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full max-w-sm px-4 py-2.5 border border-green-400 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        )}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>Show</span>
          <select
            value={pageSize}
            onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="px-2 py-1.5 border border-green-400 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            {PAGE_SIZE_OPTIONS.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entries</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-green-200 dark:divide-gray-800">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 select-none' : ''}`}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-green-500 dark:text-green-400">{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                    {col.sortable !== false && sortKey !== col.key && (
                      <span className="text-gray-400 dark:text-gray-500">⇅</span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-green-200 dark:divide-gray-800">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  No data found.
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row.id ?? i} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                      {col.render ? col.render(row) : (typeof col.accessor === 'function' ? col.accessor(row) : row[col.accessor])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {sorted && sorted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length} entries
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="px-2.5 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-green-400 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
              title="First page"
            >
              &laquo;
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-green-400 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              &lsaquo;
            </button>
            {getPageNumbers().map((p, i) =>
              p === '...' ? (
                <span key={`ellip-${i}`} className="px-2 py-1.5 text-sm text-gray-400 dark:text-gray-500">&hellip;</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    page === p
                      ? 'bg-green-500 text-white font-medium'
                      : 'border border-green-400 dark:border-gray-700 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-green-400 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              &rsaquo;
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="px-2.5 py-1.5 text-sm text-gray-700 dark:text-gray-300 border border-green-400 dark:border-gray-700 rounded-lg disabled:opacity-40 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
              title="Last page"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}






