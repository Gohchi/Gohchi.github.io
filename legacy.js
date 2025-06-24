window.onload = function () {
  const container = document.getElementById('browser');
  if (container) {
    const browser = identifyBrowser();
    const message = '\nYou are using ' + browser + '. Redirecting you to the appropriate page...';
    container.innerText += message;
    redirectByBrowser();
  }
};

function redirectByBrowser() {
  const browser = identifyBrowser();

  if (browser === "Nintendo 3DS") {
    window.location.href = "/3DS";
    return;
  } else if (browser === "PlayStation Vita") {
    window.location.href = "/PSVita";
    return;
  }
  window.location.href = "/welcome";
}

function identifyBrowser() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Nintendo 3DS") != -1) {
    return "Nintendo 3DS";
  } else if (userAgent.indexOf("PlayStation Vita") != -1) {
    return "PlayStation Vita";
  } else if (userAgent.indexOf("Chrome") != -1) {
    return "Google Chrome";
  } else if (userAgent.indexOf("Firefox") != -1) {
    return "Mozilla Firefox";
  } else if (userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Chrome") == -1) {
    return "Apple Safari";
  } else if (userAgent.indexOf("Edge") != -1) {
    return "Microsoft Edge";
  } else if (userAgent.indexOf("Trident") != -1) {
    return "Internet Explorer";
  } else {
    return "Unknown Browser";
  }
}