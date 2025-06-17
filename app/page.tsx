'use client'

import { useState, useEffect } from 'react'
import TabNavigation from '@/components/TabNavigation'
import LoadTestForm from '@/components/LoadTestForm'
import ResultsDisplay from '@/components/ResultsDisplay'
import ReadMeTab from '@/components/ReadMeTab'
import { Zap, Moon, Sun } from 'lucide-react'

interface TestResult {
  id: string
  timestamp: string
  config: any
  results: any
}

// Constants
const MAX_STORED_RESULTS = 50 // Limit stored results to prevent localStorage overflow
const STORAGE_KEY = 'loadtest-results'

// Utility functions for localStorage
const saveResultsToStorage = (results: TestResult[]) => {
  try {
    // Keep only the latest MAX_STORED_RESULTS
    const trimmedResults = results.slice(0, MAX_STORED_RESULTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedResults))
    return trimmedResults
  } catch (error) {
    console.error('Error saving test results to localStorage:', error)
    // If storage is full, try to save fewer results
    try {
      const reducedResults = results.slice(0, Math.floor(MAX_STORED_RESULTS / 2))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedResults))
      return reducedResults
    } catch (retryError) {
      console.error('Error saving reduced test results:', retryError)
      return results
    }
  }
}

const loadResultsFromStorage = (): TestResult[] => {
  try {
    const savedResults = localStorage.getItem(STORAGE_KEY)
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults)
      if (Array.isArray(parsedResults)) {
        return parsedResults
      }
    }
  } catch (error) {
    console.error('Error parsing saved test results:', error)
    // Clear corrupted data
    localStorage.removeItem(STORAGE_KEY)
  }
  return []
}

const clearResultsFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing test results from localStorage:', error)
  }
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('testing')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [retryConfig, setRetryConfig] = useState<any>(null)

  // Load theme and test results from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDarkMode(savedTheme === 'dark' || (!savedTheme && prefersDark))

    // Load saved test results
    const savedResults = loadResultsFromStorage()
    if (savedResults.length > 0) {
      setTestResults(savedResults)
    }
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  // Auto switch to results tab when test completes
  useEffect(() => {
    if (testResults.length > 0 && !isLoading) {
      setActiveTab('results')
    }
  }, [testResults, isLoading])

  // Save test results to localStorage whenever testResults changes
  useEffect(() => {
    if (testResults.length > 0) {
      saveResultsToStorage(testResults)
    }
  }, [testResults])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }

  const handleTestSubmit = (results: any, config: any) => {
    const newResult: TestResult = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('th-TH'),
      config,
      results
    }
    const updatedResults = [newResult, ...testResults] // Add to beginning of array
    
    // Save to localStorage with size limit
    const trimmedResults = saveResultsToStorage(updatedResults)
    setTestResults(trimmedResults)
  }

  const handleRetryTest = (config: any) => {
    setRetryConfig(config)
    setActiveTab('testing')
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const clearResults = () => {
    setTestResults([])
    clearResultsFromStorage()
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Compact Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg shadow-sm">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gracer Load Testing Tool
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">เครื่องมือทดสอบภาระงานด้วย k6</p>
              </div>
            </div>
            
            {/* Theme Toggle & Results Counter */}
            <div className="flex items-center space-x-4">
              {testResults.length > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      ผลลัพธ์: {testResults.length} ครั้ง
                    </span>
                    {testResults.length >= MAX_STORED_RESULTS && (
                      <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full">
                        Max {MAX_STORED_RESULTS}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>บันทึกแล้ว</span>
                  </div>
                  <button
                    onClick={clearResults}
                    className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                    title="ลบผลการทดสอบทั้งหมด"
                  >
                    Clear All
                  </button>
                </div>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        hasResults={testResults.length > 0}
        resultsCount={testResults.length}
      />

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'testing' && (
          <div className="max-w-4xl mx-auto">
            <LoadTestForm 
              onSubmit={handleTestSubmit}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              retryConfig={retryConfig}
              onRetryConfigUsed={() => setRetryConfig(null)}
            />
          </div>
        )}

        {activeTab === 'results' && (
          <div className="max-w-7xl mx-auto">
            <ResultsDisplay 
              results={testResults}
              isLoading={isLoading}
              onClearResults={clearResults}
              onRetryTest={handleRetryTest}
            />
          </div>
        )}

        {activeTab === 'readme' && (
          <ReadMeTab />
        )}
      </div>
    </main>
  )
} 