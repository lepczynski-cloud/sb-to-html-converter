<script>
  import {onDestroy, onMount} from 'svelte';
  import loadProject from '../packager/load-project';
  import Packager from '../packager/web/export';
  import {isStandalone, version} from './environment';
  import {SOURCE_CODE, WEBSITE} from '../packager/brand';

  const dictionaries = {
    pl: {
      pageTitle: 'SB do HTML | konwerter działający lokalnie',
      metaDescription: 'Zamień plik projektu .sb, .sb2 lub .sb3 w samodzielny plik HTML bez wysyłania go na serwer.',
      brand: 'SB → HTML',
      localBadge: 'Przetwarzanie lokalne',
      heroTitle: 'Zamień plik .sb, .sb2 lub .sb3 w samodzielny HTML',
      heroText: 'Wybierz plik projektu. Konwersja odbywa się w Twojej przeglądarce, a gotowy projekt pobierzesz jako jeden plik HTML.',
      compatibilityText: 'Działa z plikami projektów wyeksportowanymi z edytora Scratch.',
      stepOneTitle: 'Wybierz projekt',
      stepOneText: 'Przeciągnij plik albo wybierz go z dysku.',
      stepTwoTitle: 'Ustaw opcje',
      stepTwoText: 'Domyślne ustawienia są dobre dla większości gier.',
      stepThreeTitle: 'Pobierz HTML',
      stepThreeText: 'Otwórz wynik lokalnie lub umieść go na stronie.',
      workflow: 'Jak to działa',
      converterTitle: 'Konwerter',
      dropTitle: 'Upuść plik projektu tutaj',
      dropText: 'lub kliknij, aby wybrać plik',
      formats: 'Obsługiwane formaty: .sb, .sb2, .sb3',
      selectedFile: 'Wybrany plik',
      removeFile: 'Usuń',
      largeFile: 'To duży projekt. Konwersja może wymagać dużo pamięci, dlatego najlepiej użyj komputera i zamknij zbędne karty.',
      settingsTitle: 'Ustawienia gry',
      settingsHint: 'Opcjonalne',
      gameTitle: 'Tytuł gry',
      turbo: 'Tryb Turbo',
      turboHelp: 'Szybsze wykonywanie skryptów. Może zmienić zachowanie projektów zależnych od dokładnego taktowania.',
      interpolation: 'Płynniejszy ruch',
      interpolationHelp: 'Interpoluje pozycje duszków między klatkami.',
      autoplay: 'Uruchom automatycznie',
      autoplayHelp: 'Przeglądarka może nadal wymagać kliknięcia, szczególnie gdy gra odtwarza dźwięk.',
      controls: 'Pokaż zieloną flagę i Stop',
      fullscreen: 'Pokaż przycisk pełnego ekranu',
      cloudVariables: 'Zmienne chmurowe',
      cloudLocal: 'Lokalne, zalecane do pracy offline',
      cloudServer: 'Serwer TurboWarp, wymaga Internetu',
      cloudIgnore: 'Ignoruj',
      cloudHelp: 'Tryb lokalny zapisuje wartości tylko w danej przeglądarce i nie synchronizuje graczy.',
      customExtensionConfirm: 'Ten projekt używa niestandardowych rozszerzeń. Ich kod może zostać pobrany i będzie uruchamiany bez sandboxa w wygenerowanej grze. Kontynuuj tylko, jeśli ufasz projektowi i źródłom rozszerzeń. Kontynuować?',
      convert: 'Konwertuj i pobierz HTML',
      cancel: 'Anuluj',
      downloaded: 'Pobrano:',
      downloadAgain: 'Pobierz ponownie',
      offlineTitle: 'Konwerter również bez Internetu',
      offlineText: 'Pobierz pojedynczy plik HTML z całym konwerterem. Potem możesz otworzyć go bezpośrednio z dysku w nowoczesnej przeglądarce.',
      offlineButton: 'Pobierz konwerter offline',
      standaloneTitle: 'Uruchomiono wersję offline',
      standaloneText: 'Ta strona jest samodzielnym plikiem. Możesz zachować ją na dysku i używać bez instalacji.',
      privacyTitle: 'Co dzieje się z plikiem?',
      privacyText: 'Projekt jest odczytywany lokalnie i nie jest wysyłany do serwera tej aplikacji. Niestandardowe rozszerzenia mogą zostać pobrane podczas konwersji, a wygenerowana gra może łączyć się z usługami zewnętrznymi.',
      limitsTitle: 'Ważne ograniczenia',
      limitsText: 'Duże projekty mogą przekroczyć limit pamięci telefonu lub przeglądarki. Zgodność zależy również od rozszerzeń i funkcji użytych w projekcie.',
      rightsTitle: 'Publikuj odpowiedzialnie',
      rightsText: 'Konwertuj i udostępniaj tylko projekty, do których masz odpowiednie prawa. SB to HTML Converter nie jest powiązany ani wspierany przez Scratch Foundation.',
      privacyLink: 'Pełna informacja o prywatności',
      sourceCode: 'Kod źródłowy',
      basedOn: 'Oparte na TurboWarp Packager',
      versionLabel: 'Wersja',
      language: 'Język',
      browserUnsupported: 'Ta przeglądarka nie obsługuje funkcji wymaganych do konwersji. Użyj aktualnej wersji Chrome, Edge, Firefox albo Safari.',
      status: {
        ready: 'Wybierz plik projektu.',
        selected: 'Plik jest gotowy do konwersji.',
        reading: 'Odczytywanie i analizowanie projektu…',
        assets: 'Przetwarzanie zasobów projektu…',
        extensions: 'Dołączanie rozszerzeń…',
        packaging: 'Tworzenie samodzielnego pliku HTML…',
        downloading: 'Przygotowywanie pobierania…',
        done: 'Gotowe. Plik HTML został pobrany.',
        cancelled: 'Konwersja została anulowana.',
        error: 'Konwersja nie powiodła się.'
      },
      errors: {
        invalidFile: 'Wybierz plik z rozszerzeniem .sb, .sb2 albo .sb3.',
        noFile: 'Najpierw wybierz plik projektu.',
        failed: 'Nie udało się utworzyć pliku HTML.'
      }
    },
    en: {
      pageTitle: 'SB to HTML Converter | Local browser converter',
      metaDescription: 'Convert an .sb, .sb2 or .sb3 project file to standalone HTML without uploading it to a server.',
      brand: 'SB → HTML',
      localBadge: 'Local processing',
      heroTitle: 'Turn an .sb, .sb2 or .sb3 file into standalone HTML',
      heroText: 'Choose a project file. Conversion runs in your browser and downloads the finished project as a single HTML file.',
      compatibilityText: 'Works with project files exported from Scratch.',
      stepOneTitle: 'Choose a project',
      stepOneText: 'Drop a file or select one from your device.',
      stepTwoTitle: 'Choose options',
      stepTwoText: 'The defaults work well for most games.',
      stepThreeTitle: 'Download HTML',
      stepThreeText: 'Open it locally or publish it on a website.',
      workflow: 'How it works',
      converterTitle: 'Converter',
      dropTitle: 'Drop a project file here',
      dropText: 'or click to choose a file',
      formats: 'Supported formats: .sb, .sb2, .sb3',
      selectedFile: 'Selected file',
      removeFile: 'Remove',
      largeFile: 'This is a large project. Conversion may use a lot of memory, so use a desktop computer and close unnecessary tabs.',
      settingsTitle: 'Game settings',
      settingsHint: 'Optional',
      gameTitle: 'Game title',
      turbo: 'Turbo mode',
      turboHelp: 'Runs scripts faster. It can change projects that depend on exact timing.',
      interpolation: 'Smoother motion',
      interpolationHelp: 'Interpolates sprite positions between frames.',
      autoplay: 'Start automatically',
      autoplayHelp: 'The browser may still require a click, especially when the game plays audio.',
      controls: 'Show green flag and Stop',
      fullscreen: 'Show fullscreen button',
      cloudVariables: 'Cloud variables',
      cloudLocal: 'Local, recommended for offline use',
      cloudServer: 'TurboWarp server, Internet required',
      cloudIgnore: 'Ignore',
      cloudHelp: 'Local mode stores values only in that browser and does not synchronize players.',
      customExtensionConfirm: 'This project uses custom extensions. Their code may be downloaded and will run without a sandbox in the generated game. Continue only if you trust the project and extension sources. Continue?',
      convert: 'Convert and download HTML',
      cancel: 'Cancel',
      downloaded: 'Downloaded:',
      downloadAgain: 'Download again',
      offlineTitle: 'Use the converter without Internet access',
      offlineText: 'Download one HTML file containing the complete converter. You can later open it directly from disk in a modern browser.',
      offlineButton: 'Download offline converter',
      standaloneTitle: 'Offline version is running',
      standaloneText: 'This page is a self-contained file. Keep it on disk and use it without installation.',
      privacyTitle: 'What happens to the file?',
      privacyText: 'The project is read locally and is not uploaded to this app’s server. Custom extensions may be downloaded during conversion, and the generated game may connect to external services.',
      limitsTitle: 'Important limitations',
      limitsText: 'Large projects can exceed a phone or browser memory limit. Compatibility also depends on the extensions and features used by the project.',
      rightsTitle: 'Publish responsibly',
      rightsText: 'Only convert and share projects for which you have the necessary rights. SB to HTML Converter is not affiliated with or endorsed by the Scratch Foundation.',
      privacyLink: 'Full privacy information',
      sourceCode: 'Source code',
      basedOn: 'Based on TurboWarp Packager',
      versionLabel: 'Version',
      language: 'Language',
      browserUnsupported: 'This browser does not support the features required for conversion. Use a current version of Chrome, Edge, Firefox or Safari.',
      status: {
        ready: 'Choose a project file.',
        selected: 'The file is ready to convert.',
        reading: 'Reading and analysing the project…',
        assets: 'Processing project assets…',
        extensions: 'Bundling extensions…',
        packaging: 'Creating the standalone HTML file…',
        downloading: 'Preparing the download…',
        done: 'Done. The HTML file has been downloaded.',
        cancelled: 'Conversion was cancelled.',
        error: 'Conversion failed.'
      },
      errors: {
        invalidFile: 'Choose a file ending in .sb, .sb2 or .sb3.',
        noFile: 'Choose a project file first.',
        failed: 'The HTML file could not be created.'
      }
    }
  };

  let language = 'en';
  let selectedFile = null;
  let gameTitle = '';
  let isDragging = false;
  let busy = false;
  let cancelled = false;
  let progress = 0;
  let statusKey = 'ready';
  let errorMessage = '';
  let resultName = '';
  let downloadURL = '';
  let currentLoadTask = null;
  let currentPackager = null;

  let turbo = true;
  let interpolation = false;
  let autoplay = false;
  let showControls = true;
  let fullscreen = true;
  let cloudMode = 'local';

  const browserSupported = (
    typeof TextDecoder === 'function' &&
    typeof TextEncoder === 'function' &&
    typeof Blob === 'function' &&
    typeof URL === 'function' &&
    typeof URL.createObjectURL === 'function'
  );

  $: t = dictionaries[language];
  $: statusText = t.status[statusKey] || t.status.ready;
  $: selectedFileSize = selectedFile ? formatBytes(selectedFile.size) : '';
  $: isLargeFile = selectedFile && selectedFile.size > 100 * 1024 * 1024;

  onMount(() => {
    let savedLanguage = '';
    try {
      savedLanguage = localStorage.getItem('sb-to-html-language') || '';
    } catch (error) {}
    const browserLanguage = navigator.language && navigator.language.toLowerCase().startsWith('pl')
      ? 'pl'
      : 'en';
    setLanguage(savedLanguage === 'pl' || savedLanguage === 'en' ? savedLanguage : browserLanguage);
  });

  function setLanguage(nextLanguage) {
    language = nextLanguage === 'pl' ? 'pl' : 'en';
    document.documentElement.lang = language;
    document.title = dictionaries[language].pageTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', dictionaries[language].metaDescription);
    try {
      localStorage.setItem('sb-to-html-language', language);
    } catch (error) {}
  }

  function clearDownload() {
    if (downloadURL) {
      URL.revokeObjectURL(downloadURL);
      downloadURL = '';
    }
  }

  onDestroy(clearDownload);

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes < 1) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, index);
    return `${value.toFixed(index === 0 || value >= 10 ? 0 : 1)} ${units[index]}`;
  }

  function stripProjectExtension(name) {
    return name.replace(/\.(sb|sb2|sb3)$/i, '');
  }

  function safeFileName(name) {
    const cleaned = name
      .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-')
      .replace(/[. ]+$/g, '')
      .trim()
      .slice(0, 120);
    return cleaned || 'converted-project';
  }

  function simpleHash(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, '0');
  }

  function setProgress(value) {
    progress = Math.max(0, Math.min(1, Number(value) || 0));
  }

  function chooseFile(file) {
    clearDownload();
    errorMessage = '';
    resultName = '';
    progress = 0;
    if (!file || !/\.(sb|sb2|sb3)$/i.test(file.name)) {
      selectedFile = null;
      gameTitle = '';
      statusKey = 'error';
      errorMessage = t.errors.invalidFile;
      return;
    }
    selectedFile = file;
    gameTitle = stripProjectExtension(file.name).trim() || 'Converted project';
    statusKey = 'selected';
  }

  function handleFileInput(event) {
    const file = event.currentTarget.files && event.currentTarget.files[0];
    chooseFile(file);
    event.currentTarget.value = '';
  }

  function handleDrop(event) {
    isDragging = false;
    if (busy) return;
    const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    chooseFile(file);
  }

  function handleDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) isDragging = false;
  }

  function removeSelectedFile() {
    if (busy) return;
    clearDownload();
    selectedFile = null;
    gameTitle = '';
    resultName = '';
    errorMessage = '';
    progress = 0;
    statusKey = 'ready';
  }

  function updateLoadingProgress(type, a, b) {
    if (type === 'assets' && b) {
      statusKey = 'assets';
      setProgress(0.08 + (a / b) * 0.32);
    } else if (type === 'compress') {
      statusKey = 'reading';
      setProgress(0.08 + (Number(a) || 0) * 0.32);
    } else if (type === 'fetch') {
      statusKey = 'reading';
      setProgress(0.08 + (Number(a) || 0) * 0.32);
    }
  }


  function getExtensionURLs(project) {
    const extensions = project && project.analysis && Array.isArray(project.analysis.extensions)
      ? project.analysis.extensions
      : [];
    return extensions
      .map((extension) => typeof extension === 'object' && extension ? extension.url || '' : extension)
      .filter((extension) => typeof extension === 'string' && extension.length > 0);
  }

  function createPackager(project) {
    const packager = new Packager();
    const options = packager.options;
    const analysis = project.analysis || {
      stageVariables: [],
      extensions: []
    };
    const title = gameTitle.trim() || stripProjectExtension(selectedFile.name) || 'Converted project';

    options.target = 'html';
    options.turbo = turbo;
    options.interpolation = interpolation;
    options.autoplay = autoplay;
    options.controls.greenFlag.enabled = showControls;
    options.controls.stopAll.enabled = showControls;
    options.controls.fullscreen.enabled = fullscreen;
    options.app.windowTitle = title;
    options.app.packageName = Packager.getDefaultPackageNameFromFileName(`${title}.sb3`);
    options.projectId = `local-${simpleHash([
      selectedFile.name.toLowerCase(),
      selectedFile.size,
      selectedFile.lastModified
    ].join('|'))}`;
    options.cloudVariables.mode = cloudMode;
    options.extensions = getExtensionURLs(project);
    options.bakeExtensions = true;

    const cloudVariables = (analysis.stageVariables || [])
      .filter((variable) => variable.isCloud)
      .map((variable) => variable.name);
    for (const variable of cloudVariables) {
      options.cloudVariables.custom[variable] = cloudMode;
    }

    packager.project = project;
    return packager;
  }

  function normalizeError(error) {
    if (!error) return '';
    const message = typeof error.message === 'string' ? error.message : String(error);
    return message.replace(/^Error:\s*/i, '').trim();
  }

  async function convert() {
    if (!selectedFile) {
      statusKey = 'error';
      errorMessage = t.errors.noFile;
      return;
    }
    if (busy) return;

    clearDownload();
    busy = true;
    cancelled = false;
    errorMessage = '';
    resultName = '';
    statusKey = 'reading';
    setProgress(0.05);

    try {
      currentLoadTask = await loadProject.fromFile(selectedFile, updateLoadingProgress);
      if (cancelled) {
        currentLoadTask.terminate();
        throw new Error('Cancelled');
      }
      const project = await currentLoadTask.promise;
      currentLoadTask = null;
      if (cancelled) throw new Error('Cancelled');

      const extensionURLs = getExtensionURLs(project);
      if (extensionURLs.length > 0 && !window.confirm(t.customExtensionConfirm)) {
        throw new Error('Cancelled');
      }

      statusKey = 'packaging';
      setProgress(0.46);
      currentPackager = createPackager(project);

      currentPackager.addEventListener('fetch-extensions', ({detail}) => {
        statusKey = 'extensions';
        setProgress(0.48 + detail.progress * 0.42);
      });
      currentPackager.addEventListener('large-asset-fetch', ({detail}) => {
        statusKey = 'packaging';
        setProgress(0.48 + detail.progress * 0.42);
      });
      currentPackager.addEventListener('zip-progress', ({detail}) => {
        statusKey = 'packaging';
        setProgress(0.72 + detail.progress * 0.18);
      });

      const result = await currentPackager.package();
      if (cancelled) throw new Error('Cancelled');

      statusKey = 'downloading';
      setProgress(0.96);
      const outputName = `${safeFileName(gameTitle)}.html`;
      const blob = new Blob([result.data], {type: result.type || 'text/html'});
      downloadURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = outputName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();

      resultName = outputName;
      statusKey = 'done';
      setProgress(1);
    } catch (error) {
      const message = normalizeError(error);
      if (cancelled || message === 'Aborted' || message === 'Cancelled') {
        statusKey = 'cancelled';
        setProgress(0);
      } else {
        statusKey = 'error';
        errorMessage = `${t.errors.failed}${message ? ` ${message}` : ''}`;
      }
    } finally {
      currentLoadTask = null;
      currentPackager = null;
      busy = false;
    }
  }

  function cancelConversion() {
    if (!busy) return;
    cancelled = true;
    statusKey = 'cancelled';
    if (currentLoadTask && typeof currentLoadTask.terminate === 'function') {
      currentLoadTask.terminate();
    }
    if (currentPackager && typeof currentPackager.abort === 'function') {
      currentPackager.abort();
    }
  }
