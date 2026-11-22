/* ==========================================================================
   HOME JS - XỬ LÝ SỰ KIỆN MÀN HÌNH CHÍNH
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mở màn hình Settings qua GameCore
  const openSettingsBtn = document.getElementById('openSettingsBtn');
  if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
      GameCore.openOverlay('settingsScreen');
    });
  }

// 2. Chuyển đổi trạng thái Active của thanh điều hướng 5 tab
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((btn) => btn.classList.remove('active'));
    item.classList.add('active');

    const selectedTab = item.getAttribute('data-tab');

    if (selectedTab === 'shop') {
      if (window.ShopScreen) window.ShopScreen.refresh();
      GameCore.openOverlay('shopScreen');
    } else {
      GameCore.closeOverlay('shopScreen');
    }

    if (selectedTab === 'benefits') {
      if (window.BenefitsScreen) window.BenefitsScreen.refresh();
      GameCore.openOverlay('benefitsScreen');
    } else {
      GameCore.closeOverlay('benefitsScreen');
    }

        if (selectedTab === 'message') {
      if (window.MessageScreen) window.MessageScreen.refresh();
      GameCore.openOverlay('messageScreen');
    } else {
      GameCore.closeOverlay('messageScreen');
    }

  });
});

  // 3. Xử lý 2 nút chức năng lớn (STAGE / GAME)
  const actionButtons = document.querySelectorAll('.main-action-btn');
  actionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      console.log('Mở chế độ:', mode);

      if (mode === 'STAGE') {
        if (window.StageScreen) window.StageScreen.refresh();
        GameCore.openOverlay('stageScreen');
      }

      if (mode === 'GAME') {
        GameCore.openOverlay('gameScreen');
      }
    });
  });
});

