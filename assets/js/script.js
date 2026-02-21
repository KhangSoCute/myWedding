document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('weddingForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = {
            name: document.getElementById('name').value,
            event: document.getElementById('eventChoice').value,
            message: document.getElementById('message').value
        };

        console.log("Dữ liệu RSVP:", data);
        
        // Hiệu ứng nút bấm khi gửi thành công
        const btn = form.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "ĐÃ GỬI XÁC NHẬN ✓";
        btn.classList.add('bg-green-800');

        setTimeout(() => {
            alert(`Cảm ơn ${data.name} đã xác nhận tham dự!`);
            form.reset();
            btn.innerText = originalText;
            btn.classList.remove('bg-green-800');
        }, 1000);
    });
});
