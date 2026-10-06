import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MoreVertical, Pencil, Plus, Trash2, Users, XCircle } from "lucide-react";
import { api, type Story } from "../../Api/client";
import { isTeamMember, teamImage } from "../../content/team";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { adminClasses } from "../../lib/adminTheme";
import ConfirmDialog from "../../components/ui/confirm-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import AddTeamModal from "./AddTeamModal";

export default function AdminTeam() {
  const { darkMode } = useAdminTheme();
  const c = adminClasses(darkMode);
  const [list, setList] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Story | null>(null);
  const [deleting, setDeleting] = useState<Story | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = () => {
    api<Story[]>("/api/stories/admin/list")
      .then((rows) => setList(rows.filter((row) => isTeamMember(row.category))))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load team"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const togglePublish = async (member: Story) => {
    try {
      await api(`/api/stories/${member.id}`, {
        method: "PATCH",
        body: JSON.stringify({ published: !member.published }),
      });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not update publish status");
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await api(`/api/stories/${deleting.id}`, { method: "DELETE" });
      setDeleting(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className={c.loading}>Loading team…</p>
      </div>
    );
  }

  return (
    <div className={`${c.page} space-y-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${c.title}`}>
            <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400">
              <Users className="w-5 h-5" />
            </span>
            Team
          </h1>
          <p className={`${c.subtitle} mt-1 text-sm`}>
            Register people for the About Us page. Only published members are shown there.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-orange-500 text-white font-medium"
        >
          <Plus className="w-4 h-4" />
          Register member
        </button>
      </div>

      {error && <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">{error}</div>}

      {list.length === 0 ? (
        <div className={`rounded border border-dashed p-10 text-center ${c.cardMuted}`}>
          <p className={`font-medium ${c.title}`}>No team members yet</p>
          <p className={`${c.subtitle} text-sm mt-1`}>The About page keeps the current team until you publish someone.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((member) => (
            <article key={member.id} className={`rounded border overflow-hidden ${c.cardMuted}`}>
              <div className="p-4 flex gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  {member.imageUrl ? <img src={teamImage(member.imageUrl)} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className={`font-semibold truncate ${c.title}`}>{member.name}</h2>
                      <p className={`text-sm ${c.subtitle}`}>{member.role}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className={`p-1 rounded ${c.subtitle}`} aria-label="Member actions">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => { setEditing(member); setModalOpen(true); }}>
                          <Pencil className="w-4 h-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => togglePublish(member)}>
                          {member.published ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                          {member.published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(member)}>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <button
                    type="button"
                    onClick={() => togglePublish(member)}
                    className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium ${
                      member.published ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                    }`}
                  >
                    {member.published ? "Published" : "Draft"} · {member.published ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AddTeamModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSuccess={load}
        member={editing}
      />
      <ConfirmDialog
        isOpen={!!deleting}
        onClose={() => !deleteLoading && setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete team member"
        message={deleting ? `Delete ${deleting.name} from the team?` : ""}
        confirmLabel="Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
