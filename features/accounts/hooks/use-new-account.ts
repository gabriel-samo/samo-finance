import { create } from "zustand";

// Define the type for the new account store
type NewAccountStore = {
  isOpen: boolean; // State to track if the new account sheet is open
  onOpen: () => void; // Function to open the new account sheet
  onClose: () => void; // Function to close the new account sheet
};

// Create the Zustand store for managing the new account sheet state
export const useNewAccount = create<NewAccountStore>((set) => ({
  isOpen: false, // Initial state: the new account sheet is closed
  onOpen: () => set({ isOpen: true }), // Function to open the sheet by setting isOpen to true
  onClose: () => set({ isOpen: false }) // Function to close the sheet by setting isOpen to false
}));
