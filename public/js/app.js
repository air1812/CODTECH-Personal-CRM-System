document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.btn, .nav-link, .pagination-link');
  buttons.forEach((button) => {
    button.addEventListener('mouseover', () => button.classList.add('hover'));
    button.addEventListener('mouseout', () => button.classList.remove('hover'));
  });
});