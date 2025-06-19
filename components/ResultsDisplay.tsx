'use client'

import { useState, useRef } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Clock, Users, Zap, AlertTriangle, CheckCircle, XCircle, Activity, Download, Trash2, ChevronDown, ChevronUp, Camera, FileText } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface TestResult {
  id: string
  timestamp: string
  config: any
  results: any
}

interface ResultsDisplayProps {
  results: TestResult[]
  isLoading: boolean
  onClearResults: () => void
  onRetryTest?: (config: any) => void
}

export default function ResultsDisplay({ results, isLoading, onClearResults, onRetryTest }: ResultsDisplayProps) {
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null)
  const [expandedResults, setExpandedResults] = useState<string[]>([])
  const chartRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-lg font-medium text-gray-900 dark:text-white">กำลังทำการทดสอบ...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">โปรดรอสักครู่</p>
        </div>
      </div>
    )
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
          <Activity className="w-16 h-16 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
          ยังไม่มีผลการทดสอบ
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
          ไปที่ <span className="font-medium text-blue-600 dark:text-blue-400">Testing tab</span> เพื่อเริ่มการทดสอบ Load Testing
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 max-w-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>คำแนะนำ:</strong> กรอกข้อมูล URL และกำหนดค่าการทดสอบ จากนั้นกดปุ่ม "เริ่มทดสอบ" 
            ผลลัพธ์จะแสดงในหน้านี้โดยอัตโนมัติ
          </p>
        </div>
      </div>
    )
  }

  // Auto-select the latest result if none selected
  const currentResult = selectedResult || results[0]
  
  const {
    summary,
    metrics,
    timeSeries,
    httpStatusCodes,
    responseTime
  } = currentResult?.results || {}

  // Colors for charts - Update with Artillery-style colors
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']

  // Modern gradient colors for charts
  const CHART_COLORS = {
    primary: '#3B82F6',
    primaryGradient: 'url(#primaryGradient)',
    secondary: '#10B981', 
    secondaryGradient: 'url(#secondaryGradient)',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6'
  }

  // Prepare data for status codes pie chart
  const statusCodeData = Object.entries(httpStatusCodes || {}).map(([code, count], index) => ({
    name: `HTTP ${code}`,
    value: count as number,
    color: COLORS[index % COLORS.length]
  }))

  const toggleExpanded = (resultId: string) => {
    setExpandedResults(prev => 
      prev.includes(resultId) 
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    )
  }

  const exportAsJPEG = async () => {
    if (!chartRef.current) return
    
    try {
      // Create a wrapper div with credit
      const wrapper = document.createElement('div')
      wrapper.style.background = document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff'
      wrapper.style.padding = '20px'
      wrapper.style.fontFamily = 'system-ui, -apple-system, sans-serif'
      
      // Clone the chart content
      const chartClone = chartRef.current.cloneNode(true) as HTMLElement
      wrapper.appendChild(chartClone)
      
      // Add credit footer
      const credit = document.createElement('div')
      credit.style.textAlign = 'center'
      credit.style.marginTop = '20px'
      credit.style.padding = '15px'
      credit.style.borderTop = document.documentElement.classList.contains('dark') ? '1px solid #374151' : '1px solid #e5e7eb'
      credit.style.color = document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
      credit.style.fontSize = '14px'
      credit.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>⚡</span>
          <span>Powered by <strong style="color: ${document.documentElement.classList.contains('dark') ? '#60a5fa' : '#2563eb'};">Gracer AI</strong> Load Testing Tool</span>
          <span>•</span>
          <span>Generated on ${new Date().toLocaleString('th-TH')}</span>
        </div>
      `
      wrapper.appendChild(credit)
      
      // Temporarily add to DOM for capture
      document.body.appendChild(wrapper)
      
      const canvas = await html2canvas(wrapper, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: wrapper.scrollWidth,
        height: wrapper.scrollHeight
      })
      
      // Remove from DOM
      document.body.removeChild(wrapper)
      
      const link = document.createElement('a')
      link.download = `load-test-results-${new Date().toISOString().slice(0, 10)}.jpg`
      link.href = canvas.toDataURL('image/jpeg', 0.9)
      link.click()
    } catch (error) {
      console.error('Error exporting JPEG:', error)
      alert('เกิดข้อผิดพลาดในการส่งออกรูปภาพ')
    }
  }

  const exportAsPDF = async () => {
    if (!chartRef.current) return
    
    try {
      // Create a wrapper div with credit
      const wrapper = document.createElement('div')
      wrapper.style.background = document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff'
      wrapper.style.padding = '20px'
      wrapper.style.fontFamily = 'system-ui, -apple-system, sans-serif'
      
      // Clone the chart content
      const chartClone = chartRef.current.cloneNode(true) as HTMLElement
      wrapper.appendChild(chartClone)
      
      // Add credit footer
      const credit = document.createElement('div')
      credit.style.textAlign = 'center'
      credit.style.marginTop = '20px'
      credit.style.padding = '15px'
      credit.style.borderTop = document.documentElement.classList.contains('dark') ? '1px solid #374151' : '1px solid #e5e7eb'
      credit.style.color = document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'
      credit.style.fontSize = '14px'
      credit.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>⚡</span>
          <span>Powered by <strong style="color: ${document.documentElement.classList.contains('dark') ? '#60a5fa' : '#2563eb'};">Gracer AI</strong> Load Testing Tool</span>
          <span>•</span>
          <span>Generated on ${new Date().toLocaleString('th-TH')}</span>
        </div>
      `
      wrapper.appendChild(credit)
      
      // Temporarily add to DOM for capture
      document.body.appendChild(wrapper)
      
      const canvas = await html2canvas(wrapper, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        width: wrapper.scrollWidth,
        height: wrapper.scrollHeight
      })
      
      // Remove from DOM
      document.body.removeChild(wrapper)
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('l', 'mm', 'a4') // landscape
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 10
      
      // Add header to PDF
      pdf.setFontSize(16)
      if (document.documentElement.classList.contains('dark')) {
        pdf.setTextColor(156, 163, 175)
      } else {
        pdf.setTextColor(107, 114, 128)
      }
      pdf.text('Load Testing Results - Powered by Gracer AI', pdfWidth / 2, 8, { align: 'center' } as any)
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save(`load-test-results-${new Date().toISOString().slice(0, 10)}.pdf`)
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('เกิดข้อผิดพลาดในการส่งออก PDF')
    }
  }

  return (
    <div className="flex gap-6 h-full">
      {/* Sidebar - Tests History */}
      <div className="w-80 flex-shrink-0">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-full transition-colors">
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-3 border-b border-gray-100 dark:border-gray-700 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-1.5 rounded-lg">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">ประวัติการทดสอบ</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{results.length} ครั้ง</p>
                </div>
              </div>
              <button
                onClick={onClearResults}
                className="flex items-center px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                title="ลบทั้งหมด"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="p-3">
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {results.map((result, index) => (
                <div 
                  key={result.id} 
                  className={`border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedResult?.id === result.id || (!selectedResult && index === 0)
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedResult(result)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          index === 0 ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {index + 1}
                        </span>
                        {index === 0 && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-1.5 py-0.5 rounded-full text-xs font-medium">
                            Latest
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {result.timestamp}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {result.config.method} {result.config.url}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                        <span>{result.config.virtualUsers} users</span>
                        <span>{result.config.duration}</span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Requests</p>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{result.results.summary?.requests || 0}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg Time</p>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">{result.results.summary?.avgResponseTime || 0}ms</p>
                      </div>
                    </div>

                    {/* Retry Button */}
                    {onRetryTest && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onRetryTest(result.config)
                          }}
                          className="w-full flex items-center justify-center px-2 py-1.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                          title="ทดสอบใหม่ด้วยการตั้งค่าเดิม"
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          Retry Test
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Result Details */}
      <div className="flex-1">
      {currentResult && (
        <div ref={chartRef} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-6 py-4 border-b border-gray-100 dark:border-gray-700 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">ผลการทดสอบ Load Testing</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{currentResult.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportAsJPEG}
                  className="flex items-center px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <Camera className="w-4 h-4 mr-1" />
                  JPEG
                </button>
                <button
                  onClick={exportAsPDF}
                  className="flex items-center px-3 py-2 text-sm bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  PDF
                </button>
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">ทดสอบเสร็จสิ้น</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center">
                  <Users className="w-10 h-10 text-blue-600 dark:text-blue-400 mr-4" />
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Virtual Users</p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{summary?.vus || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-6 border border-green-200 dark:border-green-700">
                <div className="flex items-center">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400 mr-4" />
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total</p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300">{summary?.requests || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700">
                <div className="flex items-center">
                  <Clock className="w-10 h-10 text-purple-600 dark:text-purple-400 mr-4" />
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Avg Response</p>
                    <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{summary?.avgResponseTime || 0}<span className="text-lg">ms</span></p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-lg p-6 border border-red-200 dark:border-red-700">
                <div className="flex items-center">
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400 mr-4" />
                  <div>
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">Failed</p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300">{summary?.failed || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              {/* Response Time Chart */}
              {timeSeries && timeSeries.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-500" />
                      Response Time
                    </h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeSeries}>
                        <defs>
                          <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="secondaryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                          </linearGradient>
                          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/>
                          </filter>
                        </defs>
                        <CartesianGrid 
                          strokeDasharray="3 3" 
                          stroke={document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'} 
                          strokeOpacity={0.6}
                        />
                        <XAxis 
                          dataKey="time" 
                          stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'}
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#d1d5db', strokeWidth: 1 }}
                        />
                        <YAxis 
                          stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'}
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#d1d5db', strokeWidth: 1 }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                            color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#111827',
                            fontSize: '13px'
                          }}
                          labelStyle={{ fontWeight: 600 }}
                          cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeOpacity: 0.5 }}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          iconType="circle"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="responseTime" 
                          stroke="#3B82F6" 
                          strokeWidth={2}
                          name="Response Time (ms)"
                          dot={{ fill: '#3B82F6', strokeWidth: 1, r: 3 }}
                          activeDot={{ r: 3, stroke: '#3B82F6', strokeWidth: 1, fill: '#ffffff' }}
                          fill="url(#primaryGradient)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="activeUsers" 
                          stroke="#10B981" 
                          strokeWidth={2}
                          name="Active Users"
                          dot={{ fill: '#10B981', strokeWidth: 1, r: 3 }}
                          activeDot={{ r: 3, stroke: '#10B981', strokeWidth: 1, fill: '#ffffff' }}
                          fill="url(#secondaryGradient)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* HTTP Status Codes */}
              {statusCodeData.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                      HTTP Status Codes
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Total Requests: {statusCodeData.reduce((sum, item) => sum + item.value, 0)}
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <defs>
                          <filter id="pieShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15"/>
                          </filter>
                        </defs>
                        <Pie
                          data={statusCodeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                          outerRadius={110}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="none"
                          filter="url(#pieShadow)"
                        >
                          {statusCodeData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                            color: '#111827',
                            fontSize: '13px'
                          }}
                          labelStyle={{ fontWeight: 600 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Response Time Percentiles */}
            {responseTime && responseTime.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                    Response Time %
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Performance Analysis
                  </div>
                </div>
                
                {/* Chart */}
                <div className="h-72 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={responseTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        </linearGradient>
                        <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2"/>
                        </filter>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'} 
                        strokeOpacity={0.6}
                      />
                      <XAxis 
                        dataKey="percentile" 
                        stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'}
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#d1d5db', strokeWidth: 1 }}
                      />
                      <YAxis 
                        stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280'}
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: document.documentElement.classList.contains('dark') ? '#4b5563' : '#d1d5db', strokeWidth: 1 }}
                        label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                          color: document.documentElement.classList.contains('dark') ? '#f9fafb' : '#111827',
                          fontSize: '13px'
                        }}
                        labelStyle={{ fontWeight: 600 }}
                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                      />
                      <Bar 
                        dataKey="value" 
                        fill="url(#barGradient)" 
                        radius={[6, 6, 0, 0]}
                        filter="url(#barShadow)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Analysis */}
                <div className="space-x-2 flex flex-rows">
                  {responseTime.map((item: any, index: number) => {
                    const percentageText = item.percentile === 'p50' ? '50%' :
                                         item.percentile === 'p90' ? '90%' :
                                         item.percentile === 'p95' ? '95%' :
                                         item.percentile === 'p99' ? '99%' : item.percentile
                    
                    // Performance level based on response time thresholds
                    const getPerformanceLevel = (percentile: string, value: number) => {
                      const thresholds = {
                        p50: { excellent: 100, good: 300, fair: 800 },
                        p90: { excellent: 200, good: 500, fair: 1200 },
                        p95: { excellent: 300, good: 700, fair: 1500 },
                        p99: { excellent: 500, good: 1000, fair: 2000 }
                      }
                      const threshold = thresholds[percentile as keyof typeof thresholds]
                      if (!threshold) return { level: 'unknown', color: 'gray', text: 'ไม่ทราบ', icon: '❓' }
                      
                      if (value <= threshold.excellent) {
                        return { level: 'excellent', color: 'green', text: 'ดีเยี่ยม', icon: '🚀' }
                      } else if (value <= threshold.good) {
                        return { level: 'good', color: 'blue', text: 'ดี', icon: '✅' }
                      } else if (value <= threshold.fair) {
                        return { level: 'fair', color: 'yellow', text: 'พอใช้', icon: '⚠️' }
                      } else {
                        return { level: 'poor', color: 'red', text: 'ต้องปรับปรุง', icon: '🚨' }
                      }
                    }
                    
                    const performance = getPerformanceLevel(item.percentile, item.value)
                    
                    return (
                      <div key={index} className={`p-3 rounded-lg bg-${performance.color}-50 dark:bg-${performance.color}-900/20 border-${performance.color}-400`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{performance.icon}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {percentageText} ของผู้ใช้
                            </span>
                          </div>
                          <span className={`text-sm font-bold text-${performance.color}-600 dark:text-${performance.color}-400`}>
                            {item.value} ms
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className={`text-xs text-${performance.color}-700 dark:text-${performance.color}-300`}>
                            ประสิทธิภาพ: {performance.text}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {(() => {
                              const totalUsers = summary?.vus || 0
                              const percentageValue = parseInt(percentageText.replace('%', ''))
                              const userCount = Math.round((totalUsers * percentageValue) / 100)
                              const remainingUsers = totalUsers - userCount
                              
                              return (
                                <span>
                                  📊 <span className="font-medium">{userCount} คน</span> ได้รับ response ≤ {item.value}ms 
                                  {remainingUsers > 0 ? ` (อีก ${remainingUsers} คนรอนานกว่านี้)` : ' (ทุกคนได้รับ response ≤ ค่านี้)'}
                                </span>
                              )
                            })()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Performance Analysis & Capacity Prediction */}
            {summary && responseTime && responseTime.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 mb-8 border border-indigo-200 dark:border-indigo-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">การวิเคราะห์ประสิทธิภาพและพยากรณ์การรองรับสูงสุด</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Performance Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                      การวิเคราะห์ประสิทธิภาพปัจจุบัน
                    </h4>
                    
                    {(() => {
                      const currentVUsers = summary?.vus || 0
                      const avgResponseTime = summary?.avgResponseTime || 0
                      const successRate = summary?.requests > 0 ? ((summary.requests - summary.failed) / summary.requests) : 0
                      const p95ResponseTime = responseTime.find((item: any) => item.percentile === 'p95')?.value || avgResponseTime
                      
                      // Performance scoring based on industry standards
                      const responseTimeScore = p95ResponseTime <= 300 ? 1.0 : 
                                              p95ResponseTime <= 700 ? 0.8 :
                                              p95ResponseTime <= 1500 ? 0.6 :
                                              p95ResponseTime <= 3000 ? 0.4 : 0.2
                      
                      const successRateScore = successRate >= 0.99 ? 1.0 :
                                             successRate >= 0.95 ? 0.8 :
                                             successRate >= 0.90 ? 0.6 :
                                             successRate >= 0.85 ? 0.4 : 0.2
                      
                      // Weighted performance score (Response Time 60%, Success Rate 40%)
                      const performanceScore = (responseTimeScore * 0.6) + (successRateScore * 0.4)
                      
                      const getPerformanceLevel = (score: number) => {
                        if (score >= 0.8) return { text: 'ดีเยี่ยม', color: 'green', icon: '🚀' }
                        if (score >= 0.6) return { text: 'ดี', color: 'blue', icon: '✅' }
                        if (score >= 0.4) return { text: 'พอใช้', color: 'yellow', icon: '⚠️' }
                        return { text: 'ต้องปรับปรุง', color: 'red', icon: '🚨' }
                      }
                      
                      const level = getPerformanceLevel(performanceScore)
                      
                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Virtual Users ปัจจุบัน</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{currentVUsers} users</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Response Time (p95)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{p95ResponseTime.toFixed(0)} ms</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{(successRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Performance Score</span>
                            <span className={`font-semibold text-${level.color}-600 dark:text-${level.color}-400`}>
                              {(performanceScore * 100).toFixed(0)}/100
                            </span>
                          </div>
                          <div className={`mt-4 p-3 rounded-lg bg-${level.color}-50 dark:bg-${level.color}-900/20`}>
                            <p className={`text-sm text-${level.color}-700 dark:text-${level.color}-300 font-medium flex items-center`}>
                              <span className="mr-2">{level.icon}</span>
                              ประสิทธิภาพระบบ: {level.text}
                            </p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                  
                  {/* Capacity Prediction */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                    <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                      พยากรณ์การรองรับสูงสุด
                    </h4>
                    
                    {(() => {
                      const currentVUsers = summary?.vus || 0
                      const avgResponseTime = summary?.avgResponseTime || 0
                      const successRate = summary?.requests > 0 ? ((summary.requests - summary.failed) / summary.requests) : 0
                      const totalRequests = summary?.requests || 0
                      const duration = parseFloat(currentResult.config.duration.replace('s', '')) || 1
                      const p95ResponseTime = responseTime.find((item: any) => item.percentile === 'p95')?.value || avgResponseTime
                      
                      // Performance scoring
                      const responseTimeScore = p95ResponseTime <= 300 ? 1.0 : 
                                              p95ResponseTime <= 700 ? 0.8 :
                                              p95ResponseTime <= 1500 ? 0.6 :
                                              p95ResponseTime <= 3000 ? 0.4 : 0.2
                      
                      const successRateScore = successRate >= 0.99 ? 1.0 :
                                             successRate >= 0.95 ? 0.8 :
                                             successRate >= 0.90 ? 0.6 :
                                             successRate >= 0.85 ? 0.4 : 0.2
                      
                      const performanceScore = (responseTimeScore * 0.6) + (successRateScore * 0.4)
                      
                      // Realistic scalability factor based on performance characteristics
                      let scalabilityFactor = 1.0
                      let recommendation = ''
                      let recommendationColor = 'blue'
                      
                      if (performanceScore >= 0.8) {
                        // Excellent performance - minimal resource contention
                        scalabilityFactor = 1.6 + (performanceScore - 0.8) * 3 // 1.6-2.2x
                        recommendation = 'ระบบมีประสิทธิภาพดีเยี่ยม สามารถรองรับผู้ใช้เพิ่มขึ้นได้อย่างมั่นใจ'
                        recommendationColor = 'green'
                      } else if (performanceScore >= 0.6) {
                        // Good performance - some resource pressure
                        scalabilityFactor = 1.2 + (performanceScore - 0.6) * 2 // 1.2-1.6x
                        recommendation = 'ประสิทธิภาพดี แต่ควรตรวจสอบทรัพยากรระบบก่อนเพิ่มโหลด'
                        recommendationColor = 'blue'
                      } else if (performanceScore >= 0.4) {
                        // Fair performance - approaching limits
                        scalabilityFactor = 0.9 + (performanceScore - 0.4) * 1.5 // 0.9-1.2x
                        recommendation = 'ใกล้ขีดจำกัดแล้ว ควรปรับปรุงประสิทธิภาพก่อนเพิ่มโหลด'
                        recommendationColor = 'yellow'
                      } else {
                        // Poor performance - at or over capacity
                        scalabilityFactor = 0.6 + (performanceScore * 0.75) // 0.6-0.9x
                        recommendation = 'ระบบมีปัญหาด้านประสิทธิภาพ ควรลดโหลดหรือปรับปรุงระบบเร่งด่วน'
                        recommendationColor = 'red'
                      }
                      
                      const estimatedMaxConcurrency = Math.round(currentVUsers * scalabilityFactor)
                      
                      // Calculate throughput using Little's Law: Throughput = Concurrency / Response Time
                      const effectiveResponseTime = Math.max(p95ResponseTime, 50) / 1000 // Convert to seconds, minimum 50ms
                      const theoreticalThroughput = estimatedMaxConcurrency / effectiveResponseTime
                      const practicalThroughput = Math.round(theoreticalThroughput * successRate * 0.8) // 80% safety margin
                      
                      const currentThroughput = totalRequests / duration
                      const throughputGrowthPotential = ((practicalThroughput / Math.max(currentThroughput, 1)) - 1) * 100
                      
                      return (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Concurrent Users สูงสุด (แนะนำ)</span>
                            <span className={`font-semibold text-${recommendationColor}-600 dark:text-${recommendationColor}-400`}>
                              {estimatedMaxConcurrency} users
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Throughput คาดการณ์</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{practicalThroughput} req/s</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">การเพิ่มขึ้นจากปัจจุบัน</span>
                            <span className={`font-semibold ${
                              scalabilityFactor >= 1.5 ? 'text-green-600 dark:text-green-400' :
                              scalabilityFactor >= 1.2 ? 'text-blue-600 dark:text-blue-400' :
                              scalabilityFactor >= 1.0 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {scalabilityFactor >= 1 ? '+' : ''}{((scalabilityFactor - 1) * 100).toFixed(0)}%
                            </span>
                          </div>
                          {throughputGrowthPotential > 0 && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 dark:text-gray-400">ศักยภาพ Throughput</span>
                              <span className={`font-semibold ${
                                throughputGrowthPotential > 50 ? 'text-green-600 dark:text-green-400' :
                                throughputGrowthPotential > 20 ? 'text-blue-600 dark:text-blue-400' :
                                'text-yellow-600 dark:text-yellow-400'
                              }`}>
                                +{throughputGrowthPotential.toFixed(0)}%
                              </span>
                            </div>
                          )}
                          <div className={`mt-4 p-3 rounded-lg bg-${recommendationColor}-50 dark:bg-${recommendationColor}-900/20`}>
                            <p className={`text-sm text-${recommendationColor}-700 dark:text-${recommendationColor}-300 font-medium`}>
                              📊 {recommendation}
                            </p>
                            {performanceScore < 0.6 && (
                              <p className={`text-xs text-${recommendationColor}-600 dark:text-${recommendationColor}-400 mt-1`}>
                                💡 แนะนำ: ตรวจสอบ CPU, Memory, Database connections และ network latency
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
                
                {/* Performance Guidelines */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-600">
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    แนวทางการประเมินและพยากรณ์ (มาตรฐาน DevOps)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <div className="font-medium text-green-800 dark:text-green-200 mb-1">🚀 ดีเยี่ยม (Score ≥ 80)</div>
                      <div className="text-green-700 dark:text-green-300">
                        • Response time p95 &lt; 300ms<br/>
                        • Success rate &gt; 99%<br/>
                        • รองรับเพิ่มได้ 1.6-2.2x<br/>
                        • แนะนำ: เพิ่มโหลดได้อย่างมั่นใจ
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                      <div className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">⚠️ ควรระวัง (Score 40-60)</div>
                      <div className="text-yellow-700 dark:text-yellow-300">
                        • Response time p95 300ms-1.5s<br/>
                        • Success rate 85-95%<br/>
                        • รองรับเพิ่มได้ 0.9-1.2x<br/>
                        • แนะนำ: เพิ่มโหลดอย่างระมัดระวัง
                      </div>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <div className="font-medium text-red-800 dark:text-red-200 mb-1">🚨 ต้องปรับปรุง (Score &lt; 40)</div>
                      <div className="text-red-700 dark:text-red-300">
                        • Response time p95 &gt; 1.5s<br/>
                        • Success rate &lt; 85%<br/>
                        • ควรลดโหลด 0.6-0.9x<br/>
                        • แนะนำ: ปรับปรุงระบบก่อนเพิ่มโหลด
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Metrics */}
            {metrics && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Detailed Metrics
                  </h3>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    System Performance Details
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
                        Duration
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Duration</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.duration || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="w-5 h-5 text-blue-500" />
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                        Rate
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Requests/sec</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.requestRate || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <Download className="w-5 h-5 text-green-500" />
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium px-2 py-1 bg-green-50 dark:bg-green-900/30 rounded-full">
                        In
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Received</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.dataReceived || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="w-5 h-5 text-orange-500" />
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium px-2 py-1 bg-orange-50 dark:bg-orange-900/30 rounded-full">
                        Out
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Data Sent</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.dataSent || 'N/A'}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full">
                        Min
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Min Response</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.minResponseTime || 'N/A'}<span className="text-sm text-gray-500 dark:text-gray-400 ml-1">ms</span></p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div className="text-xs text-red-600 dark:text-red-400 font-medium px-2 py-1 bg-red-50 dark:bg-red-900/30 rounded-full">
                        Max
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Max Response</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metrics.maxResponseTime || 'N/A'}<span className="text-sm text-gray-500 dark:text-gray-400 ml-1">ms</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  )
} 