# 🚀 Load Testing Tool

เครื่องมือทดสอบภาระงานที่พัฒนาด้วย Next.js และ k6 สำหรับทดสอบประสิทธิภาพของ Web API และเว็บไซต์

![Load Testing Tool](https://img.shields.io/badge/Load%20Testing-k6-orange)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC)

## 📋 สารบัญ

- [หลักการทำงาน](#หลักการทำงาน)
- [ฟีเจอร์หลัก](#ฟีเจอร์หลัก)
- [การติดตั้ง](#การติดตั้ง)
- [วิธีใช้งาน](#วิธีใช้งาน)
- [การอ่านผลลัพธ์](#การอ่านผลลัพธ์)
- [ตัวอย่างการใช้งาน](#ตัวอย่างการใช้งาน)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)

## 🔧 หลักการทำงาน

### 1. **Frontend (Next.js + React)**
- **ฟอร์มกรอกข้อมูล**: ผู้ใช้กรอก URL, HTTP Method, Headers, Parameters, Body และค่าการทดสอบ
- **การแสดงผล**: แสดงผลลัพธ์เป็นกราฟและตารางแบบ real-time
- **UI/UX**: ใช้ Tailwind CSS และ Recharts สำหรับ data visualization

### 2. **Backend API (Next.js API Routes)**
- **รับข้อมูล**: รับ configuration จาก frontend
- **สร้าง k6 Script**: แปลงข้อมูลเป็น JavaScript script สำหรับ k6
- **รัน Load Test**: เรียกใช้ k6 เพื่อทำการทดสอบ
- **ประมวลผล**: แปลงผลลัพธ์จาก k6 JSON format เป็นข้อมูลสำหรับแสดงผล

### 3. **k6 Load Testing Engine**
- **Virtual Users**: จำลองผู้ใช้หลายคนเข้าใช้งานพร้อมกัน
- **Scenarios**: กำหนดรูปแบบการทดสอบ (ramp-up, steady state, ramp-down)
- **Metrics Collection**: เก็บข้อมูล response time, throughput, error rate
- **Real-time Monitoring**: ติดตามผลการทดสอบแบบ real-time

### 4. **Fallback System**
- หากไม่มี k6 ติดตั้ง ระบบจะสร้าง **Mock Data** ที่มีลักษณะใกล้เคียงกับผลการทดสอบจริง
- ช่วยให้สามารถทดลองใช้ UI และฟีเจอร์ต่างๆ ได้โดยไม่ต้องติดตั้ง k6

## ✨ ฟีเจอร์หลัก

### 🎯 **การกำหนดค่าการทดสอบ**
- **URL Configuration**: รองรับ HTTP และ HTTPS
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH
- **Request Parameters**: Query string parameters
- **Headers Management**: เพิ่ม/ลบ HTTP headers
- **Request Body**: รองรับ JSON และ Form Data
- **Load Configuration**: Virtual Users, Duration, Ramp-up Time

### 📊 **การแสดงผลลัพธ์**
- **Summary Cards**: ข้อมูลสรุปโดยรวม
- **Response Time Chart**: กราฟแสดง response time ตลอดการทดสอบ
- **HTTP Status Codes**: แสดงสัดส่วน status codes
- **Percentile Analysis**: วิเคราะห์ response time percentiles
- **Detailed Metrics**: ข้อมูลรายละเอียด

### 🎨 **User Experience**
- **Responsive Design**: ใช้งานได้ทั้ง Desktop และ Mobile
- **Real-time Updates**: แสดงผลทันทีเมื่อการทดสอบเสร็จ
- **Loading States**: แสดงสถานะการโหลด
- **Error Handling**: จัดการข้อผิดพลาดอย่างเหมาะสม

## 🚀 การติดตั้ง

### 1. **Clone Repository**
```bash
git clone <repository-url>
cd loadtest-tool
```

### 2. **ติดตั้ง Dependencies**
```bash
npm install
```

### 3. **ติดตั้ง k6 (Optional)**
```bash
# สำหรับ macOS
./install-k6.sh

# หรือติดตั้งแยก
# macOS
brew install k6

# Ubuntu/Debian
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows
winget install k6
# หรือ
choco install k6
```

### 4. **รันโปรเจค**
```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## 📖 วิธีใช้งาน

### **ขั้นตอนที่ 1: กรอกข้อมูล URL และ Method**
```
URL: https://jsonplaceholder.typicode.com/posts
Method: GET
```

### **ขั้นตอนที่ 2: เพิ่ม Request Parameters (ถ้าจำเป็น)**
```
Key: _limit    Value: 10
Key: _page     Value: 1
```

### **ขั้นตอนที่ 3: กำหนด Headers**
```
Key: Authorization    Value: Bearer your-token
Key: Content-Type     Value: application/json
```

### **ขั้นตอนที่ 4: ใส่ Request Body (สำหรับ POST/PUT)**
```json
{
  "title": "Test Post",
  "body": "This is a test post",
  "userId": 1
}
```

### **ขั้นตอนที่ 5: ตั้งค่าการทดสอบ**
```
Virtual Users: 10        (จำนวนผู้ใช้จำลอง)
Duration: 30s            (ระยะเวลาทดสอบ)
Ramp-up Time: 5s         (เวลาเพิ่มผู้ใช้ค่อยๆ)
```

### **ขั้นตอนที่ 6: เริ่มทดสอบ**
กดปุ่ม **"เริ่มทดสอบ"** และรอผลลัพธ์

## 📈 การอ่านผลลัพธ์

### **1. Summary Cards**

#### 🔵 **Virtual Users**
- **ความหมาย**: จำนวนผู้ใช้จำลองที่กำหนด
- **การอ่าน**: ตัวเลขนี้ควรตรงกับที่ตั้งค่าไว้

#### 🟢 **Total Requests**
- **ความหมาย**: จำนวน HTTP requests ทั้งหมดที่ส่งไป
- **การอ่าน**: ยิ่งมากยิ่งดี แสดงว่าระบบรับโหลดได้มาก

#### 🟣 **Average Response Time**
- **ความหมาย**: เวลาตอบสนองเฉลี่ย (มิลลิวินาที)
- **การอ่าน**: 
  - **< 100ms**: ดีเยี่ยม
  - **100-300ms**: ดี
  - **300-1000ms**: พอใช้
  - **> 1000ms**: ช้า ต้องปรับปรุง

#### 🔴 **Failed Requests**
- **ความหมาย**: จำนวน requests ที่ล้มเหลว
- **การอ่าน**: ควรน้อยที่สุด หรือ 0

### **2. Response Time Over Time Chart**

#### 📊 **เส้นกราฟสีม่วง (Response Time)**
- **ความหมาย**: แสดง response time ตลอดการทดสอบ
- **การอ่าน**:
  - **เส้นตรง**: ประสิทธิภาพคงที่ดี
  - **เส้นขึ้น**: ประสิทธิภาพลดลงเมื่อโหลดเพิ่ม
  - **เส้นกระเซ็น**: ไม่เสถียร มีปัญหา

#### 📈 **เส้นกราฟสีเขียว (Active Users)**
- **ความหมาย**: จำนวน active users ในแต่ละช่วงเวลา
- **การอ่าน**: ควรเพิ่มขึ้นตาม ramp-up time ที่กำหนด

### **3. HTTP Status Codes Distribution**

#### 🟢 **HTTP 200 (Success)**
- **ควรมี**: 95-100% ของ total requests
- **หากน้อย**: มีปัญหาการทำงานของ API

#### 🟡 **HTTP 404 (Not Found)**
- **ความหมาย**: URL ไม่ถูกต้องหรือ resource ไม่มี
- **การแก้**: ตรวจสอบ URL และ endpoints

#### 🔴 **HTTP 500 (Server Error)**
- **ความหมาย**: เซิร์ฟเวอร์มีปัญหา
- **การแก้**: ตรวจสอบ server logs และแก้ไข bugs

### **4. Response Time Percentiles**

#### 📊 **การอ่านค่า Percentiles**
- **p50 (Median)**: 50% ของ requests ได้ response ≤ ค่านี้
- **p90**: 90% ของ requests ได้ response ≤ ค่านี้  
- **p95**: 95% ของ requests ได้ response ≤ ค่านี้
- **p99**: 99% ของ requests ได้ response ≤ ค่านี้

#### 🎯 **เป้าหมายที่ดี**
```
p50: < 200ms
p90: < 500ms  
p95: < 800ms
p99: < 1500ms
```

### **5. Detailed Metrics**

#### ⏱️ **Total Duration**
- **ความหมาย**: เวลาทั้งหมดที่ใช้ในการทดสอบ
- **การอ่าน**: ควรใกล้เคียงกับที่กำหนดไว้

#### 🔄 **Requests/sec (RPS)**
- **ความหมาย**: จำนวน requests ต่อวินาที
- **การอ่าน**: ยิ่งสูงยิ่งดี แสดงว่า throughput สูง

#### 📥 **Data Received/Sent**
- **ความหมาย**: ปริมาณข้อมูลที่รับ/ส่ง
- **การอ่าน**: ใช้คำนวณ bandwidth และต้นทุน

#### ⚡ **Min/Max Response Time**
- **ความหมาย**: เวลาตอบสนองที่เร็วที่สุด/ช้าที่สุด
- **การอ่าน**: ช่วงห่างไม่ควรกว้างเกินไป

## 💡 ตัวอย่างการใช้งาน

### **1. ทดสอบ REST API**
```
URL: https://jsonplaceholder.typicode.com/posts
Method: POST
Headers: 
  Content-Type: application/json
Body:
{
  "title": "Load Test Post",
  "body": "Testing API performance",
  "userId": 1
}
Virtual Users: 20
Duration: 1m
Ramp-up: 10s
```

### **2. ทดสอบเว็บไซต์**
```
URL: https://example.com
Method: GET
Parameters:
  utm_source: loadtest
  page: home
Virtual Users: 50
Duration: 2m
Ramp-up: 15s
```

### **3. ทดสอบ API พร้อม Authentication**
```
URL: https://api.example.com/users
Method: GET
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Accept: application/json
Virtual Users: 15
Duration: 45s
Ramp-up: 5s
```

## 📁 โครงสร้างโปรเจค

```
loadtest-tool/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── load-test/
│   │       └── route.ts          # API endpoint สำหรับรัน k6
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # หน้าหลัก
├── components/
│   ├── LoadTestForm.tsx          # ฟอร์มกรอกข้อมูลการทดสอบ
│   └── ResultsDisplay.tsx        # แสดงผลลัพธ์และกราฟ
├── public/                       # Static assets
├── styles/                       # CSS files
├── install-k6.sh               # สคริปต์ติดตั้ง k6
├── package.json                 # Dependencies
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # เอกสารนี้
```

## 🛠️ เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Load Testing**: k6
- **HTTP Client**: Built-in Fetch API

## ⚠️ ข้อควรระวัง

### **1. การใช้งาน k6**
- ไม่ควรทดสอบ production servers ด้วยโหลดสูงเกินไป
- ขอความยินยอมก่อนทดสอบ external APIs
- ระวังการใช้ bandwidth มากเกินไป

### **2. การตีความผลลัพธ์**
- ผลการทดสอบขึ้นอยู่กับ network, server specs, และ database
- ควรทดสอบหลายครั้งเพื่อความแม่นยำ
- เปรียบเทียบผลกับ baseline metrics

### **3. ข้อจำกัด**
- Mock data จะไม่แม่นยำเท่าการทดสอบจริงด้วย k6
- การทดสอบผ่าน browser อาจมี CORS limitations
- ไม่รองรับ WebSocket หรือ advanced protocols

## 🤝 การพัฒนาต่อ

สามารถขยายฟีเจอร์เพิ่มเติมได้:

- **Test Scenarios**: บันทึกและโหลด test configurations
- **Historical Data**: เก็บประวัติการทดสอบ
- **Alerts**: แจ้งเตือนเมื่อประสิทธิภาพลดลง
- **Comparison**: เปรียบเทียบผลการทดสอบ
- **Export Reports**: ส่งออกรายงานเป็น PDF/Excel
- **Team Collaboration**: แชร์ผลการทดสอบกับทีม

## 📄 License

MIT License - ใช้งานได้อย่างอิสระ

---

**Happy Load Testing!** 🚀

หากมีคำถามหรือต้องการความช่วยเหลือ สามารถเปิด Issue ใน repository นี้ได้ 