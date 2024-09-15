import { create } from "zustand";

// Define the type for the open transaction store
type OpenTransactionState = {
  id?: string; // Optional state to track the ID of the transaction being opened
  isOpen: boolean; // State to track if the transaction sheet is open
  onOpen: (id: string) => void; // Function to open the transaction sheet with a specific transaction ID
  onClose: () => void; // Function to close the transaction sheet
};

// Create the Zustand store for managing the open transaction sheet state
export const useOpenTransaction = create<OpenTransactionState>((set) => ({
  id: undefined, // Initial state: no transaction ID is set
  isOpen: false, // Initial state: the transaction sheet is closed
  onOpen: (id: string) => set({ isOpen: true, id }), // Function to open the sheet by setting isOpen to true and setting the transaction ID
  onClose: () => set({ isOpen: false, id: undefined }) // Function to close the sheet by setting isOpen to false and clearing the transaction ID
}));
