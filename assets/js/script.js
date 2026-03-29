document.addEventListener('DOMContentLoaded', function() {
    // 1. URL Web App từ Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxeUAWTL8DR_aYYtWckXWGyztk5JGZDv9XVoHPHwyRgn424hR-3IK3Z4TUrfbeGhio/exec';
    
    const form = document.getElementById('weddingForm');
    const btn = form.querySelector('button');

    // Cấu hình thông tin lịch chi tiết theo yêu cầu của Khang
    const weddingEvents = {
        "Đà Nẵng": {
            title: "Lễ Vu Quy - Khang & Vy (Đà Nẵng)",
            start: "20260606T100000", 
            end: "20260606T140000",
            location: "Nhà Hàng Tiệc Cưới Phúc Khang, 139 Trương Chí Cương, Nam Phước, Đà Nẵng",
            description: "Rất hân hạnh được đón tiếp bạn tại tiệc Vu Quy của chúng mình!"
        },
        "An Giang": {
            title: "Lễ Tân Hôn - Khang & Vy (An Giang)",
            start: "20260614T100000",
            end: "20260614T140000",
            location: "Khách sạn Đông Xuyên, 9A Lương Văn Cù, Long Xuyên, An Giang",
            description: "Rất hân hạnh được đón tiếp bạn tại tiệc Tân Hôn của chúng mình!"
        }
    };

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

    function handleCalendarExport(eventData) {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        if (isIOS) {
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Wedding RSVP//VN",
                "BEGIN:VEVENT",
                `DTSTART:${eventData.start}`,
                `DTEND:${eventData.end}`,
                `SUMMARY:${eventData.title}`,
                `LOCATION:${eventData.location}`,
                `DESCRIPTION:${eventData.description}`,
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\n");

            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute('download', 'lich-dam-cuoi.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${eventData.start}/${eventData.end}&details=${encodeURIComponent(eventData.description)}&location=${encodeURIComponent(eventData.location)}&sf=true&output=xml`;
            window.open(googleUrl, '_blank');
        }
    }
});
