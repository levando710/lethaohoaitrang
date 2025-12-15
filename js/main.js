AOS.init({ once: true, offset: 30, duration: 800 });

// Countdown (Giữ nguyên logic)
const weddingDate = new Date("December 28, 2025 00:00:00").getTime();
setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "<div class='text-white fw-bold'>Happy Wedding!</div>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const html = `
        <div class="time-box">
            <div class="display-5">${days}</div>
            <div class="small">Ngày</div>
        </div>
        <div class="time-box">
            <div class="display-5">${hours}</div>
            <div class="small">Giờ</div>
        </div>
        <div class="time-box">
            <div class="display-5">${minutes}</div>
            <div class="small">Phút</div>
        </div>
        <div class="time-box">
            <div class="display-5">${seconds}</div>
            <div class="small">Giây</div>
        </div>
    `;
    document.getElementById("countdown").innerHTML = html;
}, 1000);

// Form Submit (Giữ nguyên)
const form = document.getElementById('rsvpForm');
const btnSubmit = document.getElementById('btnSubmit');
const scriptURL = 'https://script.google.com/macros/s/AKfycby4sSGPcyVxZpkS6uKYjI66AgpC2gqmC6U_fX-DLozkuaN6ykVmH0rxudiezuTGA1Tn/exec';

form.addEventListener('submit', e => {
    e.preventDefault();
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = 'Đang gửi...';
    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            alert("Đã gửi thành công!");
            form.reset();
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Gửi Xác Nhận';
        })
        .catch(error => {
            alert("Lỗi!");
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Gửi Xác Nhận';
        });
});

// Slider & Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const totalImages = 9; 
    const folder = 'images/album/';
    const container = document.getElementById('gallery-wrapper');
    
    if (container) {
        let html = '';
        for (let i = 1; i <= totalImages; i++) {
            html += `
                <div class="swiper-slide">
                    <img src="${folder}${i}.jpg" class="gallery-img" loading="lazy">
                </div>
            `;
        }
        container.innerHTML = html;
        
        // Cấu hình Slider chuyên cho Mobile App
        new Swiper(".mySwiper", {
            slidesPerView: 1.2, // Hiện 1 ảnh rưỡi để người dùng biết có thể lướt tiếp
            spaceBetween: 15,
            centeredSlides: true,
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            pagination: { el: ".swiper-pagination", clickable: true },
        });

        const galleryImages = document.querySelectorAll('.gallery-img');
        const lightboxImage = document.getElementById('lightboxImage');
        const imageModalElement = document.getElementById('imageModal');
        if (imageModalElement && lightboxImage) {
            const imageModal = new bootstrap.Modal(imageModalElement);
            galleryImages.forEach(img => {
                img.addEventListener('click', function() {
                    lightboxImage.src = this.src;
                    imageModal.show();
                });
            });
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    // --- PHẦN XỬ LÝ NHẠC & MÀN HÌNH CHỜ ---
    const overlay = document.getElementById('welcome-overlay');
    const btnOpen = document.getElementById('btn-open-wedding');
    const musicBtn = document.getElementById('musicBtn');
    const audio = document.getElementById('weddingMusic');
    let isPlaying = false;

    // Hàm cập nhật trạng thái nút nhạc góc màn hình
    function updateMusicBtnState(playing) {
        if (playing) {
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        } else {
            musicBtn.classList.remove('playing');
            musicBtn.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
        }
    }

    // 1. SỰ KIỆN QUAN TRỌNG NHẤT: Bấm nút "Mở Thiệp"
    if (btnOpen) {
        btnOpen.addEventListener('click', function() {
            // Ẩn màn hình chờ
            overlay.classList.add('overlay-hidden');
            
            // Bắt đầu phát nhạc ngay lập tức
            audio.play().then(() => {
                isPlaying = true;
                updateMusicBtnState(true);
            }).catch(err => {
                console.log("Lỗi phát nhạc: " + err);
            });

            // Cho phép cuộn trang trở lại (nếu bạn có khóa scroll)
            document.body.style.overflow = 'auto'; 
        });
    }

    // 2. Sự kiện cho nút nhạc góc màn hình (để khách tắt/bật thủ công)
    if (musicBtn) {
        musicBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (isPlaying) {
                audio.pause();
                isPlaying = false;
                updateMusicBtnState(false);
            } else {
                audio.play();
                isPlaying = true;
                updateMusicBtnState(true);
            }
        });
    }
    
   
});