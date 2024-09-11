import { create } from "zustand";

// Define the type for the new category store
type NewCategoryStore = {
  isOpen: boolean; // State to track if the new category sheet is open
  onOpen: () => void; // Function to open the new category sheet
  onClose: () => void; // Function to close the new category sheet
};

// Create the Zustand store for managing the new category sheet state
export const useNewCategory = create<NewCategoryStore>((set) => ({
  isOpen: false, // Initial state: the new category sheet is closed
  onOpen: () => set({ isOpen: true }), // Function to open the sheet by setting isOpen to true
  onClose: () => set({ isOpen: false }) // Function to close the sheet by setting isOpen to false
}));
