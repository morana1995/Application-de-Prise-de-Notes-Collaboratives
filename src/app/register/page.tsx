"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, KeyRound, UserPlus, User } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        return;
      }

      toast.success("Compte créé avec succès");
      router.push("/");
    } catch (error) {
      toast.error("Erreur serveur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Formulaire */}
      <div className="w-full lg:w-1/2 px-10 lg:px-24 py-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Créer un compte</h1>
        <p className="text-gray-600 mb-6">
          Inscrivez-vous pour commencer à utiliser <b>NoteNexus</b>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700 text-sm">Nom Complet</Label>
            <div className="relative mt-1">
              <Input
                id="name"
                type="text"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 text-sm">Email</Label>
            <div className="relative mt-1">
              <Input
                id="email"
                type="email"
                placeholder="nom@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 text-sm">Mot de passe</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-700 text-sm">Confirmer le mot de passe</Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-violet-600 hover:bg-violet-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Inscription..." : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                S'inscrire
              </>
            )}
          </Button>
        </form>

        <p className="mt-4 text-sm text-gray-700">
          Vous avez déjà un compte ?{" "}
          <a href="/login" className="text-violet-600 font-medium hover:underline">
            Se connecter
          </a>
        </p>
      </div>

      {/* Image illustrée */}
      <div className="hidden lg:flex w-1/2 bg-gray-50 items-center justify-center flex-col px-10">
        <h2 className="text-3xl font-bold text-violet-700 mb-2">NoteNexus</h2>
        <p className="text-sm text-gray-600 mb-6">Rejoignez-nous!</p>
        <Image
          src="/images/note.png"
          alt="Illustration inscription"
          width={300}
          height={300}
          className="mb-4"
        />
        <p className="text-center text-gray-700 text-sm max-w-sm font-bold">
          Créez un compte pour commencer à organiser vos notes et à partager vos idées avec votre équipe.
        </p>
      </div>
    </div>
  );
}
