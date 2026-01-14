'use client';

import { cn } from '@/lib/utils';
import { createContext, useContext, useState, useRef, useId, ReactNode, KeyboardEvent } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabsId: string;
  registerTab: (value: string) => void;
  tabs: string[];
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const [tabs, setTabs] = useState<string[]>([]);
  const tabsId = useId();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onChange?.(tab);
  };

  const registerTab = (value: string) => {
    setTabs((prev) => {
      if (prev.includes(value)) return prev;
      return [...prev, value];
    });
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange, tabsId, registerTab, tabs }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function TabsList({ children, className, 'aria-label': ariaLabel }: TabsListProps) {
  const { activeTab, setActiveTab, tabs } = useTabsContext();
  const tablistRef = useRef<HTMLDivElement>(null);

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.indexOf(activeTab);
    let newIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      setActiveTab(tabs[newIndex]);
      // Focus the new tab button
      const newTabButton = tablistRef.current?.querySelector(
        `[data-tab-value="${tabs[newIndex]}"]`
      ) as HTMLButtonElement;
      newTabButton?.focus();
    }
  };

  return (
    <div
      ref={tablistRef}
      role="tablist"
      aria-label={ariaLabel || 'Tabs'}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex gap-1 p-1 bg-oyster-100 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { activeTab, setActiveTab, tabsId, registerTab } = useTabsContext();
  const isActive = activeTab === value;

  // Register this tab on mount
  useState(() => {
    registerTab(value);
  });

  return (
    <button
      type="button"
      role="tab"
      id={`${tabsId}-tab-${value}`}
      aria-selected={isActive}
      aria-controls={`${tabsId}-panel-${value}`}
      tabIndex={isActive ? 0 : -1}
      data-tab-value={value}
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-sky focus:ring-offset-1',
        isActive
          ? 'bg-white text-oyster-900 shadow-sm'
          : 'text-oyster-600 hover:text-oyster-900',
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const { activeTab, tabsId } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <div
      role="tabpanel"
      id={`${tabsId}-panel-${value}`}
      aria-labelledby={`${tabsId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={cn(
        'mt-4 focus:outline-none',
        isActive && 'animate-fade-in',
        className
      )}
    >
      {isActive && children}
    </div>
  );
}

export default Tabs;
