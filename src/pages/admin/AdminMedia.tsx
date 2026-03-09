import { useEffect, useState } from "react";
import { api, assetUrl, type MediaItem } from "../../Api/client";
import AddMediaModal from "./AddMediaModal";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Loader2,
  Inbox,
  Pencil,
  Trash2,
  Eye,
  Image,
  Video,
  Play,
} from "lucide-react";

function fetchList(setList: (v: MediaItem[]) => void) {
  api<MediaItem[]>("/api/media/admin/list")
    .then(setList)
    .catch(() => {});
}

function getThumbnailUrl(m: MediaItem): string | null {
  if (m.thumbnailUrl) return assetUrl(m.thumbnailUrl);
  if (m.youtubeId) return `https://img.youtube.com/vi/${m.youtubeId}/mqdefault.jpg`;
  return null;
}

function getViewUrl(m: MediaItem): string | null {
  if (m.youtubeId) return `https://www.youtube.com/watch?v=${m.youtubeId}`;
  if (m.fileUrl) return assetUrl(m.fileUrl);
  return null;
}

export default function AdminMedia() {
  const [list, setList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [deletingMedia, setDeletingMedia] = useState<MediaItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    const m = deletingMedia;
    if (!m) return;
    setDeleteLoading(true);
    try {
      await api<unknown>(`/api/media/${m.id}`, { method: "DELETE" });
      setDeletingMedia(null);
      refreshList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    api<MediaItem[]>("/api/media/admin/list")
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const refreshList = () => fetchList(setList);

  const filtered = list.filter(
    (m) =>
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.type.toLowerCase().includes(search.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(search.toLowerCase())) ||
      (m.date && m.date.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className="text-gray-400">Loading media…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-6 text-red-400">
        <p className="font-medium">Couldn&apos;t load media</p>
        <p className="text-sm mt-1 opacity-90">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-gray-100 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
            <Video className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">Media</h1>
            <p className="text-gray-400 -mt-1 text-sm">
              Manage photo and video gallery.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setEditingMedia(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4" />
            Add media
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by title, type or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-2 rounded bg-[#252945] border border-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition"
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="rounded bg-[#252945] border border-slate-700/50 border-dashed p-12 text-center">
          <div className="w-16 h-16 rounded bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            {list.length === 0 ? "No media yet" : "No matches"}
          </h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
            {list.length === 0
              ? "Add your first video or photo. YouTube embeds and thumbnails supported."
              : "Try a different search term."}
          </p>
          {list.length === 0 && (
            <button
              type="button"
              onClick={() => { setEditingMedia(null); setModalOpen(true); }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4" />
              Add media
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const thumbUrl = getThumbnailUrl(m);
            const viewUrl = getViewUrl(m);
            return (
              <article
                key={m.id}
                className="group rounded-xl bg-[#252945] border border-slate-700/50 hover:border-orange-500/30 transition overflow-hidden flex flex-col"
              >
                <div className="relative aspect-video bg-slate-800/50 overflow-hidden">
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={m.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Image className="w-12 h-12" />
                    </div>
                  )}
                  {m.youtubeId && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center text-white">
                        <Play className="w-7 h-7 ml-1 fill-white" />
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="p-2 rounded-lg bg-black/50 text-white/90 hover:bg-black/70 hover:text-white transition shrink-0"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-[140px]">
                        {viewUrl ? (
                          <DropdownMenuItem asChild>
                            <a
                              href={viewUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4 shrink-0" />
                              View
                            </a>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled className="flex items-center gap-2">
                            <Eye className="w-4 h-4 shrink-0" />
                            View
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onSelect={() => { setEditingMedia(m); setModalOpen(true); }}>
                          <Pencil className="w-4 h-4 shrink-0" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeletingMedia(m)}>
                          <Trash2 className="w-4 h-4 shrink-0" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <span className="absolute top-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/90 text-slate-200">
                    {m.type}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-white truncate mb-1">{m.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                    {m.duration && <span>{m.duration}</span>}
                    {m.views > 0 && <span>{m.views} views</span>}
                    {m.date && <span>{m.date}</span>}
                  </div>
                  {m.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mt-auto">{m.description}</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AddMediaModal
        isOpen={modalOpen}
        onClose={() => { setEditingMedia(null); setModalOpen(false); }}
        onSuccess={refreshList}
        media={editingMedia}
      />

      <ConfirmDialog
        isOpen={!!deletingMedia}
        onClose={() => !deleteLoading && setDeletingMedia(null)}
        onConfirm={handleDelete}
        title="Delete media"
        message={deletingMedia ? `Are you sure you want to delete "${deletingMedia.title}"? This cannot be undone.` : ""}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
