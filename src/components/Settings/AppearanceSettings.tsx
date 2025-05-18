
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const AppearanceSettings = () => {
  const [theme, setTheme] = useState("system");
  const [fontSize, setFontSize] = useState("medium");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Préférences d'apparence sauvegardées",
      description: "Vos préférences d'apparence ont été mises à jour.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apparence</CardTitle>
          <CardDescription>
            Personnalisez l'apparence de l'application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Thème</Label>
              <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem
                    value="light"
                    id="theme-light"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="theme-light"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="rounded-md border border-border p-2 w-full bg-white">
                      <div className="h-4 w-full rounded-sm bg-[#eaeaea]" />
                      <div className="mt-1 h-10 w-full rounded-sm bg-[#f6f6f6]" />
                    </div>
                    <span className="mt-3 block w-full text-center font-normal">
                      Clair
                    </span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="dark"
                    id="theme-dark"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="theme-dark"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="rounded-md border border-border p-2 w-full bg-[#2a2a2a]">
                      <div className="h-4 w-full rounded-sm bg-[#444444]" />
                      <div className="mt-1 h-10 w-full rounded-sm bg-[#333333]" />
                    </div>
                    <span className="mt-3 block w-full text-center font-normal">
                      Sombre
                    </span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="system"
                    id="theme-system"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="theme-system"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="rounded-md border border-border p-2 w-full bg-gradient-to-r from-white to-[#2a2a2a]">
                      <div className="h-4 w-full rounded-sm bg-gradient-to-r from-[#eaeaea] to-[#444444]" />
                      <div className="mt-1 h-10 w-full rounded-sm bg-gradient-to-r from-[#f6f6f6] to-[#333333]" />
                    </div>
                    <span className="mt-3 block w-full text-center font-normal">
                      Système
                    </span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label>Taille du texte</Label>
              <RadioGroup value={fontSize} onValueChange={setFontSize} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem
                    value="small"
                    id="font-small"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="font-small"
                    className="flex items-center justify-center rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-sm">Petite</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="medium"
                    id="font-medium"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="font-medium"
                    className="flex items-center justify-center rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-base">Moyenne</span>
                  </Label>
                </div>
                
                <div>
                  <RadioGroupItem
                    value="large"
                    id="font-large"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="font-large"
                    className="flex items-center justify-center rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-lg">Grande</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;
