import { create } from "zustand";

// Define the type for the open account store
type OpenAccountStore = {
  id?: string; // Optional state to track the ID of the account being opened
  isOpen: boolean; // State to track if the account sheet is open
  onOpen: (id: string) => void; // Function to open the account sheet with a specific account ID
  onClose: () => void; // Function to close the account sheet
};

// Create the Zustand store for managing the open account sheet state
export const useOpenAccount = create<OpenAccountStore>((set) => ({
  id: undefined, // Initial state: no account ID is set
  isOpen: false, // Initial state: the account sheet is closed
  onOpen: (id: string) => set({ isOpen: true, id }), // Function to open the sheet by setting isOpen to true and setting the account ID
  onClose: () => set({ isOpen: false, id: undefined }) // Function to close the sheet by setting isOpen to false and clearing the account ID
}));
