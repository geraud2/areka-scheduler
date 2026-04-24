import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { useAppointments, appointmentsStore } from "@/store/appointmentsStore";
import { TIME_SLOTS } from "@/data/timeSlots";
import { Appointment, InterventionType } from "@/data/appointments";
import { toast } from "@/hooks/use-toast";

const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];

const toISO = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const AdminPlanning = () => {
  const all = useAppointments();
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  // Compute month grid (Mon-first)
  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const last = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const startOffset = (first.getDay() + 6) % 7; // Monday=0
    const cells: { date: Date; current: boolean }[] = [];
    for (let i = 0; i < startOffset; i++) {
      const d = new Date(first);
      d.setDate(d.getDate() - (startOffset - i));
      cells.push({ date: d, current: false });
    }
    for (let d = 1; d <= last.getDate(); d++) {
      cells.push({ date: new Date(cursor.getFullYear(), cursor.getMonth(), d), current: true });
    }
    while (cells.length % 7 !== 0) {
      const lastCell = cells[cells.length - 1].date;
      const d = new Date(lastCell);
      d.setDate(d.getDate() + 1);
      cells.push({ date: d, current: false });
    }
    return cells;
  }, [cursor]);

  const byDay = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    for (const a of all) {
      if (a.status === "refused") continue;
      (map[a.date] ||= []).push(a);
    }
    return map;
  }, [all]);

  const dayAppts = selectedDay ? (byDay[selectedDay] || []) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Planning des interventions</h1>
          <p className="text-muted-foreground text-sm mt-1">Vue mensuelle de vos rendez-vous.</p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Ajouter un RDV
        </Button>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 shadow-soft">
        <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </h2>
        <Button variant="ghost" size="icon" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block bg-card border border-border rounded-xl shadow-soft overflow-hidden">
        <div className="grid grid-cols-7 bg-muted/50 text-xs font-medium">
          {DAYS.map((d) => (
            <div key={d} className="px-3 py-2 text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {grid.map(({ date, current }, i) => {
            const iso = toISO(date);
            const list = byDay[iso] || [];
            const isToday = iso === toISO(new Date());
            return (
              <button
                key={i}
                onClick={() => setSelectedDay(iso)}
                className={cn(
                  "min-h-[100px] border-t border-l border-border p-2 text-left transition-base hover:bg-muted/40",
                  !current && "bg-muted/20 text-muted-foreground",
                  i % 7 === 6 && "border-r"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-semibold", isToday && "h-6 w-6 grid place-items-center rounded-full bg-primary text-primary-foreground")}>
                    {date.getDate()}
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  {list.slice(0, 3).map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "truncate text-[11px] px-1.5 py-0.5 rounded font-medium",
                        a.type === "entretien" ? "bg-info/15 text-info" : "bg-accent/15 text-accent",
                        a.source === "manual" && "ring-1 ring-foreground/20"
                      )}
                    >
                      {a.slot.split("-")[0]} {a.lastName}
                    </div>
                  ))}
                  {list.length > 3 && (
                    <p className="text-[10px] text-muted-foreground">+{list.length - 3} autres</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile list */}
      <div className="md:hidden space-y-2">
        {grid.filter((c) => c.current).map(({ date }) => {
          const iso = toISO(date);
          const list = byDay[iso] || [];
          if (list.length === 0) return null;
          return (
            <button
              key={iso}
              onClick={() => setSelectedDay(iso)}
              className="w-full text-left bg-card border border-border rounded-xl p-3 shadow-soft"
            >
              <p className="text-sm font-semibold">
                {date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {list.map((a) => (
                  <span
                    key={a.id}
                    className={cn(
                      "text-xs px-2 py-0.5 rounded font-medium",
                      a.type === "entretien" ? "bg-info/15 text-info" : "bg-accent/15 text-accent"
                    )}
                  >
                    {a.slot.split("-")[0]} · {a.lastName}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Day detail */}
      <Dialog open={!!selectedDay} onOpenChange={(v) => !v && setSelectedDay(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDay && new Date(selectedDay).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </DialogTitle>
          </DialogHeader>
          {dayAppts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Aucun rendez-vous ce jour.</p>
          ) : (
            <div className="space-y-2">
              {dayAppts
                .slice()
                .sort((a, b) => a.slot.localeCompare(b.slot))
                .map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <div className={cn(
                    "h-10 w-1 rounded-full",
                    a.type === "entretien" ? "bg-info" : "bg-accent"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{a.firstName} {a.lastName}</p>
                    <p className="text-xs text-muted-foreground">{a.slot} · {a.address}</p>
                  </div>
                  {a.source === "manual" && <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Manuel</span>}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
};

const AddDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const all = useAppointments();
  const todayISO = new Date().toISOString().slice(0, 10);
  const [data, setData] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    address: "",
    type: "entretien" as InterventionType,
    date: todayISO,
    slot: "",
  });

  const taken = all
    .filter((a) => a.date === data.date && a.status !== "refused")
    .map((a) => a.slot);

  const submit = () => {
    if (!data.lastName || !data.phone || !data.slot) return;
    appointmentsStore.add({
      id: crypto.randomUUID(),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: "",
      address: data.address,
      type: data.type,
      date: data.date,
      slot: data.slot,
      status: "confirmed",
      source: "manual",
      createdAt: new Date().toISOString(),
    });
    toast({ title: "Rendez-vous ajouté" });
    onOpenChange(false);
    setData({ ...data, lastName: "", firstName: "", phone: "", address: "", slot: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Prénom</Label><Input value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Nom *</Label><Input value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value })} /></div>
          </div>
          <div className="space-y-1.5"><Label>Téléphone *</Label><Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Adresse</Label><Input value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} /></div>
          <div className="space-y-1.5">
            <Label>Type</Label>
            <Select value={data.type} onValueChange={(v) => setData({ ...data, type: v as InterventionType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entretien">Entretien</SelectItem>
                <SelectItem value="depannage">Dépannage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Date</Label><Input type="date" min={todayISO} value={data.date} onChange={(e) => setData({ ...data, date: e.target.value, slot: "" })} /></div>
            <div className="space-y-1.5">
              <Label>Créneau *</Label>
              <Select value={data.slot} onValueChange={(v) => setData({ ...data, slot: v })}>
                <SelectTrigger><SelectValue placeholder="Choisir" /></SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((s) => (
                    <SelectItem key={s} value={s} disabled={taken.includes(s)}>
                      {s}{taken.includes(s) && " — pris"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full" onClick={submit}>Ajouter le RDV</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPlanning;
