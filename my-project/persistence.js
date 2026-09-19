/* 增强交互：草稿自动保存、发布内容管理与持久化反馈 */
(function () {
  const DRAFT_KEY = 'campusOpportunityDraft';
  const draftFields = ['title', 'date', 'location', 'limit', 'description'];
  const form = document.querySelector('#publishForm');
  if (!form) return;

  const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
  if (draft) {
    draftFields.forEach((name) => {
      if (draft[name] && form.elements[name]) form.elements[name].value = draft[name];
    });
    const hint = document.createElement('p');
    hint.className = 'draft-hint';
    hint.textContent = '已恢复上次未完成的发布草稿';
    form.prepend(hint);
  }

  let draftTimer;
  form.addEventListener('input', () => {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(() => {
      const value = {};
      draftFields.forEach((name) => { value[name] = form.elements[name]?.value || ''; });
      if (Object.values(value).some(Boolean)) localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
    }, 250);
  });

  form.addEventListener('submit', () => {
    localStorage.removeItem(DRAFT_KEY);
    setTimeout(addManagement, 0);
  });

  function addManagement() {
    const mine = document.querySelector('#mine');
    if (!mine || document.querySelector('#myPublishedPanel')) return;
    const panel = document.createElement('div');
    panel.id = 'myPublishedPanel';
    panel.className = 'published-panel';
    panel.innerHTML = '<div><span class="eyebrow">MY POSTS</span><h3>我发布的机会</h3><p>发布内容已进入全部机会列表，也可以在这里查看或撤下。</p></div><div id="publishedItems"></div>';
    mine.appendChild(panel);
    renderPublished();
  }

  function renderPublished() {
    const target = document.querySelector('#publishedItems');
    if (!target) return;
    const posts = JSON.parse(localStorage.getItem('published') || '[]');
    target.innerHTML = posts.length ? posts.map((post) => `<div class="published-item"><div><b>${escapeHtml(post.title)}</b><small>${escapeHtml(post.date)} · ${escapeHtml(post.location)} · 学生自主发布</small></div><button class="remove-post" data-remove-post="${post.id}">撤下</button></div>`).join('') : '<p class="published-empty">你还没有发布内容，点击右上角“发布机会”开始吧。</p>';
  }

  function escapeHtml(value) { return String(value || '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  document.addEventListener('click', (event) => {
    const id = event.target.dataset.removePost;
    if (!id) return;
    const posts = JSON.parse(localStorage.getItem('published') || '[]').filter((post) => post.id !== id);
    localStorage.setItem('published', JSON.stringify(posts));
    window.location.reload();
  });

  if (JSON.parse(localStorage.getItem('published') || '[]').length) addManagement();
})();
