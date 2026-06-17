import { create } from 'zustand';
import {
  WeddingProject,
  ChecklistTask,
  Guest,
  Table,
  BudgetCategory,
  Expense,
  AlbumPhoto,
} from '@/types';
import {
  defaultProject,
  defaultChecklist,
  defaultGuests,
  defaultTables,
  defaultBudgetCategories,
  defaultExpenses,
  defaultAlbumPhotos,
} from '@/data/mockData';
import { generateId, loadFromStorage, saveToStorage } from '@/utils';

interface WeddingStore {
  project: WeddingProject;
  tasks: ChecklistTask[];
  guests: Guest[];
  tables: Table[];
  budgetCategories: BudgetCategory[];
  expenses: Expense[];
  photos: AlbumPhoto[];
  currentPage: string;

  setCurrentPage: (page: string) => void;

  updateProject: (data: Partial<WeddingProject>) => void;

  addTask: (task: Omit<ChecklistTask, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, data: Partial<ChecklistTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;

  addGuest: (guest: Omit<Guest, 'id' | 'checkedIn'>) => void;
  updateGuest: (id: string, data: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  setGuestRSVP: (id: string, status: Guest['rsvpStatus']) => void;
  toggleGuestCheckIn: (id: string) => void;
  assignGuestSeat: (guestId: string, tableId: string, seatNumber: number) => void;
  unassignGuestSeat: (guestId: string) => void;

  addTable: (table: Omit<Table, 'id'>) => void;
  updateTable: (id: string, data: Partial<Table>) => void;
  deleteTable: (id: string) => void;

  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateCategoryBudget: (categoryId: string, budget: number) => void;

  addPhoto: (photo: Omit<AlbumPhoto, 'id' | 'uploadedAt'>) => void;
  deletePhoto: (id: string) => void;
  updatePhoto: (id: string, data: Partial<AlbumPhoto>) => void;

  recalculateBudgetSpent: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'wedding-planner-data';

const getInitialState = () => {
  const saved = loadFromStorage<Partial<WeddingStore>>(STORAGE_KEY, {});
  return {
    project: saved.project || defaultProject,
    tasks: saved.tasks || defaultChecklist,
    guests: saved.guests || defaultGuests,
    tables: saved.tables || defaultTables,
    budgetCategories: saved.budgetCategories || defaultBudgetCategories,
    expenses: saved.expenses || defaultExpenses,
    photos: saved.photos || defaultAlbumPhotos,
    currentPage: saved.currentPage || 'dashboard',
  };
};

export const useWeddingStore = create<WeddingStore>((set, get) => ({
  ...getInitialState(),

  setCurrentPage: (page) => {
    set({ currentPage: page });
    saveToStorage(STORAGE_KEY, get());
  },

  updateProject: (data) => {
    set((state) => ({ project: { ...state.project, ...data } }));
    saveToStorage(STORAGE_KEY, get());
  },

  addTask: (task) => {
    const newTask: ChecklistTask = {
      ...task,
      id: generateId('task'),
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
    saveToStorage(STORAGE_KEY, get());
  },

  updateTask: (id, data) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    saveToStorage(STORAGE_KEY, get());
  },

  toggleTaskStatus: (id) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== id) return t;
        const nextStatus: ChecklistTask['status'] =
          t.status === 'pending' ? 'in_progress' : t.status === 'in_progress' ? 'completed' : 'pending';
        return { ...t, status: nextStatus };
      }),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  addGuest: (guest) => {
    const newGuest: Guest = { ...guest, id: generateId('g'), checkedIn: false };
    set((state) => ({ guests: [...state.guests, newGuest] }));
    saveToStorage(STORAGE_KEY, get());
  },

  updateGuest: (id, data) => {
    set((state) => ({
      guests: state.guests.map((g) => (g.id === id ? { ...g, ...data } : g)),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  deleteGuest: (id) => {
    set((state) => ({ guests: state.guests.filter((g) => g.id !== id) }));
    saveToStorage(STORAGE_KEY, get());
  },

  setGuestRSVP: (id, status) => {
    set((state) => ({
      guests: state.guests.map((g) =>
        g.id === id
          ? {
              ...g,
              rsvpStatus: status,
              confirmedAt: status === 'confirmed' ? new Date().toISOString() : undefined,
            }
          : g
      ),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  toggleGuestCheckIn: (id) => {
    set((state) => ({
      guests: state.guests.map((g) => {
        if (g.id !== id) return g;
        const checked = !g.checkedIn;
        return {
          ...g,
          checkedIn: checked,
          checkedInAt: checked ? new Date().toISOString() : undefined,
        };
      }),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  assignGuestSeat: (guestId, tableId, seatNumber) => {
    set((state) => ({
      guests: state.guests.map((g) =>
        g.id === guestId ? { ...g, tableId, seatNumber } : g
      ),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  unassignGuestSeat: (guestId) => {
    set((state) => ({
      guests: state.guests.map((g) =>
        g.id === guestId ? { ...g, tableId: undefined, seatNumber: undefined } : g
      ),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  addTable: (table) => {
    const newTable: Table = { ...table, id: generateId('t') };
    set((state) => ({ tables: [...state.tables, newTable] }));
    saveToStorage(STORAGE_KEY, get());
  },

  updateTable: (id, data) => {
    set((state) => ({
      tables: state.tables.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  deleteTable: (id) => {
    set((state) => {
      const guests = state.guests.map((g) =>
        g.tableId === id ? { ...g, tableId: undefined, seatNumber: undefined } : g
      );
      return { tables: state.tables.filter((t) => t.id !== id), guests };
    });
    saveToStorage(STORAGE_KEY, get());
  },

  addExpense: (expense) => {
    const newExpense: Expense = { ...expense, id: generateId('e') };
    set((state) => ({ expenses: [...state.expenses, newExpense] }));
    get().recalculateBudgetSpent();
  },

  updateExpense: (id, data) => {
    set((state) => ({
      expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)),
    }));
    get().recalculateBudgetSpent();
  },

  deleteExpense: (id) => {
    set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) }));
    get().recalculateBudgetSpent();
  },

  updateCategoryBudget: (categoryId, budget) => {
    set((state) => ({
      budgetCategories: state.budgetCategories.map((c) =>
        c.id === categoryId ? { ...c, budget } : c
      ),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  recalculateBudgetSpent: () => {
    set((state) => {
      const categoryTotals = new Map<string, number>();
      state.expenses.forEach((e) => {
        const prev = categoryTotals.get(e.categoryId) || 0;
        categoryTotals.set(e.categoryId, prev + e.amount);
      });
      const budgetCategories = state.budgetCategories.map((c) => ({
        ...c,
        spent: categoryTotals.get(c.id) || 0,
      }));
      return { budgetCategories };
    });
    saveToStorage(STORAGE_KEY, get());
  },

  addPhoto: (photo) => {
    const newPhoto: AlbumPhoto = {
      ...photo,
      id: generateId('p'),
      uploadedAt: new Date().toISOString(),
    };
    set((state) => ({ photos: [...state.photos, newPhoto] }));
    saveToStorage(STORAGE_KEY, get());
  },

  deletePhoto: (id) => {
    set((state) => ({ photos: state.photos.filter((p) => p.id !== id) }));
    saveToStorage(STORAGE_KEY, get());
  },

  updatePhoto: (id, data) => {
    set((state) => ({
      photos: state.photos.map((p) => (p.id === id ? { ...p, ...data } : p)),
    }));
    saveToStorage(STORAGE_KEY, get());
  },

  resetAll: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      project: defaultProject,
      tasks: defaultChecklist,
      guests: defaultGuests,
      tables: defaultTables,
      budgetCategories: defaultBudgetCategories,
      expenses: defaultExpenses,
      photos: defaultAlbumPhotos,
      currentPage: 'dashboard',
    });
  },
}));
