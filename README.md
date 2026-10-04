# Scratch to HTML Converter

Darmowy, dwujęzyczny konwerter projektów Scratch do samodzielnego pliku HTML.
Konwersja odbywa się lokalnie w przeglądarce. Repozytorium buduje również
pojedynczy plik HTML z całym konwerterem, który można pobrać i uruchamiać z dysku.

Free, bilingual Scratch-to-HTML converter. Conversion runs locally in the
browser, and the same source also produces a single-file offline converter.

## Metadane repozytorium / Repository metadata

**Nazwa / Name:** `scratch-to-html-converter`

**Opis / Description:**

> Free, privacy-friendly Scratch .sb/.sb2/.sb3 to standalone HTML converter. Runs in the browser and as a downloadable offline HTML app.

**Topics:**

`scratch`, `scratch3`, `sb3`, `html`, `converter`, `turbowarp`, `browser`,
`offline`, `privacy`, `static-site`, `cloudflare-workers`, `javascript`

**Licencja / License:** Mozilla Public License 2.0 (`MPL-2.0`)

---

## Polski

### Co potrafi

- konwertuje pliki `.sb`, `.sb2` i `.sb3` do jednego pliku `.html`;
- działa lokalnie w przeglądarce — projekt nie jest wysyłany do serwera aplikacji;
- ma polski i angielski interfejs z zapamiętywaniem wyboru;
- obsługuje przeciąganie pliku oraz klasyczny wybór z dysku;
- pozwala włączyć Turbo, interpolację, autostart, przyciski sterowania i pełny ekran;
- pozwala wybrać sposób działania zmiennych chmurowych;
- buduje wersję online oraz pojedynczy plik konwertera działający offline;
- publikuje nową wersję strony z każdego pushu do `main` przez Cloudflare Workers Builds;
- tworzy trwałe wydania GitHub Release dopiero po dodaniu tagu wersji.

### Dlaczego repozytorium nie używa bezpośrednio pakietu npm w przeglądarce

Pakiet `@turbowarp/packager` jest API dla Node.js i nie jest przeznaczony do
bezpośredniego użycia w kodzie przeglądarkowym. Dlatego build pobiera dokładnie
przypięty tag źródeł TurboWarp Packager, nakłada prosty interfejs z katalogu
`overrides/`, a następnie buduje oficjalny wariant webowy i standalone.

Wersja TurboWarp jest przypięta w `config/upstream.json` jako numer wydania, tag
i pełny SHA commita. Nie zamieniaj jej na `latest`. API i struktura projektu
upstream mogą zmienić się także między wydaniami innymi niż major.

### Szybki start lokalny dla dewelopera

Wymagania:

- Node.js 24 lub nowszy;
- Git;
- dostęp do Internetu podczas pierwszego buildu.

```bash
npm install
npm run verify
npm run build
npm run serve
```

Następnie otwórz:

```text
http://127.0.0.1:8080
```

Wyniki buildu:

```text
dist/index.html
dist/offline/scratch-to-html-converter.html
```

Drugi plik można otworzyć bezpośrednio z dysku. Nie wymaga serwera WWW ani
instalacji Node.js u osoby korzystającej z konwertera.

### Wdrożenie na Cloudflare

