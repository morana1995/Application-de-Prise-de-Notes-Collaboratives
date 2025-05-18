
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoteGrid from '@/components/notes/NoteGrid';
import NoteEditor from '@/components/notes/NoteEditor';
import ShareNoteDialog from '@/components/notes/ShareNoteDialog';
import { Plus, FileText, Star, Share2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockNotes = [
  {
    id: '1',
    title: 'Project Ideas',
    content: 'List of project ideas for the upcoming hackathon: 1. AI-powered note taking app, 2. Health tracking dashboard, 3. Social media analytics tool',
    category: 'work',
    isFavorite: true,
    isPublic: false,
    updatedAt: new Date().toISOString(),
    collaborators: [
      { id: 'user1', name: 'Alex Johnson', image: '' },
      { id: 'user2', name: 'Sarah Williams', image: '' }
    ]
  },
  {
    id: '2',
    title: 'Meeting Notes - Design Team',
    content: 'Discussed UI improvements for the dashboard. Action items: 1. Update color palette, 2. Improve mobile responsiveness, 3. Revise navigation structure',
    category: 'work',
    isFavorite: false,
    isPublic: false,
    updatedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: '3',
    title: 'Vacation Planning',
    content: 'Places to visit: 1. Barcelona, 2. Rome, 3. Paris. Budget approximately $3000. Travel dates: June 15-30.',
    category: 'personal',
    isFavorite: true,
    isPublic: false,
    updatedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: '4',
    title: 'Book Recommendations',
    content: 'Fiction: "Project Hail Mary" by Andy Weir, "The Midnight Library" by Matt Haig. Non-fiction: "Atomic Habits" by James Clear, "Four Thousand Weeks" by Oliver Burkeman',
    category: 'personal',
    isFavorite: false,
    isPublic: true,
    updatedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  }
];

// Stats for the dashboard
const stats = [
  {
    title: "Total Notes",
    value: "24",
    icon: FileText,
    description: "All your notes",
  },
  {
    title: "Favorites",
    value: "7",
    icon: Star,
    description: "Notes marked as favorite",
  },
  {
    title: "Shared Notes",
    value: "12",
    icon: Share2,
    description: "Notes shared with others",
  },
  {
    title: "Recent Activity",
    value: "5",
    icon: Clock,
    description: "Notes edited in the last 7 days",
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [editorOpen, setEditorOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [notes, setNotes] = useState(mockNotes);

  // Handle toggling favorites
  const handleToggleFavorite = (id: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, isFavorite: !note.isFavorite } : note
      )
    );
    
    const note = notes.find(n => n.id === id);
    if (note) {
      toast({
        title: note.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: note.title,
      });
    }
  };

  // Handle editing a note
  const handleEdit = (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setSelectedNote(noteToEdit);
      setEditorOpen(true);
    }
  };

  // Handle deleting a note
  const handleDelete = (id: string) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    toast({
      title: "Note deleted",
      description: "The note has been permanently deleted",
    });
  };

  // Handle sharing a note
  const handleShare = (id: string) => {
    const noteToShare = notes.find(note => note.id === id);
    if (noteToShare) {
      setSelectedNote(noteToShare);
      setShareDialogOpen(true);
    }
  };

  // Handle saving a note (new or edited)
  const handleSaveNote = (noteData: any) => {
    if (noteData.id) {
      // Edit existing note
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === noteData.id ? { ...note, ...noteData } : note
        )
      );
      toast({
        title: "Note updated",
        description: "Your changes have been saved",
      });
    } else {
      // Create new note
      const newNote = {
        ...noteData,
        id: Date.now().toString(),
        isFavorite: false,
        updatedAt: new Date().toISOString(),
      };
      setNotes(prevNotes => [newNote, ...prevNotes]);
      toast({
        title: "Note created",
        description: "Your new note has been saved",
      });
    }
  };

  // Mock functions for share dialog
  const handleAddCollaborator = (email: string, permission: 'read' | 'edit') => {
    // In a real app, this would send an invitation and update the database
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${email} with ${permission} permission`,
    });
  };

  const handleRemoveCollaborator = (id: string) => {
    // In a real app, this would remove the collaborator from the database
    toast({
      title: "Collaborator removed",
      description: "The user no longer has access to this note",
    });
  };

  const handleUpdateCollaborator = (id: string, permission: 'read' | 'edit') => {
    // In a real app, this would update the collaborator's permission in the database
    toast({
      title: "Permission updated",
      description: `User's permission changed to ${permission}`,
    });
  };

  const recentNotes = [...notes].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  ).slice(0, 8);

  const favoriteNotes = notes.filter(note => note.isFavorite);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={() => { setSelectedNote(null); setEditorOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for recent and favorite notes */}
        <Tabs defaultValue="recent">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="recent">Recent Notes</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="recent" className="space-y-4">
            <NoteGrid 
              notes={recentNotes}
              onToggleFavorite={handleToggleFavorite}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onShare={handleShare}
            />
          </TabsContent>
          
          <TabsContent value="favorites" className="space-y-4">
            {favoriteNotes.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center">
                  <p className="text-muted-foreground">
                    You haven't favorited any notes yet. Click the star icon on a note to add it to favorites.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <NoteGrid 
                notes={favoriteNotes}
                onToggleFavorite={handleToggleFavorite}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Note editor dialog */}
      <NoteEditor 
        open={editorOpen}
        onOpenChange={setEditorOpen}
        initialData={selectedNote || {
          title: '',
          content: '',
          category: 'personal',
          isPublic: false,
        }}
        onSave={handleSaveNote}
      />

      {/* Share dialog */}
      {selectedNote && (
        <ShareNoteDialog 
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          noteId={selectedNote.id}
          noteTitle={selectedNote.title}
          collaborators={selectedNote.collaborators || []}
          onAddCollaborator={handleAddCollaborator}
          onRemoveCollaborator={handleRemoveCollaborator}
          onUpdateCollaborator={handleUpdateCollaborator}
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
