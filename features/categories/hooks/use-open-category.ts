import { create } from "zustand";

// Define the type for the open category store
type OpenCategoryStore = {
  id?: string; // Optional state to track the ID of the category being opened
  isOpen: boolean; // State to track if the category sheet is open
  onOpen: (id: string) => void; // Function to open the category sheet with a specific category ID
  onClose: () => void; // Function to close the category sheet
};

// Create the Zustand store for managing the open category sheet state
export const useOpenCategory = create<OpenCategoryStore>((set) => ({
  id: undefined, // Initial state: no category ID is set
  isOpen: false, // Initial state: the category sheet is closed
  onOpen: (id: string) => set({ isOpen: true, id }), // Function to open the sheet by setting isOpen to true and setting the category ID
  onClose: () => set({ isOpen: false, id: undefined }) // Function to close the sheet by setting isOpen to false and clearing the category ID
}));
