"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserPlus, NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isAdminEmail = email.endsWith("@notenexus.com");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erreur lors de l'inscription");
        setIsLoading(false);
        return;
      }

      toast.success("Compte créé avec succès");

      if (data.user.role === "admin") {
        toast.success("Vous êtes connecté en tant qu'administrateur");
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast.error("Erreur serveur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-5xl flex flex-row-reverse gap-8 items-center">
        {/* Illustration */}
        <div className="hidden lg:flex lg:flex-1 flex-col items-center justify-center animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-primary">NoteNexus</h1>
            <p className="text-xl text-gray-700 mt-2">Rejoignez-nous!</p>
          </div>
          <div className="relative w-full h-64">
            <NotebookPen
              className="h-64 w-64 text-primary mx-auto"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent bottom-0 opacity-30"></div>
          </div>
          <div className="text-center mt-6 max-w-md">
            <p className="text-gray-700">
              Créez un compte pour commencer à organiser vos notes et à
              partager vos idées avec votre équipe.
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="w-full lg:w-1/2 lg:flex-1">
          <Card className="border-t-4 border-t-primary bg-white shadow-lg">
            <CardHeader className="bg-gray-100 rounded-t-lg">
              <CardTitle className="text-gray-900">Créer un compte</CardTitle>
              <CardDescription className="text-gray-700">
                Inscrivez-vous pour commencer à utiliser NoteNexus
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6 bg-white">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-800">
                    Nom complet
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    className="text-primary font-semibold bg-gray-50 border-gray-200 focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-800">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-50 border-gray-200 focus:border-primary text-primary font-semibold"
                  />
                  {isAdminEmail && (
                    <p className="text-sm text-primary">
                      Vous vous inscrivez avec un email administrateur.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-800">
                    Mot de passe
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-50 border-gray-200 focus:border-primary text-primary font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-800">
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-gray-50 border-gray-200 focus:border-primary text-primary font-semibold"
                  />
                </div>
                <div className="text-sm text-gray-700 border-l-2 border-primary pl-2 py-1 bg-gray-50">
                  <p>
                    Pour créer un compte administrateur, utilisez un email se
                    terminant par <strong>@notenexus.com</strong>.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-2 pb-6 bg-white">
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Inscription en cours..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      S'inscrire
                    </>
                  )}
                </Button>
                <div className="text-center text-sm text-gray-800">
                  Vous avez déjà un compte?{" "}
                  <a href="/login" className="text-primary hover:underline font-medium">
                    Se connecter
                  </a>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
