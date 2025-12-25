import React, { useRef, useState } from 'react';
import { TreeMode } from '../types';

interface UIOverlayProps {
  mode: TreeMode;
  onToggle: () => void;
  onPhotosUpload: (photos: string[]) => void;
  hasPhotos: boolean;
  uploadedPhotos: string[];
  isSharedView: boolean;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({
  mode,
  onToggle,
  onPhotosUpload,
  hasPhotos,
  uploadedPhotos,
  isSharedView
}) => {
  const isFormed = mode === TreeMode.FORMED;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareError, setShareError] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  /* ================= Upload ảnh ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readers: Promise<string>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const promise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });

      readers.push(promise);
    }

    Promise.all(readers).then((urls) => {
      onPhotosUpload(urls);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /* ================= Base64 → Blob ================= */
  const base64ToBlob = (base64: string): Blob => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  /* ================= Chia sẻ ================= */
  const handleShare = async () => {
    if (!uploadedPhotos || uploadedPhotos.length === 0) {
      setShareError('Vui lòng tải ảnh lên trước');
      return;
    }

    setIsSharing(true);
    setShareError('');
    setShareLink('');
    setUploadProgress('Chuẩn bị tải lên...');

    try {
      /* 1️⃣ Lấy URL upload */
      setUploadProgress('Đang lấy địa chỉ tải lên...');
      const urlsResponse = await fetch('/api/get-upload-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageCount: uploadedPhotos.length }),
      });

      /* Fallback localStorage khi dev */
      if (urlsResponse.status === 404) {
        const isLocalDev =
          window.location.hostname === 'localhost' ||
          window.location.hostname.includes('127.0.0.1');

        if (isLocalDev) {
          try {
            const shareId = Math.random().toString(36).substring(2, 10);
            localStorage.setItem(
              `share_${shareId}`,
              JSON.stringify({
                images: uploadedPhotos,
                createdAt: Date.now(),
              })
            );
            setShareLink(`${window.location.origin}/?share=${shareId}`);
            return;
          } catch {
            setShareError('Dữ liệu ảnh quá lớn, hãy giảm số lượng hoặc kích thước ảnh');
            return;
          }
        } else {
          throw new Error('API chưa được cấu hình, vui lòng kiểm tra thiết lập triển khai');
        }
      }

      const urlsData = await urlsResponse.json();
      if (!urlsResponse.ok) {
        throw new Error(urlsData.error || 'Không thể lấy địa chỉ upload');
      }

      const { shareId, uploadUrls } = urlsData;

      /* 2️⃣ Upload ảnh */
      let uploadedCount = 0;
      setUploadProgress(`Đang tải ảnh (0/${uploadedPhotos.length})...`);

      const imageUrls = await Promise.all(
        uploadedPhotos.map(async (photo, index) => {
          const blob = base64ToBlob(photo);
          const { uploadUrl, publicUrl } = uploadUrls[index];

          const res = await fetch(uploadUrl, {
            method: 'PUT',
            body: blob,
            headers: { 'Content-Type': 'image/jpeg' },
          });

          if (!res.ok) {
            throw new Error(`Tải ảnh thứ ${index + 1} thất bại`);
          }

          uploadedCount++;
          setUploadProgress(`Đang tải ảnh (${uploadedCount}/${uploadedPhotos.length})...`);
          return publicUrl;
        })
      );

      /* 3️⃣ Hoàn tất */
      setUploadProgress('Đang tạo liên kết chia sẻ...');
      const completeResponse = await fetch('/api/complete-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shareId, imageUrls }),
      });

      const completeData = await completeResponse.json();
      if (!completeResponse.ok) {
        throw new Error(completeData.error || 'Không thể lưu thông tin chia sẻ');
      }

      setShareLink(completeData.shareLink);
    } catch (error: any) {
      const isLocalDev =
        window.location.hostname === 'localhost' ||
        window.location.hostname.includes('127.0.0.1');

      if (isLocalDev) {
        try {
          const shareId = Math.random().toString(36).substring(2, 10);
          localStorage.setItem(
            `share_${shareId}`,
            JSON.stringify({
              images: uploadedPhotos,
              createdAt: Date.now(),
            })
          );
          setShareLink(`${window.location.origin}/?share=${shareId}`);
          return;
        } catch {
          setShareError('Dữ liệu ảnh quá lớn, hãy giảm số lượng hoặc kích thước ảnh');
          return;
        }
      }

      setShareError(error.message || 'Chia sẻ thất bại, vui lòng thử lại');
    } finally {
      setIsSharing(false);
      setUploadProgress('');
    }
  };

  /* ================= Copy link ================= */
  const handleCopyLink = async () => {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateMine = () => {
    window.location.href = window.location.origin;
  };

  /* ================= UI ================= */
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
      <header className="absolute top-8 left-1/2 -translate-x-1/2">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5E6BF] to-[#D4AF37] font-serif">
          Merry Christmas
        </h1>
      </header>

      {/* <div className="absolute bottom-8 right-8 flex flex-col items-end gap-4 pointer-events-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {isSharedView && (
          <button onClick={handleCreateMine} className="px-6 py-3 border-2 border-[#D4AF37] bg-black/70">
            <span className="text-[#D4AF37]">Tạo cây thông Noel của tôi</span>
          </button>
        )}

        {!isSharedView && !hasPhotos && (
          <button onClick={handleUploadClick} className="px-6 py-3 border-2 border-[#D4AF37] bg-black/70">
            <span className="text-[#D4AF37]">Thêm ảnh</span>
          </button>
        )} */}

        {hasPhotos && !shareLink && (
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="px-6 py-3 border-2 border-[#D4AF37] bg-black/70 disabled:opacity-50"
          >
            <span className="text-[#D4AF37]">
              {uploadProgress || (isSharing ? 'Đang tạo...' : 'Chia sẻ')}
            </span>
          </button>
        )}

        {shareError && <p className="text-red-400 text-xs">{shareError}</p>}

        {shareLink && (
          <div className="bg-black/80 border-2 border-[#D4AF37] p-4 max-w-sm">
            <p className="text-[#F5E6BF] text-sm mb-2">Liên kết chia sẻ đã được tạo</p>
            <div className="flex gap-2">
              <input
                value={shareLink}
                readOnly
                className="flex-1 bg-black text-[#D4AF37] text-xs px-2"
              />
              <button onClick={handleCopyLink}>
                <span className="text-[#D4AF37] text-xs">
                  {copied ? '✓ Đã sao chép' : 'Sao chép'}
                </span>
              </button>
            </div>
            <p className="text-xs text-[#F5E6BF]/50 mt-2">Hết hạn sau 30 ngày</p>
          </div>
        )}
      </div>
    </div>
  );
};
