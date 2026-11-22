/* ==========================================================================
   BENEFITS JS - XỬ LÝ ĐIỂM DANH 6 NGÀY & NHIỆM VỤ PHÚC LỢI
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const benefitsScreen = document.getElementById('benefitsScreen');
  const daysGrid = document.getElementById('bnDaysGrid');
  const benefitsList = document.getElementById('bnBenefitsList');
  const checkinBtn = document.getElementById('bnCheckinBtn');
  const toastEl = document.getElementById('bnToast');
  const toastMsg = document.getElementById('bnToastMsg');

  if (!benefitsScreen || !daysGrid || !benefitsList) return;

  let currentDay = 1;
  const claimedDays = new Set();
  let toastTimer = null;

  // ========================================================================
  // TỰ SỬA NỘI DUNG TỪNG DÒNG & GẮN LINK TẠI ĐÂY
  // - reward: Số thưởng hiển thị
  // - desc: Dòng chữ trắng mô tả nhiệm vụ
  // - url: Link sẽ mở khi bấm nút Go (để "" nếu chưa có link)
  // ========================================================================
  const benefitsData = [
    { id: 1, reward: '5 B', desc: 'Follow us on Facebook to get a reward', url: 'https://facebook.com', completed: false},
    { id: 2, reward: '5 B', desc: 'Follow us on Facebook to get a reward', url: 'https://facebook.com', completed: false},
    { id: 3, reward: '5 B', desc: 'Follow us on Facebook to get a reward', url: 'https://facebook.com', completed: false},
    { id: 4, reward: '5 B', desc: 'Follow us on Facebook to get a reward', url: 'https://facebook.com', completed: false},
    { id: 5, reward: '5 B', desc: 'Follow us on Facebook to get a reward', url: 'https://facebook.com', completed: false},
    { id: 6, reward: '5 B', desc: 'Follow us on Facebook to get a reward', url: 'https://facebook.com', completed: false},
    { id: 7, reward: '5 B', desc: 'Follow us on Facebook to get a reward', url: 'https://facebook.com', completed: false},
  ];

  function showToast(message) {
    if (!toastEl || !toastMsg) return;
    toastMsg.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  function renderDays() {
    daysGrid.innerHTML = '';

    for (let day = 1; day <= 6; day++) {
      const isClaimed = claimedDays.has(day);
      const isCurrent = day === currentDay && !isClaimed;

      const card = document.createElement('div');
      card.className = `bn-day-card ${isClaimed ? 'claimed' : ''} ${isCurrent ? 'active-day' : ''}`;

      card.innerHTML = `
        <span class="bn-day-reward">${isClaimed ? '✓' : '+30'}</span>
        <span class="bn-day-label bn-serif">Day ${day}</span>
      `;

      card.addEventListener('click', () => {
        if (day === currentDay && !isClaimed) {
          handleCheckIn();
        } else if (isClaimed) {
          showToast(`Bạn đã nhận thưởng Day ${day} rồi!`);
        } else {
          showToast(`Hãy điểm danh theo thứ tự (Day ${currentDay})`);
        }
      });

      daysGrid.appendChild(card);
    }
  }

  function handleCheckIn() {
    if (claimedDays.size >= 6) {
      showToast('Bạn đã hoàn thành điểm danh 6 ngày!');
      return;
    }

    claimedDays.add(currentDay);
    showToast(`Điểm danh Day ${currentDay} thành công: +30 điểm!`);

    if (currentDay < 6) {
      currentDay++;
    } else if (checkinBtn) {
      checkinBtn.textContent = 'Checked in';
      checkinBtn.classList.add('done-state');
    }
    renderDays();
  }

  function renderBenefits() {
    benefitsList.innerHTML = '';

    benefitsData.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'bn-benefit-row';

      row.innerHTML = `
        <div class="bn-benefit-info">
          <div class="bn-reward-line">
            <svg class="bn-coin-svg" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="#F6C445" stroke="#D99B16" stroke-width="1.5"/>
              <circle cx="12" cy="12" r="7.5" fill="none" stroke="#FDE08D" stroke-width="1"/>
              <text x="12" y="16" text-anchor="middle" fill="#B87A08" font-size="12" font-weight="bold" font-family="Arial, sans-serif">$</text>
            </svg>
            <span class="bn-reward-amount bn-serif">${item.reward}</span>
          </div>
          <p class="bn-benefit-desc">${item.desc}</p>
        </div>

        <button type="button"
                class="bn-go-btn bn-pill-btn bn-serif ${item.completed ? 'done-state' : ''}">
          ${item.completed ? 'Done' : 'Go'}
        </button>
      `;

      const btn = row.querySelector('.bn-go-btn');
      btn.addEventListener('click', () => {
        // Mở link ở tab mới nếu có điền url
        if (item.url && item.url.trim() !== '') {
          window.open(item.url, '_blank', 'noopener,noreferrer');
        }

        if (!item.completed) {
          item.completed = true;
          showToast(`Đã nhận thưởng +${item.reward}!`);
          renderBenefits();
        } else {
          showToast('Nhiệm vụ này đã hoàn thành!');
        }
      });

      benefitsList.appendChild(row);
    });
  }

  if (checkinBtn) {
    checkinBtn.addEventListener('click', handleCheckIn);
  }

  window.BenefitsScreen = {
    refresh() {
      renderDays();
      renderBenefits();
    }
  };

  renderDays();
  renderBenefits();
});

