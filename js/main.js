AOS.init({ once: true, offset: 50, duration: 800 });

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.classList.remove('navbar-dark');
        navbar.classList.add('navbar-light');
    } else {
        navbar.classList.remove('scrolled');
        navbar.classList.remove('navbar-light');
        navbar.classList.add('navbar-dark');
    }
});

const weddingDate = new Date("December 28, 2025 00:00:00").getTime();

setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "<div class='fs-2 text-white'>Happy Wedding!</div>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const html = `
        <div class="time-box">
            <div class="display-5 fw-bold">${days}</div>
            <div class="small">Ngày</div>
        </div>
        <div class="time-box">
            <div class="display-5 fw-bold">${hours}</div>
            <div class="small">Giờ</div>
        </div>
        <div class="time-box">
            <div class="display-5 fw-bold">${minutes}</div>
            <div class="small">Phút</div>
        </div>
        <div class="time-box">
            <div class="display-5 fw-bold">${seconds}</div>
            <div class="small">Giây</div>
        </div>
    `;
    document.getElementById("countdown").innerHTML = html;
}, 1000);

const form = document.getElementById('rsvpForm');
const btnSubmit = document.getElementById('btnSubmit');
const scriptURL = 'https://script.google.com/macros/s/AKfycby4sSGPcyVxZpkS6uKYjI66AgpC2gqmC6U_fX-DLozkuaN6ykVmH0rxudiezuTGA1Tn/exec';

form.addEventListener('submit', e => {
    e.preventDefault();
    
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang gửi...';

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            alert("Cảm ơn bạn! Chúng tôi đã nhận được xác nhận.");
            form.reset();
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Gửi Xác Nhận';
        })
        .catch(error => {
            alert("Có lỗi xảy ra! Vui lòng thử lại.");
            console.error('Error!', error.message);
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Gửi Xác Nhận';
        });
});

document.addEventListener('DOMContentLoaded', function() {
    const totalImages = 20;
    const folder = 'images/album/';
    const container = document.getElementById('gallery-wrapper');
    
    if (container) {
        let html = '';
        for (let i = 1; i <= totalImages; i++) {
            html += `
                <div class="swiper-slide">
                    <img src="${folder}${i}.jpg" 
                         class="gallery-img rounded shadow-sm" 
                         alt="Ảnh cưới ${i}" 
                         loading="lazy">
                </div>
            `;
        }
        container.innerHTML = html;
        initSwiperSlider();
    }
});

function initSwiperSlider() {
    new Swiper(".mySwiper", {
        slidesPerView: 3, // CỐ ĐỊNH 3 ẢNH (Bất kể màn hình)
        spaceBetween: 20,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        // Đã xóa phần breakpoints để không bị chuyển về 1 ảnh trên mobile
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