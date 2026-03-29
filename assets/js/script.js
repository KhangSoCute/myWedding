document.addEventListener('DOMContentLoaded', function() {
    // 1. URL Web App từ Google Apps Script
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxeUAWTL8DR_aYYtWckXWGyztk5JGZDv9XVoHPHwyRgn424hR-3IK3Z4TUrfbeGhio/exec';
    
    const form = document.getElementById('weddingForm');
    const btn = form.querySelector('button');

    // Cấu hình thông tin lịch (Đã cập nhật TP.HCM và địa chỉ chi tiết)
    const weddingEvents = {
        "Đà Nẵng": {
            title: "Lễ Vu Quy - Khang & Vy (Đà Nẵng)",
            start: "20260606T100000", 
            end: "20260606T140000",
            location: "Nhà Hàng Tiệc Cưới Phúc Khang, 139 Trương Chí Cương, Nam Phước, Duy Xuyên, Quảng Nam",
            description: "Rất hân hạnh được đón tiếp bạn tại tiệc Vu Quy của chúng mình!"
        },
        "An Giang": {
            title: "Lễ Tân Hôn - Khang & Vy (An Giang)",
            start: "20260614T100000",
            end: "20260614T140000",
            location: "Khách sạn Đông Xuyên, 9A Lương Văn Cù, Mỹ Long, Long Xuyên, An Giang",
            description: "Rất hân hạnh được đón tiếp bạn tại tiệc Tân Hôn của chúng mình!"
        },
        // "TP.HCM": {
        //     title: "Tiệc Báo Hỷ - Khang & Vy (TP.HCM)",
        //     start: "20261231T180000", 
        //     end: "20261231T210000",
        //     location: "TP. Hồ Chí Minh (Địa điểm cụ thể sẽ thông báo sau)",
        //     description: "Khang và Vy sẽ thông báo thời gian và địa điểm chính xác đến bạn sớm nhất!"
        // }
    };

    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const guestName = document.getElementById('name').value;
            const selectedEvent = document.getElementById('eventChoice').value; // Đây là chỗ lấy Event

            // Hiệu ứng đang gửi
            const originalText = btn.innerText;
            btn.innerText = 'ĐANG GỬI...';
            btn.disabled = true;

            // 2. Thu thập dữ liệu
            const params = new URLSearchParams();
            params.append('name', guestName);
            params.append('event', selectedEvent);
            params.append('message', document.getElementById('message').value);

            // 3. Gửi dữ liệu qua Google Sheets
            fetch(scriptURL, { 
                method: 'POST', 
                mode: 'no-cors', 
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString() 
            })
            .then(() => {
                // Hiệu ứng thành công
                btn.innerText = "ĐÃ GỬI XÁC NHẬN ✓";
                btn.classList.add('bg-green-800');

                // ĐOẠN QUAN TRỌNG NHẤT: Kích hoạt Calendar sau khi Alert
                setTimeout(() => {
                    alert(`Cảm ơn ${guestName} đã xác nhận tham dự! Khang và Vy đã nhận được thông tin.`);
                    
                    // Hỏi khách có muốn thêm lịch không
                    const confirmCalendar = confirm(`Bạn có muốn thêm lịch nhắc cho buổi tiệc tại ${selectedEvent} vào điện thoại không?`);
                    
                    if (confirmCalendar && weddingEvents[selectedEvent]) {
                        handleCalendarExport(weddingEvents[selectedEvent]);
                    }

                    form.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.classList.remove('bg-green-800');
                }, 500);
            })
            .catch(error => {
                console.error('Lỗi!', error.message);
                alert("Có lỗi xảy ra, vui lòng thử lại sau.");
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }

    // Hàm tạo file cho iOS hoặc link cho Android
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
