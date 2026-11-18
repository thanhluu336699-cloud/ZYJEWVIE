/* ==========================================================================
   WALLPAPER JS - XỬ LÝ CHỌN HÌNH NỀN & NHÂN VẬT DÙNG CHUNG
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const wpBtnBack = document.getElementById('wpBtnBack');
  const bgContainer = document.getElementById('bgListContainer');
  const charContainer = document.getElementById('charGridContainer');

  // 1. Nút quay lại màn hình Settings
  if (wpBtnBack) {
    wpBtnBack.addEventListener('click', () => {
      GameCore.closeOverlay('wallpaperScreen');
    });
  }

  // 2. Render danh sách Màu nền / Hình nền
  function renderBackgrounds() {
    if (!bgContainer) return;
    const selectedBgId = GameCore.getSelectedBackgroundId();
    bgContainer.innerHTML = '';

    GameCore.BACKGROUNDS.forEach((bg) => {
      const card = document.createElement('div');
      card.className = `bg-card ${bg.id === selectedBgId ? 'active' : ''}`;
      card.innerHTML = `<img src="${bg.preview}" alt="${bg.id}" loading="lazy">`;

      card.addEventListener('click', () => {
        GameCore.setGlobalBackground(bg.id);
        renderBackgrounds();
      });

      bgContainer.appendChild(card);
    });
  }

  // 3. Render danh sách Nhân vật từ mảng dùng chung GameCore.CHARACTERS
  function renderCharacters() {
    if (!charContainer) return;
    const selectedCharId = GameCore.getSelectedCharacterId();
    charContainer.innerHTML = '';

    GameCore.CHARACTERS.forEach((char) => {
      const item = document.createElement('div');
      item.className = `char-item ${char.id === selectedCharId ? 'active' : ''}`;
      item.innerHTML = `
        <div class="char-thumb">
          <img src="${char.avatar || char.image}" alt="${char.name}" loading="lazy">
        </div>
        <div class="char-name-pill">${char.name}</div>
      `;

      item.addEventListener('click', () => {
        GameCore.setGlobalCharacter(char.id);
        renderCharacters();
      });

      charContainer.appendChild(item);
    });
  }

  renderBackgrounds();
  renderCharacters();
});

