"use client";

import React, { useState, useEffect } from "react";
import {
  SmsMessage,
  GmScreen,
  SwipeAction,
  CountryInfo,
} from "@/types";
import {
  INITIAL_MESSAGES,
  AVAILABLE_COUNTRIES,
  CONTACT_NAMES,
} from "@/lib/storage";
import { GoogleMessagesHome } from "@/components/google-messages/GoogleMessagesHome";
import { ConversationView } from "@/components/google-messages/ConversationView";
import { NewChatView } from "@/components/google-messages/NewChatView";
import { SearchMessagesView } from "@/components/google-messages/SearchMessagesView";
import { SettingsView } from "@/components/google-messages/SettingsView";
import { RcsSettingsView } from "@/components/google-messages/RcsSettingsView";
import { SpamProtectionView } from "@/components/google-messages/SpamProtectionView";
import { SwipeActionsView } from "@/components/google-messages/SwipeActionsView";
import { NotificationsView } from "@/components/google-messages/NotificationsView";
import { AdvancedSettingsView } from "@/components/google-messages/AdvancedSettingsView";
import { ArchivedMessagesView } from "@/components/google-messages/ArchivedMessagesView";
import { SpamAndBlockedView } from "@/components/google-messages/SpamAndBlockedView";

export default function Home() {
  const [isClient, setIsClient] = useState(false);

  // Screen Navigation Stack
  const [currentGmScreen, setCurrentGmScreen] = useState<GmScreen>("HOME");
  const [gmScreenStack, setGmScreenStack] = useState<GmScreen[]>([]);

  // Active Conversation State
  const [activeContactAddress, setActiveContactAddress] = useState<string | null>(null);
  const [activeContactName, setActiveContactName] = useState<string>("");

  // Data Store
  const [messages, setMessages] = useState<SmsMessage[]>(INITIAL_MESSAGES);
  const [archivedAddresses, setArchivedAddresses] = useState<string[]>([]);
  const [blockedAddresses, setBlockedAddresses] = useState<string[]>([]);

  // Settings & Preferences
  const [rcsEnabled, setRcsEnabled] = useState(true);
  const [rcsReadReceipts, setRcsReadReceipts] = useState(true);
  const [rcsTypingIndicators, setRcsTypingIndicators] = useState(true);
  const [rcsAutoDownload, setRcsAutoDownload] = useState("Até 105 MB");
  const [rcsResendAsSms, setRcsResendAsSms] = useState(true);
  const [spamProtectionEnabled, setSpamProtectionEnabled] = useState(true);
  const [swipeRightAction, setSwipeRightAction] = useState<SwipeAction>("ARCHIVE");
  const [swipeLeftAction, setSwipeLeftAction] = useState<SwipeAction>("DELETE");
  const [outgoingSounds, setOutgoingSounds] = useState(true);
  const [masterNotifications, setMasterNotifications] = useState(true);
  const [incomingNotifications, setIncomingNotifications] = useState(true);
  const [otherNotifications, setOtherNotifications] = useState(true);
  const [notificationVibration, setNotificationVibration] = useState(true);
  const [groupMms, setGroupMms] = useState(true);
  const [autoMms, setAutoMms] = useState(true);
  const [roamingMms, setRoamingMms] = useState(false);
  const [deliveryReports, setDeliveryReports] = useState(true);
  const [currentCountry, setCurrentCountry] = useState<CountryInfo>(AVAILABLE_COUNTRIES[0]);
  const [phoneNumber, setPhoneNumber] = useState("+258 84 123 4567");
  const [smsc, setSmsc] = useState("+258840001000");

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 3000);
  };

  // Hydration & Local Storage sync
  useEffect(() => {
    setIsClient(true);
    try {
      const savedMessages = localStorage.getItem("megasnem_messages");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        // Fallback or migrate old key without backup metadata if needed
        const oldMessages = localStorage.getItem("samc_messages");
        if (oldMessages) {
          const parsed: any[] = JSON.parse(oldMessages);
          // filter out any deleted / corrupted messages and strip backup fields
          const sanitized: SmsMessage[] = parsed
            .filter((m) => !m.isDeletedFromDevice)
            .map((m) => ({
              id: m.id,
              telephonyId: m.telephonyId,
              address: m.address,
              body: m.body,
              date: m.date,
              dateSent: m.dateSent,
              type: m.type,
              read: m.read,
              status: m.status,
              serviceCenter: m.serviceCenter || null,
              isSpam: !!m.isSpam,
              spamScore: m.spamScore || 0,
              spamReason: m.spamReason || null,
              syncedCloud: true,
            }));
          setMessages(sanitized.length > 0 ? sanitized : INITIAL_MESSAGES);
          localStorage.removeItem("samc_messages");
          localStorage.removeItem("samc_logs");
          localStorage.removeItem("samc_hidden");
        }
      }

      const savedArchived = localStorage.getItem("megasnem_archived");
      if (savedArchived) setArchivedAddresses(JSON.parse(savedArchived));

      const savedBlocked = localStorage.getItem("megasnem_blocked");
      if (savedBlocked) setBlockedAddresses(JSON.parse(savedBlocked));
    } catch (e) {
      console.warn("Error restoring localStorage:", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem("megasnem_messages", JSON.stringify(messages));
      localStorage.setItem("megasnem_archived", JSON.stringify(archivedAddresses));
      localStorage.setItem("megasnem_blocked", JSON.stringify(blockedAddresses));
    } catch (e) {
      console.warn("Error saving to localStorage:", e);
    }
  }, [messages, archivedAddresses, blockedAddresses, isClient]);

  // Navigation Helper
  const navigateGm = (screen: GmScreen) => {
    setGmScreenStack((prev) => [...prev, currentGmScreen]);
    setCurrentGmScreen(screen);
  };

  const popGmScreen = () => {
    if (gmScreenStack.length > 0) {
      const prev = gmScreenStack[gmScreenStack.length - 1];
      setGmScreenStack((s) => s.slice(0, -1));
      setCurrentGmScreen(prev);
      if (prev === "HOME") {
        setActiveContactAddress(null);
        setActiveContactName("");
      }
    } else {
      setCurrentGmScreen("HOME");
      setActiveContactAddress(null);
      setActiveContactName("");
    }
  };

  // Open Conversation
  const openConversation = (address: string, displayName?: string) => {
    const name = displayName || CONTACT_NAMES[address] || address;
    setActiveContactAddress(address);
    setActiveContactName(name);

    // Mark messages in conversation as read
    setMessages((prev) =>
      prev.map((m) =>
        m.address === address && m.read === 0 ? { ...m, read: 1 } : m
      )
    );

    navigateGm("CONVERSATION");
  };

  // Send message
  const handleSendMessage = (text: string, toAddress?: string) => {
    const dest = toAddress || activeContactAddress || "+258841234567";
    const newMsg: SmsMessage = {
      id: Date.now(),
      telephonyId: Date.now() + 100,
      address: dest,
      body: text,
      date: Date.now(),
      dateSent: Date.now(),
      type: "sent",
      read: 1,
      status: 0,
      serviceCenter: "+258840001000",
      isSpam: false,
      spamScore: 0,
      spamReason: null,
      syncedCloud: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    // Optional simulated reply from contact after a few seconds
    if (dest === "+258841234567") {
      setTimeout(() => {
        const replyMsg: SmsMessage = {
          id: Date.now() + 1,
          telephonyId: Date.now() + 101,
          address: dest,
          body: "Combinado amor! Fico à tua espera 🥰",
          date: Date.now(),
          dateSent: Date.now(),
          type: "inbox",
          read: 1,
          status: -1,
          serviceCenter: "+258840001000",
          isSpam: false,
          spamScore: 0,
          spamReason: null,
          syncedCloud: true,
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 4000);
    }
  };

  // Genuine, permanent message deletion
  const handleDeleteMessage = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const handleDeleteConversation = (addr: string) => {
    setMessages((prev) => prev.filter((m) => m.address !== addr));
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#130E0C] text-[#F2E0DB] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F59F7A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#130E0C] text-[#F2E0DB]">
      {/* Global Toast */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#261D1A] border border-[#F59F7A] text-[#F59F7A] text-xs font-semibold px-4 py-2 rounded-full shadow-2xl">
          {toast}
        </div>
      )}

      {currentGmScreen === "HOME" && (
        <GoogleMessagesHome
          messages={messages}
          archivedAddresses={archivedAddresses}
          blockedAddresses={blockedAddresses}
          swipeRightAction={swipeRightAction}
          swipeLeftAction={swipeLeftAction}
          onOpenConversation={(addr) => openConversation(addr)}
          onNavigate={(screen) => navigateGm(screen)}
          onMarkAllAsRead={() => {
            setMessages((prev) => prev.map((m) => ({ ...m, read: 1 })));
          }}
          onArchive={(addr) => {
            setArchivedAddresses((prev) =>
              prev.includes(addr) ? prev : [...prev, addr]
            );
          }}
          onUnarchive={(addr) => {
            setArchivedAddresses((prev) => prev.filter((a) => a !== addr));
          }}
          onDeleteConversation={(addr) => handleDeleteConversation(addr)}
        />
      )}

      {currentGmScreen === "CONVERSATION" && activeContactAddress && (
        <ConversationView
          onBack={() => popGmScreen()}
          contactAddress={activeContactAddress}
          contactDisplayName={activeContactName}
          messages={messages.filter((m) => m.address === activeContactAddress)}
          onSendMessage={(text) => handleSendMessage(text)}
          onDeleteMessage={handleDeleteMessage}
        />
      )}

      {currentGmScreen === "NEW_CHAT" && (
        <NewChatView
          onBack={() => popGmScreen()}
          onSelectContact={(addr, name) => {
            openConversation(addr, name);
          }}
        />
      )}

      {currentGmScreen === "SEARCH" && (
        <SearchMessagesView
          onBack={() => popGmScreen()}
          messages={messages}
          onOpenConversation={(addr) => openConversation(addr)}
        />
      )}

      {currentGmScreen === "SETTINGS" && (
        <SettingsView
          onBack={() => popGmScreen()}
          onNavigate={(screen) => navigateGm(screen)}
          rcsEnabled={rcsEnabled}
          outgoingSounds={outgoingSounds}
          setOutgoingSounds={setOutgoingSounds}
          spamProtectionEnabled={spamProtectionEnabled}
        />
      )}

      {currentGmScreen === "RCS_SETTINGS" && (
        <RcsSettingsView
          onBack={() => popGmScreen()}
          rcsEnabled={rcsEnabled}
          setRcsEnabled={setRcsEnabled}
          readReceipts={rcsReadReceipts}
          setReadReceipts={setRcsReadReceipts}
          typingIndicators={rcsTypingIndicators}
          setTypingIndicators={setRcsTypingIndicators}
          autoDownload={rcsAutoDownload}
          setAutoDownload={setRcsAutoDownload}
          resendAsSms={rcsResendAsSms}
          setResendAsSms={setRcsResendAsSms}
        />
      )}

      {currentGmScreen === "SPAM_PROTECTION" && (
        <SpamProtectionView
          onBack={() => popGmScreen()}
          spamProtectionEnabled={spamProtectionEnabled}
          setSpamProtectionEnabled={setSpamProtectionEnabled}
        />
      )}

      {currentGmScreen === "SWIPE_ACTIONS" && (
        <SwipeActionsView
          onBack={() => popGmScreen()}
          swipeRightAction={swipeRightAction}
          setSwipeRightAction={setSwipeRightAction}
          swipeLeftAction={swipeLeftAction}
          setSwipeLeftAction={setSwipeLeftAction}
        />
      )}

      {currentGmScreen === "NOTIFICATIONS" && (
        <NotificationsView
          onBack={() => popGmScreen()}
          masterEnabled={masterNotifications}
          setMasterEnabled={setMasterNotifications}
          incomingEnabled={incomingNotifications}
          setIncomingEnabled={setIncomingNotifications}
          otherEnabled={otherNotifications}
          setOtherEnabled={setOtherNotifications}
          vibration={notificationVibration}
          setVibration={setNotificationVibration}
        />
      )}

      {currentGmScreen === "ADVANCED" && (
        <AdvancedSettingsView
          onBack={() => popGmScreen()}
          groupMms={groupMms}
          setGroupMms={setGroupMms}
          autoMms={autoMms}
          setAutoMms={setAutoMms}
          roamingMms={roamingMms}
          setRoamingMms={setRoamingMms}
          deliveryReports={deliveryReports}
          setDeliveryReports={setDeliveryReports}
          currentCountry={currentCountry}
          setCurrentCountry={setCurrentCountry}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          smsc={smsc}
          setSmsc={setSmsc}
        />
      )}

      {currentGmScreen === "ARCHIVED" && (
        <ArchivedMessagesView
          onBack={() => popGmScreen()}
          archivedAddresses={archivedAddresses}
          unarchive={(addr) => {
            setArchivedAddresses((prev) => prev.filter((a) => a !== addr));
          }}
          messages={messages}
          onOpenConversation={(addr) => openConversation(addr)}
        />
      )}

      {currentGmScreen === "SPAM_AND_BLOCKED" && (
        <SpamAndBlockedView
          onBack={() => popGmScreen()}
          blockedAddresses={blockedAddresses}
          unblock={(addr) => {
            setBlockedAddresses((prev) => prev.filter((a) => a !== addr));
          }}
          messages={messages}
          onOpenConversation={(addr) => openConversation(addr)}
        />
      )}
    </main>
  );
}
