/* ==========================================================================
   SHOP JS - XỬ LÝ MÀN HÌNH CỬA HÀNG (DÙNG CHUNG DỮ LIỆU GAMECORE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const shopScreen = document.getElementById('shopScreen');
  const itemsGrid = document.getElementById('shItemsGrid');
  const scrollArea = document.getElementById('shScrollArea');
  const modalOverlay = document.getElementById('shModalOverlay');
  const modalTitle = document.getElementById('shModalTitle');
  const modalDesc = document.getElementById('shModalDesc');
  const btnCancel = document.getElementById('shBtnCancel');
  const btnBuy = document.getElementById('shBtnBuy');

  if (!shopScreen || !itemsGrid) return;

  const DEFAULT_THUMB = GameCore.CHARACTERS[1]?.avatar || 'assets/images/idol1.png';

  // Dữ liệu mẫu cho 3 tab còn lại
  const otherTabsData = {
    trangphuc: Array.from({ length: 16 }, (_, i) => ({
      name: `Trang phục ${i + 1}`,
      image: DEFAULT_THUMB,
      price: '1110B'
    })),
    hieuung: Array.from({ length: 20 }, (_, i) => ({
      name: `Pháo hoa ${i + 1}`,
      image: DEFAULT_THUMB,
      price: '1110B'
    })),
    premium: Array.from({ length: 12 }, (_, i) => ({
      name: `Gói VIP ${i + 1}`,
      image: DEFAULT_THUMB,
      price: '1110B'
    }))
  };

function getSingersList() {
  return GameCore.CHARACTERS.map((char) => ({
    id: char.id,
    name: char.name,
    avatar: GameCore.REAL_IMAGES[char.id], // Hoặc GameCore.CHIBI_IMAGES[char.id]
    price: char.price || '1110B'
  }));
}

  function renderItems(tabKey) {
    const list = tabKey === 'casi'
      ? getSingersList()
      : (otherTabsData[tabKey] || getSingersList());

    itemsGrid.innerHTML = list.map((item) => `
      <div class="sh-singer-card" data-item-name="${item.name}" data-item-price="${item.price}">
        <div class="sh-avatar-circle">
          <img src="${item.image}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="sh-singer-name">${item.name}</div>
        <div class="sh-price-pill">${item.price}</div>
      </div>
    `).join('');

    if (scrollArea) scrollArea.scrollTop = 0;
  }

  function openBuyModal(name, price) {
    modalTitle.textContent = name;
    modalDesc.textContent = `Bạn có muốn mở khóa ${name} với giá ${price} không?`;
    modalOverlay.classList.add('show');
  }

  function closeBuyModal() {
    modalOverlay.classList.remove('show');
  }

  // Click vào thẻ vật phẩm / ca sĩ để mở hộp thoại mua
  itemsGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.sh-singer-card');
    if (!card) return;
    openBuyModal(card.dataset.itemName, card.dataset.itemPrice);
  });

  if (btnCancel) btnCancel.addEventListener('click', closeBuyModal);
  if (btnBuy) btnBuy.addEventListener('click', closeBuyModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeBuyModal();
    });
  }

  // Chuyển 4 tab danh mục trong Shop
  const tabButtons = shopScreen.querySelectorAll('.sh-tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderItems(btn.dataset.tab);
    });
  });

  window.ShopScreen = {
    refresh() {
      const activeTab = shopScreen.querySelector('.sh-tab-btn.active');
      renderItems(activeTab ? activeTab.dataset.tab : 'casi');
    }
  };

  renderItems('casi');
});

