# Brandschutzordnung Studio

Brandschutzordnung Studio ist eine browserbasierte, regelbasierte Anwendung zur strukturierten Erstellung von Brandschutzordnungen **Teil A, Teil B und Teil C** für unterschiedliche Unternehmen, Einrichtungen und Nutzungsarten in Deutschland. Die Anwendung arbeitet ohne künstliche Intelligenz. Projektdaten werden standardmäßig nur im Browser verarbeitet und lokal gespeichert.

## Funktionsumfang

- Teil A als einseitiger A4-Aushang
- Teil B für Personen ohne besondere Brandschutzaufgaben
- Teil C für Personen mit besonderen Brandschutzaufgaben
- feste Kapitelstruktur und objektspezifische Formulierungshilfen
- Auswahl aller 16 Bundesländer ohne voreingestellte Region
- Klassifikation der Nutzungs-/Objektart und Prüfung möglicher Sonderbauanforderungen
- Anwendbarkeitsprüfung über Baugenehmigung, Brandschutzkonzept, behördliche Auflage und Gefährdungsbeurteilung
- branchen- und nutzungsneutrales Gefährdungsprofil, unter anderem für Publikumsverkehr, Betreuung/Pflege, Fremdfirmen, Heißarbeiten, Gefahrstoffe, Ex-Bereiche, Lithium-Ionen-Akkus, brennbare Stäube, Lager, Küchen, PV-, Brandmelde-, Lösch- und Entrauchungsanlagen
- Ersteller-Prüfer-Freigeber-Workflow mit Dokumentnummer, Version, Gültigkeit und Änderungsvermerk
- lokale Autospeicherung sowie Export/Import als `.bso.json`
- regelbasierter Prüfbericht mit direkter Navigation zur Fundstelle
- A4-Druckausgabe über den Browser

## Fach- und Risikoprüfung

Zusätzlich zur formalen Regelprüfung enthält die Anwendung einen internen Qualitätsschritt aus zwei Perspektiven:

### BSB-Fachprüfung

- tatsächliche Nutzung und örtliche Verhältnisse
- Widerspruchsfreiheit zu Genehmigung, Brandschutzkonzept, Alarmplan, Feuerwehrplan sowie Flucht- und Rettungsplänen
- korrekte Zielgruppenabgrenzung für Teil A/B/C
- Alarmierungs-, Räumungs- und Vertretungsorganisation für alle Betriebszeiten
- besondere Personengruppen, Sprache und Barrierefreiheit
- Heißarbeiten, Fremdfirmen, Änderungen und Ausfälle von Brandschutzeinrichtungen
- dokumentierte Entscheidung, ob eine brandschutzbeauftragte Person erforderlich, empfohlen oder nicht erforderlich ist

### Sachschutz und Betriebsunterbrechung

- Brandabschnitte, Abschlüsse und Schadenbegrenzung
- Zündquellen, Brandlasten, Lagerung und Brandstiftung
- Verfügbarkeit und Außerbetriebnahme technischer Brandschutzanlagen
- Feuerwehrzugang, Löschwasserversorgung und Planbereitstellung
- kritische Prozesse, Wiederanlauf und Betriebsunterbrechungsrisiken
- objektspezifische Versichereranforderungen und Risikoberichte

Dieser Prüfschritt ist **kein Bestandteil der DIN-14096-Ausgabe** und erteilt keine Versichererfreigabe. Er dient der Qualitätssicherung und verweist offene bauliche, technische oder organisatorische Punkte in ein separates Maßnahmenmanagement.

## Fachliche Basis

Die Prüflogik und Benutzerführung berücksichtigen insbesondere:

- Arbeitsschutzgesetz, insbesondere §§ 4, 10 und 12
- Arbeitsstättenverordnung, insbesondere §§ 3a und 4 sowie Anhang Nummern 2.2 und 2.3
- ASR A2.2 „Maßnahmen gegen Brände“, Ausgabe Mai 2018, zuletzt geändert GMBl 2025
- ASR A2.3 „Fluchtwege und Notausgänge“
- ASR A1.3 „Sicherheits- und Gesundheitsschutzkennzeichnung“
- ASR V3a.2 „Barrierefreie Gestaltung von Arbeitsstätten“
- DIN 14096:2014-05 „Brandschutzordnung – Regeln für das Erstellen und das Aushängen“
- DIN EN ISO 216 und DIN EN ISO 7010
- Gefahrstoffverordnung und TRGS 800 „Brandschutzmaßnahmen“
- DGUV Informationen 205-001, 205-003 und 205-023
- VdS 2000 „Brandschutz im Betrieb“ als ergänzende Perspektive der Schadenverhütung

Die Anwendung enthält keine vollständige Wiedergabe kostenpflichtiger Norm- oder Richtlinientexte. Maßgeblich bleiben die jeweils aktuelle Fassung, landes- und nutzungsspezifische Vorschriften, Genehmigungsunterlagen, örtliche Anforderungen und konkrete Versicherungsverträge.

## Rechtliche Abgrenzung

Der digitale Regel-Check ist eine strukturierte Vollständigkeits- und Plausibilitätskontrolle. Er ist **keine Zertifizierung, Rechtsberatung, Normkonformitäts- oder Versichererbescheinigung**. Verantwortung und Freigabe verbleiben beim Arbeitgeber bzw. Betreiber. Vor Freigabe sind eine Ortsprüfung, der Abgleich mit den vollständigen Unterlagen und eine fachkundige Prüfung erforderlich.

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

Nach Änderungen in `main` prüft `.github/workflows/pages.yml` die JavaScript-Module und die Regel-Engine. Für die Veröffentlichung muss unter **Settings → Pages → Source** einmalig **GitHub Actions** ausgewählt werden.
