export interface User {
  username: string;
  password: string;
  role: 'user' | 'manager';
}

export interface Document {
  id: string;
  name: string;
  uploadDate: string;
  metadata: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

