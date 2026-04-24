import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  ShieldCheck,
  Flame,
  CalendarCheck2,
  ClipboardCheck,
  Wrench,
  CheckCircle2,
  Loader2,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Star,
  Sparkles,
  ArrowRight,
  Mail,
  User,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import logo from "@/assets/areka-logo.png";
import { TIME_SLOTS } from "@/data/timeSlots";
import { appointmentsStore } from "@/store/appointmentsStore";
import { useTakenSlots } from "@/store/appointmentsStore";
import { InterventionType } from "@/data/appointments";

// Images placeholder (gratuites Unsplash)
const heroBg = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&q=80";
const entretienImg = "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80";
const depannageImg = "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80";
const ctaImg = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&q=80";

const PHONE = "01 23 45 67 89";

const todayISO = () => new Date().toISOString().slice(0, 10);

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  type: InterventionType | "";
  description: string;
  date: string;
  slot: string;
}

const initial: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  type: "",
  description: "",
  date: todayISO(),
  slot: "",
};

const ClientPage = () => {
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<FormState | null>(null);

  const taken = useTakenSlots(form.date);
  const slotsView = useMemo(
    () => TIME_SLOTS.map((s) => ({ value: s, taken: taken.includes(s) })),
    [taken]
  );

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const valid =
    form.firstName &&
    form.lastName &&
    form.phone &&
    form.email &&
    form.address &&
    form.type &&
    form.date &&
    form.slot;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setTimeout(() => {
      appointmentsStore.add({
        id: crypto.randomUUID(),
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email,
        address: form.address,
        type: form.type as InterventionType,
        description: form.description,
        date: form.date,
        slot: form.slot,
        status: "pending",
        source: "client",
        createdAt: new Date().toISOString(),
      });
      setConfirmed(form);
      setSubmitting(false);
      setForm(initial);
    }, 800);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background pb-24 md:pb-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Areka" className="h-10 w-10 rounded-xl shadow-sm" />
              <div>
                <p className="font-bold text-foreground">Areka Services</p>
                <p className="text-xs text-muted-foreground">Chauffage & dépannage</p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-4 py-12 md:py-20 text-center animate-fade-in">
          <div className="relative mx-auto h-24 w-24">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping-slow" />
            <div className="absolute inset-2 bg-success/15 rounded-full" />
            <div className="relative h-full w-full rounded-full bg-success/10 grid place-items-center">
              <CheckCircle2 className="h-12 w-12 text-success animate-check-pop" />
            </div>
          </div>

          <h1 className="mt-8 text-3xl md:text-4xl font-bold text-foreground">
            Merci {confirmed.firstName} !
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-md mx-auto">
            Votre demande a bien été enregistrée. Nous vous recontactons rapidement
            pour confirmer votre rendez-vous.
          </p>

          <div className="mt-10 bg-card rounded-3xl shadow-elegant border border-border p-6 md:p-8 text-left">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg text-foreground">Récapitulatif</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-xl">
                <CalendarIcon className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-semibold">
                    {new Date(confirmed.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-xl">
                <Clock className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Créneau</p>
                  <p className="font-semibold">{confirmed.slot}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 bg-muted/40 rounded-xl">
                <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Adresse</p>
                  <p className="font-semibold">{confirmed.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => setConfirmed(null)} className="gap-2">
              <CalendarCheck2 className="h-4 w-4" />
              Faire une nouvelle demande
            </Button>
            <Link to="/">
              <Button variant="outline" size="lg" className="gap-2">
                <Home className="h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="Areka" className="h-10 w-10 rounded-xl shadow-sm" width={40} height={40} />
            <div className="min-w-0">
              <p className="font-bold leading-tight text-foreground truncate">Areka Services</p>
              <p className="text-xs text-muted-foreground truncate">Chauffage & dépannage</p>
            </div>
          </div>
          <a href={`tel:${PHONE.replace(/\s/g, "")}`}>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <Phone className="h-4 w-4" /> <span className="hidden sm:inline">Nous appeler</span>
            </Button>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Technicien en intervention"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-4 py-1.5 text-sm font-medium text-white mb-6">
              <Sparkles className="h-4 w-4" />
              Chauffage & dépannage en Île-de-France
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
              Votre chaudière,
              <br />
              <span className="text-accent">entre de bonnes mains</span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-white/80 max-w-lg">
              Réservez en quelques clics l'intervention d'un technicien certifié,
              près de chez vous. Confirmation immédiate par SMS et email.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: CalendarCheck2, label: "Créneaux en temps réel" },
                { icon: ShieldCheck, label: "Technicien certifié" },
                { icon: Clock, label: "Moins de 24h en urgence" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-white/90">4.9 sur 120+ avis</span>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#reserver">
                <Button size="lg" className="gap-2 bg-white text-primary hover:bg-white/90 font-semibold shadow-xl rounded-full px-8">
                  Réserver un créneau
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white rounded-full px-8"
                >
                  <Phone className="h-4 w-4" /> Appeler maintenant
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Nos services</h2>
          <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
            Des prestations claires, sans surprise, pour votre tranquillité.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <article className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={entretienImg}
                alt="Entretien de chaudière"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge className="absolute top-4 left-4 bg-success/90 text-white border-0 text-xs font-semibold px-3 py-1">
                Recommandé
              </Badge>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center shrink-0">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Entretien annuel</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Contrôle complet, nettoyage et certificat d'entretien obligatoire
                    pour votre assurance.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">dès 89€</p>
                <a href="#reserver">
                  <Button size="sm" className="rounded-full gap-2">
                    Réserver <ArrowRight className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          </article>

          <article className="group relative overflow-hidden rounded-3xl bg-card border border-border shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-48 sm:h-56 overflow-hidden">
              <img
                src={depannageImg}
                alt="Dépannage de chaudière"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge className="absolute top-4 left-4 bg-accent text-white border-0 text-xs font-semibold px-3 py-1">
                Urgence
              </Badge>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 grid place-items-center shrink-0">
                  <Flame className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Dépannage rapide</h3>
                  <p className="mt-2 text-muted-foreground text-sm">
                    Intervention en moins de 24h pour panne chaudière, chauffe-eau
                    ou perte d'eau chaude.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-2xl font-bold text-primary">sur devis</p>
                <a href="#reserver">
                  <Button size="sm" className="rounded-full gap-2">
                    Réserver <ArrowRight className="h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Comment ça marche</h2>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
              Trois étapes simples pour un rendez-vous rapide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                step: 1,
                icon: CalendarCheck2,
                title: "Réservez",
                desc: "Choisissez un créneau qui vous arrange en moins d'une minute.",
                color: "bg-blue-50 text-blue-600",
              },
              {
                step: 2,
                icon: ClipboardCheck,
                title: "Confirmation",
                desc: "On vous recontacte pour valider le RDV par SMS et email.",
                color: "bg-green-50 text-green-600",
              },
              {
                step: 3,
                icon: Wrench,
                title: "Intervention",
                desc: "Le technicien intervient à l'heure prévue, le travail est fait.",
                color: "bg-orange-50 text-orange-600",
              },
            ].map(({ step, icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="relative bg-card rounded-3xl p-6 md:p-8 shadow-card border border-border hover:shadow-elegant transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                    {step}
                  </span>
                  <div className={cn("h-12 w-12 rounded-2xl grid place-items-center", color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="mt-2 text-muted-foreground text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0">
          <img src={ctaImg} alt="Technicien Areka" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-primary/90" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Prêt à prendre rendez-vous ?
          </h2>
          <p className="mt-4 text-white/80 text-lg">
            Un technicien certifié se déplace chez vous en moins de 24h.
          </p>
          <a href="#reserver" className="mt-8 inline-block">
            <Button size="lg" className="gap-2 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full px-10 shadow-xl text-lg py-6">
              Je réserve maintenant
              <ArrowRight className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Formulaire */}
      <section id="reserver" className="max-w-3xl mx-auto px-4 py-16 md:py-24 scroll-mt-20">
        <div className="bg-card rounded-3xl shadow-elegant border border-border p-6 md:p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center">
              <ClipboardCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Prendre rendez-vous</h2>
              <p className="text-sm text-muted-foreground">
                Tous les champs marqués d'un * sont obligatoires
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Vos coordonnées</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input id="firstName" required placeholder="Jean" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input id="lastName" required placeholder="Dupont" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="flex items-center gap-1"><Phone className="h-3 w-3" /> Téléphone *</Label>
                  <Input id="phone" type="tel" required placeholder="06 12 34 56 78" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email *</Label>
                  <Input id="email" type="email" required placeholder="jean@email.fr" value={form.email} onChange={(e) => update("email", e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                <Label htmlFor="address" className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Adresse complète d'intervention *</Label>
                <Input id="address" required placeholder="15 rue de Paris, 75001 Paris" value={form.address} onChange={(e) => update("address", e.target.value)} className="rounded-xl" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Type d'intervention *</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "entretien" as const, icon: ShieldCheck, title: "Entretien annuel", sub: "Maintenance préventive", price: "dès 89€" },
                  { val: "depannage" as const, icon: Flame, title: "Dépannage", sub: "Intervention rapide", price: "sur devis" },
                ].map((opt) => {
                  const active = form.type === opt.val;
                  return (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => update("type", opt.val)}
                      className={cn(
                        "text-left rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200",
                        active ? "border-primary bg-primary/5 shadow-soft scale-[1.02]" : "border-border hover:border-primary/30 bg-card hover:bg-muted/30"
                      )}
                    >
                      <div className={cn("h-10 w-10 rounded-xl grid place-items-center", active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                        <opt.icon className="h-5 w-5" />
                      </div>
                      <p className="mt-3 font-semibold text-sm">{opt.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{opt.sub}</p>
                      <p className="text-sm font-bold text-primary mt-2">{opt.price}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Détails supplémentaires</h3>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea id="description" rows={4} placeholder="Décrivez brièvement votre besoin..." value={form.description} onChange={(e) => update("description", e.target.value)} className="rounded-xl resize-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarCheck2 className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-foreground">Date & créneau *</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Date souhaitée</Label>
                  <Input id="date" type="date" min={todayISO()} required value={form.date} onChange={(e) => { update("date", e.target.value); update("slot", ""); }} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="slot">Créneau horaire</Label>
                  <Select value={form.slot} onValueChange={(v) => update("slot", v)}>
                    <SelectTrigger id="slot" className="rounded-xl">
                      <SelectValue placeholder="Choisir un créneau" />
                    </SelectTrigger>
                    <SelectContent>
                      {slotsView.map(({ value, taken }) => (
                        <SelectItem key={value} value={value} disabled={taken}>
                          {value}{taken && <span className="text-xs text-muted-foreground"> — complet</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full rounded-xl text-base py-6 font-semibold" disabled={!valid || submitting}>
              {submitting ? <><Loader2 className="h-5 w-5 animate-spin mr-3" /> Envoi en cours...</> : "Envoyer ma demande"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              En soumettant ce formulaire, vous acceptez d'être recontacté par notre technicien.
            </p>
          </form>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Areka" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-foreground">Areka Services</span>
          </div>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Areka Services · Chauffage & dépannage</p>
          <Link to="/admin/login" className="inline-block mt-3 text-sm text-muted-foreground hover:text-primary transition-colors">
            Espace technicien
          </Link>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
};

export default ClientPage;