# SB to HTML Converter

## English

Convert `.sb`, `.sb2`, and `.sb3` project files into a standalone HTML file that can be opened in a modern browser.

**Online version:** [sbtohtml.lepczynski.it](https://sbtohtml.lepczynski.it)

### Use the online converter

1. Open the [online converter](https://sbtohtml.lepczynski.it).
2. Drop an `.sb`, `.sb2`, or `.sb3` file onto the page, or select it from your device.
3. Adjust the optional settings when needed.
4. Convert the project and download the generated HTML file.

The project file is processed locally in the browser and is not uploaded to this application's server.

### Use the converter offline

Download the standalone HTML converter from the [latest GitHub release](https://github.com/lepczynski-cloud/sb-to-html-converter/releases/latest) and open it directly in a current version of Chrome, Edge, Firefox, or Safari.

You can also build it from source.

Requirements:

- Node.js 24 or newer
- Git
- Internet access during the first build

```bash
git clone https://github.com/lepczynski-cloud/sb-to-html-converter.git
cd sb-to-html-converter
npm install
npm run verify
npm run build
```

The standalone converter is generated as:

```text
dist/offline/sb-to-html-converter.html
```

Open that file directly from disk. To run the hosted version locally:

```bash
npm run serve
```

Then open `http://127.0.0.1:8080`.

### Important limitations

- Large projects can exceed the available browser memory, especially on mobile devices.
- Custom extensions may require Internet access during conversion and run without a sandbox in the generated game.
- A generated game may still connect to external services when the original project uses them.
- Compatibility depends on the blocks, extensions, and features used by the project.

Only convert and publish projects for which you have the necessary rights.

### License and attribution

This project is licensed under the [Mozilla Public License 2.0](LICENSE) and is based on [TurboWarp Packager](https://github.com/TurboWarp/packager). See [NOTICE](NOTICE) for attribution.

Scratch is a project of the Scratch Foundation. This repository is independent and is not affiliated with or endorsed by the Scratch Foundation or TurboWarp.

---

## Polski

Konwerter zmienia pliki projektów `.sb`, `.sb2` i `.sb3` w samodzielny plik HTML, który można otworzyć w nowoczesnej przeglądarce.

**Wersja online:** [sbtohtml.lepczynski.it](https://sbtohtml.lepczynski.it)

### Użycie wersji online

1. Otwórz [konwerter online](https://sbtohtml.lepczynski.it).
2. Przeciągnij plik `.sb`, `.sb2` lub `.sb3` na stronę albo wybierz go z urządzenia.
3. W razie potrzeby zmień opcjonalne ustawienia.
4. Uruchom konwersję i pobierz wygenerowany plik HTML.

Plik projektu jest przetwarzany lokalnie w przeglądarce i nie jest wysyłany na serwer tej aplikacji.

### Użycie konwertera offline

Pobierz samodzielny konwerter HTML z [najnowszego wydania na GitHubie](https://github.com/lepczynski-cloud/sb-to-html-converter/releases/latest), a następnie otwórz go bezpośrednio w aktualnej wersji Chrome, Edge, Firefox lub Safari.

Możesz go również zbudować ze źródeł.

Wymagania:

- Node.js 24 lub nowszy
- Git
- dostęp do Internetu podczas pierwszego buildu

```bash
git clone https://github.com/lepczynski-cloud/sb-to-html-converter.git
cd sb-to-html-converter
npm install
npm run verify
npm run build
```

Samodzielny konwerter zostanie utworzony jako:

```text
dist/offline/sb-to-html-converter.html
```

Ten plik można otworzyć bezpośrednio z dysku. Aby uruchomić lokalnie wersję przeznaczoną do hostowania:

```bash
npm run serve
```

Następnie otwórz `http://127.0.0.1:8080`.

### Ważne ograniczenia

- Duże projekty mogą przekroczyć dostępny limit pamięci przeglądarki, szczególnie na telefonach.
- Niestandardowe rozszerzenia mogą wymagać połączenia z Internetem podczas konwersji i działają bez sandboxa w wygenerowanej grze.
- Wygenerowana gra może nadal łączyć się z usługami zewnętrznymi, jeżeli korzysta z nich oryginalny projekt.
- Zgodność zależy od bloków, rozszerzeń i funkcji użytych w projekcie.

Konwertuj i publikuj wyłącznie projekty, do których masz odpowiednie prawa.

### Licencja i informacje o komponentach

Projekt jest udostępniany na licencji [Mozilla Public License 2.0](LICENSE) i wykorzystuje [TurboWarp Packager](https://github.com/TurboWarp/packager). Informacje o autorach i licencjach znajdują się w pliku [NOTICE](NOTICE).

Scratch jest projektem Scratch Foundation. To repozytorium jest niezależne i nie jest powiązane ani oficjalnie wspierane przez Scratch Foundation lub TurboWarp.
