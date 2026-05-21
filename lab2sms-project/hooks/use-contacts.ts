import { useState, useEffect, useCallback } from 'react';
import * as Contacts from 'expo-contacts';
import * as SecureStore from 'expo-secure-store';

export interface CustomContact {
  id: string;
  name: string;
  phoneNumbers?: { number: string }[];
  isCustom?: boolean;
}

const CUSTOM_CONTACTS_KEY = 'custom_contacts_storage';

/**
 * Custom hook to manage both device and custom contacts
 */
export function useContacts() {
  const [deviceContacts, setDeviceContacts] = useState<CustomContact[]>([]);
  const [customContacts, setCustomContacts] = useState<CustomContact[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load custom contacts from SecureStore
  const loadCustomContacts = useCallback(async () => {
    try {
      const stored = await SecureStore.getItemAsync(CUSTOM_CONTACTS_KEY);
      if (stored) {
        setCustomContacts(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading custom contacts:', error);
    }
  }, []);

  // Save custom contacts to SecureStore
  const saveCustomContacts = useCallback(async (contacts: CustomContact[]) => {
    try {
      await SecureStore.setItemAsync(CUSTOM_CONTACTS_KEY, JSON.stringify(contacts));
      setCustomContacts(contacts);
    } catch (error) {
      console.error('Error saving custom contacts:', error);
    }
  }, []);

  // Load device contacts
  const loadDeviceContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      setPermissionStatus(status);
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
        });

        if (data.length > 0) {
          const formattedContacts: CustomContact[] = data.map(c => ({
            id: c.id,
            name: c.name || 'Unknown',
            phoneNumbers: c.phoneNumbers?.map(p => ({ number: p.number || '' })),
          }));
          setDeviceContacts(formattedContacts);
        }
      }
    } catch (error) {
      console.error('Error loading device contacts:', error);
      setPermissionStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomContacts();
    loadDeviceContacts();
  }, [loadCustomContacts, loadDeviceContacts]);

  const addCustomContact = useCallback(async (name: string, phone: string) => {
    const newContact: CustomContact = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      phoneNumbers: [{ number: phone.trim() }],
      isCustom: true,
    };
    const updated = [newContact, ...customContacts];
    await saveCustomContacts(updated);
    return newContact;
  }, [customContacts, saveCustomContacts]);

  const deleteCustomContact = useCallback(async (id: string) => {
    const updated = customContacts.filter(c => c.id !== id);
    await saveCustomContacts(updated);
  }, [customContacts, saveCustomContacts]);

  const allContacts = [...customContacts, ...deviceContacts];

  return {
    allContacts,
    customContacts,
    deviceContacts,
    permissionStatus,
    isLoading,
    addCustomContact,
    deleteCustomContact,
    refreshContacts: loadDeviceContacts,
  };
}
