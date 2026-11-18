/* ==========================================================================
   BGM JS - XỬ LÝ SỰ KIỆN & ÂM THANH MÀN HÌNH NHẠC NỀN
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const SONGS_DATA = [
    { id: 1, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 261.63 },
    { id: 2, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 293.66 },
    { id: 3, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 329.63 },
    { id: 4, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 349.23 },
    { id: 5, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 392.00 },
    { id: 6, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 440.00 },
    { id: 7, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 493.88 },
    { id: 8, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 523.25 },
    { id: 9, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 261.63 },
    { id: 10, title: "Sốt nhẹ", author: "tác giả", duration: "03:00", baseFreq: 329.63 }
  ];

  // Khôi phục trạng thái từ localStorage
  let isMusicEnabled = localStorage.getItem('idol_game_bgm_enabled') !== 'false';
  const savedSongId = localStorage.getItem('idol_game_bgm_song_id');
  let currentPlayingId = savedSongId ? Number(savedSongId) : null;
  let searchQuery = "";
  let toastTimer = null;

  let audioCtx = null;
  let bgmInterval = null;

  const masterSwitch = document.getElementById("bgmMasterSwitch");
  const toggleStatusText = document.getElementById("bgmToggleStatusText");
  const musicPanel = document.getElementById("bgmMusicPanel");
  const songListContainer = document.getElementById("bgmSongListContainer");
  const searchInput = document.getElementById("bgmSearchInput");
  const clearSearchBtn = document.getElementById("bgmClearSearchBtn");
  const backBtn = document.getElementById("bgmBackBtn");

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playAmbientNote(freq) {
    if (!audioCtx || !isMusicEnabled) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.45);
    } catch (e) {}
  }

  function startBgmLoop(song) {
    stopBgmLoop();
    if (!isMusicEnabled || !song) return;
    initAudio();

    const scale = [1, 1.25, 1.5, 1.875, 1.5, 1.25];
    let step = 0;
    playAmbientNote(song.baseFreq * scale[0]);

    bgmInterval = setInterval(() => {
      if (!isMusicEnabled || currentPlayingId !== song.id) {
        stopBgmLoop();
        return;
      }
      step = (step + 1) % scale.length;
      playAmbientNote(song.baseFreq * scale[step]);
    }, 950);
  }

  function stopBgmLoop() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  function showToast(message) {
    const toastEl = document.getElementById("bgmGameToast");
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2000);
  }

  function getVintageAlbumSVG() {
    return `
      <svg width="100%" height="100%" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="42" height="42" rx="4" fill="none" stroke="#5c4b32" stroke-width="1"/>
        <path d="M10 16 L38 16 M10 32 L38 32" stroke="#5c4b32" stroke-width="1" stroke-dasharray="2 1"/>
        <rect x="8" y="18" width="32" height="12" rx="2" fill="#d9c294" stroke="#3a2e1e" stroke-width="1.2"/>
        <text x="24" y="26.5" font-family="Georgia, serif" font-size="7.5" font-weight="bold" fill="#2c2216" text-anchor="middle">Vintage</text>
        <circle cx="14" cy="11" r="1.3" fill="#4a3c28"/>
        <circle cx="24" cy="11" r="1.5" fill="#4a3c28"/>
        <circle cx="34" cy="11" r="1.3" fill="#4a3c28"/>
        <rect x="17" y="36" width="14" height="2.2" rx="1" fill="#4a3c28"/>
      </svg>
    `;
  }

  function renderSongList() {
    if (!songListContainer) return;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const filteredSongs = SONGS_DATA.filter(song =>
      song.title.toLowerCase().includes(normalizedQuery) ||
      song.author.toLowerCase().includes(normalizedQuery)
    );

    if (filteredSongs.length === 0) {
      songListContainer.innerHTML = `<div class="bgm-empty-state">Không tìm thấy bài hát phù hợp</div>`;
      return;
    }

    songListContainer.innerHTML = filteredSongs.map(song => {
      const isPlaying = isMusicEnabled && currentPlayingId === song.id;
      return `
        <div class="bgm-song-item ${isPlaying ? "is-playing" : ""}" role="listitem" data-id="${song.id}">
          <div class="bgm-album-cover" aria-hidden="true">
            ${getVintageAlbumSVG()}
          </div>

          <div class="bgm-song-info">
            <div class="bgm-song-title">${song.title}</div>
            <div class="bgm-song-meta">
              <span>${song.author} ${song.duration}</span>
              ${isPlaying ? `
                <span class="bgm-equalizer" aria-hidden="true">
                  <span></span><span></span><span></span>
                </span>
              ` : ""}
            </div>
          </div>

          <button
            class="bgm-play-btn ${isPlaying ? "active" : ""}"
            type="button"
            data-play-id="${song.id}"
            aria-label="${isPlaying ? "Tạm dừng" : "Phát"} ${song.title}"
          >
            ${isPlaying ? `
              <svg viewBox="0 0 24 24" fill="#0c1446">
                <rect x="5" y="4" width="5" height="16" rx="1.5"></rect>
                <rect x="14" y="4" width="5" height="16" rx="1.5"></rect>
              </svg>
            ` : `
              <svg viewBox="0 0 24 24" fill="#0c1446" style="margin-left: calc(var(--u-settings) * 0.25);">
                <polygon points="5,3 20,12 5,21"></polygon>
              </svg>
            `}
          </button>
        </div>
      `;
    }).join("");
  }

  // Đồng bộ giao diện ban đầu theo trạng thái đã lưu
  function syncInitialUI() {
    if (masterSwitch) masterSwitch.setAttribute("aria-checked", String(isMusicEnabled));
    if (toggleStatusText) toggleStatusText.textContent = isMusicEnabled ? "Bật" : "Tắt";
    if (musicPanel) musicPanel.classList.toggle("is-muted", !isMusicEnabled);
    renderSongList();
  }

  // Bật / Tắt tổng
  if (masterSwitch) {
    masterSwitch.addEventListener("click", () => {
      isMusicEnabled = !isMusicEnabled;
      localStorage.setItem('idol_game_bgm_enabled', String(isMusicEnabled));

      masterSwitch.setAttribute("aria-checked", String(isMusicEnabled));
      toggleStatusText.textContent = isMusicEnabled ? "Bật" : "Tắt";

      if (isMusicEnabled) {
        musicPanel.classList.remove("is-muted");
        showToast("Đã bật nhạc nền");
        if (currentPlayingId !== null) {
          const song = SONGS_DATA.find(s => s.id === currentPlayingId);
          startBgmLoop(song);
        }
      } else {
        musicPanel.classList.add("is-muted");
        stopBgmLoop();
        showToast("Đã tắt nhạc nền");
      }
      renderSongList();
    });
  }

  // Chọn phát / dừng từng bài
  if (songListContainer) {
    songListContainer.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-play-id]");
      if (!btn) return;

      const songId = Number(btn.getAttribute("data-play-id"));
      const song = SONGS_DATA.find(s => s.id === songId);
      if (!song) return;

      if (!isMusicEnabled) {
        isMusicEnabled = true;
        localStorage.setItem('idol_game_bgm_enabled', 'true');
        masterSwitch.setAttribute("aria-checked", "true");
        toggleStatusText.textContent = "Bật";
        musicPanel.classList.remove("is-muted");
      }

      if (currentPlayingId === songId) {
        currentPlayingId = null;
        localStorage.removeItem('idol_game_bgm_song_id');
        stopBgmLoop();
        showToast(`Đã dừng: ${song.title}`);
      } else {
        currentPlayingId = songId;
        localStorage.setItem('idol_game_bgm_song_id', String(songId));
        startBgmLoop(song);
        showToast(`Đang phát: ${song.title} #${song.id}`);
      }
      renderSongList();
    });
  }

  // Tìm kiếm bài hát
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      clearSearchBtn.classList.toggle("visible", searchQuery.length > 0);
      renderSongList();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      searchQuery = "";
      searchInput.value = "";
      clearSearchBtn.classList.remove("visible");
      searchInput.focus();
      renderSongList();
    });
  }

  // Nút quay lại màn hình Settings
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      GameCore.closeOverlay('bgmScreen');
    });
  }

  // Tự động phát lại bài đã lưu ngay khi người chơi chạm lần đầu vào màn hình (vượt chính sách chặn Autoplay của trình duyệt)
  document.addEventListener('pointerdown', () => {
    if (isMusicEnabled && currentPlayingId !== null && !bgmInterval) {
      const song = SONGS_DATA.find(s => s.id === currentPlayingId);
      if (song) startBgmLoop(song);
    }
  }, { once: true });

  syncInitialUI();
});

