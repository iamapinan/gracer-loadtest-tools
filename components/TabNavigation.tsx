'use client'

import { useState } from 'react'
import { Play, BarChart3, BookOpen } from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: React.ReactNode
  badge?: number
}

interface TabNavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
  hasResults?: boolean
  resultsCount?: number
}

export default function TabNavigation({ activeTab, onTabChange, hasResults, resultsCount }: TabNavigationProps) {
  const tabs: Tab[] = [
    {
      id: 'testing',
      name: 'Testing',
      icon: <Play className="w-4 h-4" />
    },
    {
      id: 'results',
      name: 'Results',
      icon: <BarChart3 className="w-4 h-4" />,
      badge: resultsCount && resultsCount > 0 ? resultsCount : undefined
    },
    {
      id: 'readme',
      name: 'README',
      icon: <BookOpen className="w-4 h-4" />
    }
  ]

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
      <nav className="flex justify-start space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              relative py-3 px-4 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-200
              ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <span className={`transition-colors ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
              {tab.icon}
            </span>
            <span>{tab.name}</span>
            {tab.badge && (
              <span className="ml-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 py-0.5 px-1.5 rounded-full text-xs font-medium">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
} 