export interface WeddingProject {
  id: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  theme: string;
  coverImage?: string;
  createdAt: string;
}

export type TaskCategory = 'venue' | 'dress' | 'catering' | 'photo' | 'ceremony' | 'other';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';
export type Assignee = 'groom' | 'bride' | 'groom_father' | 'groom_mother' | 'bride_father' | 'bride_mother';

export interface ChecklistTask {
  id: string;
  category: TaskCategory;
  title: string;
  description?: string;
  deadline: string;
  assignee: Assignee;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
}

export type GuestRelation = 'groom_side' | 'bride_side';
export type RSVPStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relation: GuestRelation;
  group?: string;
  seatPreference?: string;
  rsvpStatus: RSVPStatus;
  confirmedAt?: string;
  checkedIn: boolean;
  checkedInAt?: string;
  plusOne?: boolean;
  plusOneName?: string;
  notes?: string;
  tableId?: string;
  seatNumber?: number;
}

export type TableType = 'round' | 'square';

export interface Table {
  id: string;
  name: string;
  type: TableType;
  capacity: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budget: number;
  spent: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  title: string;
  amount: number;
  date: string;
  notes?: string;
  payee?: string;
}

export interface AlbumPhoto {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
  category?: string;
}

export interface Invitation {
  id: string;
  templateId: string;
  title: string;
  subtitle?: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  personalizedMessage?: string;
}

export type PageKey =
  | 'dashboard'
  | 'project'
  | 'checklist'
  | 'guests'
  | 'invitations'
  | 'seating'
  | 'budget'
  | 'checkin'
  | 'album';
