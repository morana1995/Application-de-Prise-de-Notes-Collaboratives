
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import NoteGrid from '@/components/notes/NoteGrid';
import NoteEditor from '@/components/notes/NoteEditor';
import ShareNoteDialog from '@/components/notes/ShareNoteDialog';
import { Plus, Search, SortAsc, SortDesc, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data (same as Dashboard)
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
  },
  {
    id: '5',
    title: 'Weekly Goals',
    content: 'Complete project proposal, start learning TypeScript, exercise 3 times, read 2 chapters of "Clean Code"',
    category: 'personal',
    isFavorite: false,
    isPublic: false,
    updatedAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
  },
  {
    id: '6',
    title: 'Recipe - Chocolate Cake',
    content: 'Ingredients: flour, sugar, cocoa powder, eggs, milk, vanilla extract. Instructions: Mix dry ingredients...',
    category: 'personal',
    isFavorite: false,
    isPublic: true,
    updatedAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
  }
];

const Notes = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState(mockNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editorOpen, setEditorOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  // Filter and sort notes
  const filteredNotes = notes.filter(note => {
    // Search term filter
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Sort by date
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

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
          note.id === noteData.id ? { ...note, ...noteData, updatedAt: new Date().toISOString() } : note
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
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${email} with ${permission} permission`,
    });
  };

  const handleRemoveCollaborator = (id: string) => {
    toast({
      title: "Collaborator removed",
      description: "The user no longer has access to this note",
    });
  };

  const handleUpdateCollaborator = (id: string, permission: 'read' | 'edit') => {
    toast({
      title: "Permission updated",
      description: `User's permission changed to ${permission}`,
    });
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">All Notes</h1>
          <Button onClick={() => { setSelectedNote(null); setEditorOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            New Note
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="ideas">Ideas</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort Toggle */}
          <Button variant="outline" onClick={toggleSortOrder}>
            {sortOrder === 'desc' ? (
              <>
                <SortDesc className="mr-2 h-4 w-4" />
                Newest First
              </>
            ) : (
              <>
                <SortAsc className="mr-2 h-4 w-4" />
                Oldest First
              </>
            )}
          </Button>
        </div>

        {/* Note Grid */}
        <div className="pt-2">
          <NoteGrid 
            notes={filteredNotes}
            onToggleFavorite={handleToggleFavorite}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShare}
          />
        </div>
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

export default Notes;
