/**
 * Opened as the installed app: go straight to EDI (the address is the "Buka EDI" link's).
 * Opened in a browser tab: offer to install, with the steps for Android and iPhone.
 */
(() => {
  const appUrl = document.getElementById('open-app').href;
  const installed = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  // The service worker is what makes the launcher installable (and lets it open without a signal).
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

  if (installed) {
    document.body.classList.add('launching');
    location.replace(appUrl);
    return;
  }

  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.getElementById('help-ios').hidden = false;
    document.getElementById('help-android').hidden = true;
  }

  // Chrome / Edge on Android and laptops: our own button instead of the browser's mini bar.
  const installButton = document.getElementById('install-btn');
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = false;
  });
  installButton.addEventListener('click', async () => {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    installButton.hidden = true;
  });
  window.addEventListener('appinstalled', () => { installButton.hidden = true; });
})();
