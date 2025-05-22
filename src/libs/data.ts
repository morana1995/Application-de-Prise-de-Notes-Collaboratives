
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
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    image?: string | null;
  };
  category?: {
    name: string;
    color?: string;
  };
  collaborators?: any[];
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










