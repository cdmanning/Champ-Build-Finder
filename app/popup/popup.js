document.addEventListener('DOMContentLoaded', () => {
    const siteSelect = document.getElementById('site-select');
    const helpBtn = document.querySelector('.help-btn');

    helpBtn.addEventListener('click', () => {
        chrome.tabs.create({ url: '/help/help.html' });
    });

    siteSelect.addEventListener('change', () => {
        chrome.storage.local.set({ preferredSite: siteSelect.value });
    });

    chrome.storage.local.get({ preferredSite: 'u.gg' }, (data) => {
        siteSelect.value = data.preferredSite;
    });

    setTimeout(() => document.body.classList.remove('preload'), 100);
});