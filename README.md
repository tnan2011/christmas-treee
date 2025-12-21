🎄 Grand Luxury Interactive Christmas Tree
Cây Thông Noel 3D Tương Tác Cao Cấp

Grand Luxury Interactive Christmas Tree là một ứng dụng Web 3D độ chân thực cao, mô phỏng cây thông Noel sang trọng với phong cách xa hoa tông xanh lục bảo & vàng ánh kim, hỗ trợ điều khiển bằng cử chỉ tay, hiệu ứng từ hỗn loạn → hoàn chỉnh, cùng khả năng tải ảnh và chia sẻ online.

✨ Tính năng nổi bật

🌟 Cây thông Noel 3D độ chi tiết cao

✋ Điều khiển bằng cử chỉ tay qua webcam (MediaPipe)

🔄 Chuyển trạng thái động:

CHAOS – Các phần tử bung ra hỗn loạn

FORMED – Tụ lại thành cây thông hoàn chỉnh

📸 Trang trí cây bằng ảnh Polaroid cá nhân

🔗 Tạo link chia sẻ ảnh (hết hạn sau 30 ngày)

⚡ Render tối ưu với InstancedMesh & Particles

✨ Hiệu ứng Bloom, glow điện ảnh cao cấp

🧠 Ý tưởng & kiến trúc
1️⃣ Máy trạng thái (State Machine)

CHAOS: Các phần tử (lá, đồ trang trí, ảnh) phân tán ngẫu nhiên

FORMED: Các phần tử tụ lại tạo hình cây thông

Chuyển trạng thái mượt bằng nội suy (Lerp)

2️⃣ Hệ tọa độ kép (Dual-Position System)

Mỗi phần tử có 2 vị trí:

ChaosPosition: tọa độ ngẫu nhiên trong không gian hình cầu

TargetPosition: tọa độ tạo thành cây thông hình nón

➡ Nội suy giữa 2 vị trí trong useFrame

3️⃣ Hệ thống thành phần

Lá thông: THREE.Points + ShaderMaterial

Đồ trang trí:

Hộp quà (nặng)

Quả cầu màu (nhẹ)

Đèn trang trí (rất nhẹ)

Ảnh Polaroid: InstancedMesh, sắp xếp quanh cây

🛠️ Công nghệ sử dụng
Frontend

React 19 + TypeScript

React Three Fiber (R3F)

Three.js

@react-three/drei

@react-three/postprocessing

Tailwind CSS

MediaPipe (nhận diện tay)

Backend (chia sẻ ảnh)

Vercel Serverless Functions

Cloudflare R2 (Object Storage – S3 compatible)

Cloudflare KV (Key–Value Storage)

AWS SDK S3 Client

📦 Cài đặt & chạy dự án
1️⃣ Clone repository
git clone <repository-url>
cd grand-luxury-interactive-christmas-tree

2️⃣ Cài đặt dependencies
npm install

3️⃣ Chạy môi trường phát triển
npm run dev


🔹 Chế độ local sử dụng localStorage để chia sẻ (chỉ hoạt động trong cùng trình duyệt)

4️⃣ (Tuỳ chọn) Cấu hình Cloudflare để chia sẻ online

Xem hướng dẫn trong cloudflare-setup.md

Copy env.example → .env.local

Điền thông tin Cloudflare R2 & KV

Chạy test với Vercel:

npm run dev:vercel

5️⃣ Truy cập ứng dụng

Mở trình duyệt: http://localhost:3010

Cho phép quyền camera

Tải ảnh để trang trí cây

🎯 Hướng dẫn sử dụng
📸 Tải ảnh & chia sẻ

Nhấn Tải ảnh

Chọn tối đa 22 ảnh

Ảnh hiển thị dạng Polaroid trên cây

Nhấn Tạo link chia sẻ

Gửi link cho bạn bè (hết hạn sau 30 ngày)

✋ Điều khiển bằng cử chỉ tay
Cử chỉ	Hành động
Xòe tay	Bung cây (CHAOS)
Nắm tay	Tạo lại cây (FORMED)
Di chuyển tay	Xoay / nghiêng camera

Có khung preview camera ở góc trên phải để căn chỉnh tay

🖱️ Điều khiển bằng chuột (khi không có tay)

Click & kéo: xoay góc nhìn

Cuộn chuột: zoom

Chuột phải & kéo: pan (mặc định tắt)

🎨 Cấu hình đồ họa

Camera: [0, 4, 20]

Environment: Lobby HDRI

Bloom:

Threshold: 0.8

Intensity: 1.2

Tông màu chủ đạo: Xanh lục bảo – Vàng ánh kim

🎄 Mục đích dự án

Trình diễn kỹ thuật Web 3D hiện đại

Demo điều khiển gesture-based interaction

Phù hợp làm:

Đồ án

Portfolio

Trải nghiệm lễ hội tương tác