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
    const musicBtn = document.getElementById('musicBtn');
    const audio = document.getElementById('weddingMusic');
    let isPlaying = false;

    // 1. Hàm bật/tắt nhạc khi bấm nút
    function toggleMusic() {
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove('playing');
            musicBtn.innerHTML = '<i class="bi bi-music-note-beamed"></i>'; // Icon nốt nhạc
        } else {
            audio.play();
            musicBtn.classList.add('playing');
            musicBtn.innerHTML = '<i class="bi bi-pause-fill"></i>'; // Icon pause
        }
        isPlaying = !isPlaying;
    }

    musicBtn.addEventListener('click', function(e) {
        // Ngăn sự kiện nổi bọt để không kích hoạt cái auto-play bên dưới
        e.stopPropagation(); 
        toggleMusic();
    });

    // 2. Cấu hình TỰ ĐỘNG PHÁT khi chạm màn hình
    // Thay vì dùng 'scroll', ta dùng 'touchstart' và 'click'
    function startMusicOnInteraction() {
        if (!isPlaying) {
            audio.play().then(() => {
                // Nếu phát thành công
                isPlaying = true;
                musicBtn.classList.add('playing');
                musicBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                
                // Xóa ngay sự kiện để không gọi lại nữa
                document.removeEventListener('click', startMusicOnInteraction);
                document.removeEventListener('touchstart', startMusicOnInteraction);
            }).catch((error) => {
                console.log("Trình duyệt vẫn chặn chưa cho phát: " + error);
            });
        }
    }

    // Thêm sự kiện vào toàn bộ trang web
    // 'click': Cho máy tính
    // 'touchstart': Cho điện thoại (chạm vào màn hình là tính)
    document.addEventListener('click', startMusicOnInteraction);
    document.addEventListener('touchstart', startMusicOnInteraction);
});