</script>

<div class="page">
  <header class="topbar">
    <a class="brand" href={isStandalone ? WEBSITE : './'} aria-label={t.brand}>
      <span class="brand-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" role="img">
          <path d="M7 2.75h7l4.25 4.25v14.25H7z" />
          <path d="M14 2.75V7h4.25" />
          <path d="M4 11h8m-2.75-2.75L12 11 9.25 13.75M20 16h-8m2.75-2.75L12 16l2.75 2.75" />
        </svg>
      </span>
      <span>{t.brand}</span>
    </a>

    <div class="language-switcher" aria-label={t.language}>
      <button
        type="button"
        class:active={language === 'en'}
        aria-pressed={language === 'en'}
        on:click={() => setLanguage('en')}
      >EN</button>
      <button
        type="button"
        class:active={language === 'pl'}
        aria-pressed={language === 'pl'}
        on:click={() => setLanguage('pl')}
      >PL</button>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="local-badge"><span aria-hidden="true"></span>{t.localBadge}</div>
      <h1>{t.heroTitle}</h1>
      <p class="hero-text">{t.heroText}</p>
      <p class="compatibility-note">{t.compatibilityText}</p>

      <div class="steps" aria-label={t.workflow}>
        <div class="step">
          <span class="step-number">1</span>
          <div><strong>{t.stepOneTitle}</strong><span>{t.stepOneText}</span></div>
        </div>
        <div class="step">
          <span class="step-number">2</span>
          <div><strong>{t.stepTwoTitle}</strong><span>{t.stepTwoText}</span></div>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <div><strong>{t.stepThreeTitle}</strong><span>{t.stepThreeText}</span></div>
        </div>
      </div>
    </section>

    <section class="converter-card" aria-labelledby="converter-heading">
      <div class="section-heading">
        <div>
          <span class="eyebrow">.SB · .SB2 · .SB3 → .HTML</span>
          <h2 id="converter-heading">{t.converterTitle}</h2>
        </div>
        {#if version}<span class="version-pill">{version}</span>{/if}
      </div>

      {#if !browserSupported}
        <div class="alert error" role="alert">{t.browserUnsupported}</div>
      {:else}
        <input
          id="project-file"
          class="file-input"
          type="file"
          accept=".sb,.sb2,.sb3"
          disabled={busy}
          on:change={handleFileInput}
        >
        <label
          for="project-file"
          class="drop-zone"
          class:dragging={isDragging}
          class:disabled={busy}
          on:dragenter|preventDefault={() => isDragging = true}
          on:dragover|preventDefault={() => isDragging = true}
          on:dragleave|preventDefault={handleDragLeave}
          on:drop|preventDefault={handleDrop}
        >
          <span class="upload-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
              <path d="M5 13v6.25h14V13" />
            </svg>
          </span>
          <strong>{t.dropTitle}</strong>
          <span>{t.dropText}</span>
          <small>{t.formats}</small>
        </label>

        {#if selectedFile}
          <div class="file-card">
            <span class="file-type" aria-hidden="true">SB</span>
            <div class="file-details">
              <span>{t.selectedFile}</span>
              <strong title={selectedFile.name}>{selectedFile.name}</strong>
              <small>{selectedFileSize}</small>
            </div>
            <button type="button" class="text-button" disabled={busy} on:click={removeSelectedFile}>
              {t.removeFile}
            </button>
          </div>
        {/if}

        {#if isLargeFile}
          <div class="alert warning" role="status">{t.largeFile}</div>
        {/if}

        <details class="settings" class:disabled={busy}>
          <summary>
            <span>{t.settingsTitle}</span>
            <small>{t.settingsHint}</small>
          </summary>
          <div class="settings-content">
            <label class="field full-width">
              <span>{t.gameTitle}</span>
              <input type="text" bind:value={gameTitle} maxlength="120" disabled={busy || !selectedFile}>
            </label>

            <label class="toggle-option">
              <input type="checkbox" bind:checked={turbo} disabled={busy}>
              <span class="toggle-copy"><strong>{t.turbo}</strong><small>{t.turboHelp}</small></span>
            </label>
            <label class="toggle-option">
              <input type="checkbox" bind:checked={interpolation} disabled={busy}>
              <span class="toggle-copy"><strong>{t.interpolation}</strong><small>{t.interpolationHelp}</small></span>
            </label>
            <label class="toggle-option">
              <input type="checkbox" bind:checked={autoplay} disabled={busy}>
              <span class="toggle-copy"><strong>{t.autoplay}</strong><small>{t.autoplayHelp}</small></span>
            </label>
            <label class="toggle-option compact">
              <input type="checkbox" bind:checked={showControls} disabled={busy}>
              <span class="toggle-copy"><strong>{t.controls}</strong></span>
            </label>
            <label class="toggle-option compact">
              <input type="checkbox" bind:checked={fullscreen} disabled={busy}>
              <span class="toggle-copy"><strong>{t.fullscreen}</strong></span>
            </label>

            <label class="field full-width">
              <span>{t.cloudVariables}</span>
              <select bind:value={cloudMode} disabled={busy}>
                <option value="local">{t.cloudLocal}</option>
                <option value="ws">{t.cloudServer}</option>
                <option value="">{t.cloudIgnore}</option>
              </select>
              <small>{t.cloudHelp}</small>
            </label>
          </div>
        </details>

        {#if errorMessage}
          <div class="alert error" role="alert">{errorMessage}</div>
        {/if}

        {#if busy || progress > 0 || statusKey === 'cancelled'}
          <div class="progress-panel" aria-live="polite">
            <div class="progress-copy"><span>{statusText}</span><strong>{Math.round(progress * 100)}%</strong></div>
            <div
              class="progress-track"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={Math.round(progress * 100)}
            >
              <span style={`width: ${Math.round(progress * 100)}%`}></span>
            </div>
          </div>
        {/if}

        <div class="actions">
          <button
            type="button"
            class="primary-button"
            disabled={!selectedFile || busy}
            on:click={convert}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 19h14" /></svg>
            {t.convert}
          </button>
          {#if busy}
            <button type="button" class="secondary-button" on:click={cancelConversion}>{t.cancel}</button>
          {/if}
        </div>

        {#if resultName && downloadURL && statusKey === 'done'}
          <div class="success-message" role="status">
            <span aria-hidden="true">✓</span>
            <div>{t.downloaded} <strong>{resultName}</strong></div>
            <a class="download-again" href={downloadURL} download={resultName}>{t.downloadAgain}</a>
          </div>
        {/if}
      {/if}
    </section>

    <section class="offline-card">
      <div class="offline-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M7 3h8l4 4v14H7zM15 3v4h4M12 10v7m0 0-3-3m3 3 3-3" /></svg>
      </div>
      <div>
        <h2>{isStandalone ? t.standaloneTitle : t.offlineTitle}</h2>
        <p>{isStandalone ? t.standaloneText : t.offlineText}</p>
      </div>
      {#if !isStandalone}
        <a class="secondary-button offline-download" href="./offline/sb-to-html-converter.html" download>
          {t.offlineButton}
        </a>
      {/if}
    </section>

    <section class="info-grid">
      <article>
        <span class="info-icon shield" aria-hidden="true">✓</span>
        <h2>{t.privacyTitle}</h2>
        <p>{t.privacyText}</p>
        {#if !isStandalone}<a href="./privacy.html">{t.privacyLink}</a>{/if}
      </article>
      <article>
        <span class="info-icon" aria-hidden="true">!</span>
        <h2>{t.limitsTitle}</h2>
        <p>{t.limitsText}</p>
      </article>
      <article>
        <span class="info-icon" aria-hidden="true">i</span>
        <h2>{t.rightsTitle}</h2>
        <p>{t.rightsText}</p>
      </article>
    </section>
  </main>

  <footer>
    <div>
      <a href={SOURCE_CODE} target="_blank" rel="noreferrer">{t.sourceCode}</a>
      <span>·</span>
      <a href="https://github.com/TurboWarp/packager" target="_blank" rel="noreferrer">{t.basedOn}</a>
    </div>
    {#if version}<small>{t.versionLabel}: {version}</small>{/if}
  </footer>
</div>

<style>
  :global(*) {
    box-sizing: border-box;
  }
  :global(html) {
    color-scheme: light;
    scroll-behavior: smooth;
  }
  :global(body) {
    margin: 0;
    min-width: 320px;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #172033;
    background: #f4f6fb;
  }
  :global(button), :global(input), :global(select) {
    font: inherit;
  }
  :global(a) {
    color: #4452d9;
  }
  :global(a:focus-visible), :global(button:focus-visible), :global(input:focus-visible), :global(select:focus-visible), :global(summary:focus-visible) {
    outline: 3px solid rgba(88, 101, 242, 0.35);
    outline-offset: 3px;
  }
  .page {
    --primary: #5865f2;
    --primary-dark: #4452d9;
    --primary-soft: #eef0ff;
    --green: #24a866;
    --text: #172033;
    --muted: #667085;
    --surface: #ffffff;
    --surface-soft: #f8f9fc;
    --border: #dfe3ec;
    --shadow: 0 22px 60px rgba(35, 43, 77, 0.12);
    min-height: 100vh;
    background:
      radial-gradient(circle at 9% 4%, rgba(88, 101, 242, 0.12), transparent 30rem),
      radial-gradient(circle at 95% 18%, rgba(36, 168, 102, 0.09), transparent 26rem),
      #f4f6fb;
  }
  .topbar {
    width: min(1120px, calc(100% - 40px));
    margin: 0 auto;
    min-height: 76px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 11px;
    color: var(--text);
    text-decoration: none;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .brand-icon {
    width: 38px;
    height: 38px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    color: white;
    background: linear-gradient(145deg, #6975ff, #4452d9);
    box-shadow: 0 8px 20px rgba(88, 101, 242, 0.26);
  }
  .brand-icon svg {
    width: 24px;
    height: 24px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.65;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .language-switcher {
    display: inline-flex;
    padding: 4px;
    border: 1px solid var(--border);
    border-radius: 11px;
    background: rgba(255, 255, 255, 0.78);
    backdrop-filter: blur(12px);
  }
  .language-switcher button {
    min-width: 42px;
    min-height: 34px;
    padding: 5px 10px;
    border: 0;
    border-radius: 8px;
    color: var(--muted);
    background: transparent;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 800;
  }
  .language-switcher button.active {
    color: white;
    background: var(--primary);
    box-shadow: 0 4px 12px rgba(88, 101, 242, 0.24);
  }
  main {
    width: min(1000px, calc(100% - 40px));
    margin: 0 auto;
  }
  .hero {
    padding: 68px 0 40px;
    text-align: center;
  }
  .local-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid rgba(36, 168, 102, 0.22);
    border-radius: 999px;
    color: #157144;
    background: rgba(225, 248, 237, 0.92);
    font-size: 0.82rem;
    font-weight: 750;
  }
  .local-badge span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 0 4px rgba(36, 168, 102, 0.12);
  }
  h1 {
    max-width: 780px;
    margin: 20px auto 16px;
    color: var(--text);
    font-size: clamp(2.2rem, 6vw, 4.2rem);
    line-height: 1.02;
    letter-spacing: -0.055em;
  }
  .hero-text {
    max-width: 720px;
    margin: 0 auto;
    color: var(--muted);
    font-size: clamp(1rem, 2vw, 1.18rem);
    line-height: 1.7;
  }
  .compatibility-note {
    width: fit-content;
    max-width: 100%;
    margin: 16px auto 0;
    padding: 7px 12px;
    border: 1px solid rgba(88, 101, 242, 0.18);
    border-radius: 999px;
    color: var(--primary-dark);
    background: rgba(238, 240, 255, 0.74);
    font-size: 0.82rem;
    font-weight: 700;
  }
  .steps {
    margin: 42px auto 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    text-align: left;
  }
  .step {
    display: flex;
    gap: 12px;
    padding: 17px;
    border: 1px solid rgba(223, 227, 236, 0.8);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.62);
    backdrop-filter: blur(10px);
  }
  .step-number {
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    color: var(--primary-dark);
    background: var(--primary-soft);
    font-size: 0.82rem;
    font-weight: 850;
  }
  .step div {
    display: grid;
    gap: 4px;
  }
  .step strong {
    font-size: 0.92rem;
  }
  .step span:last-child {
    color: var(--muted);
    font-size: 0.8rem;
    line-height: 1.45;
  }
  .converter-card {
    padding: clamp(22px, 4vw, 38px);
    border: 1px solid rgba(223, 227, 236, 0.92);
    border-radius: 26px;
    background: var(--surface);
    box-shadow: var(--shadow);
  }
  .section-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 24px;
  }
  .section-heading h2 {
    margin: 5px 0 0;
    font-size: 1.65rem;
    letter-spacing: -0.03em;
  }
  .eyebrow {
    color: var(--primary-dark);
    font-size: 0.72rem;
    font-weight: 850;
    letter-spacing: 0.12em;
  }
  .version-pill {
    max-width: 310px;
    overflow: hidden;
    padding: 7px 10px;
    border-radius: 999px;
    color: var(--muted);
    background: var(--surface-soft);
    font-size: 0.72rem;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .drop-zone {
    min-height: 250px;
    padding: 32px 20px;
    border: 2px dashed #c9cede;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text);
    background: linear-gradient(180deg, #fbfbff, #f7f8fd);
    cursor: pointer;
    text-align: center;
    transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;
  }
  .file-input:focus-visible + .drop-zone {
    outline: 3px solid rgba(88, 101, 242, 0.35);
    outline-offset: 3px;
  }
  .drop-zone:hover, .drop-zone.dragging {
    border-color: var(--primary);
    background: var(--primary-soft);
    transform: translateY(-1px);
  }
  .drop-zone.disabled {
    opacity: 0.58;
    cursor: not-allowed;
    transform: none;
  }
  .upload-icon {
    width: 58px;
    height: 58px;
    margin-bottom: 8px;
    display: grid;
    place-items: center;
    border-radius: 18px;
    color: var(--primary);
    background: white;
    box-shadow: 0 10px 30px rgba(88, 101, 242, 0.14);
  }
  .upload-icon svg {
    width: 29px;
    height: 29px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .drop-zone strong {
    font-size: 1.08rem;
  }
  .drop-zone > span:not(.upload-icon) {
    color: var(--muted);
  }
  .drop-zone small {
    margin-top: 7px;
    color: #8b93a7;
  }
  .file-card {
    margin-top: 16px;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 13px;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--surface-soft);
  }
  .file-type {
    flex: 0 0 43px;
    height: 43px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    color: var(--primary-dark);
    background: var(--primary-soft);
    font-size: 0.75rem;
    font-weight: 900;
  }
  .file-details {
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .file-details span, .file-details small {
    color: var(--muted);
    font-size: 0.75rem;
  }
  .file-details strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .text-button {
    margin-left: auto;
    padding: 7px 9px;
    border: 0;
    color: #b42318;
    background: transparent;
    cursor: pointer;
    font-size: 0.82rem;
    font-weight: 750;
  }
  .settings {
    margin-top: 18px;
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }
  .settings.disabled {
    opacity: 0.72;
  }
  .settings.disabled summary {
    pointer-events: none;
  }
  .settings summary {
    min-height: 56px;
    padding: 14px 17px;
    display: flex;
    align-items: center;
    gap: 9px;
    cursor: pointer;
    font-weight: 800;
    list-style-position: inside;
    background: var(--surface-soft);
  }
  .settings summary small {
    padding: 3px 7px;
    border-radius: 999px;
    color: var(--muted);
    background: #e9ecf3;
    font-size: 0.68rem;
    font-weight: 750;
  }
  .settings-content {
    padding: 18px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    border-top: 1px solid var(--border);
  }
  .field {
    display: grid;
    gap: 7px;
    color: var(--text);
    font-size: 0.86rem;
    font-weight: 750;
  }
  .field input, .field select {
    width: 100%;
    min-height: 43px;
    padding: 9px 11px;
    border: 1px solid #cdd2df;
    border-radius: 10px;
    color: var(--text);
    background: white;
  }
  .field small, .toggle-copy small {
    color: var(--muted);
    font-size: 0.74rem;
    font-weight: 450;
    line-height: 1.45;
  }
  .full-width {
    grid-column: 1 / -1;
  }
  .toggle-option {
    min-height: 84px;
    padding: 14px;
    display: flex;
    align-items: flex-start;
    gap: 11px;
    border: 1px solid var(--border);
    border-radius: 13px;
    background: var(--surface-soft);
    cursor: pointer;
  }
  .toggle-option.compact {
    min-height: 58px;
    align-items: center;
  }
  .toggle-option input {
    width: 18px;
    height: 18px;
    margin: 2px 0 0;
    accent-color: var(--primary);
  }
  .toggle-copy {
    display: grid;
    gap: 4px;
  }
  .toggle-copy strong {
    font-size: 0.87rem;
  }
  .alert {
    margin-top: 16px;
    padding: 13px 15px;
    border-radius: 12px;
    font-size: 0.84rem;
    line-height: 1.55;
  }
  .alert.warning {
    border: 1px solid #f0d58b;
    color: #6b4d00;
    background: #fff8df;
  }
  .alert.error {
    border: 1px solid #f1b6b0;
    color: #8f1d14;
    background: #fff1ef;
  }
  .progress-panel {
    margin-top: 18px;
    padding: 14px;
    border-radius: 13px;
    background: var(--surface-soft);
  }
  .progress-copy {
    margin-bottom: 9px;
    display: flex;
    justify-content: space-between;
    gap: 12px;
    color: var(--muted);
    font-size: 0.8rem;
  }
  .progress-copy strong {
    color: var(--text);
  }
  .progress-track {
    height: 8px;
    overflow: hidden;
    border-radius: 999px;
    background: #e1e5ee;
  }
  .progress-track span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, var(--primary), #7b84ff);
    transition: width 180ms ease;
  }
  .actions {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .primary-button, .secondary-button {
    min-height: 46px;
    padding: 11px 17px;
    border-radius: 11px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    cursor: pointer;
    font-weight: 800;
    text-decoration: none;
    transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease;
  }
  .primary-button {
    border: 1px solid var(--primary);
    color: white;
    background: var(--primary);
    box-shadow: 0 10px 22px rgba(88, 101, 242, 0.23);
  }
  .primary-button:hover:not(:disabled) {
    background: var(--primary-dark);
    transform: translateY(-1px);
  }
  .primary-button:disabled {
    border-color: #b8bdcb;
    color: #f3f4f6;
    background: #b8bdcb;
    box-shadow: none;
    cursor: not-allowed;
  }
  .primary-button svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.9;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .secondary-button {
    border: 1px solid var(--border);
    color: var(--text);
    background: white;
  }
  .secondary-button:hover {
    border-color: #bcc2d1;
    background: #f8f9fc;
  }
  .success-message {
    margin-top: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    color: #157144;
    font-size: 0.84rem;
    overflow-wrap: anywhere;
  }
  .download-again {
    margin-left: auto;
    color: var(--primary-dark);
    font-weight: 800;
  }
  .success-message > span {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    color: white;
    background: var(--green);
    font-weight: 900;
  }
  .offline-card {
    margin-top: 22px;
    padding: 25px;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 18px;
    border: 1px solid rgba(88, 101, 242, 0.18);
    border-radius: 20px;
    background: linear-gradient(135deg, #edf0ff, #f9faff);
  }
  .offline-icon {
    width: 52px;
    height: 52px;
    display: grid;
    place-items: center;
    border-radius: 15px;
    color: var(--primary);
    background: white;
  }
  .offline-icon svg {
    width: 28px;
    height: 28px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.7;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .offline-card h2 {
    margin: 0 0 5px;
    font-size: 1.06rem;
  }
  .offline-card p {
    margin: 0;
    color: var(--muted);
    font-size: 0.84rem;
    line-height: 1.55;
  }
  .offline-download {
    white-space: nowrap;
  }
  .info-grid {
    margin-top: 22px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }
  .info-grid article {
    padding: 22px;
    border: 1px solid var(--border);
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.78);
  }
  .info-icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    color: var(--primary-dark);
    background: var(--primary-soft);
    font-weight: 900;
  }
  .info-icon.shield {
    color: #157144;
    background: #e1f8ed;
  }
  .info-grid h2 {
    margin: 14px 0 7px;
    font-size: 1rem;
  }
  .info-grid p {
    margin: 0;
    color: var(--muted);
    font-size: 0.82rem;
    line-height: 1.6;
  }
  .info-grid a {
    display: inline-block;
    margin-top: 10px;
    font-size: 0.78rem;
    font-weight: 750;
  }
  footer {
    width: min(1000px, calc(100% - 40px));
    margin: 0 auto;
    padding: 42px 0 34px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    color: var(--muted);
    font-size: 0.76rem;
  }
  footer div {
    display: flex;
    gap: 9px;
    flex-wrap: wrap;
  }
  footer a {
    color: inherit;
  }

  @media (prefers-color-scheme: dark) {
    :global(html) {
      color-scheme: dark;
    }
    :global(body) {
      color: #ecedf5;
      background: #0d1020;
    }
    :global(a) {
      color: #aeb5ff;
    }
    .page {
      --text: #f1f2f8;
      --muted: #a8aec1;
      --surface: #171b2d;
      --surface-soft: #1d2236;
      --border: #30364d;
      --primary-soft: #252c54;
      --shadow: 0 22px 70px rgba(0, 0, 0, 0.34);
      background:
        radial-gradient(circle at 9% 4%, rgba(88, 101, 242, 0.2), transparent 30rem),
        radial-gradient(circle at 95% 18%, rgba(36, 168, 102, 0.1), transparent 26rem),
        #0d1020;
    }
    .language-switcher, .step, .info-grid article {
      background: rgba(23, 27, 45, 0.78);
    }
    .local-badge {
      color: #81d8ac;
      background: rgba(22, 91, 59, 0.35);
    }
    .compatibility-note {
      border-color: rgba(174, 181, 255, 0.22);
      color: #c8ccff;
      background: rgba(37, 44, 84, 0.64);
    }
    .drop-zone {
      border-color: #3b425c;
      background: linear-gradient(180deg, #1a1f33, #171b2d);
    }
    .drop-zone:hover, .drop-zone.dragging {
      border-color: #7d87ff;
      background: #20264a;
    }
    .upload-icon, .field input, .field select, .secondary-button, .offline-icon {
      color: var(--text);
      background: #20263b;
    }
    .settings summary, .settings-content, .file-card, .progress-panel, .toggle-option {
      background: var(--surface-soft);
    }
    .settings summary small {
      background: #2b3148;
    }
    .alert.warning {
      border-color: #6d5a1c;
      color: #f7d982;
      background: #30290f;
    }
    .alert.error {
      border-color: #71342e;
      color: #ffaaa3;
      background: #351b1a;
    }
    .offline-card {
      border-color: #394274;
      background: linear-gradient(135deg, #20264a, #171b2d);
    }
    .progress-track {
      background: #30364c;
    }
  }

  @media (max-width: 760px) {
    .topbar, main, footer {
      width: min(100% - 24px, 1000px);
    }
    .hero {
      padding-top: 44px;
    }
    .steps, .info-grid {
      grid-template-columns: 1fr;
    }
    .settings-content {
      grid-template-columns: 1fr;
    }
    .full-width {
      grid-column: auto;
    }
    .offline-card {
      grid-template-columns: auto 1fr;
    }
    .offline-download {
      grid-column: 1 / -1;
      width: 100%;
    }
    footer {
      align-items: flex-start;
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    .topbar {
      min-height: 66px;
    }
    .brand > span:last-child {
      display: none;
    }
    h1 {
      font-size: 2.35rem;
    }
    .converter-card {
      padding: 18px;
      border-radius: 20px;
    }
    .section-heading {
      flex-direction: column;
      gap: 10px;
    }
    .version-pill {
      max-width: 100%;
    }
    .drop-zone {
      min-height: 220px;
    }
    .file-card {
      align-items: flex-start;
    }
    .text-button {
      padding-top: 2px;
    }
    .primary-button, .secondary-button {
      width: 100%;
    }
    .offline-card {
      grid-template-columns: 1fr;
    }
  }
</style>
