/* ==========================================================================
   SETTINGS JS - XỬ LÝ SỰ KIỆN MÀN HÌNH CÀI ĐẶT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Nút quay lại màn hình chính
  const btnBack = document.getElementById('btnBack');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      GameCore.closeOverlay('settingsScreen');
    });
  }

  // 2. Xử lý click vào từng mục cài đặt & tài khoản
  const settingItems = document.querySelectorAll('.setting-item, .danger-item');
  settingItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      console.log('Chọn mục cài đặt:', action);

      // Ví dụ: Nếu người chơi bấm "Hình nền", có thể gọi GameCore.setGlobalBackground(...)
      if (action === 'wallpaper') {
        GameCore.openOverlay('wallpaperScreen');
      }

      if (action === 'bgm') {
        GameCore.openOverlay('bgmScreen');
      }
    });
  });
});

