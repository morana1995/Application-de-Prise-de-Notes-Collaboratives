
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState({
    noteShared: true,
    noteUpdated: true,
    groupInvite: true,
    marketing: false,
  });
  
  const [pushNotifications, setPushNotifications] = useState({
    noteShared: true,
    noteUpdated: true,
    groupInvite: true,
  });
  
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Préférences de notifications enregistrées",
      description: "Vos préférences de notifications ont été mises à jour.",
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notifications par email</CardTitle>
          <CardDescription>
            Gérez les emails que vous recevez de notre part.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="email-note-shared">Partage de note</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email quand quelqu'un partage une note avec vous.
                  </p>
                </div>
                <Switch
                  id="email-note-shared"
                  checked={emailNotifications.noteShared}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, noteShared: checked })
                  }
                />
              </div>
              
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="email-note-updated">Modifications de note</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email quand une note partagée est modifiée.
                  </p>
                </div>
                <Switch
                  id="email-note-updated"
                  checked={emailNotifications.noteUpdated}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, noteUpdated: checked })
                  }
                />
              </div>
              
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="email-group-invite">Invitations de groupe</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir un email lorsque vous êtes invité à rejoindre un groupe.
                  </p>
                </div>
                <Switch
                  id="email-group-invite"
                  checked={emailNotifications.groupInvite}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, groupInvite: checked })
                  }
                />
              </div>
              
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="email-marketing">Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des emails concernant les nouveautés et conseils.
                  </p>
                </div>
                <Switch
                  id="email-marketing"
                  checked={emailNotifications.marketing}
                  onCheckedChange={(checked) =>
                    setEmailNotifications({ ...emailNotifications, marketing: checked })
                  }
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notifications push</CardTitle>
          <CardDescription>
            Configurez les notifications dans l'application et sur votre appareil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="push-note-shared">Partage de note</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir une notification quand quelqu'un partage une note avec vous.
                  </p>
                </div>
                <Switch
                  id="push-note-shared"
                  checked={pushNotifications.noteShared}
                  onCheckedChange={(checked) =>
                    setPushNotifications({ ...pushNotifications, noteShared: checked })
                  }
                />
              </div>
              
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="push-note-updated">Modifications de note</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir une notification quand une note partagée est modifiée.
                  </p>
                </div>
                <Switch
                  id="push-note-updated"
                  checked={pushNotifications.noteUpdated}
                  onCheckedChange={(checked) =>
                    setPushNotifications({ ...pushNotifications, noteUpdated: checked })
                  }
                />
              </div>
              
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="push-group-invite">Invitations de groupe</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir une notification lorsque vous êtes invité à rejoindre un groupe.
                  </p>
                </div>
                <Switch
                  id="push-group-invite"
                  checked={pushNotifications.groupInvite}
                  onCheckedChange={(checked) =>
                    setPushNotifications({ ...pushNotifications, groupInvite: checked })
                  }
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings;
