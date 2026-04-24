import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Printer, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/areka-logo.png";

const NAVY = "#1a3c5e";

const AdminQR = () => {
  const [url, setUrl] = useState(typeof window !== "undefined" ? window.location.origin : "");
  const wrapRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const canvas = wrapRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "areka-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const print = () => window.print();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">QR Code</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Générez un QR code à imprimer pour vos stickers et flyers.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Config */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-soft space-y-4 print:hidden">
          <h2 className="font-semibold">Configuration</h2>
          <div className="space-y-1.5">
            <Label htmlFor="qr-url">URL du site</Label>
            <Input id="qr-url" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button onClick={download} className="flex-1">
              <Download className="h-4 w-4 mr-2" /> Télécharger PNG
            </Button>
            <Button onClick={print} variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" /> Imprimer
            </Button>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Info className="h-4 w-4 text-primary" /> Spécifications
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
              <li>Format PNG · 1024 × 1024 px</li>
              <li>Couleur : {NAVY}</li>
              <li>Logo Areka centré</li>
              <li>Correction d'erreur élevée (H)</li>
              <li>Sticker recommandé : 6 × 6 cm</li>
            </ul>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-soft flex flex-col items-center">
          <h2 className="font-semibold self-start mb-4 print:hidden">Aperçu (taille réelle ≈ 6 cm)</h2>
          <div
            ref={wrapRef}
            className="bg-white p-4 rounded-xl shadow-soft"
            style={{ width: 240, height: 240 }}
          >
            {url && (
              <QRCodeCanvas
                value={url}
                size={1024}
                level="H"
                fgColor={NAVY}
                bgColor="#ffffff"
                includeMargin={false}
                imageSettings={{
                  src: logo,
                  height: 200,
                  width: 200,
                  excavate: true,
                }}
                style={{ width: "100%", height: "100%" }}
              />
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{url}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminQR;
