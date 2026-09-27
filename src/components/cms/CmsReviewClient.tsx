"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  Moon,
  Save,
  Send,
  Sun,
  Trash2,
  X,
} from "lucide-react";
import { cmaFetch } from "@/lib/cms/client";
import { cmsPath } from "@/lib/cms/admin-path";
import { markdownToHtml } from "@/lib/cms/markdown";
import {
  assetLink,
  localeString,
  type CmsAsset,
  type CmsEntry,
} from "@/lib/cms/types";
import {
  CmsImageUploader,
  useAssetUrl,
} from "@/components/cms/CmsImageUploader";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Props = { entryId: string };

export function CmsReviewClient({ entryId }: Props) {
  const router = useRouter();
  const isNew = entryId === "new";

  const [entry, setEntry] = useState<CmsEntry | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [title, setTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState("0 min read");
  const [coverAssetId, setCoverAssetId] = useState<string | null>(null);
  const imageUrl = useAssetUrl(coverAssetId);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isDiscarding, setIsDiscarding] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [banner, setBanner] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);
  const [editorTheme, setEditorTheme] = useState<"dark" | "light">("dark");
  const [mediaOpen, setMediaOpen] = useState(false);
  const [assets, setAssets] = useState<CmsAsset[]>([]);

  const calculateStats = useCallback((html: string) => {
    const plain = html.replace(/<[^>]*>?/gm, "");
    const words = plain.trim().split(/\s+/).filter((w) => w.length > 0).length;
    setWordCount(words);
    setReadTime(`${Math.max(0, Math.ceil(words / 200))} min read`);
  }, []);

  const hydrateFromEntry = useCallback(
    (data: CmsEntry) => {
      setEntry(data);
      const f = data.fields;
      setTitle(localeString(f.title));
      setSlug(localeString(f.slug));
      const rawBody = localeString(f.body);
      const bodyHtml = markdownToHtml(rawBody);
      setBody(bodyHtml);
      calculateStats(bodyHtml);
      setCategory(localeString(f.category));
      const tagsVal = f.tags as { "en-US"?: string[] } | undefined;
      const tagList = tagsVal?.["en-US"];
      setTags(Array.isArray(tagList) ? tagList.join(", ") : "");
      setExcerpt(localeString(f.excerpt));
      setSeoTitle(localeString(f.seoTitle));
      setSeoDescription(localeString(f.seoDescription));
      setFocusKeyword(localeString(f.focusKeyword));
      const cover =
        (f.coverImage as { "en-US"?: { sys?: { id?: string } } })?.["en-US"]
          ?.sys?.id ||
        (f.image as { "en-US"?: { sys?: { id?: string } } })?.["en-US"]?.sys
          ?.id ||
        null;
      setCoverAssetId(cover);
    },
    [calculateStats],
  );

  useEffect(() => {
    if (isNew) {
      setTitle("New Blank Post");
      setSlug(`draft-${Date.now()}`);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await cmaFetch(`entries/${entryId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load entry");
        if (!cancelled) hydrateFromEntry(data as CmsEntry);
      } catch (err) {
        if (!cancelled) {
          setBanner({
            ok: false,
            text: err instanceof Error ? err.message : "Load failed",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [entryId, hydrateFromEntry, isNew]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) titleInputRef.current.focus();
  }, [isEditingTitle]);

  const fetchAssets = async () => {
    const res = await cmaFetch("assets?order=-sys.createdAt&limit=40");
    const data = await res.json();
    setAssets(data.items || []);
  };

  const getAssetUrlById = async (assetId: string) => {
    const res = await cmaFetch(`assets/${assetId}`);
    const data = await res.json();
    const raw = data?.fields?.file?.["en-US"]?.url as string | undefined;
    if (!raw) return "";
    return raw.startsWith("//") ? `https:${raw}` : raw;
  };

  const insertImageIntoEditor = async (assetId: string) => {
    const url = await getAssetUrlById(assetId);
    if (!url) return;
    setBody((prev) => {
      const next = `${prev}<p><img src="${url}" alt="" /></p>`;
      calculateStats(next);
      return next;
    });
    setMediaOpen(false);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: () => {
            void fetchAssets();
            setMediaOpen(true);
          },
        },
      },
    }),
    [],
  );

  function prepareFields() {
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const fields: Record<string, unknown> = {
      title: { "en-US": title || "Untitled" },
      slug: { "en-US": slug || `untitled-${Date.now()}` },
      body: { "en-US": body },
      category: { "en-US": category || "Uncategorized" },
      excerpt: { "en-US": excerpt },
      seoTitle: { "en-US": seoTitle },
      seoDescription: { "en-US": seoDescription || excerpt },
      focusKeyword: { "en-US": focusKeyword },
      wordCount: { "en-US": wordCount },
      readTime: { "en-US": readTime },
      featured: {
        "en-US":
          (entry?.fields?.featured as { "en-US"?: boolean })?.["en-US"] ??
          false,
      },
      publishedDate: {
        "en-US":
          localeString(entry?.fields?.publishedDate) ||
          new Date().toISOString(),
      },
    };
    if (tagArray.length) fields.tags = { "en-US": tagArray };
    if (coverAssetId) {
      fields.coverImage = { "en-US": assetLink(coverAssetId) };
    } else if (entry?.fields?.coverImage) {
      fields.coverImage = entry.fields.coverImage;
    }
    if (entry?.fields?.image) fields.image = entry.fields.image;
    return fields;
  }

  function handleApiErrors(data: {
    details?: { errors?: { path?: string[]; details?: string; name?: string }[] };
    message?: string;
  }) {
    if (data.details?.errors) {
      const next: Record<string, string> = {};
      for (const err of data.details.errors) {
        const field = err.path?.[1] || "general";
        next[field] = err.details || err.name || "Invalid";
      }
      setFieldErrors(next);
      setBanner({
        ok: false,
        text: "Validation failed — check highlighted fields.",
      });
    } else {
      setBanner({
        ok: false,
        text: data.message || "Action could not be executed.",
      });
    }
  }

  async function saveEntry(publishAfter: boolean) {
    setIsProcessing(true);
    setFieldErrors({});
    setBanner(null);
    try {
      const fields = prepareFields();
      let currentVersion = entry?.sys?.version || 1;
      let id = entry?.sys?.id;

      if (isNew && !id) {
        const createRes = await cmaFetch("entries", {
          method: "POST",
          contentTypeId: "news",
          body: JSON.stringify({ fields }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          handleApiErrors(createData);
          return;
        }
        id = createData.sys.id;
        currentVersion = createData.sys.version;
        setEntry(createData);
        router.replace(cmsPath("review", id!));
      } else {
        const updateRes = await cmaFetch(`entries/${id}`, {
          method: "PUT",
          version: currentVersion,
          body: JSON.stringify({ fields }),
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) {
          handleApiErrors(updateData);
          return;
        }
        currentVersion = updateData.sys.version;
        setEntry(updateData);
      }

      if (publishAfter && id) {
        if (coverAssetId) {
          try {
            const assetRes = await cmaFetch(`assets/${coverAssetId}`);
            const assetData = await assetRes.json();
            await cmaFetch(`assets/${coverAssetId}/published`, {
              method: "PUT",
              version: assetData.sys.version,
            });
          } catch {
            /* continue */
          }
        }
        const publishRes = await cmaFetch(`entries/${id}/published`, {
          method: "PUT",
          version: currentVersion,
        });
        if (!publishRes.ok) {
          handleApiErrors(await publishRes.json());
          return;
        }
        setBanner({ ok: true, text: "Published — post is live in Contentful." });
        router.push(cmsPath());
        return;
      }
      setBanner({ ok: true, text: "Draft saved." });
    } catch (err) {
      setBanner({
        ok: false,
        text: err instanceof Error ? err.message : "Save failed",
      });
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleDiscard() {
    if (isNew && !entry?.sys?.id) {
      router.push(cmsPath());
      return;
    }
    setIsDiscarding(true);
    try {
      const id = entry!.sys.id;
      let version = entry!.sys.version;
      if (entry!.sys.publishedVersion) {
        await cmaFetch(`entries/${id}/published`, {
          method: "DELETE",
          version,
        });
        const fresh = await cmaFetch(`entries/${id}`);
        const freshData = (await fresh.json()) as CmsEntry;
        version = freshData.sys.version;
      }
      const del = await cmaFetch(`entries/${id}`, {
        method: "DELETE",
        version,
      });
      if (!del.ok) throw new Error("Failed to delete");
      router.push(cmsPath());
    } catch (err) {
      setBanner({
        ok: false,
        text: err instanceof Error ? err.message : "Discard failed",
      });
    } finally {
      setIsDiscarding(false);
      setConfirmDiscard(false);
    }
  }

  const fieldClass = (name: string) =>
    `mt-1 w-full rounded-[10px] border bg-black px-3 py-2 text-sm text-white placeholder:text-muted ${
      fieldErrors[name]
        ? "border-red-500 ring-1 ring-red-500"
        : "border-border"
    }`;

  const isPublished = !!entry?.sys?.publishedVersion;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative pb-12 text-white">
      {mediaOpen ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6 backdrop-blur-sm">
          <div className="flex h-[80vh] w-full max-w-5xl flex-col rounded-[12px] border border-border bg-surface shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-heading text-xl">Media Library</h2>
              <button
                type="button"
                onClick={() => setMediaOpen(false)}
                className="text-muted hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex flex-1 flex-col gap-8 overflow-hidden p-6">
              <div className="max-w-md space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Upload new
                </h3>
                <CmsImageUploader
                  label="Upload image"
                  onUploadComplete={async (id) => {
                    await insertImageIntoEditor(id);
                  }}
                />
              </div>
              <div className="h-px w-full bg-border" />
              <div className="flex flex-1 flex-col space-y-3 overflow-hidden">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Existing media
                </h3>
                <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-6 md:grid-cols-4 lg:grid-cols-5">
                  {assets.map((asset) => {
                    const raw = asset.fields?.file?.["en-US"]?.url;
                    if (!raw) return null;
                    const url = raw.startsWith("//") ? `https:${raw}` : raw;
                    return (
                      <button
                        key={asset.sys.id}
                        type="button"
                        onClick={() => void insertImageIntoEditor(asset.sys.id)}
                        className="aspect-square overflow-hidden rounded-[10px] border border-border bg-black transition hover:border-primary"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                  {assets.length === 0 ? (
                    <p className="col-span-full text-sm text-muted">
                      No assets yet — upload one above.
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {confirmDiscard ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-[12px] border border-border bg-surface p-6">
            <h3 className="font-heading text-lg">Discard this post?</h3>
            <p className="mt-2 text-sm text-muted">
              Permanently deletes it from Contentful.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDiscard(false)}
                className="rounded-[10px] border border-border px-4 py-2 text-sm text-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDiscarding}
                onClick={handleDiscard}
                className="inline-flex items-center rounded-[10px] bg-red-900 px-4 py-2 text-sm text-red-100"
              >
                {isDiscarding ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Confirm discard
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-border bg-surface/80 px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Link
            href={cmsPath()}
            className="shrink-0 rounded-lg p-2 text-muted hover:bg-black hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
              className="h-9 w-full max-w-2xl rounded-[10px] border border-border bg-black px-3 text-lg font-bold text-white"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="truncate rounded-md px-2 py-1 text-left text-lg font-bold hover:bg-black/50"
            >
              {title || "Untitled Post"}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isPublished ? (
            <>
              <button
                type="button"
                disabled={isProcessing || isDiscarding}
                onClick={() => setConfirmDiscard(true)}
                className="hidden items-center rounded-[10px] px-3 py-2 text-sm text-red-400 hover:bg-red-950/40 sm:inline-flex"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Discard
              </button>
              <button
                type="button"
                disabled={isProcessing || isDiscarding}
                onClick={() => void saveEntry(false)}
                className="inline-flex items-center rounded-[10px] border border-border bg-black px-3 py-2 text-sm text-white hover:border-primary/40"
              >
                {isProcessing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Draft
              </button>
            </>
          ) : null}
          <button
            type="button"
            disabled={isProcessing || isDiscarding}
            onClick={() => void saveEntry(true)}
            className="inline-flex items-center rounded-[10px] bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover"
          >
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Publish
          </button>
        </div>
      </div>

      <div>
        {banner ? (
          <p
            className={`mb-6 rounded-lg border px-3 py-2 text-sm ${
              banner.ok
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {banner.text}
          </p>
        ) : null}

        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs ${
              isPublished
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/20 bg-amber-500/10 text-amber-400"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
          <span className="font-mono text-sm text-muted">{wordCount} words</span>
          <span className="text-muted">·</span>
          <span className="font-mono text-sm text-muted">{readTime}</span>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            <div className="flex items-end justify-between">
              <label className="text-base font-semibold text-white">
                Body Content
              </label>
              <span
                className={`text-xs ${
                  body.replace(/<[^>]*>?/gm, "").length > 50000
                    ? "text-red-500"
                    : "text-muted"
                }`}
              >
                {body.replace(/<[^>]*>?/gm, "").length} / 50000
              </span>
            </div>
            <div
              className={`cms-quill relative overflow-hidden rounded-[12px] border border-border ${
                editorTheme === "dark" ? "cms-quill-dark" : "cms-quill-light"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  setEditorTheme((t) => (t === "dark" ? "light" : "dark"))
                }
                className="absolute right-3 top-2 z-10 rounded-md p-1.5 text-muted hover:bg-black hover:text-white"
                title="Toggle editor theme"
              >
                {editorTheme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <ReactQuill
                theme="snow"
                value={body}
                onChange={(html) => {
                  setBody(html);
                  calculateStats(html);
                }}
                modules={modules}
              />
            </div>
            {fieldErrors.body ? (
              <p className="text-xs text-red-400">{fieldErrors.body}</p>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-base font-semibold">Cover Image</label>
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[12px] border border-border bg-black">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Cover"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-muted">
                    <ImageIcon className="mb-2 h-8 w-8" />
                    <span className="text-sm">No cover yet</span>
                  </div>
                )}
              </div>
              <CmsImageUploader
                onUploadComplete={(id) => setCoverAssetId(id)}
              />
            </div>

            <div className="space-y-4 rounded-[12px] border border-border bg-surface p-5">
              <h3 className="text-lg font-semibold">Taxonomy</h3>
              <label className="block text-xs uppercase tracking-wider text-muted">
                URL slug
                <input
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, ""),
                    )
                  }
                  className={fieldClass("slug")}
                />
                {fieldErrors.slug ? (
                  <p className="mt-1 text-xs text-red-400">{fieldErrors.slug}</p>
                ) : null}
              </label>
              <label className="block text-xs uppercase tracking-wider text-muted">
                Category
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={fieldClass("category")}
                />
              </label>
              <label className="block text-xs uppercase tracking-wider text-muted">
                Tags (comma separated)
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className={fieldClass("tags")}
                />
              </label>
            </div>

            <div className="space-y-4 rounded-[12px] border border-border bg-surface p-5">
              <h3 className="text-lg font-semibold">Search Optimization</h3>
              <label className="block text-xs uppercase tracking-wider text-muted">
                SEO title
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className={fieldClass("seoTitle")}
                />
              </label>
              <label className="block text-xs uppercase tracking-wider text-muted">
                Focus keyword
                <input
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className={fieldClass("focusKeyword")}
                />
              </label>
              <label className="block text-xs uppercase tracking-wider text-muted">
                Excerpt / meta description
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={4}
                  className={`${fieldClass("excerpt")} resize-none`}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
