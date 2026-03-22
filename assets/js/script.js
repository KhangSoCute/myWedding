document.addEventListener('DOMContentLoaded', function() {
    // 1. URL Web App từ Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxeUAWTL8DR_aYYtWckXWGyztk5JGZDv9XVoHPHwyRgn424hR-3IK3Z4TUrfbeGhio/exec';
    
    const form = document.getElementById('weddingForm');
    const btn = form.querySelector('button');

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            // Lấy giá trị để hiển thị trong alert sau này
            const guestName = document.getElementById('name').value;

            // Hiệu ứng đang gửi
            const originalText = btn.innerText;
            btn.innerText = 'ĐANG GỬI...';
            btn.disabled = true;

            // 2. Thu thập dữ liệu thủ công theo ID để đảm bảo chính xác 100%
            const params = new URLSearchParams();
            params.append('name', document.getElementById('name').value);
            params.append('event', document.getElementById('eventChoice').value);
            params.append('message', document.getElementById('message').value);

            console.log("Dữ liệu đang gửi đi:", Object.fromEntries(params));

            // 3. Gửi dữ liệu qua Google Sheets
            fetch(scriptURL, { 
                method: 'POST', 
                mode: 'no-cors', 
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString() 
            })
            .then(() => {
                // Hiệu ứng thành công
                btn.innerText = "ĐÃ GỬI XÁC NHẬN ✓";
                btn.classList.add('bg-green-800');

                setTimeout(() => {
                    alert(`Cảm ơn ${guestName} đã xác nhận tham dự! Khang và Vy đã nhận được thông tin.`);
                    form.reset();
                    
                    // Khôi phục nút bấm
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.classList.remove('bg-green-800');
                }, 1000);
            })
            .catch(error => {
                console.error('Lỗi!', error.message);
                alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }
});
