export const extractKanji = phrase => {
  if (!phrase) return [];
  const kanjiList = [];
  let kanjiGroup = '';
  for (let i = 0; i < phrase.length; i++) {
    const unicodeCode = phrase.charCodeAt(i);
    if (unicodeCode >= 0x4E00 && unicodeCode <= 0x9FFF) {
      kanjiGroup += phrase[i];
    } else {
      if (kanjiGroup !== '') {
        kanjiList.push(kanjiGroup);
        kanjiGroup = '';
      }
    }
  }
  if (kanjiGroup !== '') {
    kanjiList.push(kanjiGroup);
  }
  return kanjiList;
};

export const splitByKanji = (sentence, kanjiList) => {
  let result = [];
  let currentIndex = 0;
  for (let i = 0; i < kanjiList.length; i++) {
    const kanji = kanjiList[i];
    const index = sentence.indexOf(kanji, currentIndex);
    if (index !== -1) {
      result.push(sentence.substring(currentIndex, index));
      result.push(kanji);
      currentIndex = index + kanji.length;
    }
  }
  result.push(sentence.substring(currentIndex));
  return result;
};

export const showRefsDialog = refs => {
  if (!refs) { // If no references are provided, do nothing
    return;
  }

  const dialog = document.getElementById('dialog-refs');
  if (dialog) {
    const content = dialog.querySelector('.content');
    content.innerHTML = ''; // Clear previous content
    for (let i = 0; i < refs.length; i++) {
      const ref = refs[i];
      const p = document.createElement('p');
      p.textContent = `${'*'.repeat(i + 1)} ${ref}`;
      content.appendChild(p); // Add each reference as a paragraph
    }

    dialog.showModal();
  }
};

export const showDialog = id => {
  const dialog = document.getElementById(id);
  if (dialog) {
    dialog.showModal();
  }
};

export const closeDialog = id => {
  const dialog = document.getElementById(id);
  if (dialog) {
    dialog.close();
  }
};

export const speak = (text, voice) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ja-JP';
  if (voice) {
    utterance.voice = voice; //this.selectedVoice;
  }
  window.speechSynthesis.speak(utterance);
}

export const getVoices = async () => {
  // Wait for voices to be loaded if not available yet
  if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    await new Promise(resolve => {
      const handler = () => {
        speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve();
      };
      speechSynthesis.addEventListener('voiceschanged', handler);
      // In case voices are already loaded
      if (speechSynthesis.getVoices().length) {
        speechSynthesis.removeEventListener('voiceschanged', handler);
        resolve();
      }
    });
  }
  // Filter voices by ja-JP language
  return window.speechSynthesis.getVoices().filter(({ lang }) => ['ja-JP', 'ja_JP'].includes(lang));
}