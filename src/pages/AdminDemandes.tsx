import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Check,
  X,
  CalendarClock,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAppointments, appointmentsStore } from "@/store/appointmentsStore";
import { Appointment } from "@/data/appointments";
import { AppointmentStatus, STATUS_LABELS, STATUS_STYLES } from "@/data/statusLabels";
import { TIME_SLOTS } from "@/data/timeSlots";
import { toast } from "@/hooks/use-toast";

type Filter = "all" | AppointmentStatus;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmées" },
  { value: "rescheduled", label: "À replanifier" },
  { value: "refused", label: "Refusées" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const TypeBadge = ({ type }: { type: Appointment["type"] }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md",
      type === "entretien" ? "bg-info/15 text-info" : "bg-accent/15 text-accent"
    )}
  >
    {type === "entretien" ? <ShieldCheck className="h-3 w-3" /> : <Flame className="h-3 w-3" />}
    {type === "entretien" ? "Entretien" : "Dépannage"}
  </span>
);

const StatusBadge = ({ status }: { status: AppointmentStatus }) => (
  <span className={cn("inline-flex text-xs font-medium px-2 py-1 rounded-md border", STATUS_STYLES[status])}>
    {STATUS_LABELS[status]}
  </span>
);

const AdminDemandes = () => {
  const all = useAppointments();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((a) => {
      if (filter !== "all" && a.status !== filter) return false;
      if (!q) return true;
      return [a.firstName, a.lastName, a.phone, a.email, a.address]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [all, filter, search]);

  const counts = useMemo(
    () => ({
      total: all.length,
      pending: all.filter((a) => a.status === "pending").length,
      confirmed: all.filter((a) => a.status === "confirmed").length,
      rescheduled: all.filter((a) => a.status === "rescheduled").length,
    }),
    [all]
  );

  const setStatus = (id: string, status: AppointmentStatus) => {
    appointmentsStore.update(id, { status });
    toast({ title: "Statut mis à jour", description: STATUS_LABELS[status] });
  };

  const opened = openId ? all.find((a) => a.id === openId) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Demandes de rendez-vous</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gérez les demandes entrantes et planifiez vos interventions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Total" value={counts.total} tone="primary" />
        <StatCard label="En attente" value={counts.pending} tone="warning" />
        <StatCard label="Confirmés" value={counts.confirmed} tone="success" />
        <StatCard label="À replanifier" value={counts.rescheduled} tone="info" />
      </div>

      {/* Filters + search */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "text-xs md:text-sm font-medium px-3 py-1.5 rounded-full border transition-base",
                filter === f.value
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-muted"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative md:ml-auto md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Date / Créneau</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Aucune demande
                </td>
              </tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-border hover:bg-muted/30 transition-base">
                <td className="px-4 py-3">
                  <p className="font-medium">{a.firstName} {a.lastName}</p>
                  <p className="text-xs text-muted-foreground">{a.phone}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{formatDate(a.date)}</p>
                  <p className="text-xs text-muted-foreground">{a.slot}</p>
                </td>
                <td className="px-4 py-3"><TypeBadge type={a.type} /></td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setOpenId(a.id)} title="Voir">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-success hover:text-success" onClick={() => setStatus(a.id, "confirmed")} title="Valider">
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-info hover:text-info" onClick={() => setStatus(a.id, "rescheduled")} title="Replanifier">
                      <CalendarClock className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setStatus(a.id, "refused")} title="Refuser">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucune demande</p>
        )}
        {filtered.map((a) => (
          <div key={a.id} className="bg-card rounded-xl border border-border p-4 shadow-soft">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold truncate">{a.firstName} {a.lastName}</p>
                <a href={`tel:${a.phone}`} className="text-xs text-muted-foreground">{a.phone}</a>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 items-center text-xs">
              <TypeBadge type={a.type} />
              <span className="text-muted-foreground">{formatDate(a.date)} · {a.slot}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" onClick={() => setOpenId(a.id)}>
                <Eye className="h-4 w-4 mr-1" /> Voir
              </Button>
              <Button size="sm" className="flex-1 bg-success hover:bg-success/90" onClick={() => setStatus(a.id, "confirmed")}>
                <Check className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => setStatus(a.id, "rescheduled")}>
                <CalendarClock className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="text-destructive border-destructive/40" onClick={() => setStatus(a.id, "refused")}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!opened} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-w-lg">
          {opened && (
            <>
              <DialogHeader>
                <DialogTitle>{opened.firstName} {opened.lastName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {opened.phone}</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {opened.email}</div>
                <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /> {opened.address}</div>
                <div><TypeBadge type={opened.type} /></div>
                {opened.description && (
                  <div className="bg-muted/50 rounded-lg p-3 text-muted-foreground">
                    {opened.description}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <Label className="text-xs">Date</Label>
                    <Input
                      type="date"
                      value={opened.date}
                      onChange={(e) => appointmentsStore.update(opened.id, { date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Créneau</Label>
                    <Select
                      value={opened.slot}
                      onValueChange={(v) => appointmentsStore.update(opened.id, { slot: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TIME_SLOTS.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 pt-3">
                  <Button className="flex-1 bg-success hover:bg-success/90" onClick={() => { setStatus(opened.id, "confirmed"); setOpenId(null); }}>
                    <Check className="h-4 w-4 mr-1" /> Valider
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => { setStatus(opened.id, "rescheduled"); setOpenId(null); }}>
                    <CalendarClock className="h-4 w-4 mr-1" /> Replanifier
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => { setStatus(opened.id, "refused"); setOpenId(null); }}>
                    <X className="h-4 w-4 mr-1" /> Refuser
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "primary" | "warning" | "success" | "info";
}) => {
  const tones = {
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
  };
  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-soft">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl md:text-3xl font-bold">{value}</span>
        <span className={cn("h-2 w-2 rounded-full", tones[tone])} />
      </div>
    </div>
  );
};

export default AdminDemandes;
