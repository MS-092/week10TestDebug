import { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, TextInput, useWindowDimensions, Modal, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { NeonColors } from '@/constants/theme';
import { useContactsContext } from '@/contexts/contacts-context';

/**
 * Contacts Screen - Contact Selection for SMS
 */
export default function ContactsScreen() {
  const { allContacts, permissionStatus, addCustomContact, deleteCustomContact } = useContactsContext();
  const [searchQuery, setSearchQuery] = useState('');
  
  // EXTRA: Multi-contact selection state - stores selected contact IDs
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());
  
  // EXTRA: Add contact modal state
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  
  const router = useRouter();
  const { width } = useWindowDimensions();
  
  // EXTRA: Responsive design - adaptive layout based on screen width
  const isLargeScreen = width >= 768;
  const maxWidth = isLargeScreen ? 800 : '100%';
  const numColumns = isLargeScreen ? 2 : 1;

  const getInitials = (name: string | null | undefined): string => {
    if (!name) return '?';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getRandomGradient = (index: number): [string, string, ...string[]] => {
    const gradients: [string, string, ...string[]][] = [
      [NeonColors.purple, NeonColors.pink],
      [NeonColors.cyan, NeonColors.purple],
      [NeonColors.pink, NeonColors.cyan],
      [NeonColors.purple, NeonColors.cyan],
      [NeonColors.cyan, NeonColors.pink],
    ];
    return gradients[index % gradients.length];
  };

  // EXTRA: Validate phone number - allows numbers and optional + at the beginning
  const validatePhoneNumber = (phone: string): boolean => {
    // Regex: optional + at start, followed by digits only
    const phoneRegex = /^\+?[0-9]+$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // EXTRA: Format phone number input - only allow valid characters
  const formatPhoneNumber = (text: string): string => {
    // Allow only + and numbers
    let formatted = text.replace(/[^0-9+]/g, '');
    // Ensure + is only at the beginning
    if (formatted.indexOf('+') > 0) {
      formatted = formatted.replace(/\+/g, '');
    }
    // Remove duplicate +
    const plusCount = (formatted.match(/\+/g) || []).length;
    if (plusCount > 1) {
      formatted = '+' + formatted.replace(/\+/g, '');
    }
    return formatted;
  };

  // EXTRA: Add new custom contact
  const handleAddCustomContact = async () => {
    if (!newContactName.trim()) {
      setFormError('Please enter a name');
      return;
    }
    
    const trimmedPhone = newContactPhone.trim();
    if (!trimmedPhone) {
      setFormError('Please enter a phone number');
      return;
    }
    
    if (!validatePhoneNumber(trimmedPhone)) {
      setFormError('Phone number can only contain numbers and optional + at the beginning');
      return;
    }
    
    await addCustomContact(newContactName, trimmedPhone);
    setNewContactName('');
    setNewContactPhone('');
    setFormError(null);
    setIsAddModalVisible(false);
  };

  // EXTRA: Toggle contact selection for multi-recipient SMS
  const toggleContactSelection = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  // EXTRA: Select all contacts with phone numbers
  const selectAllContacts = () => {
    const allIds = filteredContacts
      .filter((c) => c.phoneNumbers && c.phoneNumbers[0])
      .map((c) => c.id);
    setSelectedContacts(new Set(allIds));
  };

  // EXTRA: Clear all selections
  const clearSelection = () => {
    setSelectedContacts(new Set());
  };

  // EXTRA: Confirm selection and pass phone numbers back to Home screen
  const confirmSelection = () => {
    const selectedNumbers = allContacts
      .filter((c) => selectedContacts.has(c.id) && c.phoneNumbers && c.phoneNumbers[0])
      .map((c) => c.phoneNumbers?.[0]?.number)
      .filter((n): n is string => !!n);
    
    if (selectedNumbers.length > 0) {
      // Pass selected numbers as comma-separated string for multi-recipient SMS
      router.push({ 
        pathname: '/', 
        params: { 
          phoneNumbers: selectedNumbers.join(','),
          phoneNumber: selectedNumbers[0] // Also pass first number for backwards compatibility
        } 
      });
    }
  };

  const filteredContacts = allContacts.filter((contact) =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phoneNumbers?.some(p => p.number.includes(searchQuery))
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[NeonColors.darkBg, NeonColors.darkCard]}
        style={styles.header}
      >
        <View style={[styles.headerContent, { maxWidth }]}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={NeonColors.cyan} />
            </Pressable>
            
            <Pressable 
              onPress={() => setIsAddModalVisible(true)} 
              style={styles.addContactButton}
            >
              <Ionicons name="person-add" size={20} color={NeonColors.cyan} />
              <Text style={styles.addContactButtonText}>Add Custom</Text>
            </Pressable>
          </View>

          <Text style={styles.headerTitle}>CONTACTS</Text>
          
          {selectedContacts.size > 0 && (
            <View style={styles.selectionBadge}>
              <Text style={styles.selectionBadgeText}>{selectedContacts.size} selected</Text>
            </View>
          )}
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color={NeonColors.cyan} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#555"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.actionRow}>
            <Pressable onPress={selectAllContacts} style={styles.actionButton}>
              <Ionicons name="checkmark-done" size={16} color={NeonColors.cyan} />
              <Text style={styles.actionButtonText}>Select All</Text>
            </Pressable>
            <Pressable onPress={clearSelection} style={styles.actionButton}>
              <Ionicons name="close-circle" size={16} color={NeonColors.pink} />
              <Text style={[styles.actionButtonText, { color: NeonColors.pink }]}>Clear</Text>
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      {permissionStatus === 'denied' && (
        <View style={styles.permissionContainer}>
          <Ionicons name="lock-closed" size={64} color={NeonColors.pink} />
          <Text style={styles.permissionText}>Contact permission denied</Text>
          <Text style={styles.permissionSubtext}>Please enable contacts access in your system settings to see your contacts</Text>
          <Pressable 
            style={styles.settingsButton}
            onPress={() => Linking.openSettings()}
          >
            <Text style={styles.settingsButtonText}>Open Settings</Text>
          </Pressable>
        </View>
      )}

      {permissionStatus === 'granted' && (
        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={[styles.listContent, { maxWidth, alignSelf: 'center' }]}
          renderItem={({ item, index }) => {
            const isSelected = selectedContacts.has(item.id);
            const hasPhone = item.phoneNumbers && item.phoneNumbers[0];
            
            return (
              <Pressable 
                onPress={() => hasPhone && toggleContactSelection(item.id)}
                style={({ pressed }) => [
                  styles.contactPressable, 
                  isLargeScreen && styles.contactPressableLarge,
                  pressed && styles.contactPressed
                ]}
              >
                <View style={[
                  styles.contactContainer, 
                  isLargeScreen && styles.contactContainerLarge,
                  isSelected && styles.contactContainerSelected
                ]}>
                  <LinearGradient
                    colors={getRandomGradient(index)}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                  </LinearGradient>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName} numberOfLines={1}>{item.name}</Text>
                    {hasPhone && (
                      <View style={styles.phoneRow}>
                        <Ionicons name="call" size={12} color={NeonColors.pink} style={styles.phoneIcon} />
                        <Text style={styles.contactPhone} numberOfLines={1}>{item.phoneNumbers?.[0]?.number}</Text>
                      </View>
                    )}
                  </View>
                  
                  {item.isCustom && (
                    <Pressable onPress={() => deleteCustomContact(item.id)} style={styles.deleteButton}>
                      <Ionicons name="trash-outline" size={20} color={NeonColors.pink} />
                    </Pressable>
                  )}
                  
                  {isSelected ? (
                    <View style={styles.selectedIcon}>
                      <Ionicons name="checkmark-circle" size={24} color={NeonColors.cyan} />
                    </View>
                  ) : (
                    <View style={styles.unselectedIcon}>
                      <Ionicons name="ellipse-outline" size={24} color="#444" />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={64} color="#333" />
              <Text style={styles.emptyText}>No contacts found</Text>
            </View>
          }
        />
      )}
      
      {/* EXTRA: Add Custom Contact Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ADD CUSTOM CONTACT</Text>
              <Pressable onPress={() => {
                setIsAddModalVisible(false);
                setFormError(null);
              }}>
                <Ionicons name="close" size={24} color={NeonColors.pink} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalInputWrapper}>
                <Ionicons name="person-outline" size={18} color={NeonColors.cyan} style={styles.modalInputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Full Name"
                  placeholderTextColor="#555"
                  value={newContactName}
                  onChangeText={setNewContactName}
                />
              </View>

              <View style={styles.modalInputWrapper}>
                <Ionicons name="call-outline" size={18} color={NeonColors.cyan} style={styles.modalInputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Phone Number (e.g. +123456789)"
                  placeholderTextColor="#555"
                  value={newContactPhone}
                  onChangeText={(text) => setNewContactPhone(formatPhoneNumber(text))}
                  keyboardType="phone-pad"
                />
              </View>

              {formError && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={NeonColors.pink} />
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              )}

              <Pressable onPress={handleAddCustomContact} style={styles.addSubmitButton}>
                <LinearGradient
                  colors={[NeonColors.cyan, NeonColors.purple]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.addSubmitButtonGradient}
                >
                  <Text style={styles.addSubmitButtonText}>SAVE CONTACT</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* EXTRA: Confirm selection button for multi-contact SMS */}
      {selectedContacts.size > 0 && (
        <View style={styles.confirmButtonContainer}>
          <Pressable onPress={confirmSelection} style={styles.confirmButton}>
            <LinearGradient
              colors={[NeonColors.cyan, NeonColors.purple]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.confirmButtonGradient}
            >
              <Ionicons name="checkmark-done" size={20} color="#fff" />
              <Text style={styles.confirmButtonText}>
                Send to {selectedContacts.size} contact{selectedContacts.size > 1 ? 's' : ''}
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: NeonColors.darkBg,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerContent: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 245, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 255, 0.3)',
  },
  addContactButtonText: {
    color: NeonColors.cyan,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  backButton: {
    // No specific change here but used in headerTop
  },
  headerTitle: {
    color: NeonColors.cyan,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 4,
    textShadowColor: NeonColors.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 16,
  },
  selectionBadge: {
    backgroundColor: NeonColors.cyan,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  selectionBadgeText: {
    color: NeonColors.darkBg,
    fontWeight: '600',
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeonColors.darkCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NeonColors.darkBorder,
  },
  searchIcon: {
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: '#fff',
    fontSize: 15,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: NeonColors.darkBg,
  },
  actionButtonText: {
    color: NeonColors.cyan,
    fontSize: 13,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    width: '100%',
    paddingBottom: 100,
  },
  contactPressable: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactPressableLarge: {
    flex: 1,
    flexBasis: 0,
  },
  contactPressed: {
    opacity: 0.7,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeonColors.darkCard,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NeonColors.darkBorder,
  },
  contactContainerLarge: {
    flex: 1,
  },
  contactContainerSelected: {
    borderColor: NeonColors.cyan,
    borderWidth: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 14,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  phoneIcon: {
    marginRight: 6,
  },
  contactPhone: {
    color: '#888',
    fontSize: 13,
  },
  selectedIcon: {
    marginLeft: 8,
  },
  unselectedIcon: {
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
  separator: {
    height: 10,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  permissionSubtext: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  settingsButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NeonColors.cyan,
    backgroundColor: 'transparent',
  },
  settingsButtonText: {
    color: NeonColors.cyan,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#555',
    fontSize: 16,
    marginTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: NeonColors.darkCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: NeonColors.darkBorder,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: NeonColors.darkBorder,
  },
  modalTitle: {
    color: NeonColors.cyan,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
  modalBody: {
    padding: 20,
    gap: 16,
  },
  modalInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeonColors.darkBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NeonColors.darkBorder,
    height: 54,
  },
  modalInputIcon: {
    paddingHorizontal: 15,
  },
  modalInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  errorText: {
    color: NeonColors.pink,
    fontSize: 13,
  },
  addSubmitButton: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addSubmitButtonGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  addSubmitButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 2,
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: NeonColors.darkBg,
    borderTopWidth: 1,
    borderTopColor: NeonColors.darkBorder,
  },
  confirmButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
