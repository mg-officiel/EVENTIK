import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button"; 
import { Moon, Sun } from "lucide-react"; 

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">EVENTIK</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/allevents">Événements</Link>
            <Link to="/abonnement">Abonnements</Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Changer de thème"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <nav className="space-x-2">

             {/* logique pour l'authentification */}
            <Button asChild variant="ghost">
                <Link to="/login">Connexion</Link>
            </Button>
            <Button asChild>
                <Link to="/register">Inscription</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
