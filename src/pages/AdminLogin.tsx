import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authStore } from "@/store/authStore";
import logo from "@/assets/areka-logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      authStore.login();
      navigate("/admin/demandes");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-2xl shadow-elegant p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <img src={logo} alt="Areka" className="h-16 w-16 rounded-xl bg-white p-2 shadow-soft" width={64} height={64} />
            <h1 className="mt-4 text-2xl font-bold text-foreground">Espace technicien</h1>
            <p className="text-sm text-muted-foreground mt-1">Connectez-vous pour gérer les demandes</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@areka.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Se connecter
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Démo front-end — toute saisie est acceptée
            </p>
          </form>
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-foreground/90 hover:text-primary-foreground transition-base"
        >
          <ArrowLeft className="h-4 w-4" /> Retour au site
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
