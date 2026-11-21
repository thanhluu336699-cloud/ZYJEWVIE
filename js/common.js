/* ==========================================================================
   COMMON JS - DỮ LIỆU DÙNG CHUNG, TỈ LỆ MÀN HÌNH, ĐỔI HÌNH NỀN & NHÂN VẬT
   ========================================================================== */

const GameCore = (() => {
  const REF_W = 360;
  const REF_H = 800;

  const DEFAULT_PLACEHOLDER = "data:image/svg+xml;utf8," + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 220">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c9edfb"/>
          <stop offset="100%" stop-color="#eef9fe"/>
        </linearGradient>
      </defs>
      <rect width="200" height="220" fill="url(#sky)"/>
      <path d="M55 68 h85 a18 18 0 0 0 0 -36 a24 24 0 0 0 -45 -8 a20 20 0 0 0 -35 12 a16 16 0 0 0 -5 32 z" fill="#ffffff"/>
      <path d="M0 155 Q 60 140, 120 160 T 200 150 L 200 220 L 0 220 Z" fill="#b7d46c"/>
      <path d="M0 175 Q 75 155, 145 175 T 200 165 L 200 220 L 0 220 Z" fill="#82a825"/>
    </svg>
  `);

  // ========================================================
  // DANH SÁCH HÌNH NỀN DÙNG CHUNG (Thay value bằng gradient hoặc url('...'))
  // ========================================================
  const BACKGROUNDS = [
    {
      id: "bg_1",
      preview: DEFAULT_PLACEHOLDER,
      value: "linear-gradient(180deg, #7492e8 0%, #a3bdf8 100%)"
    },
    {
      id: "bg_2",
      preview: DEFAULT_PLACEHOLDER,
      value: "linear-gradient(180deg, #ff8fb1 0%, #ffc2d1 100%)"
    },
    {
      id: "bg_3",
      preview: DEFAULT_PLACEHOLDER,
      value: "linear-gradient(180deg, #6b5ce7 0%, #a29bfe 100%)"
    },
    {
      id: "bg_4",
      preview: DEFAULT_PLACEHOLDER,
      value: "linear-gradient(180deg, #38ada9 0%, #82ccdd 100%)"
    },
    {
      id: "bg_5",
      preview: DEFAULT_PLACEHOLDER,
      value: "linear-gradient(180deg, #f6b93b 0%, #fad390 100%)"
    },
    {
      id: "bg_6",
      preview: DEFAULT_PLACEHOLDER,
      value: "linear-gradient(180deg, #4a69bd 0%, #6a89cc 100%)"
    }
  ];

  // ========================================================
  // DANH SÁCH CA SĨ DÙNG CHUNG TOÀN GAME (Chỉnh tên & ảnh tại đây)
  // ========================================================
  // 1. DANH SÁCH CA SĨ (Tên & giá dùng chung)
  const CHARACTERS = [
    { id: "char_1", name: "Tên ca sĩ 1", price: "1110B" },
    { id: "char_2", name: "Tên ca sĩ 2", price: "1500B" },
    { id: "char_3", name: "Tên ca sĩ 3", price: "2000B" }
  ];

  // 2. ẢNH DÙNG CHUNG LOẠI 1 (Người thật) - Tự thêm link theo id ca sĩ
  const REAL_IMAGES = {
    char_1: "assets/images/singer1_real.png",
    char_2: "assets/images/singer2_real.png",
    char_3: "assets/images/singer3_real.png"
  };

  // 3. ẢNH DÙNG CHUNG LOẠI 2 (Chibi) - Tự thêm link theo id ca sĩ
  const CHIBI_IMAGES = {
    char_1: "assets/images/idol1.png",
    char_2: "assets/images/singer2_chibi.png",
    char_3: "assets/images/singer3_chibi.png"
  };


  // 1. Tính toán tỉ lệ fluid co giãn theo mọi màn hình điện thoại
  function syncFluidRatio() {
    const vw = window.innerWidth;
    const vh = window.screen.height;
    const unit = Math.min(vw / REF_W, vh / REF_H) * 5.2;
    document.documentElement.style.setProperty('--u-settings', `${unit.toFixed(4)}px`);
  }

  // 2. Hàm mở/đóng bất kỳ màn hình Overlay nào bằng ID
  function openOverlay(screenId) {
    const el = document.getElementById(screenId);
    if (el) el.classList.add('open');
  }

  function closeOverlay(screenId) {
    const el = document.getElementById(screenId);
    if (el) el.classList.remove('open');
  }

  // 3. Đổi hình nền dùng chung toàn game & lưu localStorage
  function setGlobalBackground(bgId) {
    const found = BACKGROUNDS.find(b => b.id === bgId) || BACKGROUNDS[0];
    if (!found) return;
    document.documentElement.style.setProperty('--bg-gradient', found.value);
    localStorage.setItem('idol_game_bg_id', found.id);
  }

  function getSelectedBackgroundId() {
    return localStorage.getItem('idol_game_bg_id') || BACKGROUNDS[0].id;
  }

  // 4. Đổi nhân vật chính hiển thị ở Home & lưu localStorage
  function setGlobalCharacter(charId) {
    const found = CHARACTERS.find(c => c.id === charId) || CHARACTERS[0];
    if (!found) return;

    const mainCharEl = document.getElementById('mainCharacter');
    if (mainCharEl) {
      mainCharEl.src = CHIBI_IMAGES[found.id] || DEFAULT_PLACEHOLDER; // Đổi thành CHIBI_IMAGES[found.id] nếu Home dùng chibi
      mainCharEl.alt = found.name;
    }

    localStorage.setItem('idol_game_char_id', found.id);
  }


  function getSelectedCharacterId() {
    return localStorage.getItem('idol_game_char_id') || CHARACTERS[0].id;
  }

  // Lấy thông tin object nhân vật hiện tại (tiện cho các màn khác gọi)
  function getCurrentCharacter() {
    const id = getSelectedCharacterId();
    return CHARACTERS.find(c => c.id === id) || CHARACTERS[0];
  }

  // Khôi phục dữ liệu đã lưu khi tải trang
  function loadSavedState() {
    setGlobalBackground(getSelectedBackgroundId());
    setGlobalCharacter(getSelectedCharacterId());
  }

  function init() {
    loadSavedState();
    syncFluidRatio();

    window.addEventListener('resize', syncFluidRatio);
    window.addEventListener('orientationchange', syncFluidRatio);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', syncFluidRatio);
    }
  }

  return {
    init,
    BACKGROUNDS,
    CHARACTERS,
    REAL_IMAGES,
    CHIBI_IMAGES,
    openOverlay,
    closeOverlay,
    setGlobalBackground,
    getSelectedBackgroundId,
    setGlobalCharacter,
    getSelectedCharacterId,
    getCurrentCharacter
  };

})();

document.addEventListener('DOMContentLoaded', GameCore.init);

