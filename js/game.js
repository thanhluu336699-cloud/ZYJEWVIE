/* ==========================================================================
   GAME JS - XỬ LÝ SỰ KIỆN MÀN HÌNH CHỌN GAME
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const gamesData = Array.from({ length: 10 }, (_, idx) => ({
    id: idx + 1,
    title: 'Game',
    bookmarked: false
  }));

  let currentTab = 'all';
  let toastTimeout = null;
  let selectedGameId = null;

  const gameScreen = document.getElementById('gameScreen');
  const gamesGrid = document.getElementById('gmGamesGrid');
  const emptySavedState = document.getElementById('gmEmptySavedState');
  const tabGame = document.getElementById('gmTabGame');
  const tabYourGame = document.getElementById('gmTabYourGame');
  const tabIndicator = document.getElementById('gmTabIndicator');
  const drawerSavedCount = document.getElementById('gmDrawerSavedCount');

  if (!gameScreen || !gamesGrid) return;

  function syncCardUnit() {
    const firstCard = gamesGrid.querySelector('.gm-game-card');
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width;
    if (cardWidth > 0) {
      gameScreen.style.setProperty('--cu', `${cardWidth / 100}px`);
    }
  }

  const gridResizeObserver = new ResizeObserver(() => {
    syncCardUnit();
  });
  gridResizeObserver.observe(gamesGrid);

  function showToast(message) {
    const toast = document.getElementById('gmToastMsg');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2000);
  }

  function getLandscapeThumbnailSVG(uid) {
    return `
      <svg viewBox="0 0 240 150" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gmSkyGrad-${uid}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#CBEBFC"/>
            <stop offset="65%" stop-color="#E8F7FE"/>
            <stop offset="100%" stop-color="#F7FCFF"/>
          </linearGradient>
        </defs>
        <rect width="240" height="150" fill="url(#gmSkyGrad-${uid})"/>
        <g fill="#FFFFFF">
          <circle cx="111" cy="33" r="10.5"/>
          <circle cx="123" cy="28" r="13.5"/>
          <circle cx="135" cy="33" r="10"/>
          <rect x="103" y="32" width="40" height="12" rx="6"/>
        </g>
        <g fill="#FFFFFF" opacity="0.95">
          <circle cx="204" cy="37" r="6.5"/>
          <circle cx="212" cy="34" r="8"/>
          <circle cx="219" cy="37" r="6"/>
          <rect x="199" y="36" width="25" height="7" rx="3.5"/>
        </g>
        <path d="M0 116 Q 52 100, 108 111 T 240 107 L 240 150 L 0 150 Z" fill="#B6D773"/>
        <path d="M0 120 C 26 95, 54 104, 82 123 C 112 140, 148 127, 178 112 C 204 99, 224 106, 240 118 L 240 150 L 0 150 Z" fill="#7CA317"/>
      </svg>
    `;
  }

  function renderGames() {
    const filteredGames = currentTab === 'all'
      ? gamesData
      : gamesData.filter(game => game.bookmarked);

    const savedTotal = gamesData.filter(g => g.bookmarked).length;
    if (drawerSavedCount) drawerSavedCount.textContent = savedTotal;

    if (filteredGames.length === 0) {
      gamesGrid.innerHTML = '';
      gamesGrid.classList.add('hidden');
      emptySavedState.classList.remove('hidden');
      emptySavedState.style.display = 'flex';
      return;
    }

    emptySavedState.classList.add('hidden');
    emptySavedState.style.display = 'none';
    gamesGrid.classList.remove('hidden');

    gamesGrid.innerHTML = filteredGames.map(game => `
      <article class="gm-game-card" data-id="${game.id}">
        <div class="gm-card-thumb">
          ${getLandscapeThumbnailSVG(game.id)}
        </div>
        <div class="gm-card-footer">
          <button
            type="button"
            class="gm-bookmark-btn"
            data-bookmark-id="${game.id}"
            aria-label="${game.bookmarked ? 'Bỏ lưu game' : 'Lưu game'}"
            aria-pressed="${game.bookmarked}"
          >
            <svg viewBox="0 0 24 28" fill="${game.bookmarked ? '#090A8A' : 'none'}" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 3C3.5 2.17157 4.17157 1.5 5 1.5H19C19.8284 1.5 20.5 2.17157 20.5 3V25.2L12 19.3L3.5 25.2V3Z" stroke="#090A8A" stroke-width="2.5" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            class="gm-play-pill-btn"
            data-play-id="${game.id}"
          >
            ${game.title}
          </button>
        </div>
      </article>
    `).join('');

    requestAnimationFrame(syncCardUnit);
  }

  function switchTab(targetTab) {
    currentTab = targetTab;
    if (targetTab === 'all') {
      tabIndicator.classList.remove('right');
      tabGame.setAttribute('aria-selected', 'true');
      tabYourGame.setAttribute('aria-selected', 'false');
    } else {
      tabIndicator.classList.add('right');
      tabGame.setAttribute('aria-selected', 'false');
      tabYourGame.setAttribute('aria-selected', 'true');
    }
    renderGames();
  }

  const gameModalBackdrop = document.getElementById('gmModalBackdrop');
  const modalThumbContainer = document.getElementById('gmModalThumbContainer');
  const modalGameTitle = document.getElementById('gmModalGameTitle');
  const modalGameSubtitle = document.getElementById('gmModalGameSubtitle');

  function openGameModal(id) {
    selectedGameId = id;
    modalThumbContainer.innerHTML = getLandscapeThumbnailSVG(`modal-${id}`);
    modalGameTitle.textContent = `Game #${id}`;
    modalGameSubtitle.textContent = `Bạn đã chọn trò chơi số ${id}. Nhấn "Chơi ngay" để bắt đầu!`;
    gameModalBackdrop.classList.add('open');
  }

  function closeGameModal() {
    gameModalBackdrop.classList.remove('open');
    selectedGameId = null;
  }

  document.getElementById('gmBtnCloseModal').addEventListener('click', closeGameModal);
  gameModalBackdrop.addEventListener('click', (e) => {
    if (e.target === gameModalBackdrop) closeGameModal();
  });
  document.getElementById('gmBtnConfirmPlay').addEventListener('click', () => {
    const id = selectedGameId;
    closeGameModal();
    showToast(`Đang khởi chạy Game #${id}...`);
  });

  tabGame.addEventListener('click', () => switchTab('all'));
  tabYourGame.addEventListener('click', () => switchTab('saved'));

  gamesGrid.addEventListener('click', (e) => {
    const bookmarkBtn = e.target.closest('[data-bookmark-id]');
    if (bookmarkBtn) {
      const id = Number(bookmarkBtn.dataset.bookmarkId);
      const item = gamesData.find(g => g.id === id);
      if (item) {
        item.bookmarked = !item.bookmarked;
        renderGames();
        showToast(item.bookmarked ? `Đã lưu Game #${id} vào Your game` : `Đã bỏ lưu Game #${id}`);
      }
      return;
    }

    const playBtn = e.target.closest('[data-play-id]');
    if (playBtn) {
      const id = Number(playBtn.dataset.playId);
      openGameModal(id);
    }
  });

  // Nút quay lại: Nếu đang ở tab "Your game" thì về tab "Game", nếu đang ở tab "Game" thì đóng màn hình về Home
  document.getElementById('gmBtnBack').addEventListener('click', () => {
    if (currentTab === 'saved') {
      switchTab('all');
    } else {
      GameCore.closeOverlay('gameScreen');
    }
  });

  const drawerBackdrop = document.getElementById('gmDrawerBackdrop');
  const drawerPanel = document.getElementById('gmDrawerPanel');

  function openDrawer() {
    drawerBackdrop.classList.add('open');
    drawerPanel.classList.add('open');
    drawerPanel.setAttribute('aria-hidden', 'false');
  }

  function closeDrawer() {
    drawerBackdrop.classList.remove('open');
    drawerPanel.classList.remove('open');
    drawerPanel.setAttribute('aria-hidden', 'true');
  }

  document.getElementById('gmBtnHamburger').addEventListener('click', openDrawer);
  document.getElementById('gmBtnCloseDrawer').addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  drawerPanel.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-menu-action]');
    if (!actionBtn) return;
    const action = actionBtn.dataset.menuAction;
    closeDrawer();
    if (action === 'all') switchTab('all');
    else if (action === 'saved') switchTab('saved');
    else if (action === 'settings') GameCore.openOverlay('bgmScreen');
    else if (action === 'info') showToast('Phiên bản giao diện v1.0');
  });

  renderGames();
});

