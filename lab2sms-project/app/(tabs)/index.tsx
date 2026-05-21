import { Image } from 'expo-image';
import { StyleSheet, TextInput, Pressable, View, useWindowDimensions, FlatList } from 'react-native';
import { useState, useEffect, useMemo } from 'react';
import * as SMS from 'expo-sms';
import { useLocalSearchParams, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { NeonColors } from '@/constants/theme';
import { useContactsContext } from '@/contexts/contacts-context';

/**
 * Home Screen - SMS Composition and Sending
 */
export default function HomeScreen() {
  const params = useLocalSearchParams();
  const { allContacts } = useContactsContext();
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [smsStatus, setSmsStatus] = useState<string | null>(null);
  
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const maxWidth = isLargeScreen ? 600 : '100%';

  useEffect(() => {
    if (params.phoneNumber) {
      setPhoneNumber(params.phoneNumber as string);
      setSmsStatus(null); // Clear previous status when new contact selected
    }
    if (params.phoneNumbers) {
      setPhoneNumber((params.phoneNumbers as string).split(',').join(', '));
      setSmsStatus(null);
    }
  }, [params.phoneNumber, params.phoneNumbers]);

  const sendSms = async () => {
    if (!phoneNumber.trim()) {
      setSmsStatus('Please enter a phone number');
      return;
    }
    if (!message.trim()) {
      setSmsStatus('Please enter a message');
      return;
    }
    
    const isAvailable = await SMS.isAvailableAsync();
    if (isAvailable) {
      const numbers = phoneNumber.split(',').map(n => n.trim()).filter(n => n);
      const { result } = await SMS.sendSMSAsync(numbers, message);
      setSmsStatus(result);
    } else {
      setSmsStatus('SMS not available on this device');
    }
  };

  const suggestedContacts = useMemo(() => {
    if (phoneNumber.length < 2 || phoneNumber.includes(',')) {
      return [];
    }
    return allContacts.filter(contact =>
      contact.name?.toLowerCase().includes(phoneNumber.toLowerCase()) ||
      contact.phoneNumbers?.some(p => p.number.includes(phoneNumber))
    ).slice(0, 3);
  }, [phoneNumber, allContacts]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: NeonColors.darkBg, dark: NeonColors.darkBg }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <LinearGradient
            colors={[NeonColors.purple, NeonColors.pink, NeonColors.cyan]}
            style={styles.headerGradient}
          />
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
        </View>
      }>
      
      <View style={[styles.contentWrapper, { maxWidth }]}>
        <ThemedView style={styles.titleContainer}>
          <View style={styles.glowText}>
            <ThemedText type="title" style={styles.neonTitle}>CYBER</ThemedText>
            <ThemedText type="title" style={styles.neonTitleAccent}>SMS</ThemedText>
          </View>
        </ThemedView>

        <View style={styles.cardOuter}>
          <LinearGradient
            colors={[NeonColors.cyan, NeonColors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBorder}
          >
            <View style={styles.cardInner}>
              <View style={styles.cardHeader}>
                <Ionicons name="send" size={20} color={NeonColors.cyan} />
                <ThemedText style={styles.cardTitle}>COMPOSE MESSAGE</ThemedText>
              </View>
              
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={18} color={NeonColors.pink} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    placeholderTextColor="#555"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                  {phoneNumber.length > 0 && (
                    <Pressable onPress={() => setPhoneNumber('')} style={styles.clearIcon}>
                      <Ionicons name="close-circle" size={18} color="#555" />
                    </Pressable>
                  )}
                </View>
                
                {suggestedContacts.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    {suggestedContacts.map((item) => (
                      <Pressable 
                        key={item.id}
                        style={styles.suggestionItem}
                        onPress={() => setPhoneNumber(item.phoneNumbers?.[0]?.number || '')}
                      >
                        <ThemedText style={styles.suggestionName}>{item.name}</ThemedText>
                        <ThemedText style={styles.suggestionNumber}>{item.phoneNumbers?.[0]?.number}</ThemedText>
                      </Pressable>
                    ))}
                  </View>
                )}
                
                <View style={styles.inputWrapper}>
                  <Ionicons name="chatbubble-outline" size={18} color={NeonColors.pink} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.messageInput]}
                    placeholder="Enter message"
                    placeholderTextColor="#555"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                  />
                </View>

                {smsStatus && (
                  <View style={styles.statusContainer}>
                    <Ionicons 
                      name={
                        smsStatus === 'sent' ? 'checkmark-circle' : 
                        smsStatus === 'cancelled' ? 'close-circle' : 'alert-circle'
                      } 
                      size={16} 
                      color={
                        smsStatus === 'sent' ? NeonColors.cyan : 
                        smsStatus === 'cancelled' ? '#888' : NeonColors.pink
                      } 
                    />
                    <ThemedText style={[
                      styles.statusText, 
                      { 
                        color: smsStatus === 'sent' ? NeonColors.cyan : 
                               smsStatus === 'cancelled' ? '#888' : NeonColors.pink 
                      }
                    ]}>
                      {smsStatus === 'sent' ? 'Message sent!' : 
                       smsStatus === 'cancelled' ? 'Message cancelled' : smsStatus}
                    </ThemedText>
                  </View>
                )}

                <View style={styles.buttonRow}>
                  <Pressable 
                    onPress={sendSms} 
                    style={({ pressed }) => [
                      styles.sendButton, 
                      styles.buttonHalf, 
                      pressed && styles.sendButtonPressed
                    ]}
                  >
                    <LinearGradient
                      colors={[NeonColors.purple, NeonColors.pink]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.sendButtonGradient}
                    >
                      <Ionicons name="paper-plane" size={18} color="#fff" />
                      <ThemedText style={styles.sendButtonText}>SEND SMS</ThemedText>
                    </LinearGradient>
                  </Pressable>
                  <Link href="/contacts" asChild>
                    <Pressable style={({ pressed }) => [
                      styles.contactButton, 
                      styles.buttonHalf, 
                      pressed && styles.sendButtonPressed
                    ]}>
                      <Ionicons name="people" size={18} color={NeonColors.cyan} />
                      <ThemedText style={styles.contactButtonText}>CONTACTS</ThemedText>
                    </Pressable>
                  </Link>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  contentWrapper: {
    alignSelf: 'center',
    width: '100%',
  },
  headerImageContainer: {
    flex: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    tintColor: NeonColors.cyan,
    opacity: 0.6,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  glowText: {
    flexDirection: 'row',
    gap: 12,
  },
  neonTitle: {
    color: NeonColors.cyan,
    textShadowColor: NeonColors.cyan,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
  },
  neonTitleAccent: {
    color: NeonColors.pink,
    textShadowColor: NeonColors.pink,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
  },
  cardOuter: {
    marginBottom: 16,
  },
  cardBorder: {
    borderRadius: 16,
    padding: 1,
  },
  cardInner: {
    backgroundColor: NeonColors.darkCard,
    borderRadius: 15,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardTitle: {
    color: NeonColors.cyan,
    letterSpacing: 2,
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NeonColors.darkBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NeonColors.darkBorder,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontSize: 16,
    paddingRight: 16,
  },
  clearIcon: {
    paddingRight: 12,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonHalf: {
    flex: 1,
    flexBasis: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  sendButtonPressed: {
    opacity: 0.8,
  },
  sendButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  sendButtonText: {
    color: '#fff',
    letterSpacing: 2,
    fontWeight: '600',
    fontSize: 14,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: NeonColors.cyan,
    backgroundColor: 'transparent',
  },
  contactButtonText: {
    color: NeonColors.cyan,
    letterSpacing: 2,
    fontWeight: '600',
    fontSize: 14,
  },
  suggestionsContainer: {
    backgroundColor: NeonColors.darkCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: NeonColors.darkBorder,
    marginTop: -8,
    marginBottom: 8,
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: NeonColors.darkBorder,
  },
  suggestionName: {
    color: '#fff',
    fontSize: 15,
  },
  suggestionNumber: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
});
