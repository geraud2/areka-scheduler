import { useState, useEffect } from "react";
import { Flame, Sparkles } from "lucide-react";
import logo from "@/assets/areka-logo.png";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-primary transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-accent/30 rounded-full animate-ping-slow" />
        <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-3xl bg-white shadow-2xl grid place-items-center animate-bounce-in">
          <img src={logo} alt="Areka Services" className="h-20 w-20 sm:h-24 sm:w-24 object-contain" />
        </div>
      </div>

      <h1 className="mt-8 text-3xl sm:text-4xl font-bold text-white tracking-tight animate-fade-up">
        Areka<span className="text-accent"> Services</span>
      </h1>

      <div className="mt-4 flex items-center gap-2 text-white/70 animate-fade-up-delayed">
        <Flame className="h-4 w-4 text-accent" />
        <span className="text-sm sm:text-base font-medium">Chauffage & dépannage</span>
        <Sparkles className="h-4 w-4 text-accent" />
      </div>

      <div className="mt-10 flex items-center gap-1.5 animate-fade-up-delayed">
        <span className="h-2 w-2 rounded-full bg-white animate-bounce-dot" />
        <span className="h-2 w-2 rounded-full bg-white animate-bounce-dot [animation-delay:0.15s]" />
        <span className="h-2 w-2 rounded-full bg-accent animate-bounce-dot [animation-delay:0.3s]" />
      </div>
    </div>
  );
};

export default SplashScreen;