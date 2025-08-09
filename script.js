const mobileBtn = document.getElementById('mobile-menu-btn');
if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
}