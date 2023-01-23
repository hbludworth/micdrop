chrome.runtime.onInstalled.addListener((details) => {
  if (
    details.reason === 'install' ||
    (details.reason === 'update' &&
      chrome.runtime.getManifest().version === '1.0.0')
  ) {
    chrome.tabs.create({
      url:
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:8080/tutorial'
          : 'https://app.sendmicdrop.com/tutorial',
    });
  }
});
