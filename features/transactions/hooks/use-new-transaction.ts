import { create } from "zustand";

// Define the type for the new transaction store
type NewTransactionStore = {
  isOpen: boolean; // State to track if the new transaction sheet is open
  onOpen: () => void; // Function to open the new transaction sheet
  onClose: () => void; // Function to close the new transaction sheet
};

// Create the Zustand store for managing the new transaction sheet state
// This store will be used to control the visibility of the new transaction sheet component.
// The `isOpen` state determines whether the sheet is currently visible or not.
// The `onOpen` function sets `isOpen` to true, making the sheet visible.
// The `onClose` function sets `isOpen` to false, hiding the sheet.
export const useNewTransaction = create<NewTransactionStore>((set) => ({
  isOpen: false, // Initial state: the new transaction sheet is closed
  onOpen: () => set({ isOpen: true }), // Function to open the sheet by setting isOpen to true
  onClose: () => set({ isOpen: false }) // Function to close the sheet by setting isOpen to false
}));
