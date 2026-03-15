/* ========================================================
   AquaSense — Telugu Voice Input for Irrigation Calculator
   Uses Web Speech API (te-IN locale)
   ======================================================== */

(function () {
  'use strict';

  const TELUGU_CROPS = {
    'వరి': 'rice',
    'ధాన్యం': 'rice',
    'బియ్యం': 'rice',
    'పత్తి': 'cotton',
    'వేరుశనగ': 'groundnut',
    'వేరుసెనగ': 'groundnut',
    'మొక్కజొన్న': 'maize',
    'జొన్న': 'maize',
    'చెరకు': 'sugarcane',
  };

  const TELUGU_SOILS = {
    'ఇసుక': 'sandy',
    'ఇసుక నేల': 'sandy',
    'సారవంత': 'loamy',
    'సారవంతమైన': 'loamy',
    'సారవంతమైన నేల': 'loamy',
    'బంకమట్టి': 'clay',
    'జిగట మట్టి': 'clay',
    'బంక': 'clay',
  };

  // Telugu number words
  const TELUGU_NUMBERS = {
    'ఒకటి': 1, 'రెండు': 2, 'మూడు': 3, 'నాలుగు': 4, 'ఐదు': 5,
    'ఆరు': 6, 'ఏడు': 7, 'ఎనిమిది': 8, 'తొమ్మిది': 9, 'పది': 10,
    'పదకొండు': 11, 'పన్నెండు': 12, 'పదమూడు': 13, 'పధ్నాలుగు': 14, 'పదిహేను': 15,
    'ఇరవై': 20, 'ముప్పై': 30, 'నలభై': 40, 'యాభై': 50,
    'అర': 0.5, 'అరవై': 60, 'డెబ్భై': 70, 'ఎనభై': 80, 'తొంభై': 90, 'నూరు': 100,
  };

  let recognition = null;
  let isListening = false;
  let voiceBtn = null;
  let voiceStatus = null;

  /* ========================================================
     CHECK SUPPORT
     ======================================================== */
  function isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /* ========================================================
     CREATE VOICE UI
     ======================================================== */
  function createVoiceButton() {
    const calcBtn = document.getElementById('calc-btn');
    if (!calcBtn || document.getElementById('voice-input-btn')) return;

    const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;

    // Voice button
    voiceBtn = document.createElement('button');
    voiceBtn.type = 'button';
    voiceBtn.className = 'voice-input-btn';
    voiceBtn.id = 'voice-input-btn';
    voiceBtn.title = t('calc.voice.tooltip');
    voiceBtn.setAttribute('data-i18n-title', 'calc.voice.tooltip');
    voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';

    if (!isSupported()) {
      voiceBtn.classList.add('unsupported');
      voiceBtn.title = t('voice.unsupported');
      voiceBtn.disabled = true;
    }

    voiceBtn.addEventListener('click', toggleListening);

    // Status display
    voiceStatus = document.createElement('div');
    voiceStatus.className = 'voice-status hidden';
    voiceStatus.id = 'voice-status';
    voiceStatus.innerHTML = `
      <div class="voice-status-inner">
        <div class="voice-pulse"></div>
        <span class="voice-status-text" data-i18n="voice.listening">${t('voice.listening')}</span>
      </div>
      <div class="voice-transcript" id="voice-transcript"></div>
    `;

    // Insert voice button next to calc button
    const formCard = document.getElementById('calc-form-card');
    if (formCard) {
      // Add button wrapper after form
      const voiceWrap = document.createElement('div');
      voiceWrap.className = 'voice-input-wrap';
      voiceWrap.appendChild(voiceBtn);
      voiceWrap.appendChild(voiceStatus);

      const form = document.getElementById('irrigation-form');
      if (form) {
        form.parentNode.insertBefore(voiceWrap, form.nextSibling);
      }
    }
  }

  /* ========================================================
     SPEECH RECOGNITION
     ======================================================== */
  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  function startListening() {
    if (!isSupported()) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'te-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      isListening = true;
      voiceBtn.classList.add('listening');
      voiceStatus.classList.remove('hidden');
      const transcript = document.getElementById('voice-transcript');
      if (transcript) transcript.textContent = '';
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const transcript = document.getElementById('voice-transcript');
      if (transcript) {
        transcript.textContent = finalTranscript || interimTranscript;
      }

      if (finalTranscript) {
        parseTeluguInput(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.warn('[Voice] Error:', event.error);
      stopListening();

      if (event.error !== 'aborted') {
        const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;
        showVoiceError(t('voice.error'));
      }
    };

    recognition.onend = () => {
      stopListening();
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn('[Voice] Failed to start:', e);
      stopListening();
    }
  }

  function stopListening() {
    isListening = false;
    if (voiceBtn) voiceBtn.classList.remove('listening');
    if (voiceStatus) {
      setTimeout(() => voiceStatus.classList.add('hidden'), 1500);
    }
    if (recognition) {
      try { recognition.stop(); } catch (e) { /* ignore */ }
      recognition = null;
    }
  }

  /* ========================================================
     PARSE TELUGU INPUT
     ======================================================== */
  function parseTeluguInput(text) {
    const normalized = text.trim();
    let filled = false;

    // Match crops
    for (const [teluguWord, cropValue] of Object.entries(TELUGU_CROPS)) {
      if (normalized.includes(teluguWord)) {
        const cropField = document.getElementById('crop-type');
        if (cropField) {
          cropField.value = cropValue;
          cropField.dispatchEvent(new Event('change'));
          highlightField(cropField);
          filled = true;
        }
        break;
      }
    }

    // Match soils
    for (const [teluguWord, soilValue] of Object.entries(TELUGU_SOILS)) {
      if (normalized.includes(teluguWord)) {
        const soilField = document.getElementById('soil-type');
        if (soilField) {
          soilField.value = soilValue;
          soilField.dispatchEvent(new Event('change'));
          highlightField(soilField);
          filled = true;
        }
        break;
      }
    }

    // Extract numbers
    const numbers = extractNumbers(normalized);
    if (numbers.length > 0) {
      const landField = document.getElementById('land-size');
      const rainField = document.getElementById('rainfall');

      // Context: if "ఎకరం" or "ఎకరాలు" mentioned, assign to land
      // if "వర్షం" or "మిల్లీమీటర్" mentioned, assign to rain
      const hasLandContext = /ఎకర|భూమి|పొలం/.test(normalized);
      const hasRainContext = /వర్ష|మిల్లీ|మి\.మీ/.test(normalized);

      if (numbers.length >= 2) {
        if (landField) { landField.value = numbers[0]; highlightField(landField); }
        if (rainField) { rainField.value = numbers[1]; highlightField(rainField); }
        filled = true;
      } else if (numbers.length === 1) {
        if (hasRainContext && rainField) {
          rainField.value = numbers[0]; highlightField(rainField);
        } else if (landField) {
          landField.value = numbers[0]; highlightField(landField);
        }
        filled = true;
      }
    }

    // Visual feedback for result
    if (filled) {
      const transcript = document.getElementById('voice-transcript');
      if (transcript) {
        transcript.classList.add('success');
        setTimeout(() => transcript.classList.remove('success'), 2000);
      }
    }
  }

  function extractNumbers(text) {
    const numbers = [];

    // First check Telugu number words
    for (const [word, value] of Object.entries(TELUGU_NUMBERS)) {
      if (text.includes(word)) {
        numbers.push(value);
      }
    }

    // Then extract Arabic/digits
    const digitMatches = text.match(/[\d]+\.?[\d]*/g);
    if (digitMatches) {
      digitMatches.forEach((m) => numbers.push(parseFloat(m)));
    }

    return numbers;
  }

  function highlightField(field) {
    field.classList.add('voice-filled');
    field.closest('.form-group')?.classList.remove('error');
    setTimeout(() => field.classList.remove('voice-filled'), 2000);
  }

  function showVoiceError(message) {
    const transcript = document.getElementById('voice-transcript');
    if (transcript) {
      transcript.textContent = message;
      transcript.classList.add('error');
      setTimeout(() => {
        transcript.classList.remove('error');
        transcript.textContent = '';
      }, 3000);
    }
  }

  /* ========================================================
     INITIALIZE
     ======================================================== */
  function init() {
    createVoiceButton();

    // Listen for language changes
    window.addEventListener('languageChanged', () => {
      if (voiceBtn) {
        const t = window.AquaSenseI18n ? window.AquaSenseI18n.t : (k) => k;
        voiceBtn.title = t('calc.voice.tooltip');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
