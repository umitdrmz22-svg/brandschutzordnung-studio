# Brandschutzordnung Studio

Brandschutzordnung Studio ist eine vollständig browserbasierte, regelbasierte Anwendung zur strukturierten Erstellung von Brandschutzordnungen **Teil A, Teil B und Teil C**. Die Anwendung arbeitet ohne künstliche Intelligenz. Projektdaten werden standardmäßig nur im Browser verarbeitet und lokal gespeichert.

## Funktionsumfang

- Teil A als einseitiger A4-Aushang mit 10-mm-Rahmen und druckoptimierter Ausgabe
- Teil B für Personen ohne besondere Brandschutzaufgaben
- Teil C für Personen mit besonderen Brandschutzaufgaben
- feste, nicht frei verfälschbare Kapitelstruktur für Teil B und C
- Anwendbarkeitsprüfung über Baugenehmigung, Brandschutzkonzept, behördliche Auflage und Gefährdungsbeurteilung
- Auswahl aller 16 Bundesländer und dokumentierte Prüfung von Landesbau- und Sonderbauvorschriften
- Gefährdungsprofil für u. a. Publikumsverkehr, eingeschränkte Mobilität, Heißarbeiten, Ex-Bereiche, Gefahrstoffe, Ammoniak, Hochregallager, Brandmelde-, Sprinkler-, RWA- und Gaslöschanlagen
- Ersteller-Prüfer-Freigeber-Workflow mit Dokumentnummer, Version, Gültigkeit und Änderungsvermerk
- Warnung bei einem Prüfintervall von mehr als 24 Monaten
- lokale Autospeicherung sowie Export/Import als `.bso.json`
- regelbasierter Prüfbericht mit direkter Navigation zur Fundstelle
- A4-Druckausgabe über den Browser
- automatische Tests der Prüflogik und GitHub-Pages-Deployment

## Fachliche Basis

Die Prüflogik und Benutzerführung berücksichtigen insbesondere:

- Arbeitsschutzgesetz, insbesondere §§ 4, 10 und 12
- Arbeitsstättenverordnung, insbesondere §§ 3a und 4 sowie Anhang Nummern 2.2 und 2.3
- ASR A2.2 „Maßnahmen gegen Brände“, Ausgabe Mai 2018, zuletzt geändert GMBl 2025
- ASR A2.3 „Fluchtwege und Notausgänge“
- ASR A1.3 „Sicherheits- und Gesundheitsschutzkennzeichnung“
- ASR V3a.2 „Barrierefreie Gestaltung von Arbeitsstätten“
- DIN 14096:2014-05 „Brandschutzordnung – Regeln für das Erstellen und das Aushängen“
- DIN EN ISO 216 für Papierformate
- DIN EN ISO 7010 in Verbindung mit ASR A1.3 für Sicherheitszeichen
- Gefahrstoffverordnung, insbesondere Brand- und Explosionsgefährdungen
- DGUV Informationen 205-001, 205-003 und 205-023

Die Anwendung enthält keine vollständige Wiedergabe kostenpflichtiger Normtexte. Nutzer müssen die jeweils aktuelle Normfassung und objektspezifische Anforderungen selbst zugrunde legen.

## Wichtige rechtliche Abgrenzung

Eine Brandschutzordnung ist objektspezifisch. Ob und in welchem Umfang Teil A, B oder C erforderlich ist, kann sich unter anderem aus folgenden Quellen ergeben:

- Landesbau- und Sonderbauordnungsrecht
- Baugenehmigung und Nebenbestimmungen
- Brandschutzkonzept oder Brandschutznachweis
- Gefährdungsbeurteilung
- behördlichen oder feuerwehrtechnischen Vorgaben
- Anforderungen des Sachversicherers

Der digitale Regel-Check ist eine strukturierte Vollständigkeits- und Plausibilitätskontrolle. Er ist **keine Zertifizierung, Rechtsberatung oder Konformitätsbescheinigung**. Vor Freigabe sind eine Ortsprüfung, der Abgleich mit Genehmigungsunterlagen und eine fachkundige Prüfung erforderlich.

## Sicherheitszeichen

Die Vorschau verwendet vereinfachte, beschriftete Symbolfelder. Vor betrieblicher Ausgabe müssen Zeichen und Bedeutung mit ASR A1.3/DIN EN ISO 7010 und der tatsächlichen örtlichen Ausstattung abgeglichen werden. Offizielle Downloadangebote für Sicherheitszeichen stellt beispielsweise die BGHM bereit.

## Lokaler Start

```bash
python3 -m http.server 8080
```

Danach `http://localhost:8080` öffnen.

## Tests

```bash
npm test
```

## Veröffentlichung

Nach dem Merge in `main` testet `.github/workflows/pages.yml` die Prüflogik und veröffentlicht die statische Anwendung über GitHub Pages. In den Repository-Einstellungen muss unter **Pages → Source** die Option **GitHub Actions** ausgewählt sein.
