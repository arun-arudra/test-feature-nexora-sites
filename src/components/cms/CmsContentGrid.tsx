"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { cmaFetch } from "@/lib/cms/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { localeString, type CmsEntry } from "@/lib/cms/types";

export function CmsContentGrid() {
  const router = useRouter();
  const [entries, setEntries] = useState<CmsEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("-sys.updatedAt");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const skip = currentPage * rowsPerPage;
      let path = `entries?content_type=news&order=${encodeURIComponent(sortField)}&skip=${skip}&limit=${rowsPerPage}`;
      if (search.trim()) {
        path += `&query=${encodeURIComponent(search.trim())}`;
      }
      const res = await cmaFetch(path);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Failed to load");
      }
      setEntries(data.items || []);
      setTotalEntries(data.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries");
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, rowsPerPage, sortField, search]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void fetchEntries();
    }, 280);
    return () => window.clearTimeout(t);
  }, [fetchEntries]);

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const entry = entries.find((e) => e.sys.id === deleteId);
      if (!entry) throw new Error("Entry not found");

      if (entry.sys.publishedVersion) {
        const unpub = await cmaFetch(`entries/${deleteId}/published`, {
          method: "DELETE",
          version: entry.sys.version,
        });
        if (!unpub.ok && unpub.status !== 404) {
          const d = await unpub.json().catch(() => ({}));
          throw new Error(
            (d as { message?: string }).message || "Unpublish failed",
          );
        }
        // refresh version after unpublish
        const fresh = await cmaFetch(`entries/${deleteId}`);
        const freshData = (await fresh.json()) as CmsEntry;
        const del = await cmaFetch(`entries/${deleteId}`, {
          method: "DELETE",
          version: freshData.sys?.version ?? entry.sys.version,
        });
        if (!del.ok) {
          const d = await del.json().catch(() => ({}));
          throw new Error(
            (d as { message?: string }).message || "Delete failed",
          );
        }
      } else {
        const del = await cmaFetch(`entries/${deleteId}`, {
          method: "DELETE",
          version: entry.sys.version,
        });
        if (!del.ok) {
          const d = await del.json().catch(() => ({}));
          throw new Error(
            (d as { message?: string }).message || "Delete failed",
          );
        }
      }
      setDeleteId(null);
      void fetchEntries();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleSort(field: string) {
    setSortField((prev) => (prev === field ? `-${field}` : field));
  }

  return (
    <div className="flex h-full flex-col rounded-[12px] border border-border bg-surface p-6 shadow-xl">
      <h2 className="font-heading text-xl text-white">Publishing Queue</h2>
      <div className="relative mt-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(0);
          }}
          placeholder="Search posts…"
          className="w-full rounded-[10px] border border-border bg-black py-2 pl-9 pr-3 text-sm text-white placeholder:text-muted"
        />
      </div>

      {error ? (
        <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-[10px] border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-black/60 text-muted">
            <tr className="border-b border-border">
              <th
                className="cursor-pointer px-3 py-3 font-medium hover:text-white"
                onClick={() => toggleSort("fields.title")}
              >
                Title <ArrowUpDown className="inline h-3 w-3" />
              </th>
              <th
                className="cursor-pointer px-3 py-3 font-medium hover:text-white"
                onClick={() => toggleSort("fields.category")}
              >
                Category <ArrowUpDown className="inline h-3 w-3" />
              </th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th
                className="cursor-pointer px-3 py-3 font-medium hover:text-white"
                onClick={() => toggleSort("sys.updatedAt")}
              >
                Updated <ArrowUpDown className="inline h-3 w-3" />
              </th>
              <th className="px-3 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-muted">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-muted">
                  No content found.
                </td>
              </tr>
            ) : (
              entries.map((entry) => {
                const isPublished = !!entry.sys.publishedVersion;
                const updated = entry.sys.updatedAt
                  ? new Date(entry.sys.updatedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "—";
                return (
                  <tr
                    key={entry.sys.id}
                    className="border-b border-border last:border-0 hover:bg-black/40"
                  >
                    <td className="px-3 py-3 font-medium text-white">
                      {localeString(entry.fields.title) || "Untitled"}
                    </td>
                    <td className="px-3 py-3 text-muted">
                      {localeString(entry.fields.category) || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${
                          isPublished
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : "border-amber-500/20 bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-muted">{updated}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() =>
                            router.push(cmsPath("review", entry.sys.id))
                          }
                          className="rounded-lg p-2 text-muted hover:bg-black hover:text-white"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => setDeleteId(entry.sys.id)}
                          className="rounded-lg p-2 text-red-400 hover:bg-red-950/40 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <label className="flex items-center gap-2">
          Rows:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(0);
            }}
            className="rounded-lg border border-border bg-black px-2 py-1 text-white"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-3">
          <span>
            {totalEntries === 0
              ? "0"
              : `${currentPage * rowsPerPage + 1}–${Math.min(
                  (currentPage + 1) * rowsPerPage,
                  totalEntries,
                )}`}{" "}
            of {totalEntries}
          </span>
          <div className="flex gap-1">
            <button
              type="button"
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="rounded-lg border border-border p-2 hover:bg-black disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={(currentPage + 1) * rowsPerPage >= totalEntries}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-lg border border-border p-2 hover:bg-black disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {deleteId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[12px] border border-border bg-surface p-6">
            <h3 className="font-heading text-lg text-white">Delete this post?</h3>
            <p className="mt-2 text-sm text-muted">
              This permanently removes it from Contentful. Cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-[10px] border border-border px-4 py-2 text-sm text-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center rounded-[10px] bg-red-900 px-4 py-2 text-sm text-red-100 hover:bg-red-800 disabled:opacity-60"
              >
                {isDeleting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
