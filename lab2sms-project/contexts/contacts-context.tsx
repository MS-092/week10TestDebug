import React, { createContext, useContext } from 'react';
import { useContacts, CustomContact } from '@/hooks/use-contacts';

interface ContactsContextType {
  allContacts: CustomContact[];
  customContacts: CustomContact[];
  deviceContacts: CustomContact[];
  permissionStatus: string | null;
  isLoading: boolean;
  addCustomContact: (name: string, phone: string) => Promise<CustomContact>;
  deleteCustomContact: (id: string) => Promise<void>;
  refreshContacts: () => Promise<void>;
}

const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

export function ContactsProvider({ children }: { children: React.ReactNode }) {
  const contacts = useContacts();
  return <ContactsContext.Provider value={contacts}>{children}</ContactsContext.Provider>;
}

export function useContactsContext() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContactsContext must be used within a ContactsProvider');
  }
  return context;
}
