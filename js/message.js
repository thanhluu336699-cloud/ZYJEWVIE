/* ==========================================================================
   MESSAGE JS - KÊNH THẾ GIỚI, HỖ TRỢ ADMINE & CHAT RIÊNG (DM) THEO PHÒNG
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const messageScreen = document.getElementById('messageScreen');
  const messageListContainer = document.getElementById('msgListContainer');
  const searchInput = document.getElementById('msgSearchInput');
  const fakeCursor = document.getElementById('msgFakeCursor');
  const clearSearchBtn = document.getElementById('msgClearSearchBtn');
  const unreadFilterBtn = document.getElementById('msgUnreadFilterBtn');

  const newDmBtn = document.getElementById('msgNewDmBtn');
  const newDmForm = document.getElementById('msgNewDmForm');
  const dmTargetInput = document.getElementById('msgDmTargetInput');

  const chatDrawer = document.getElementById('msgChatDrawer');
  const closeChatBtn = document.getElementById('msgCloseChatBtn');
  const chatDetailAvatar = document.getElementById('msgChatDetailAvatar');
  const chatDetailName = document.getElementById('msgChatDetailName');
  const chatMessagesBox = document.getElementById('msgMessagesBox');
  const sendChatForm = document.getElementById('msgSendChatForm');
  const chatReplyInput = document.getElementById('msgReplyInput');

  if (!messageScreen || !messageListContainer) return;

  // --- Danh tính người dùng hiện tại & giới hạn bảo mật cơ bản ---
  const MAX_MSG_LEN = 500;
  const COOLDOWN_MS = 1500;
  let lastSentAt = 0;

  function sanitizeId(raw) {
    return String(raw || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 32);
  }

  function getCurrentUserId() {
    let uid = sessionStorage.getItem('zyjwie_session_uid');
    if (!uid) {
      uid = 'user_' + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('zyjwie_session_uid', uid);
    }
    return sanitizeId(uid);
  }

  const currentUserId = getCurrentUserId();

  function getCurrentSenderName() {
    const homeNameEl = document.getElementById('playerName');
    const rawName = (homeNameEl && homeNameEl.textContent) ? homeNameEl.textContent.trim() : 'Người chơi';
    if (/^(admine|admin|hệ thống|system)$/i.test(rawName)) {
      return 'Người chơi';
    }
    return rawName.slice(0, 24) || 'Người chơi';
  }

  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Sinh roomId chuẩn cho từng loại hội thoại ---
  function buildDmRoomId(userA, userB) {
    const pair = [sanitizeId(userA), sanitizeId(userB)].filter(Boolean).sort();
    return `dm_${pair.join('__')}`;
  }

  // Kiểm tra quyền truy cập phòng:
  // - 'public': ai cũng vào được
  // - 'dm': chỉ thành viên nằm trong danh sách members mới được xem/nhận tin
  function canUserAccessRoom(room, userId) {
    if (!room) return false;
    if (room.type === 'public') return true;
    if (room.type === 'dm') {
      return Array.isArray(room.members) && room.members.includes(sanitizeId(userId));
    }
    return false;
  }

  function getLandscapeAvatarSVG() {
    return `
      <svg viewBox="0 0 100 100" style="width:100%;height:100%;display:block;" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="msgSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#c9e6ff"/>
            <stop offset="70%" stop-color="#eef7ff"/>
            <stop offset="100%" stop-color="#ffffff"/>
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#msgSkyGrad)"/>
        <path d="M26 30 C26 23, 35 20, 41 24 C45 18, 57 18, 61 24 C68 23, 74 28, 72 34 C72 38, 67 40, 62 40 L32 40 C26 40, 23 35, 26 30 Z" fill="#ffffff"/>
        <path d="M-5 74 Q 45 58, 105 76 L 105 105 L -5 105 Z" fill="#8cc63f"/>
        <path d="M-5 80 Q 62 72, 105 64 L 105 105 L -5 105 Z" fill="#689f1c"/>
      </svg>
    `;
  }

  // --- Link 1 - 4 trong đoạn 3 của Admine (tự thêm link tại đây) ---
  const ADMINE_LINKS = {
    policy: '',
    guide: '',
    creator: '',
    donate: ''
  };

  const ADMINE_PART_1 = `CHÀO MỪNG ĐẾN VỚI ZYJEWVIE! Cảm ơn sếp đã quan tâm và lựa chọn đồng hành cùng ZYJEWVIE! ZYJEWVIE là một tựa game 2D độc lập được phát triển bởi  nhóm "ZYLAJEWVIE". Vì vẫn đang trong quá trình hoàn thiện, trò chơi hiện còn một số hạn chế nhất định.`;

  const ADMINE_PART_2 = `Trước hết, game hiện chưa hoàn tất các thủ tục xin cấp phép liên quan đến hình ảnh và âm thanh. Bên cạnh đó, hệ thống bảo mật vẫn chưa được đảm bảo ở mức cao nhất. Vì vậy, chúng mình khuyến nghị các sếp chủ động bảo vệ thông tin cá nhân, hạn chế chia sẻ những dữ liệu nhạy cảm và không sử dụng các thông tin quan trọng trên tài khoản trong quá trình trải nghiệm.
Chúng mình hiểu rằng sản phẩm vẫn còn nhiều thiếu sót do đội ngũ phát triển chưa có nhiều kinh nghiệm. Vì vậy, nếu gặp phải lỗi, bất tiện hoặc có bất kỳ đóng góp nào, rất mong các sếp có thể thông cảm và gửi phản hồi đến Admin thông qua khung chat hỗ trợ. Đội ngũ sẽ cố gắng tiếp nhận và phản hồi trong thời gian sớm nhất.
Sự quan tâm, kiên nhẫn và những đóng góp của sếp chính là động lực để chúng mình tiếp tục cải thiện và phát triển ZYJEWVIE.`;

  const ADMINE_PART_3 = {
    intro: `Lưu ý: Vì ZYJEWVIE vẫn đang trong quá trình hoàn thiện và phát triển, các sếp vui lòng chú ý theo dõi những thông báo từ Admin để không bỏ lỡ các bản cập nhật, thay đổi và thông tin mới nhất về trò chơi nhé!
Trước khi bắt đầu trải nghiệm game, vui lòng dành chút thời gian tìm hiểu những thông tin quan trọng dưới đây:`,
    links: [
      { key: 'policy', label: '1. Chính sách và điều khoản' },
      { key: 'guide', label: '2. Hướng dẫn' },
      { key: 'creator', label: '3. Về nhà sản xuất' },
      { key: 'donate', label: '4. Phương thức donate' }
    ],
    outro: `Chúc các sếp có những trải nghiệm thật thú vị!`
  };

  const conversations = [
    {
      id: 'admine',
      roomId: `dm_admine__${currentUserId}`,
      type: 'dm',
      members: ['admine', currentUserId],
      name: 'Admine',
      preview: 'CHÀO MỪNG ĐẾN VỚI ZYJEWVIE! Cảm ơn sếp đã quan tâm và lựa chọn đồng hành...',
      unread: true,
      messages: [
        { sender: 'Admine', senderId: 'admine', text: ADMINE_PART_1, isMe: false },
        { sender: 'Admine', senderId: 'admine', text: ADMINE_PART_2, isMe: false },
        { sender: 'Admine', senderId: 'admine', type: 'admine_part_3', isMe: false }
      ]
    },
    {
      id: 'the-gioi',
      roomId: 'world',
      type: 'public',
      members: [],
      name: 'Thế giới',
      preview: 'Tin nhắn từ group cộng đồng ZYJEWVIE',
      unread: false,
      messages: []
    }
  ];

  let isUnreadOnly = false;
  let searchQuery = '';
  let activeChatId = null;

  // Kênh đồng bộ giữa các tab trên cùng trình duyệt (chỉ phục vụ test local)
  const clientTabId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const chatChannel = ('BroadcastChannel' in window)
    ? new BroadcastChannel('zyjwie_message_channel')
    : null;

  function setBottomNavVisible(visible) {
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.style.display = visible ? '' : 'none';
    }
  }

  function getOrCreateDmConversation(targetRawId) {
    const targetId = sanitizeId(targetRawId);
    if (!targetId || targetId === currentUserId || targetId === 'admine') return null;

    const roomId = buildDmRoomId(currentUserId, targetId);
    let existing = conversations.find((c) => c.roomId === roomId);
    if (existing) return existing;

    existing = {
      id: `dm-${targetId}`,
      roomId,
      type: 'dm',
      members: [currentUserId, targetId].sort(),
      name: `Riêng • ${targetId}`,
      preview: 'Bắt đầu cuộc trò chuyện riêng',
      unread: false,
      messages: []
    };
    conversations.push(existing);
    return existing;
  }

  function renderMessages() {
    const visibleConversations = conversations.filter((c) => canUserAccessRoom(c, currentUserId));

    const filtered = visibleConversations.filter((item) => {
      const matchesUnread = isUnreadOnly ? item.unread : true;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || item.name.toLowerCase().includes(q) || item.preview.toLowerCase().includes(q);
      return matchesUnread && matchesSearch;
    });

    if (filtered.length === 0) {
      messageListContainer.innerHTML = `
        <div class="msg-empty-text">
          Không tìm thấy cuộc trò chuyện phù hợp.
        </div>
      `;
      return;
    }

    messageListContainer.innerHTML = filtered.map((item) => `
      <button type="button" class="msg-item-btn" data-chat-id="${escapeHTML(item.id)}">
        <div class="msg-avatar">
          ${getLandscapeAvatarSVG()}
        </div>
        <div class="msg-item-body">
          <div class="msg-item-top">
            <h2 class="msg-item-name">${escapeHTML(item.name)}</h2>
            ${item.unread ? '<span class="msg-unread-dot" title="Chưa đọc"></span>' : ''}
          </div>
          <p class="msg-item-preview">${escapeHTML(item.preview)}</p>
        </div>
      </button>
    `).join('');
  }

  function renderBubbleContent(m) {
    if (m.type === 'admine_part_3') {
      const linksHtml = ADMINE_PART_3.links.map((item) => {
        const href = (ADMINE_LINKS[item.key] || '').trim();
        if (href) {
          return `<a class="msg-inline-link" href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.label)}</a>`;
        }
        return `<span class="msg-inline-link msg-inline-link--empty">${escapeHTML(item.label)}</span>`;
      }).join('');

      return `
        <div>${escapeHTML(ADMINE_PART_3.intro)}</div>
        <div class="msg-link-list">${linksHtml}</div>
        <div>${escapeHTML(ADMINE_PART_3.outro)}</div>
      `;
    }
    return escapeHTML(m.text);
  }

  function renderChatHistory(chat) {
    chatMessagesBox.innerHTML = chat.messages.map((m) => {
      const isAdmineMsg = (chat.id === 'admine' || m.senderId === 'admine' || m.sender === 'Admine') && !m.time;
      const metaLabel = m.time
        ? `${escapeHTML(m.sender)} • ${escapeHTML(m.time)}`
        : escapeHTML(m.sender);

      return `
        <div class="msg-bubble-row ${m.isMe ? 'me' : 'other'}">
          ${isAdmineMsg ? '' : `<span class="msg-bubble-time">${metaLabel}</span>`}
          <div class="msg-bubble">${renderBubbleContent(m)}</div>
        </div>
      `;
    }).join('');
    chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }

  function openChat(chatId) {
    const chat = conversations.find((c) => c.id === chatId);
    if (!chat || !canUserAccessRoom(chat, currentUserId)) return;

    activeChatId = chatId;
    chat.unread = false;
    renderMessages();

    chatDetailName.textContent = chat.name;
    chatDetailAvatar.innerHTML = getLandscapeAvatarSVG();
    renderChatHistory(chat);

    setBottomNavVisible(false);
    chatDrawer.classList.remove('hidden');
  }

  function appendIncomingMessage(payload) {
    if (!payload || !payload.roomId || !payload.message) return;

    const chat = conversations.find((c) => c.roomId === payload.roomId);
    if (!chat || !canUserAccessRoom(chat, currentUserId)) return;

    const senderId = sanitizeId(payload.message.senderId || 'guest');
    const isMe = senderId === currentUserId;
    const senderName = isMe
      ? getCurrentSenderName()
      : (/^(admine|admin|hệ thống|system)$/i.test(payload.message.sender || '')
          ? 'Người chơi'
          : String(payload.message.sender || 'Người chơi').slice(0, 24));

    const incoming = {
      sender: senderName,
      senderId,
      text: String(payload.message.text || '').slice(0, MAX_MSG_LEN),
      time: String(payload.message.time || ''),
      isMe
    };

    chat.messages.push(incoming);
    chat.preview = `${incoming.sender}: ${incoming.text}`;

    if (activeChatId === chat.id && !chatDrawer.classList.contains('hidden')) {
      chat.unread = false;
      renderChatHistory(chat);
    } else if (!isMe) {
      chat.unread = true;
    }
    renderMessages();
  }

  // Cổng kết nối backend/realtime thật (Firebase / Supabase / WebSocket / REST)
  window.ZyjewvieChatTransport = {
    currentUserId,
    send(roomMessagePacket) {
      if (chatChannel) {
        chatChannel.postMessage({
          type: 'ROOM_MESSAGE',
          originTabId: clientTabId,
          ...roomMessagePacket
        });
      }
    },
    receive(roomMessagePacket) {
      appendIncomingMessage(roomMessagePacket);
    }
  };

  function sendMessageToActiveChat(rawText) {
    const cleanText = String(rawText || '').trim().slice(0, MAX_MSG_LEN);
    if (!cleanText || !activeChatId) return { ok: false };

    const nowMs = Date.now();
    if (nowMs - lastSentAt < COOLDOWN_MS) return { ok: false, reason: 'cooldown' };
    lastSentAt = nowMs;

    const chat = conversations.find((c) => c.id === activeChatId);
    if (!chat || !canUserAccessRoom(chat, currentUserId)) return { ok: false };

    const now = new Date(nowMs);
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const senderName = getCurrentSenderName();

    const packet = {
      roomId: chat.roomId,
      roomType: chat.type,
      members: chat.members,
      message: {
        sender: senderName,
        senderId: currentUserId,
        text: cleanText,
        time: timeStr
      }
    };

    appendIncomingMessage(packet);
    window.ZyjewvieChatTransport.send(packet);

    return { ok: true, chat };
  }

  if (chatChannel) {
    chatChannel.addEventListener('message', (event) => {
      const data = event.data;
      if (!data || data.type !== 'ROOM_MESSAGE' || data.originTabId === clientTabId) return;
      appendIncomingMessage(data);
    });
  }

  messageListContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-chat-id]');
    if (!btn) return;
    openChat(btn.dataset.chatId);
  });

  if (newDmBtn && newDmForm && dmTargetInput) {
    newDmBtn.addEventListener('click', () => {
      newDmForm.classList.toggle('hidden');
      if (!newDmForm.classList.contains('hidden')) {
        dmTargetInput.focus();
      }
    });

    newDmForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dmConv = getOrCreateDmConversation(dmTargetInput.value);
      if (!dmConv) return;
      dmTargetInput.value = '';
      newDmForm.classList.add('hidden');
      renderMessages();
      openChat(dmConv.id);
    });
  }

  searchInput.addEventListener('focus', () => {
    fakeCursor.style.display = 'none';
  });

  searchInput.addEventListener('blur', () => {
    if (!searchInput.value) {
      fakeCursor.style.display = 'inline-block';
    }
  });

  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    clearSearchBtn.classList.toggle('hidden', searchQuery.length === 0);
    renderMessages();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchQuery = '';
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    fakeCursor.style.display = 'inline-block';
    renderMessages();
  });

  unreadFilterBtn.addEventListener('click', () => {
    isUnreadOnly = !isUnreadOnly;
    unreadFilterBtn.classList.toggle('active', isUnreadOnly);
    renderMessages();
  });

  closeChatBtn.addEventListener('click', () => {
    chatDrawer.classList.add('hidden');
    activeChatId = null;
    setBottomNavVisible(true);
  });

  sendChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatReplyInput.value.trim();
    if (!text || !activeChatId) return;

    const res = sendMessageToActiveChat(text);
    if (!res.ok) return;

    chatReplyInput.value = '';
    renderChatHistory(res.chat);
    renderMessages();
  });

  window.MessageScreen = {
    refresh() {
      chatDrawer.classList.add('hidden');
      activeChatId = null;
      setBottomNavVisible(true);
      renderMessages();
    }
  };

  renderMessages();
});

