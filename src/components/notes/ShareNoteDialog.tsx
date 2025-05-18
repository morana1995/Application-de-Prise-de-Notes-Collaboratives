
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Copy, Mail, Link, X, Check } from 'lucide-react';

interface Collaborator {
  id: string;
  name: string;
  email: string;
  image?: string;
  permission: 'read' | 'edit';
}

interface ShareNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteId: string;
  noteTitle: string;
  collaborators: Collaborator[];
  onAddCollaborator: (email: string, permission: 'read' | 'edit') => void;
  onRemoveCollaborator: (id: string) => void;
  onUpdateCollaborator: (id: string, permission: 'read' | 'edit') => void;
}

const ShareNoteDialog: React.FC<ShareNoteDialogProps> = ({
  open,
  onOpenChange,
  noteId,
  noteTitle,
  collaborators,
  onAddCollaborator,
  onRemoveCollaborator,
  onUpdateCollaborator
}) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'read' | 'edit'>('read');
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/notes/shared/${noteId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onAddCollaborator(email, permission);
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Share Note</DialogTitle>
          <DialogDescription>
            Share "{noteTitle}" with others and manage collaborator permissions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Share Link */}
          <div className="space-y-2">
            <Label>Share Link</Label>
            <div className="flex gap-2">
              <Input 
                value={shareLink} 
                readOnly 
                className="flex-1"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Add Collaborator Form */}
          <form onSubmit={handleAddCollaborator} className="space-y-2">
            <Label>Add People</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="flex-1"
              />
              <Select 
                value={permission}
                onValueChange={(value) => setPermission(value as 'read' | 'edit')}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Can view</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="secondary">
                <Mail className="h-4 w-4 mr-2" />
                Invite
              </Button>
            </div>
          </form>
          
          {/* Collaborators Table */}
          {collaborators.length > 0 && (
            <div className="space-y-2">
              <Label>People with access</Label>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaborators.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={person.image} />
                              <AvatarFallback className="bg-brand-100 text-brand-800">
                                {person.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{person.name}</p>
                              <p className="text-xs text-muted-foreground">{person.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select 
                            defaultValue={person.permission}
                            onValueChange={(value) => 
                              onUpdateCollaborator(person.id, value as 'read' | 'edit')
                            }
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="read">Can view</SelectItem>
                              <SelectItem value="edit">Can edit</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => onRemoveCollaborator(person.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareNoteDialog;
