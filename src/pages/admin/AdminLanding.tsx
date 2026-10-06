import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Home, ImageIcon, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { getLanding, saveLanding, uploadLandingImage } from "../../content/landingApi";
import { useAdminTheme } from "../../contexts/AdminThemeContext";
import { adminClasses } from "../../lib/adminTheme";
import {
  ALUMNI_COLOR_OPTIONS,
  EMPTY_ALUMNI,
  LANDING_DEFAULTS,
  landingImage,
  type LandingContent,
} from "../../content/landing";

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "welcome", label: "Welcome" },
  { id: "programs", label: "Programs" },
  { id: "partners", label: "Partners" },
  { id: "alumni", label: "Alumni" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export default function AdminLanding() {
  const { darkMode } = useAdminTheme();
  const c = adminClasses(darkMode);
  const [data, setData] = useState<LandingContent>(LANDING_DEFAULTS);
  const [section, setSection] = useState<SectionId>("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const labelClass = `block text-sm font-medium mb-1.5 ${darkMode ? "text-slate-300" : "text-slate-600"}`;
  const inputClass = `w-full px-4 py-2.5 rounded border focus:outline-none focus:ring-2 ${c.input}`;

  useEffect(() => {
    getLanding()
      .then(setData)
      .catch(() => {
        setError("Could not load saved landing content, so the current site text is shown.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await saveLanding(data);
      setData(updated);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
        <p className={c.loading}>Loading landing page…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${c.page} space-y-6 max-w-4xl`}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${c.title}`}>
            <span className="w-10 h-10 rounded bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
              <Home className="w-5 h-5" />
            </span>
            Landing page
          </h1>
          <p className={`${c.subtitle} mt-1 text-sm`}>
            Edit every section on the home page. Program cards themselves are managed under Programs.
          </p>
        </div>
        <Link to="/" target="_blank" className={`text-sm font-medium text-orange-500 hover:text-orange-400`}>
          View site
        </Link>
      </div>

      {error && <div className="p-3 rounded bg-red-500/20 text-red-400 text-sm">{error}</div>}
      {saved && <div className="p-3 rounded bg-emerald-500/15 text-emerald-500 text-sm">Landing page saved.</div>}

      <div className="flex flex-wrap gap-2">
        {SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSection(item.id)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              section === item.id
                ? "bg-orange-500 text-white"
                : darkMode
                  ? "bg-white/5 text-slate-300 hover:bg-white/10"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={`rounded border p-6 space-y-5 ${c.cardMuted}`}>
        {section === "hero" && (
          <>
            <SectionTitle title="Hero" subtitle="Headline, button, background photo, and the stats bar." />
            <Field label="Headline" labelClass={labelClass}>
              <textarea rows={3} className={`${inputClass} resize-y`} value={data.hero.headline} onChange={(e) => setData({ ...data, hero: { ...data.hero, headline: e.target.value } })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Button text" labelClass={labelClass}>
                <input className={inputClass} value={data.hero.ctaText} onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaText: e.target.value } })} />
              </Field>
              <Field label="Button link" labelClass={labelClass}>
                <input className={inputClass} value={data.hero.ctaLink} onChange={(e) => setData({ ...data, hero: { ...data.hero, ctaLink: e.target.value } })} />
              </Field>
            </div>
            <ImageField
              label="Background image"
              labelClass={labelClass}
              inputClass={inputClass}
              value={data.hero.backgroundImage}
              onChange={(backgroundImage) => setData((prev) => ({ ...prev, hero: { ...prev.hero, backgroundImage } }))}
              onUploading={setUploading}
            />
            <Field label="Image description" labelClass={labelClass}>
              <input className={inputClass} value={data.hero.imageAlt} onChange={(e) => setData({ ...data, hero: { ...data.hero, imageAlt: e.target.value } })} />
            </Field>
            <ListHeader title="Stats" canAdd={data.hero.stats.length < 8} onAdd={() => setData({ ...data, hero: { ...data.hero, stats: [...data.hero.stats, { number: "", label: "" }] } })} />
            {data.hero.stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-[1fr_1.4fr_auto] gap-2 items-center">
                <input className={inputClass} placeholder="6k" value={stat.number} onChange={(e) => updateAt(data.hero.stats, index, { ...stat, number: e.target.value }, (stats) => setData({ ...data, hero: { ...data.hero, stats } }))} />
                <input className={inputClass} placeholder="participants served" value={stat.label} onChange={(e) => updateAt(data.hero.stats, index, { ...stat, label: e.target.value }, (stats) => setData({ ...data, hero: { ...data.hero, stats } }))} />
                <RemoveButton onClick={() => setData({ ...data, hero: { ...data.hero, stats: data.hero.stats.filter((_, i) => i !== index) } })} />
              </div>
            ))}
          </>
        )}

        {section === "welcome" && (
          <>
            <SectionTitle title="Welcome" subtitle="Intro copy, feature list, and the two photos." />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title, first line" labelClass={labelClass}>
                <input className={inputClass} value={data.welcome.titleLine1} onChange={(e) => setData({ ...data, welcome: { ...data.welcome, titleLine1: e.target.value } })} />
              </Field>
              <Field label="Title, highlighted line" labelClass={labelClass}>
                <input className={inputClass} value={data.welcome.titleHighlight} onChange={(e) => setData({ ...data, welcome: { ...data.welcome, titleHighlight: e.target.value } })} />
              </Field>
            </div>
            <Field label="Paragraph" labelClass={labelClass}>
              <textarea rows={4} className={`${inputClass} resize-y`} value={data.welcome.paragraph} onChange={(e) => setData({ ...data, welcome: { ...data.welcome, paragraph: e.target.value } })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Button text" labelClass={labelClass}>
                <input className={inputClass} value={data.welcome.ctaText} onChange={(e) => setData({ ...data, welcome: { ...data.welcome, ctaText: e.target.value } })} />
              </Field>
              <Field label="Button link" labelClass={labelClass}>
                <input className={inputClass} value={data.welcome.ctaLink} onChange={(e) => setData({ ...data, welcome: { ...data.welcome, ctaLink: e.target.value } })} />
              </Field>
            </div>
            <ListHeader title="Features" canAdd={data.welcome.features.length < 12} onAdd={() => setData({ ...data, welcome: { ...data.welcome, features: [...data.welcome.features, ""] } })} />
            {data.welcome.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input className={inputClass} value={feature} onChange={(e) => updateAt(data.welcome.features, index, e.target.value, (features) => setData({ ...data, welcome: { ...data.welcome, features } }))} />
                <RemoveButton onClick={() => setData({ ...data, welcome: { ...data.welcome, features: data.welcome.features.filter((_, i) => i !== index) } })} />
              </div>
            ))}
            <ImageField label="Main photo" labelClass={labelClass} inputClass={inputClass} value={data.welcome.imageMain} onChange={(imageMain) => setData((prev) => ({ ...prev, welcome: { ...prev.welcome, imageMain } }))} onUploading={setUploading} />
            <Field label="Main photo description" labelClass={labelClass}>
              <input className={inputClass} value={data.welcome.imageMainAlt} onChange={(e) => setData({ ...data, welcome: { ...data.welcome, imageMainAlt: e.target.value } })} />
            </Field>
            <ImageField label="Overlay photo" labelClass={labelClass} inputClass={inputClass} value={data.welcome.imageOverlay} onChange={(imageOverlay) => setData((prev) => ({ ...prev, welcome: { ...prev.welcome, imageOverlay } }))} onUploading={setUploading} />
            <Field label="Overlay photo description" labelClass={labelClass}>
              <input className={inputClass} value={data.welcome.imageOverlayAlt} onChange={(e) => setData({ ...data, welcome: { ...data.welcome, imageOverlayAlt: e.target.value } })} />
            </Field>
          </>
        )}

        {section === "programs" && (
          <>
            <SectionTitle title="Programs" subtitle="The heading on the home page. The three cards come from the Programs list." />
            <Field label="Small label" labelClass={labelClass}>
              <input className={inputClass} value={data.programs.eyebrow} onChange={(e) => setData({ ...data, programs: { ...data.programs, eyebrow: e.target.value } })} />
            </Field>
            <Field label="Heading" labelClass={labelClass}>
              <input className={inputClass} value={data.programs.heading} onChange={(e) => setData({ ...data, programs: { ...data.programs, heading: e.target.value } })} />
            </Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Button text" labelClass={labelClass}>
                <input className={inputClass} value={data.programs.ctaText} onChange={(e) => setData({ ...data, programs: { ...data.programs, ctaText: e.target.value } })} />
              </Field>
              <Field label="Button link" labelClass={labelClass}>
                <input className={inputClass} value={data.programs.ctaLink} onChange={(e) => setData({ ...data, programs: { ...data.programs, ctaLink: e.target.value } })} />
              </Field>
            </div>
          </>
        )}

        {section === "partners" && (
          <>
            <SectionTitle title="Partners" subtitle="Heading and the logo row." />
            <Field label="Heading" labelClass={labelClass}>
              <input className={inputClass} value={data.partners.heading} onChange={(e) => setData({ ...data, partners: { ...data.partners, heading: e.target.value } })} />
            </Field>
            <Field label="Description" labelClass={labelClass}>
              <textarea rows={3} className={`${inputClass} resize-y`} value={data.partners.description} onChange={(e) => setData({ ...data, partners: { ...data.partners, description: e.target.value } })} />
            </Field>
            <ListHeader title="Logos" canAdd={data.partners.items.length < 24} onAdd={() => setData({ ...data, partners: { ...data.partners, items: [...data.partners.items, { name: "", logo: "" }] } })} />
            {data.partners.items.map((partner, index) => (
              <div key={index} className={`rounded border p-4 space-y-3 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-semibold ${c.title}`}>{partner.name || `Partner ${index + 1}`}</p>
                  <RemoveButton onClick={() => setData({ ...data, partners: { ...data.partners, items: data.partners.items.filter((_, i) => i !== index) } })} />
                </div>
                <Field label="Name" labelClass={labelClass}>
                  <input className={inputClass} value={partner.name} onChange={(e) => updateAt(data.partners.items, index, { ...partner, name: e.target.value }, (items) => setData({ ...data, partners: { ...data.partners, items } }))} />
                </Field>
                <ImageField
                  label="Logo"
                  labelClass={labelClass}
                  inputClass={inputClass}
                  value={partner.logo}
                  onChange={(logo) =>
                    setData((prev) => ({
                      ...prev,
                      partners: {
                        ...prev.partners,
                        items: prev.partners.items.map((item, i) => (i === index ? { ...item, logo } : item)),
                      },
                    }))
                  }
                  onUploading={setUploading}
                />
              </div>
            ))}
          </>
        )}

        {section === "alumni" && (
          <>
            <SectionTitle title="Alumni" subtitle="Carousel heading, each graduate, and the numbers underneath." />
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Badge" labelClass={labelClass}>
                <input className={inputClass} value={data.alumni.badge} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, badge: e.target.value } })} />
              </Field>
              <Field label="Label above the name" labelClass={labelClass}>
                <input className={inputClass} value={data.alumni.storyLabel} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, storyLabel: e.target.value } })} />
              </Field>
              <Field label="Heading start" labelClass={labelClass}>
                <input className={inputClass} value={data.alumni.headingPrefix} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, headingPrefix: e.target.value } })} />
              </Field>
              <Field label="Heading highlight" labelClass={labelClass}>
                <input className={inputClass} value={data.alumni.headingHighlight} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, headingHighlight: e.target.value } })} />
              </Field>
            </div>
            <Field label="Description" labelClass={labelClass}>
              <textarea rows={3} className={`${inputClass} resize-y`} value={data.alumni.description} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, description: e.target.value } })} />
            </Field>
            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Role label" labelClass={labelClass}>
                <input className={inputClass} value={data.alumni.roleLabel} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, roleLabel: e.target.value } })} />
              </Field>
              <Field label="Button text" labelClass={labelClass}>
                <input className={inputClass} value={data.alumni.ctaText} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, ctaText: e.target.value } })} />
              </Field>
              <Field label="Button link" labelClass={labelClass}>
                <input className={inputClass} value={data.alumni.ctaLink} onChange={(e) => setData({ ...data, alumni: { ...data.alumni, ctaLink: e.target.value } })} />
              </Field>
            </div>
            <ListHeader title="Stories" canAdd={data.alumni.stories.length < 20} onAdd={() => setData({ ...data, alumni: { ...data.alumni, stories: [...data.alumni.stories, { ...EMPTY_ALUMNI }] } })} />
            {data.alumni.stories.map((story, index) => (
              <div key={index} className={`rounded border p-4 space-y-3 ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-semibold ${c.title}`}>{story.name || `Story ${index + 1}`}</p>
                  <RemoveButton onClick={() => setData({ ...data, alumni: { ...data.alumni, stories: data.alumni.stories.filter((_, i) => i !== index) } })} />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name" labelClass={labelClass}>
                    <input className={inputClass} value={story.name} onChange={(e) => updateAt(data.alumni.stories, index, { ...story, name: e.target.value }, (stories) => setData({ ...data, alumni: { ...data.alumni, stories } }))} />
                  </Field>
                  <Field label="Title" labelClass={labelClass}>
                    <input className={inputClass} value={story.title} onChange={(e) => updateAt(data.alumni.stories, index, { ...story, title: e.target.value }, (stories) => setData({ ...data, alumni: { ...data.alumni, stories } }))} />
                  </Field>
                  <Field label="Current role" labelClass={labelClass}>
                    <input className={inputClass} value={story.achievement} onChange={(e) => updateAt(data.alumni.stories, index, { ...story, achievement: e.target.value }, (stories) => setData({ ...data, alumni: { ...data.alumni, stories } }))} />
                  </Field>
                  <Field label="Location" labelClass={labelClass}>
                    <input className={inputClass} value={story.location} onChange={(e) => updateAt(data.alumni.stories, index, { ...story, location: e.target.value }, (stories) => setData({ ...data, alumni: { ...data.alumni, stories } }))} />
                  </Field>
                </div>
                <Field label="Quote" labelClass={labelClass}>
                  <textarea rows={2} className={`${inputClass} resize-y`} value={story.quote} onChange={(e) => updateAt(data.alumni.stories, index, { ...story, quote: e.target.value }, (stories) => setData({ ...data, alumni: { ...data.alumni, stories } }))} />
                </Field>
                <Field label="Story" labelClass={labelClass}>
                  <textarea rows={3} className={`${inputClass} resize-y`} value={story.story} onChange={(e) => updateAt(data.alumni.stories, index, { ...story, story: e.target.value }, (stories) => setData({ ...data, alumni: { ...data.alumni, stories } }))} />
                </Field>
                <Field label="Color" labelClass={labelClass}>
                  <select className={inputClass} value={story.color} onChange={(e) => updateAt(data.alumni.stories, index, { ...story, color: e.target.value }, (stories) => setData({ ...data, alumni: { ...data.alumni, stories } }))}>
                    {ALUMNI_COLOR_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </Field>
                <ImageField
                  label="Photo"
                  labelClass={labelClass}
                  inputClass={inputClass}
                  value={story.image}
                  onChange={(image) =>
                    setData((prev) => ({
                      ...prev,
                      alumni: {
                        ...prev.alumni,
                        stories: prev.alumni.stories.map((item, i) => (i === index ? { ...item, image } : item)),
                      },
                    }))
                  }
                  onUploading={setUploading}
                />
              </div>
            ))}
            <ListHeader title="Numbers" canAdd={data.alumni.stats.length < 8} onAdd={() => setData({ ...data, alumni: { ...data.alumni, stats: [...data.alumni.stats, { value: "", label: "" }] } })} />
            {data.alumni.stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-[1fr_1.4fr_auto] gap-2 items-center">
                <input className={inputClass} placeholder="20+" value={stat.value} onChange={(e) => updateAt(data.alumni.stats, index, { ...stat, value: e.target.value }, (stats) => setData({ ...data, alumni: { ...data.alumni, stats } }))} />
                <input className={inputClass} placeholder="Alumni" value={stat.label} onChange={(e) => updateAt(data.alumni.stats, index, { ...stat, label: e.target.value }, (stats) => setData({ ...data, alumni: { ...data.alumni, stats } }))} />
                <RemoveButton onClick={() => setData({ ...data, alumni: { ...data.alumni, stats: data.alumni.stats.filter((_, i) => i !== index) } })} />
              </div>
            ))}
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 px-6 py-2.5 rounded bg-orange-500 text-white font-medium hover:bg-orange-600 disabled:opacity-50 transition shadow-lg shadow-orange-500/20"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : uploading ? "Uploading image…" : "Save landing page"}
        </button>
      </div>
    </form>
  );
}

