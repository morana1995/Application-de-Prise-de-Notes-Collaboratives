"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, KeyRound } from "lucide-react";
import { toast } from "sonner";

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.ok) {
      toast.success("Connexion réussie");
      const role = email.endsWith("@notenexus.com") ? "admin" : "user";
      router.push(role === "admin" ? "/admin" : "/");
    } else {
      toast.error("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-white ">
      {/* Illustration Section */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 text-center space-y-2">
      <h1 className="text-4xl font-bold text-[#5f42e6]">NoteNexus</h1>
         <p className="text-sm text-gray-600">Vos idées, ensemble, partout.</p>
        <Image
          src="/images/Personal_settings.png"
          alt="Illustration"
          width={500}
          height={500}
          priority
          className="p-2"
        />
        
        <p className="text-gray-700 text-base font-bold">
          Organisez vos idées, partagez vos connaissances, et accédez à vos notes
          partout avec NoteNexus.
        </p>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-lg p-6 shadow-md border border-gray-200 space-y-6"
        >
          <div className="text-left space-y-1">
            <h2 className="text-2xl font-bold text-black">Connexion</h2>
            <p className="text-gray-600 text-sm">
              Connectez-vous à votre compte pour accéder à vos notes
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10"
                />
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5f42e6] hover:bg-[#4c33bf] text-white font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              "Connexion en cours..."
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </>
            )}
          </Button>

          <p className="text-center text-sm text-gray-700">
            Vous n'avez pas de compte ?{" "}
            <Link href="/register" className="text-[#5f42e6] hover:underline font-medium">
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
