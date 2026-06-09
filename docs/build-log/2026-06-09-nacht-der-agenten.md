# 2026-06-09 · Die Nacht der Agenten

## 1. Build-Kontext (intern)
- 8 isolierte Agenten (je 1 Datei, Worktree-isoliert) bauten parallel: Compliance-Checker (ALE-30), Roadmap-Generator (ALE-31), Use-Case/Tool (ALE-29), Process-Auditor (ALE-28), PPTX+Excel (ALE-32/33), Deploy-Checkliste (ALE-16), Smoke-Tests (ALE-37). +2.462 Zeilen, verifiziert (PPTX 40,9 KB / Excel 6,8 KB real erzeugt), 10 Issues → Done.
- Showstopper gefunden: `runs/` war in `.gitignore:12` → nie committet → frischer Checkout/Deploy crasht bei `/run/start`. Gefixt (`fbebb14`).
- Strategischer Pivot: Linear kannte nur Stufe 1 (Audit). Gesamtprodukt neu geplant (3 Stufen, 2 Horizonte) + Build-Map (76 Stories) + 48 Issues materialisiert.

## 2. 🔵 LinkedIn-Post (copy-paste-fertig)

Letzte Nacht habe ich 8 KI-Agenten gleichzeitig auf mein eigenes Software-Projekt losgelassen.

Am Morgen: 2.462 Zeilen Code.

Und ein Bug, der mir die komplette Demo zerlegt hätte.

—

Kurz zum Setup, weil das der eigentliche Trick war:

Jeder Agent durfte nur EINE Datei anfassen. In einer isolierten Arbeitskopie.

Kein Agent konnte dem anderen ins Werk pfuschen.

Acht bauten parallel: einen DSGVO-/EU-AI-Act-Checker, einen Roadmap-Generator, die PowerPoint- und Excel-Erzeugung, eine 111-Punkte-Deployment-Checkliste, Tests.

Klingt nach Magie.

War es nicht.

Denn dann kam der Moment, der zählt.

Einer der Agenten meldete: „Eine Datei, die der Code zur Laufzeit braucht, ist im Repo gar nicht vorhanden."

Sie lag auf meinem Rechner — aber war versehentlich vom Versionsverlauf ausgeschlossen.

Heißt: Auf dem Server wäre alles abgestürzt. Beim ersten echten Klick.

Gefunden wurde das nicht, weil die KI so schlau ist.

Sondern weil ich sie gezwungen habe, zu PRÜFEN statt zu raten.

Und genau das ist der Punkt.

KI tippt schneller, als ich es je könnte.

Aber der Skill ist nicht das Tippen.

Der Skill ist zu wissen, WAS geprüft werden muss — und die Maschine es prüfen zu lassen.

Klarheit schlägt Syntax.

P.S.: Beim Aufräumen fiel mir auf, dass mein eigener Projektplan nur die halbe Wahrheit kannte. Also habe ich nachts auch noch das ganze Produkt neu geplant. Aber das ist die Story von morgen.

Lasst ihr KI schon autonom an euren echten Projekten arbeiten — oder traut ihr euch (noch) nicht?

#VibeCoding #BuildInPublic #KI #LearningInPublic

> *(Hashtags: festes Kampagnen-Set übernehmen. Falls ein Link nötig: in den ersten Kommentar.)*

## 3. Was es über Alex zeigt + Visual-Idee
**Zeigt:** Orchestrierung mehrerer KI-Agenten + Engineering-Urteilsvermögen (Verifikation statt Vibe). Genau die Solutions-Engineer-Fähigkeit.
**Visual:** Terminal-/Worktree-Screenshot mit den 8 parallelen Agenten ODER ein Studio-Brand-Carousel „8 Agenten, 1 Nacht, 1 gefundener Showstopper" (Navy/Teal/Magenta, Source Code Pro).