function updateAt<T>(items: T[], index: number, next: T, apply: (items: T[]) => void) {
  apply(items.map((item, i) => (i === index ? next : item)));
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm opacity-70 mt-0.5">{subtitle}</p>
    </div>
  );
}

function Field({ label, labelClass, children }: { label: string; labelClass: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function ListHeader({ title, canAdd, onAdd }: { title: string; canAdd: boolean; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 pt-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide opacity-70">{title}</h3>
      <button type="button" disabled={!canAdd} onClick={onAdd} className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 disabled:opacity-40">
        <Plus className="w-4 h-4" />
        Add
      </button>
    </div>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="p-2 rounded text-rose-400 hover:bg-rose-500/10" aria-label="Remove">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function ImageField({
  label,
  labelClass,
  inputClass,
  value,
  onChange,
  onUploading,
}: {
  label: string;
  labelClass: string;
  inputClass: string;
  value: string;
  onChange: (value: string) => void;
  onUploading: (uploading: boolean) => void;
}) {
  const [error, setError] = useState("");
  const preview = landingImage(value);

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="w-16 h-16 rounded border border-slate-200/40 overflow-hidden bg-slate-100 flex items-center justify-center shrink-0">
          {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-5 h-5 text-slate-400" />}
        </div>
        <div className="flex-1 space-y-2">
          <input className={inputClass} value={value} placeholder="/image.jpg or https://" onChange={(e) => onChange(e.target.value)} />
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setError("");
              onUploading(true);
              try {
                onChange(await uploadLandingImage(file));
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
              } finally {
                onUploading(false);
              }
            }}
          />
        </div>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
