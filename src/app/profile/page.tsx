"use client";

import { useEffect, useState, useRef } from "react";
import { Pencil, Trash, Lock, X, Camera } from "lucide-react";
import { getSession } from 'next-auth/react'
import Image from "next/image";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import MainLayout from "@/components/Layout/MainLayout";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [editedImage, setEditedImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Erreur lors du chargement.");
        setUser(data.user);
        setEditedName(data.user.name || "");
        setEditedBio(data.user.bio || "");
        setEditedImage(data.user.image || "");
      } catch (err: any) {
        toast.error(err.message || "Erreur interne.");
      }
    }

    fetchUser();
  }, []);

  const handleEditToggle = () => setEditMode(!editMode);

  const handleAvatarClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setEditedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editedName,
          bio: editedBio,
          image: editedImage.startsWith("data:image/") 
      ? null 
      : editedImage,
       imageData: editedImage.startsWith("data:image/") 
      ? editedImage.split(",")[1] 
      : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(data.user);
      toast.success("Profil mis à jour avec succès.");
      setEditMode(false);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la mise à jour.");
    }
  };

  if (!user)
    return (
      <p className="text-center mt-10 text-muted-foreground">Chargement...</p>
    );

  return (<MainLayout>
    
    <div className="p-6 relative">
      <h1 className="text-3xl font-bold mb-2">Profil</h1>
      <p className="text-muted-foreground mb-6">
        Consultez et gérez votre profil utilisateur.
      </p>

      {/* Carte Profil */}
      <div className="bg-white rounded-md shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div
            className="relative cursor-pointer"
            onClick={editMode ? handleAvatarClick : undefined}
          >
            {editedImage ? (
              <Image
                src={editedImage}
                alt={editedName}
                width={56}
                height={56}
                className="rounded-full"
              />
            ) : (
              <div className="bg-violet-100 text-violet-800 rounded-full h-14 w-14 flex items-center justify-center text-lg font-semibold uppercase">
                {editedName.slice(0, 2) || "??"}
              </div>
            )}
            {editMode && (
              <>
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                  <Camera size={16} className="text-violet-500" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </>
            )}
          </div>

          <div>
            <p className="text-xl font-semibold">{editedName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="mt-6 space-y-4 text-sm">
          <div>
            {editMode ? ( <>
             <label className="block font-medium text-gray-700">Nom :</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              </>
            ) : (
            <p><strong>Nom :</strong> {user.name}</p>
            )}
          </div>
          <div>
           
            {editMode ? (
              <>
               <label className="block font-medium text-gray-700">Email :</label>
              <input
  type="email"
  value={user.email}
  readOnly
  className="w-full mt-1 p-2 rounded-md bg-gray-100 border border-gray-300 hover:cursor-not-allowed"
/>
<p className="text-xs text-rose-500 m-1">L'email ne peut pas être modifié.</p>
 </> ) : (
             <p><strong>Email :</strong> {user.email}</p>
            )}
          </div>

          <div>
           
            {editMode ? (<>
             <label className="block font-medium text-gray-700">Bio :</label>
              <Textarea
                rows={3}
                placeholder="Écrivez quelque chose sur vous..."
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              </>
            ) : (
              <p><strong>Bio :</strong> {user.bio || "Aucune bio"}</p>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm flex items-center gap-1"
          >
            {editMode ? (
              <>
                <X size={16} /> Annuler
              </>
            ) : (
              <>
                <Pencil size={16} /> Modifier
              </>
            )}
          </button>

          {!editMode && (
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 flex items-center gap-1">
              <Trash size={16} /> Supprimer le compte
            </button>
          )}

 {/* Bouton Enregistrer */}
      {editMode && (
          <button
            onClick={handleSaveChanges}
            className="bg-violet-100 text-violet-700 px-4 py-2 rounded shadow-md hover:bg-violet-300 flex items-center gap-1"
          >
            Enregistrer les modifications
          </button>
        
      )}

        </div>
       

      </div>

      

      {/* Section sécurité */}
      <div className="bg-white rounded-md shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-1">Sécurité du compte</h2>
        <p className="text-sm text-muted-foreground mb-4">Options pour gérer la sécurité de votre compte</p>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 text-sm flex items-center gap-1"
        >
          <Lock size={16} /> Changer le mot de passe
        </button>
      </div>

      {/* Modal pour changer le mot de passe */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-semibold mb-1">Changer le mot de passe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Entrez votre mot de passe actuel et votre nouveau mot de passe.
            </p>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block font-medium text-purple-900">Mot de passe actuel</label>
                <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              </div>
              <div>
                <label className="block font-medium text-purple-900">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium text-purple-900">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 rounded-md bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
              >
                {isLoading ? "Traitement..." : "Changer le mot de passe"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    
  </MainLayout>);
}
