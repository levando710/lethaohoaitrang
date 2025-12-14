import os
from PIL import Image

# ================= CẤU HÌNH =================
INPUT_FOLDER = r'D:\năm 4\Cưới\images\album'      # Tên thư mục chứa ảnh gốc (30MB)
OUTPUT_FOLDER = r'D:\năm 4\Cưới\image'  # Tên thư mục chứa ảnh sau khi nén
TARGET_SIZE_MB = 4.5          # Mục tiêu: Dưới 4.5 MB (để an toàn trong khoảng 2-5MB)
# ============================================

def get_size_mb(file_path):
    return os.path.getsize(file_path) / (1024 * 1024)

def compress_image(image_path, save_path, target_mb):
    """
    Nén ảnh cho đến khi dung lượng nhỏ hơn target_mb
    """
    img = Image.open(image_path)
    
    # Bước 1: Chuyển đổi sang RGB nếu là PNG/RGBA để lưu được thành JPG
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")
    
    # Bước 2: Resize sơ bộ nếu ảnh quá khổng lồ (VD: > 6000px) để tránh nặng máy
    # Giữ nguyên tỉ lệ, chỉ giới hạn chiều lớn nhất xuống 4096px (4K)
    max_dimension = 4096
    if max(img.size) > max_dimension:
        img.thumbnail((max_dimension, max_dimension), Image.LANCZOS)
    
    # Bước 3: Vòng lặp giảm chất lượng
    quality = 95 # Bắt đầu từ chất lượng cao
    step = 5     # Mỗi lần giảm 5 đơn vị
    
    while quality >= 20: # Không giảm xuống quá thấp
        # Lưu tạm để kiểm tra dung lượng
        img.save(save_path, "JPEG", quality=quality, optimize=True)
        
        current_size = get_size_mb(save_path)
        
        if current_size <= target_mb:
            print(f"✅ Đã xong: {os.path.basename(image_path)} | {quality}% Quality | {current_size:.2f} MB")
            return
        
        # Nếu vẫn lớn hơn mục tiêu, giảm chất lượng tiếp
        quality -= step
    
    # Bước 4: Nếu giảm chất lượng hết mức (20%) mà vẫn nặng > 5MB
    # Thì bắt buộc phải Resize nhỏ hơn nữa
    while current_size > target_mb:
        width, height = img.size
        img = img.resize((int(width*0.9), int(height*0.9)), Image.LANCZOS) # Giảm 10% kích thước
        img.save(save_path, "JPEG", quality=30, optimize=True)
        current_size = get_size_mb(save_path)
        print(f"⚠️ Đang resize nhỏ lại: {current_size:.2f} MB")
    
    print(f"✅ Đã xong (Resize): {os.path.basename(image_path)} | {current_size:.2f} MB")

def main():
    # Tạo thư mục output nếu chưa có
    if not os.path.exists(OUTPUT_FOLDER):
        os.makedirs(OUTPUT_FOLDER)
    
    # Tạo thư mục input nếu chưa có (để người dùng biết mà copy ảnh vào)
    if not os.path.exists(INPUT_FOLDER):
        os.makedirs(INPUT_FOLDER)
        print(f"📁 Đã tạo thư mục '{INPUT_FOLDER}'. Hãy copy ảnh 30MB vào đó rồi chạy lại tool nhé!")
        return

    files = [f for f in os.listdir(INPUT_FOLDER) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff'))]
    
    if not files:
        print(f"❌ Không thấy ảnh nào trong thư mục '{INPUT_FOLDER}' cả!")
        return

    print(f"🚀 Bắt đầu xử lý {len(files)} ảnh...")
    print("-" * 50)

    for file in files:
        input_path = os.path.join(INPUT_FOLDER, file)
        output_path = os.path.join(OUTPUT_FOLDER, file)
        
        # Đổi đuôi file thành .jpg hết cho đồng bộ
        filename_no_ext = os.path.splitext(output_path)[0]
        output_path = filename_no_ext + ".jpg"
        
        try:
            compress_image(input_path, output_path, TARGET_SIZE_MB)
        except Exception as e:
            print(f"❌ Lỗi file {file}: {e}")

    print("-" * 50)
    print("🎉 Hoàn tất! Kiểm tra thư mục:", OUTPUT_FOLDER)

if __name__ == "__main__":
    main()