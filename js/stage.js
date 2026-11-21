/* ==========================================================================
   STAGE JS - MÀN HÌNH CHỌN CA SĨ BIỂU DIỄN (DÙNG CHUNG DỮ LIỆU GAMECORE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const stageScreen = document.getElementById('stageScreen');
  const gridEl = document.getElementById('stSingerGrid');
  const selectionHintEl = document.getElementById('stSelectionHint');
  const toastEl = document.getElementById('stToastMessage');
  const btnBack = document.getElementById('stBtnBack');
  const btnProceed = document.getElementById('stBtnProceed');

  if (!stageScreen || !gridEl) return;

  // Mặc định chọn ca sĩ đang được chọn ở Home
  let selectedSingerId = GameCore.getSelectedCharacterId();
  let toastTimer = null;

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2200);
  }

  function updateSelectionHint() {
    const selected = GameCore.CHARACTERS.find(s => s.id === selectedSingerId);
    if (selectionHintEl) {
      selectionHintEl.textContent = selected ? `Đã chọn: ${selected.name}` : 'Chạm thẻ để chọn';
    }
  }

  function renderGrid() {
    gridEl.innerHTML = '';

    // Dùng chung danh sách ca sĩ từ GameCore.CHARACTERS
    GameCore.CHARACTERS.forEach(singer => {
      const isSelected = singer.id === selectedSingerId;
      const card = document.createElement('div');
      card.className = `st-singer-card ${isSelected ? 'selected' : ''}`;

      // Ưu tiên ảnh trang phục (nếu sau này có), sau đó đến avatar/image dùng chung
      const displayImg = singer.outfitImage || GameCore.CHIBI_IMAGES[singer.id]; 

      card.innerHTML = `
        <div class="st-selected-badge">✓</div>
        <div class="st-avatar-frame">
          <img src="${displayImg}" alt="${singer.name}" loading="lazy">
        </div>
        <div class="st-name-pill">${singer.name}</div>
      `;

      card.addEventListener('click', () => {
        selectedSingerId = singer.id;
        renderGrid();
        updateSelectionHint();
      });

      gridEl.appendChild(card);
    });

    // Thẻ dấu '+' ở cuối lưới
    const addCard = document.createElement('div');
    addCard.className = 'st-singer-card st-add-card';
    addCard.setAttribute('role', 'button');
    addCard.setAttribute('aria-label', 'Mở khóa thêm ca sĩ');
    addCard.innerHTML = `
      <svg class="st-plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;

    addCard.addEventListener('click', () => {
      showToast('Chức năng mở khóa thêm ca sĩ!');
    });

    gridEl.appendChild(addCard);
  }

  // Nút Quay lại '<' -> đóng overlay STAGE về màn hình Home
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      GameCore.closeOverlay('stageScreen');
    });
  }

  // Nút 'Vào biểu diễn ->'
  if (btnProceed) {
    btnProceed.addEventListener('click', () => {
      const selected = GameCore.CHARACTERS.find(s => s.id === selectedSingerId);
      if (!selected) {
        showToast('Vui lòng chọn một ca sĩ trước!');
        return;
      }
      // Đồng bộ ca sĩ được chọn cho toàn hệ thống (nếu muốn)
      GameCore.setGlobalCharacter(selected.id);
      showToast(`Bắt đầu biểu diễn với "${selected.name}"!`);
    });
  }

  // Hàm public để đồng bộ lại giao diện mỗi khi mở STAGE từ Home
  window.StageScreen = {
    refresh() {
      selectedSingerId = GameCore.getSelectedCharacterId();
      renderGrid();
      updateSelectionHint();
    }
  };

  renderGrid();
  updateSelectionHint();
});