Repozytorium jest przygotowane do **Cloudflare Workers Builds** i statycznych
assetów Workers. Dokładna instrukcja znajduje się w
[`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md).

Najważniejsze ustawienia:

```text
Production branch: main
Build command:      npm run build
Deploy command:     npm run deploy
Preview command:    npm run deploy:preview
Root directory:     /
```

Nazwa Workera w panelu Cloudflare musi odpowiadać wartości `name` w
`wrangler.jsonc`, domyślnie `scratch-to-html-converter`.

Każdy push do `main` tworzy nową wersję Cloudflare i od razu wdraża ją na
produkcję. Pozostałe branche mogą otrzymywać wersje podglądowe.

### Wersjonowanie i wydania

Nie twórz GitHub Release przy każdym commicie. Commit jest wersją wdrożenia, ale
nie powinien być trwałym wydaniem dla użytkownika.

Dla zwykłej zmiany:

```bash
git add .
git commit -m "Improve converter interface"
git push
```

Cloudflare zbuduje i wdroży nową wersję. Workflow GitHub Actions zachowa również
krótkoterminowy artefakt z katalogiem `dist`.

Dla publicznego wydania:

```bash
npm version patch
git push --follow-tags
```

Tag `vX.Y.Z` uruchamia workflow, który publikuje GitHub Release z:

- pojedynczym konwerterem offline;
- archiwum ZIP gotowej strony;
- automatycznie wygenerowanymi informacjami o zmianach.

Wersja w tagu musi być taka sama jak `version` w `package.json`.

### Aktualizacja TurboWarp Packager

1. Sprawdź nowe wydanie i jego zmiany.
2. Zmień `tag`, `version` oraz pełny `commit` w `config/upstream.json`.
3. Wykonaj pełny build.
4. Przetestuj co najmniej:
   - prosty projekt Scratch 3;
   - projekt z dźwiękiem;
   - projekt ze zmienną chmurową;
   - projekt z niestandardowym rozszerzeniem;
   - wersję hostowaną i pojedynczy plik offline.
5. Dopiero potem zatwierdź zmianę.

### Ograniczenia

- duże projekty mogą wymagać kilkukrotnie więcej pamięci niż rozmiar pliku
  wejściowego; na telefonach konwersja może zakończyć się błędem;
- niestandardowe rozszerzenia mogą wymagać sieci podczas konwersji;
- wygenerowana gra może używać sieci, jeżeli wybierzesz serwerowe zmienne
  chmurowe albo sam projekt korzysta z usług zewnętrznych;
- zgodność zależy od funkcji i rozszerzeń użytych przez konkretny projekt;
- plik wynikowy zawiera cały projekt i runtime, więc może być znacznie większy
  niż plik `.sb3`.

### Prywatność

Sam plik projektu jest przetwarzany w przeglądarce. Aplikacja nie ma backendu,
kont ani własnej analityki. Szczegóły i granice tej deklaracji opisuje
[`PRIVACY.md`](PRIVACY.md).

### Struktura

```text
config/upstream.json       przypięta wersja TurboWarp Packager
overrides/                 interfejs i branding nakładane na upstream
scripts/build.mjs          powtarzalny build wersji online i offline
static/                    własne statyczne pliki strony
docs/CLOUDFLARE.md         wdrożenie GitHub → Cloudflare
docs/DECISIONS.md          ryzyka, kontrargumenty i odrzucone alternatywy
docs/TESTING.md            macierz testów przed wydaniem
.github/workflows/         CI, artefakty i wydania tagowane
wrangler.jsonc             konfiguracja statycznych assetów Cloudflare
```

---

## English

### Features

- converts `.sb`, `.sb2`, and `.sb3` projects to one `.html` file;
- processes the project locally in the browser;
- provides Polish and English UI with a remembered selection;
- supports drag and drop;
- offers Turbo, interpolation, autoplay, player controls, fullscreen, and cloud-variable settings;
- builds both a hosted site and a single-file offline converter;
- deploys every push to `main` through Cloudflare Workers Builds;
- creates permanent GitHub Releases only for version tags.

### Developer setup

Requirements: Node.js 24+, Git, and Internet access for the first build.

```bash
npm install
npm run verify
npm run build
npm run serve
```

Open `http://127.0.0.1:8080`. The standalone offline converter is generated as
`dist/offline/scratch-to-html-converter.html` and can be opened directly from
disk.

### Cloudflare deployment

Use Cloudflare Workers Builds with:

```text
Production branch: main
Build command:      npm run build
Deploy command:     npm run deploy
Preview command:    npm run deploy:preview
Root directory:     /
```

See [`docs/CLOUDFLARE.md`](docs/CLOUDFLARE.md) for the complete setup. The
architecture trade-offs are documented in [`docs/DECISIONS.md`](docs/DECISIONS.md),
and the release test matrix is in [`docs/TESTING.md`](docs/TESTING.md).

### Releases

A normal push creates a Cloudflare deployment and a temporary GitHub Actions
artifact. A tag creates a durable GitHub Release:

```bash
npm version patch
git push --follow-tags
```

### License and attribution

This repository is licensed under the Mozilla Public License 2.0. It is based on
TurboWarp Packager, which is also MPL-2.0. See [`LICENSE`](LICENSE) and
[`NOTICE`](NOTICE).

Scratch is a project of the Scratch Foundation. This repository is independent
and is not affiliated with or endorsed by the Scratch Foundation or TurboWarp.
Only convert and publish projects for which you have the necessary rights.
