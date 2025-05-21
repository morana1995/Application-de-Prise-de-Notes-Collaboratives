
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  isFavorite: boolean;
  isPublic: boolean;
  author: User;
  collaborators: User[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Group {
  id: string;
  name: string;
  members: User[];
}










