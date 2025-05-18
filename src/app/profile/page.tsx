'use client'

import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import { X, Pencil, Trash, Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user')
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur lors du chargement.')
        setUser(data.user)
      } catch (err: any) {
        toast.error(err.message || 'Erreur interne.')
      }
    }

    fetchUser()
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error)

      toast.success(data.message || "Mot de passe mis à jour.")
      setShowModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du changement.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return <p className="text-center mt-10 text-muted-foreground">Chargement...</p>

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">Profil</h1>
      <p className="text-muted-foreground mb-6">Consultez et gérez votre profil utilisateur.</p>

      {/* Informations du profil */}
      <div className="bg-white rounded-md shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-violet-100 text-violet-800 rounded-full h-14 w-14 flex items-center justify-center text-lg font-semibold uppercase">
            {user.name?.slice(0, 2) || '??'}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2 text-sm">
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Rôle :</strong> {user.role}</p>
          <p><strong>Compte :</strong> Actif</p>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm flex items-center gap-1">
            <Pencil size={16} /> Modifier
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 flex items-center gap-1">
            <Trash size={16} /> Supprimer le compte
          </button>
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
                <label className="text-sm font-semibold">Mot de passe actuel</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Nouveau mot de passe</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="w-full mt-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
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
  )
}
