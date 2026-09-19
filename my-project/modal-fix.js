/* 弹窗关闭兜底：独立于业务脚本，确保线上旧缓存或脚本异常时仍可关闭。 */
(function () {
  const closeModal = (modal) => {
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
  };
  const openModal = (modal) => {
    if (!modal) return;
    modal.hidden = false;
    modal.removeAttribute('aria-hidden');
    modal.style.removeProperty('display');
  };
  window.closeCampusModal = closeModal;
  window.openCampusModal = openModal;

  document.addEventListener('click', function (event) {
    const button = event.target.closest('[data-close], .modal-close, .close');
    if (button) {
      event.preventDefault();
      event.stopPropagation();
      closeModal(button.closest('.modal-backdrop'));
      return;
    }
    if (event.target.classList.contains('modal-backdrop')) closeModal(event.target);
  }, true);

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.modal-backdrop').forEach((modal) => {
      if (!modal.hidden && getComputedStyle(modal).display !== 'none') closeModal(modal);
    });
  });
})();
