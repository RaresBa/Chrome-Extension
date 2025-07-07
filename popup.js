document.getElementById('translate-button').addEventListener('click', () => {
    const language = document.getElementById('language-select').value;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: language === 'reverse' ? reverseText : translatePage,
        args: language === 'reverse' ? [] : [language]
      });
    });
  });

  function translatePage(language) {
    const googleTranslateScript = document.createElement('script');
    googleTranslateScript.type = 'text/javascript';
    googleTranslateScript.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
    document.head.appendChild(googleTranslateScript);

    window.googleTranslateElementInit = function () {
      new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: language }, 'google_translate_element');
    };
  }

  function reverseText() {
    function reverseString(str) {
      return str.split('').reverse().join('');
    }

    function reverseNodeText(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = reverseString(node.textContent);
      } else {
        node.childNodes.forEach(reverseNodeText);
      }
    }

    document.body.childNodes.forEach(reverseNodeText);
  }
