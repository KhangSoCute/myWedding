document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvpForm');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Lấy dữ liệu từ form
            const name = document.getElementById('name').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value;

            // Log ra console để kiểm tra (Sau này có thể kết nối API Google Sheets tại đây)
            console.log("RSVP Received:", { name, guests, message });

            // Hiệu ứng phản hồi cho khách
            alert(`Cảm ơn ${name} đã xác nhận tham dự đám cưới của Khang & Vy!`);
            rsvpForm.reset();
        });
    }

    // Hiệu ứng xuất hiện khi cuộn trang (Scroll Reveal) đơn giản
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
