# Brandschutzordnung Studio

Browserbasierter, regelbasierter Ersteller für Brandschutzordnungen Teil A, B und C. Die Anwendung arbeitet ohne künstliche Intelligenz und verarbeitet Projektdaten ausschließlich lokal im Browser.

## Funktionen

- Teil A als kompakter A4-Aushang
- Teil B für Beschäftigte und regelmäßig anwesende Personen
- Teil C für Personen mit besonderen Brandschutzaufgaben
- Stammdaten, Geltungsbereich und betriebliches Gefährdungsprofil
- Dokumentenlenkung mit Dokumentnummer, Version, Ersteller, Prüfer und Freigeber
- Regelbasierter Vollständigkeits- und Plausibilitätscheck
- Lokale Speicherung und portable `.bso.json`-Projektdateien
- Druck- und PDF-Ausgabe über den Browser
- Keine externe Datenübermittlung und keine KI

## Fachliche Grundlage

Die Struktur orientiert sich insbesondere an:

- Arbeitsstättenverordnung, insbesondere § 4 und Anhang 2.2
- ASR A2.2 „Maßnahmen gegen Brände“
- ASR A2.3 „Fluchtwege und Notausgänge“
- ASR A1.3 „Sicherheits- und Gesundheitsschutzkennzeichnung“
- DIN 14096:2014-05 „Brandschutzordnung – Regeln für das Erstellen und das Aushängen“
- einschlägigen DGUV-Informationen zum betrieblichen Brandschutz

Normtexte werden nicht wiedergegeben. Die Anwendung bildet eine eigenständige Eingabe- und Prüflogik ab.

## Rechtlicher Hinweis

Der Regel-Check ist eine strukturierte Vollständigkeits- und Plausibilitätskontrolle. Er stellt keine Zertifizierung oder Konformitätsbescheinigung dar. Die örtliche Situation, das Brandschutzkonzept, Genehmigungsauflagen, bauordnungsrechtliche Anforderungen und betriebliche Gefährdungsbeurteilungen müssen vor Freigabe fachkundig geprüft werden.

## Tests

```bash
node tests/rules.test.js
```

## Lokaler Start

```bash
python3 -m http.server 8080
```
