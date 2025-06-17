'use client'

import { Book, ExternalLink, Github, Zap, Settings, BarChart, Shield } from 'lucide-react'

export default function ReadMeTab() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">ฟีเจอร์หลัก</h3>
          </div>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>กำหนดค่า URL, HTTP Method, Headers, Parameters</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>ตั้งค่า Virtual Users และระยะเวลาการทดสอบ</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>แสดงผลลัพธ์ในรูปแบบกราฟและตาราง</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>บันทึกประวัติการทดสอบหลายครั้ง</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>ส่งออกผลลัพธ์เป็น JPEG และ PDF</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>รองรับ Dark/Light Theme</span>
            </li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center mb-4">
            <BarChart className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">การวิเคราะห์ผลลัพธ์</h3>
          </div>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Response Time และ Throughput</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>HTTP Status Code Distribution</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Percentile Analysis (P50, P90, P95, P99)</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Virtual Users และ Failed Requests</span>
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Data Transfer Statistics</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Usage Guide */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">วิธีการใช้งาน</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">1</span>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">ไปที่ Testing Tab</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">เริ่มต้นด้วยการกรอกข้อมูล URL ที่ต้องการทดสอบ</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">2</span>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">กำหนดค่าการทดสอบ</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">เลือก HTTP Method, เพิ่ม Headers, Parameters และ Request Body</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">3</span>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">ตั้งค่า Load Test</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">กำหนดจำนวน Virtual Users, ระยะเวลา และ Ramp-up Time</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">4</span>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">เริ่มการทดสอบ</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">กดปุ่ม "เริ่มทดสอบ Load Testing" และรอผลลัพธ์</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">5</span>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">ดูผลลัพธ์</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">ระบบจะเปลี่ยนไปที่ Results Tab อัตโนมัติเมื่อเสร็จสิ้น</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-0.5">6</span>
              <div>
                <h5 className="font-medium text-gray-900 dark:text-white">ส่งออกผลลัพธ์</h5>
                <p className="text-gray-600 dark:text-gray-400 text-sm">คลิกปุ่ม JPEG หรือ PDF เพื่อส่งออกผลลัพธ์</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <BarChart className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">การตีความผลลัพธ์</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Response Time</h4>
                             <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                 <li>• &lt; 100ms: ดีเยี่ยม</li>
                 <li>• 100-300ms: ดี</li>
                 <li>• 300-1000ms: ปานกลาง</li>
                 <li>• &gt; 1000ms: ต้องปรับปรุง</li>
               </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Success Rate</h4>
                             <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                 <li>• 99.9%+: ดีเยี่ยม</li>
                 <li>• 99-99.9%: ดี</li>
                 <li>• 95-99%: ปานกลาง</li>
                 <li>• &lt; 95%: มีปัญหา</li>
               </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start">
          <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">ข้อควรระวัง</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• ใช้เฉพาะกับเว็บไซต์ที่คุณมีสิทธิ์ทดสอบเท่านั้น</li>
              <li>• อย่าทดสอบเว็บไซต์ของผู้อื่นโดยไม่ได้รับอนุญาต</li>
              <li>• เริ่มต้นด้วย Virtual Users น้อยๆ ก่อน</li>
              <li>• ระวังการใช้ bandwidth และ CPU มากเกินไป</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          พัฒนาด้วย ❤️ โดย <a href="https://gracer.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Gracer AI</a>
        </p>
      </div>
    </div>
  )
} 