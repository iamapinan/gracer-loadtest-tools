'use client'

import { useState, useEffect } from 'react'
import { Play, Plus, Trash2, Settings, Globe, Code, Zap } from 'lucide-react'

interface LoadTestFormProps {
  onSubmit: (results: any, config: any) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  retryConfig?: any
  onRetryConfigUsed?: () => void
}

interface Header {
  key: string
  value: string
}

interface Parameter {
  key: string
  value: string
}

interface TestConfig {
  url: string
  method: string
  headers: Header[]
  parameters: Parameter[]
  body: string
  virtualUsers: number
  duration: string
  rampUp: string
}

export default function LoadTestForm({ onSubmit, isLoading, setIsLoading, retryConfig, onRetryConfigUsed }: LoadTestFormProps) {
  // Initialize config with retry values if available
  const getInitialConfig = (): TestConfig => {
    if (retryConfig) {
      return {
        url: retryConfig.url || 'https://httpbin.org/get',
        method: retryConfig.method || 'GET',
        headers: retryConfig.headers || [{ key: 'Content-Type', value: 'application/json' }],
        parameters: retryConfig.parameters || [],
        body: retryConfig.body || '',
        virtualUsers: retryConfig.virtualUsers || 10,
        duration: retryConfig.duration || '30s',
        rampUp: retryConfig.rampUp || '5s'
      }
    }
    return {
      url: '',
      method: 'GET',
      headers: [{ key: 'Content-Type', value: 'application/json' }],
      parameters: [],
      body: '',
      virtualUsers: 100,
      duration: '30s',
      rampUp: '5s'
    }
  }

  const [config, setConfig] = useState<TestConfig>(getInitialConfig())

  // Update config when retryConfig changes
  useEffect(() => {
    if (retryConfig) {
      setConfig(getInitialConfig())
      onRetryConfigUsed?.()
    }
  }, [retryConfig, onRetryConfigUsed])

  const addHeader = () => {
    setConfig(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '' }]
    }))
  }

  const removeHeader = (index: number) => {
    setConfig(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index)
    }))
  }

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    setConfig(prev => ({
      ...prev,
      headers: prev.headers.map((header, i) => 
        i === index ? { ...header, [field]: value } : header
      )
    }))
  }

  const addParameter = () => {
    setConfig(prev => ({
      ...prev,
      parameters: [...prev.parameters, { key: '', value: '' }]
    }))
  }

  const removeParameter = (index: number) => {
    setConfig(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }))
  }

  const updateParameter = (index: number, field: 'key' | 'value', value: string) => {
    setConfig(prev => ({
      ...prev,
      parameters: prev.parameters.map((param, i) => 
        i === index ? { ...param, [field]: value } : param
      )
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/load-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error('Failed to run load test')
      }

      const results = await response.json()
      onSubmit(results, config)
    } catch (error) {
      console.error('Error running load test:', error)
      alert('เกิดข้อผิดพลาดในการทดสอบ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
      {/* Retry Notification */}
      {retryConfig && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800 px-6 py-4 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-lg">
              <Play className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">กำลังทดสอบซ้ำ</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                ฟอร์มได้รับค่าจากการทดสอบก่อนหน้า คุณสามารถปรับแต่งค่าต่างๆ ได้ก่อนเริ่มทดสอบใหม่
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">ตั้งค่าการทดสอบ</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">กำหนดพารามิเตอร์สำหรับการทดสอบ Load Testing</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* URL and Method Section */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Endpoint Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target URL
                </label>
                <input
                  type="url"
                  value={config.url}
                  onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://httpbin.org/get"
                  autoComplete='on'
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HTTP Method
                </label>
                <select
                  value={config.method}
                  onChange={(e) => setConfig(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
            </div>
          </div>

          {/* Request Parameters */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Code className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Parameters</h3>
              </div>
              <button
                type="button"
                onClick={addParameter}
                className="flex items-center px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                เพิ่ม Parameter
              </button>
            </div>
            
            <div className="space-y-3">
              {config.parameters.map((param, index) => (
                <div key={index} className="flex gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <input
                    type="text"
                    placeholder="Key (e.g., page)"
                    value={param.key}
                    onChange={(e) => updateParameter(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 1)"
                    value={param.value}
                    onChange={(e) => updateParameter(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {config.parameters.length === 0 && (
                <div className="text-gray-500 dark:text-gray-400 text-sm py-4 px-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
                  ไม่มี query parameters - กดปุ่ม "เพิ่ม Parameter" เพื่อเพิ่ม
                </div>
              )}
            </div>
          </div>

          {/* Headers */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Code className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">HTTP Headers</h3>
              </div>
              <button
                type="button"
                onClick={addHeader}
                className="flex items-center px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                เพิ่ม Header
              </button>
            </div>
            
            <div className="space-y-3">
              {config.headers.map((header, index) => (
                <div key={index} className="flex gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <input
                    type="text"
                    placeholder="Key (e.g., Authorization)"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., Bearer token)"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeHeader(index)}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Request Body */}
          {config.method !== 'GET' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center mb-4">
                <Code className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Request Body</h3>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, body: '{\n  "key": "value"\n}' }))}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    JSON Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, body: 'key1=value1&key2=value2' }))}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Form Data Template
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, body: '' }))}
                    className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Clear
                  </button>
                </div>
                <textarea
                  value={config.body}
                  onChange={(e) => setConfig(prev => ({ ...prev, body: e.target.value }))}
                  rows={6}
                  placeholder='JSON: {"key": "value"} หรือ Form Data: key1=value1&key2=value2'
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Load Test Configuration */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-100 dark:border-gray-600">
            <div className="flex items-center mb-6">
              <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">การตั้งค่าการทดสอบ</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Virtual Users
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={config.virtualUsers}
                  onChange={(e) => setConfig(prev => ({ ...prev, virtualUsers: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">จำนวนผู้ใช้จำลอง (1-1000)</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={config.duration}
                  onChange={(e) => setConfig(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="30s, 2m, 1h"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">ระยะเวลาทดสอบ (s=วินาที, m=นาที, h=ชั่วโมง)</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ramp-up Time
                </label>
                <input
                  type="text"
                  value={config.rampUp}
                  onChange={(e) => setConfig(prev => ({ ...prev, rampUp: e.target.value }))}
                  placeholder="5s, 1m"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">เวลาเพิ่มผู้ใช้ค่อยๆ</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 font-medium text-lg shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  กำลังทดสอบ...
                </div>
              ) : (
                <div className="flex items-center">
                  <Play className="w-6 h-6 mr-3" />
                  เริ่มทดสอบ Load Testing
                </div>
              )}
            </button>
            {!isLoading && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                ผลลัพธ์จะแสดงใน Results tab เมื่อการทดสอบเสร็จสิ้น
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
} 