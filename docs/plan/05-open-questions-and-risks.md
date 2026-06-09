# Offene Fragen & Risiken — AI-Adoption-Studio

> **Dokument-Typ:** BMAD Adversariale Vollständigkeits- & Risiko-Prüfung (Phase 4 — Härtung vor Umsetzung)
> **Projekt:** AI-Adoption-Studio
> **Stand:** 09.06.2026
> **Autor-Kontext:** Alex Heyers · Vibe Coding Bootcamp (Digitale Leute School, Kohorte 05/26)
> **Horizonte:** **H1** = Portfolio-Demo bis Final-Pitch 21.07.2026 · **H2** = kommerzielles SaaS-Produkt danach
> **Prüfgegenstand (real gelesen):** `docs/plan/01-product-brief.md`, `docs/plan/02-prd.md`, `docs/plan/03-architecture.md`, `docs/plan/04-epics-and-stories.md`
> **Lesart:** Dies ist eine bewusst feindselige Prüfung durch die Brille eines skeptischen Lead-Architekten + Product-Owners. Ziel ist nicht, die Pläne zu loben, sondern ihre Bruchstellen zu finden, bevor die Zeit es tut. Jeder offene Punkt endet mit einer **dokumentierten Entscheidungs-Vorlage inkl. Empfehlung** — keine Rückfragen, da Alex aktuell keine Fragen beantwortet.

---

## Vorbemerkung — Methodik dieser Prüfung

Die vier Plan-Dokumente sind handwerklich stark, intern konsistent benannt und diszipliniert nach Horizont getrennt. Genau das ist die Gefahr: Sie lesen sich so geschlossen, dass die wenigen echten Risse leicht übersehen werden. Diese Prüfung sucht deshalb gezielt nach (a) Widersprüchen **zwischen** den Dokumenten, (b) Annahmen, die als Fakt verkauft werden, ohne im Code verifiziert worden zu sein, (c) Zeit-Mathematik für H1, die nicht aufgeht, (d) Stellen, an denen Stufe 2/3 zwar benannt, aber nicht umsetzbar spezifiziert ist, (e) unterschätzten rechtlichen/technischen Risiken und (f) ganzen Themen, die in keinem der vier Dokumente vorkommen.

Wo ich „unbelegt" schreibe, meine ich: Die Aussage steht in den Plänen als gegeben, aber kein gelesener Code-Beleg im Dokument stützt sie zweifelsfrei — sie ist ein zu verifizierendes Versprechen, kein Faktum.

---

## 1. Widersprüche zwischen den Dokumenten

**W1 — Anzahl Linear-Issues: 46 vs. 50.** Der Product-Brief (Z. 8, 40) und der Arbeitsauftrag sprechen von **46** bestehenden Linear-Issues; das Epics-Dokument (Z. 9, Z. 18) arbeitet durchgehend mit **50** (ALE-1…ALE-50). Beide können nicht gleichzeitig die Wahrheit sein. Wahrscheinlich ist 50 die aktuellere Zählung (inkl. ALE-1…4 Onboarding-Defaults + ALE-47/48), 46 die ältere. Folge: Jede Kapazitätsrechnung, die auf der Issue-Zahl fußt, startet auf wackeligem Boden. *(Niedrige Schwere, aber symptomatisch: Die Pläne wurden zu verschiedenen Zeitpunkten gegen verschiedene Linear-Stände geschrieben.)*

**W2 — Agenten-Zählung „7 Agenten" ist inkonsistent zur Aufzählung.** Brief und PRD sprechen wiederholt von **7 Analyse-Agenten**. Tatsächlich listet die Architektur (Z. 91) sieben Kern-Agenten *plus* drei vorgelagerte (`web_research`, `pre_audit_analyst`, `document_analyst`) — und FR-3/FR-4/FR-16 fordern diese drei als MUSS. Der Reporter ist je nach Zählung der 7. oder ein achter. Real sind es eher **10 Agenten**. Der Brief sagt zudem „4 volle / 2 funktionale / 2 Stub-Agenten" (Z. 40) — das sind **8**, nicht 7. Die Zahl „7" ist ein Marketing-Rundungswert, der sich durch alle Dokumente zieht und im Pitch zur Angriffsfläche wird, sobald jemand mitzählt. **Direkte Kollision mit NFR-8 (keine geschönten Zahlen).**

**W3 — Fragepool-Größe: 105 vs. 30 vs. „10–15 selektiert".** Brief (Z. 50, 106) nennt „im Code aktuell 105 Fragen". Epics (Z. 68, ALE-20) nennt „30 MVP-Fragen". FR-5 fordert „10–15 dynamisch selektiert". Das sind drei verschiedene Zahlen für dasselbe Artefakt. Möglicherweise: 105 im Master-Pool, davon 30 MVP-tauglich kuratiert, davon 10–15 pro Run selektiert — aber das steht so nirgends explizit, und der Brief verkauft die 105 als USP-Beleg. Risiko: Im Pitch wird „105 Fragen" gesagt, im Code liegen 30 — NFR-8-Verstoß.

**W4 — `ROIOutput` ↔ falsches Linear-Issue.** Epics EPIC-3, Story 4 (Z. 91) mappt den ROI-Calculator (`ROIOutput`, FR-9) auf **ALE-33** — aber ALE-33 ist laut derselben Issue-Liste (Z. 85) die **Excel-Generierung**. Der ROI-Calculator hat in der Liste gar kein eigenes Issue. Das ist ein echter Mapping-Fehler, der bedeutet: **FR-9 (ROI) hat möglicherweise kein Linear-Issue** und fällt bei der Sprint-Planung durchs Raster.

**W5 — „n8n läuft (nicht) im Compose".** Der Brief impliziert n8n als Teil der Stack-Infrastruktur (Z. 64 „self-hosted n8n auf dem VPS"); die Architektur korrigiert das explizit (Z. 108, 293): „`docker-compose.yml` enthält nur `api`+`web` — n8n läuft NICHT im Compose". Das ist sauber aufgelöst — aber nur, weil die Architektur den Brief korrigiert. Wer nur den Brief liest, baut auf einer falschen Annahme. *(Gelöst, aber dokumentiere die Auflösung als verbindlich.)*

**W6 — Milestone-Targets driften.** Brief: P5 = „Polish/Pitch". PRD: P6 „~21.06.–14.07.". Epics-Tabelle (Z. 314–316): P5-Target **20.07.**, P6 „parallel zu P4/P5", P4-Target **14.07.**. Der Final-Pitch ist der **21.07.** Damit liegt P5 (Polish) einen Tag vor dem Pitch und P6 (der gesamte neue Stufe-2/3-Block) endet zeitgleich mit P4. Es gibt **keinen Puffer** zwischen „alles fertig" und „Pitch". Siehe H1-Zeitrahmen-Risiken.

**W7 — „immutable" vs. „versioniert" bei `system_landscapes`.** Architektur (Z. 247) und FR-25 nennen die Tabelle „versioniert pro Run, **immutable**". Gleichzeitig fordert EPIC-9/FR-26 einen „Re-Design-Loop", der „eine neue Landschafts-Version erzeugt". Das ist nicht zwingend ein Widerspruch (neue Version = neue immutable Zeile), aber der Plan definiert nirgends das Versionierungs-Schlüssel-Modell (ist `version` pro `run_id` oder pro `company_id`?). Bei H2-Umsetzung führt diese Unschärfe direkt zu einer Daten-Modell-Diskussion, die jetzt billiger zu führen wäre.

---

## 2. Unbelegte Annahmen

**U1 — A1 (SDK-additiv) ist das Fundament von Stufe 2, aber unverifiziert.** Brief A1, PRD A1, Architektur AO-3 und EPIC-5/Story-1 sagen alle dasselbe: „Der `system_architect` lässt sich additiv in 3 Schritten via `agent_patterns` einhängen — zu verifizieren." Das gesamte Argument „Stufe 2 ist risikoarm" hängt an dieser einen unbestätigten Annahme. Kein Dokument zeigt einen tatsächlich durchgeführten Smoke-Test. Wenn A1 fällt (z.B. weil der SDK-Pfad `output_model`-Schemas nicht frei zulässt oder der `context`-Durchgriff auf den `FullReport` nicht so funktioniert wie angenommen), kippt der „additiv, nicht invasiv"-Leitsatz und Stufe 2 wird zum Core-Eingriff mitten in der heißen Phase. **Höchste Hebelwirkung aller Annahmen.**

**U2 — A2 (n8n-MCP gegen VPS aus dieser Umgebung) ist der Single Point of Failure von Stufe 3.** Der gesamte „BAUEN"-Beweis (EPIC-7, FR-27, das stärkste Pitch-Argument) steht und fällt damit, dass `n8n_create_workflow`/`n8n_deploy_template` aus der Demo-Umgebung die VPS-n8n-Instanz wirklich erreichen und beschreiben können. Memory-Stand: Die VPS-SSH-Anbindung ist „noch einzurichten" (globale CLAUDE.md §6), die Bridge läuft über einen n8n-Webhook. Es ist **nicht belegt**, dass der MCP-Server gegen genau diese Instanz authentifiziert schreiben darf. Der Fallback („lokale n8n-Sandbox", Architektur Z. 221) ist genannt, aber nicht spezifiziert — woher kommt die lokale n8n-Instanz, ist sie installiert, läuft sie im Compose (nein, siehe W5)? Der Fallback ist heute selbst Vaporware.

**U3 — „Ist→Ziel-Graph fast geschenkt".** Brief (Z. 18, 114) und Architektur (Z. 114) behaupten wiederholt, der Delta-Graph komme „fast geschenkt" aus vorhandenen Daten. Das ist Wunschdenken: Zwischen `ToolRecommendation.required_integrations` (eine Freitext-/Listen-Empfehlung pro Use-Case) und einem **konfliktfreien, deduplizierten, validierten** Ziel-Graphen liegt genau die schwierige Arbeit (Konfliktauflösung „zwei PMS", Konnektor-Lücken-Detektion, mechanism-Belegung gegen den noch nicht existierenden `integration_catalog.yaml`). „Geschenkt" ist nur die Daten-Verfügbarkeit, nicht die Verdichtung. Die L-Größe von EPIC-5/Story-4 widerspricht dem „geschenkt"-Narrativ implizit selbst.

**U4 — `required_integrations`/`data_flow` enthalten verwertbare Struktur.** Stufe 2 baut komplett darauf, dass diese drei Felder (`schemas/outputs.py` Z. 145–147) maschinell zu Kanten verdichtbar sind. Kein Dokument zeigt ein Beispiel eines real befüllten `ToolRecommendation`-Objekts. Sind das strukturierte Referenzen (Tool-IDs) oder LLM-Freitext („sollte mit dem PMS verbunden werden")? Bei Freitext braucht der `system_architect` einen Entity-Resolution-Schritt (Tool-Name → Knoten-ID), der nirgends modelliert ist. **Diese Annahme ist die stillste und gefährlichste**, weil sie wie eine Code-Tatsache aussieht, aber eine Daten-Qualitäts-Wette ist.

**U5 — Anthropic-Tier-1-Budget trägt einen 8–10-Agenten-Run inkl. neuem Agenten.** NFR-4/NFR-6 versichern, die Pipeline laufe im Tier-1-Budget mit `MAX_TOKENS=20000` und 8s-Pause. Stufe 2 fügt mindestens einen weiteren großen Agenten hinzu (`system_architect`, der den **kompletten** `FullReport` als Input konsumiert — also den größten Context-Payload der Pipeline). Niemand hat den Token-/Kosten-/Laufzeit-Effekt gerechnet. Ein serieller 10-Agenten-Run mit 8s-Pausen ist bereits **>80s reine Pause** plus LLM-Latenz — die „läuft zuverlässig in der Demo"-Zusage (NFR-4) ist gegen einen Live-Pitch (Netzwerk, Rate-Limits, ElevenLabs-Latenz) nicht stresstest-belegt.

**U6 — Die Three.js-`System-Map/` ist wiederverwendbar als datengetriebener Ist→Ziel-Renderer.** EPIC-6 und Architektur (Z. 183) setzen „Reuse `System-Map/`" als gegeben. Aber die bestehende System-Map ist laut Memory eine **hartcodierte** Galaxie des Gesamtsystems (Claude-Style, 48 n8n-Satelliten inline). Sie aus beliebigem `SystemLandscape`-JSON zu speisen, mit Ist-links/Ziel-rechts-Split-View, ist ein **Umbau**, kein Reuse. Die S-Größe von EPIC-6/Story-2/3 unterschätzt das; Story-1 (L) ahnt es. Die Annahme „Reuse > Integration" (AO-1) verschleiert, dass „Reuse" hier „erheblich refactoren" bedeutet.

**U7 — `claude-sonnet-4-6` ist das richtige/aktuelle Modell.** Architektur Z. 295 will es „beibehalten, kein Modellwechsel-Risiko". Der Modell-Identifier `claude-sonnet-4-6` ist ungewöhnlich — falls das ein Tippfehler oder ein nicht mehr aktueller Alias ist, scheitert die Pipeline beim ersten Run. Vor dem Pitch ist ein Modell-Verfügbarkeits-Check Pflicht; „kein Wechsel-Risiko" ist nur wahr, solange der String real auflösbar ist. *(Aus LLM-Provider-Sicht: Modell-IDs niemals aus dem Gedächtnis annehmen — gegen die API verifizieren.)*

---

## 3. H1-Zeitrahmen-Risiken (Pitch 21.07.)

**Z1 — Der gesamte Stufe-2/3-Block (EPIC-4 bis EPIC-7) ist komplett NEU und läuft parallel zu noch unfertiger Stufe 1.** Harte Faktenlage aus den Plänen: Milestone P3 (Voice) = **3%**, P4 (Multi-Agent) = **17%**, P5 (Polish) = **4%**. Die *bestehende* Stufe-1-Welt ist also weit von fertig entfernt — und genau darauf setzt Stufe 2 datentechnisch auf. P6 (EPIC-4–7) soll „parallel" laufen, aber EPIC-5 **braucht** die fertigen Outputs aus EPIC-3 (Z. 327: „braucht EPIC-4 + die Stufe-1-Outputs aus EPIC-3"). Parallelität ist hier eine Illusion: Stufe 2 kann erst stabil gebaut werden, wenn Stufe 1 stabile Outputs liefert. Bei 17% P4-Fortschritt ist das ein **sequenzieller, nicht paralleler** Pfad.

**Z2 — Story-Punkte-Summe vs. verfügbare Kalenderzeit.** Grobe Zählung der NEU-Stories allein in EPIC-4–7: ca. 2×L + 8×M + ~12×S. Bei den Plan-eigenen Schätzungen (L≈3–8 Tage, M≈1–3, S≈≤1) ergibt das im **optimistischen** Fall ~25, im pessimistischen ~55 Personentage — für **eine** Person (Alex), die **parallel** noch EPIC-2 (Voice, der „größte offene Brocken", L-lastig) und EPIC-3 fertigstellen muss, plus Bewerbungen schreibt (Career-Strategie, Deadline 30.07.), plus Vater eines Kleinkinds ist. Zwischen 09.06. und 21.07. liegen **~42 Kalendertage**. Die Mathematik geht nur auf, wenn (a) fast nichts schiefgeht und (b) Stufe 1 quasi schon fertig wäre — beides ist nicht der Fall. **Dies ist das schwerwiegendste H1-Risiko und wird in keinem Dokument quantitativ adressiert** (R6 nennt es, entschärft es aber nur qualitativ mit „Scope begrenzen").

**Z3 — Kein Zeitpuffer, kein definierter Demo-Freeze.** Pitch 21.07., P5/P6 enden 20./14.07. Es gibt keinen explizit benannten **Code-Freeze + Generalprobe-Tag**. Eine Live-Demo mit Voice (ElevenLabs-Latenz), Multi-Agent-Run (LLM-Latenz, Rate-Limits) und Live-n8n-Deploy (Netzwerk zum VPS) hat drei unabhängige Live-Failure-Modi auf der Bühne. Ohne mindestens einen vollständigen Trockenlauf-Tag + einen aufgezeichneten Fallback-Mitschnitt ist das Bühnen-Risiko hoch.

**Z4 — Voice (EPIC-2) ist H1-kritisch, L-lastig und bei 3%.** Der USP der gesamten Demo ist das Ada-Voice-Interview. EPIC-2 enthält zwei L-Stories (Ada-Production-Config, UI-end-to-end) und sechs M-Stories, fast alle „Backlog". ElevenLabs-Conversational-AI mit Function-Calling, dynamischer Fragenselektion und Webhook-Transkript-Handling ist erfahrungsgemäß integrations-zickig. Wenn Voice am 21.07. nicht steht, bricht der differenzierende Aufhänger weg — und das ist **nicht** durch Stufe 2/3 kompensierbar.

**Z5 — Die „1 Teaser-Flow"-Untergrenze ist selbst nicht trivial.** EPIC-7 wirkt klein (1 Flow), aber enthält: A2-Smoke-Test (unverifiziert, U2), ein **neues** `builders/n8n_compiler.py` (L), Integritäts-Gate, Pre-Deploy-grep auf generiertem JSON. Ein deterministischer Compiler, der aus einem Blueprint *valides* n8n-JSON erzeugt, das `n8n_validate_workflow` besteht **und** auf der VPS deployt **und** lauffähig ist, ist realistisch 3–5 Tage inkl. Debugging — vorausgesetzt U2 hält. Fällt U2, ist EPIC-7 nicht in H1 machbar und Stufe 3 sinkt von „angedeutet/teil-real" auf „nur Slide" — was NFR-8 (Ehrlichkeit) zwingt, es im Pitch entsprechend zu degradieren.

---

## 4. Vage Stellen (Stufe 2 / Stufe 3 noch nicht umsetzbar genug)

**V1 — Konfliktauflösung des `system_architect` ist nur durch Beispiel definiert, nicht durch Regeln.** FR-20 und EPIC-5/Story-4 fordern „Integrations-Konflikte auflösen (z.B. zwei empfohlene PMS → einer gewinnt)". *Wie* der eine gewinnt (Kosten? EU-Hosting? Quick-Win? Tier?) ist nirgends als Entscheidungsregel spezifiziert. Überlässt man das dem LLM, ist das Ergebnis nicht-deterministisch und im Pitch nicht erklärbar („warum hat das System Tool A gegen B gewählt?"). Ohne explizite Tie-Break-Regeln ist EPIC-5 nicht testbar (AC-2 prüft nur *dass* ein Status gesetzt ist, nicht *ob die Wahl korrekt ist*).

**V2 — `integration_catalog.yaml` ist als Konzept beschrieben, aber sein Inhalt/Umfang/Pflege ist unbestimmt.** Dieser Katalog ist laut Architektur die „Wahrheitsquelle für jede Kanten-`mechanism`" und damit das Fundament des Integritäts-Guardrails (das Pitch-rettende Feature). Trotzdem: Welche Vendoren müssen drin sein, damit der Mock-Hotel-Fall vollständig belegbar ist? AO-5 fragt nur „handkuratiert vs. generiert", nicht „welche N Einträge minimal". Ohne definierten Minimal-Katalog fällt im Demo-Lauf jede zweite Kante auf `mechanism="manual"` + Finding zurück — der Ziel-Graph sieht dann „kaputt" statt „beeindruckend" aus. **Der Guardrail kann das Demo-Artefakt sabotieren, das er schützen soll.**

**V3 — Stufe-3-„Teaser-Pattern" ist nicht festgelegt.** Durchgängig wird „z.B. Reservierungs-Mail → PMS-Eintrag" genannt — immer als Beispiel, nie als Festlegung. Welches Pattern es real wird, hängt von U2 (welches Ziel ist sandbox-fähig?) und U4 (welche Automation kommt belegbar aus den Daten?) ab. Solange das Teaser-Pattern nicht **fixiert** ist, kann `builders/n8n_compiler.py` (EPIC-7/Story-3, L) nicht begonnen werden — der Compiler ist deterministisch *für genau dieses eine Pattern* (Architektur Z. 218). Das ist ein versteckter Blocker auf dem kritischen Pfad.

**V4 — `automations[]` deklarativ in H1, kompilierbar in H2 — der Übergang ist unspezifiziert.** OQ-4/AO-4 lassen offen, ob H1 ein „compiler-vorbereitendes Schema-Feld" einführt. Konsequenz, wenn nein: Der H2-Voll-Compiler (FR-29) muss das `AutomationBlueprint`-Schema nachträglich erweitern → Schema-Bruch zwischen H1-JSONB und H2-Tabellen. Die Empfehlung „deklarativ reicht" optimiert H1-Tempo auf Kosten von H2-Migrationsschmerz, ohne diesen Trade-off zu beziffern.

**V5 — „Branchenagnostik" wird behauptet, aber die Hospitality-Kopplung ist tiefer als zugegeben.** Brief R7 räumt ein, dass die Stufe-1-Audit-Schicht „Hospitality-DNA-durchtränkt" ist (PMS/POS/Channel-Manager/TSE, Hotel-Enums). Die These „Graph-Abstraktion ist domänenfrei, nur Vendor-Pack + Fragepool tauschen" (FR-34) ist für Stufe 2/3 plausibel, aber **die Stufe-1-Schemas** (`HospitalityKPIs`, hotel-spezifische Enums in `briefing.py`/`outputs.py`) sind es nicht. Ein zweites Branchen-Pack (EPIC-12) müsste auch diese Schemas generalisieren — das ist mehr als „neues YAML". Die Agnostik-These ist für H2 **optimistisch unterschätzt** und wird beim ersten echten Retail-Versuch teurer als geplant.

**V6 — `narrative` in Trevor-Noah-Voice ist ein qualitatives Akzeptanzkriterium ohne Testbarkeit.** `SystemLandscape.narrative` und mehrere Stories fordern „Trevor-Noah-Voice". Es gibt keine operationalisierbare Definition oder Prüf-Rubrik. Im BMAD-Sinn ist das ein nicht-verifizierbares AC — entweder rausnehmen oder mit 2–3 Beispiel-Sätzen + Negativ-Beispielen ankern.

---

## 5. Technische & rechtliche Risiken (teilweise unterschätzt)

**T1 — DSGVO: Die Voice-Verarbeitung über ElevenLabs ist der größte ungelöste Daten-Transfer.** NFR-2 fokussiert auf „EU-Hosting der Vendoren" und Kanten-Flags. Aber die **Voice-Pipeline selbst** (Ada/ElevenLabs) verarbeitet potenziell personenbezogene Sprachdaten (Stimme = biometrisch nahe, Inhalt = Geschäftsgeheimnisse) — und ElevenLabs-Hosting/AVV ist in keinem Dokument geprüft. Für die H1-Demo gegen ein Mock-Hotel ist das tolerierbar; für H2 mit echten Kundendaten ist es ein **blockierendes** Compliance-Thema, das heute gar nicht im Schema steht. Stimm-Aufnahmen können zudem unter Art. 9 DSGVO (besondere Kategorien) fallen.

**T2 — AI-Act: Das Studio gibt geschäftskritische Empfehlungen — Einordnung des eigenen Systems fehlt.** NFR-3 fordert eine AI-Act-Risikoklasse **pro Use-Case** (Output). Niemand klassifiziert das **Studio selbst**. Ein System, das automatisiert Investitions-/ROI-/Organisations-Empfehlungen erzeugt, könnte je nach Auslegung über „minimal risk" liegen, sobald es in HR-nahe oder bonitätsnahe Kontexte hineinempfiehlt. Der Disclaimer „ersetzt keine Rechtsberatung" deckt das **eigene** Produkt-Risiko nicht ab. Für H1 (Demo) irrelevant, für H2 ein offenes Tor.

**T3 — Generiertes-und-deploytes n8n-JSON ist eine Remote-Code-Ausführungs-Fläche.** Stufe 3 generiert per LLM Workflow-JSON und deployt es auf eine **live** VPS-n8n-Instanz. Ein halluziniertes oder (in H2, mit echten Credentials) bösartig promptbares JSON kann auf dem VPS reale Aktionen auslösen. Der Plan nennt nur einen Pre-Deploy-grep auf Marken-/falscher Wohnort-Begriffe (NFR-9) — das ist eine **String-Prüfung, keine Sicherheits-Validierung**. `n8n_validate_workflow` prüft Schema-Validität, nicht Harmlosigkeit. In H2 mit dem Credential-Vault wird das zu einer ernsten Injection-/Privilege-Fläche, die im Sicherheitskonzept fehlt.

**T4 — Service-Role-Key umgeht RLS — der einzige Schutz ist Backend-Disziplin.** Architektur Z. 100/279 sagt offen: Das Backend umgeht RLS „gezielt über den Service-Role-Key". Damit ist RLS **kein** Schutz gegen einen Bug in der Backend-Autorisierungslogik (jeder Endpoint, der `company_id` nicht streng gegen `auth.uid()` prüft, leakt über alle Tenants). FR-33/NFR-1 verkaufen RLS als Isolations-Garantie; faktisch ist die Garantie nur so stark wie die manuelle Ownership-Prüfung in jedem einzelnen Router. Das Security-Audit (ALE-40, EPIC-8/Story-5) muss genau das zum Schwerpunkt machen — heute ist es nur eine generische „Backlog"-Story.

**T5 — Single-Run-BackgroundTasks: Ein Crash mitten im Run hinterlässt einen Zombie.** NFR-4 akzeptiert FastAPI-BackgroundTasks für H1. Aber: Stürzt der Worker/Prozess während eines 10-Agenten-Runs ab (OOM, Deploy, VPS-Neustart), bleibt `runs.status` auf `in_progress` hängen — es gibt keinen beschriebenen Recovery-/Timeout-/Reaper-Mechanismus. Für eine Live-Demo ist „hängender Run kurz vor dem Pitch" ein realer Show-Stopper. Ein simpler Run-Timeout + Status-Reset wäre H1-billig und fehlt.

**T6 — Idempotenz & Doppel-Deploy beim n8n-Teaser.** Wenn der Operator den Teaser im Pitch zweimal auslöst (Nervosität, Netzwerk-Retry), entstehen zwei Workflows auf dem VPS oder ein Konflikt. `n8n_create_workflow` ist nicht erkennbar idempotent. Kleines Risiko, große Bühnen-Peinlichkeit.

**T7 — Kosten-Transparenz misst, begrenzt aber nicht.** NFR-6 verlangt Token-Nachverfolgbarkeit, aber **kein Budget-Limit/Circuit-Breaker**. Ein Agent in einer Schleife (oder ein zu großer `FullReport`-Context für den `system_architect`) kann das Tier-1-Budget in einem Lauf sprengen, ohne dass etwas stoppt. Bei <3 Monaten Runway ist ein fehlender Kosten-Stopp ein reales Geschäftsrisiko, kein nur-technisches.

---

## 6. Lücken (Themen, die in keinem der vier Dokumente vorkommen)

**L-G1 — Billing/Pricing/Metering ist ein einzeiliger Stub (FR-36).** Für H2 „zahlende Kunden" ist Billing der **umsatztragende** Teil — und er ist mit einem Satz abgehandelt. Keine Preis-Logik, kein Provider (Stripe?), kein Plan-Modell, keine Metering-Einheit (pro Run? pro Tenant? pro deploytem Flow?). Für ein Projekt, dessen H2-Daseinszweck „zahlende Kunden" ist, ist das die größte inhaltliche Lücke.

**L-G2 — Onboarding-at-Scale / Self-Service-Signup fehlt.** Journey J2 beginnt mit „Kunde registriert sich, Tenant wird provisioniert" — aber Tenant-Provisioning, E-Mail-Verifikation, Plan-Auswahl, Self-Service-Onboarding-Flow sind nirgends modelliert. Heute existiert nur Magic-Link (ALE-14, „Todo"). Multi-Tenant-Signup ist ein eigenes Epic-Volumen, das in EPIC-11 unter „Multi-Tenant" verschwindet.

**L-G3 — Tool-Katalog-Pflege & Vendor-Daten-Veralterung (operativer Dauerlauf).** `vendor_landscape.yaml`, `hospitality_tools_db.yaml` (490 KB!) und der neue `integration_catalog.yaml` sind **lebende Daten**: Preise ändern sich, APIs deprecaten, Vendoren verschwinden. Es gibt keinen Pflege-Prozess, keinen „Stand"-Mechanismus, kein Veralterungs-Flag. Ein KI-Adoptions-Tool, das veraltete Preise/Integrationen empfiehlt, verliert genau die Senior-Glaubwürdigkeit, die der Plan beschwört. **Reine H2-Lücke, aber sie untergräbt den Kern-USP.**

**L-G4 — Konnektor-Wartung & API-Drift (H2).** ≥20 echte Konnektoren (FR-30) bedeuten ≥20 fremde APIs, die sich unabhängig versionieren, Auth-Flows ändern, Rate-Limits anpassen. Der Plan modelliert das Bauen der Konnektoren, nicht ihre **Wartung** — der eigentliche Dauer-Kostenträger jeder iPaaS-artigen Plattform. Ohne Wartungs-/Health-Check-Strategie ist die Konnektor-Bibliothek nach 6 Monaten teilweise tot.

**L-G5 — Fehlerbehandlung/Teil-Ergebnisse, wenn ein Agent in der Kette scheitert.** Was passiert, wenn Agent 4 von 10 einen ungültigen Output liefert? Bricht der ganze Run? Läuft er degradiert weiter? Der `Reporter` aggregiert — aber über Lücken? Kein Dokument beschreibt das Verhalten bei Teil-Fehlern. Für eine Live-Demo ist „Agent 6 failt, ganze Pipeline rot" ein vermeidbarer Show-Stopper, der eine simple Per-Agent-Fallback-Strategie bräuchte.

**L-G6 — Datenschutz-Lösch-/Aufbewahrungs-Konzept (DSGVO-Betroffenenrechte).** Hochgeladene Firmendokumente, Voice-Transkripte, Reports liegen in Supabase-Storage/DB. Kein Aufbewahrungs-, Lösch- oder Export-Konzept (Art. 15/17 DSGVO). H1-Demo: egal. H2: gesetzlich verpflichtend und im Schema nicht vorgesehen.

**L-G7 — Beobachtbarkeit/Logging des Live-Systems.** Kein Wort zu strukturiertem Logging, Error-Tracking (Sentry o.ä.), Alerting. EPIC-11 nennt „Production-Deployment + Monitoring" als M-Story — das ist für einen mandantenfähigen SaaS, der live Kunden-Workflows deployt, deutlich unterdimensioniert.

**L-G8 — Test-Strategie jenseits eines E2E-Smoke-Tests.** Es gibt genau eine Test-Story (ALE-37, Smoke-Test gegen Mock-Hotel). Für den deterministischen Integritäts-Pass (FR-21) — das No-Fake-Herzstück — gibt es **keine** Unit-Test-Forderung. Genau dieser Pass *muss* aber beweisbar korrekt sein, sonst ist die Ehrlichkeits-Garantie selbst unbelegt. Ironie: Das Feature, das Halluzination verhindern soll, ist selbst ungetestet spezifiziert.

**L-G9 — Kein Rollback-/Cleanup für deployte n8n-Flows.** Stufe 3 deployt Flows. Es gibt kein „undeploy"/Cleanup nach der Demo. Nach mehreren Trockenläufen sammelt die VPS-n8n-Instanz Test-Flows an — operativer Müll, und in H2 (echte Flows) ein Lifecycle-Management-Loch.

---

## 7. Priorisierte offene Entscheidungen für Alex (Top 5)

> Format pro Punkt: **Entscheidung · Empfehlung (1 Satz).** Bewusst als Vorlage mit Default formuliert, nicht als Rückfrage — die Empfehlung gilt, bis Alex aktiv widerspricht.

**D1 — A1 & A2 sofort smoke-testen, bevor irgendeine P6-Story beginnt (U1, U2, Z1).**
*Empfehlung:* Diese Woche je einen 1-Stunden-Spike fahren (`system_architect`-Dummy via `agent_patterns` registrieren + einen Trivial-n8n-Flow gegen die VPS deployen) — fällt einer, wird der ganze H1-Stufe-2/3-Plan **jetzt** umgeplant, nicht im Juli.

**D2 — Stufe 3 ehrlich von „teil-real" auf „angedeutet/aufgezeichnet" herabstufen, falls A2 bis 30.06. nicht grün ist (Z5, U2, T6).**
*Empfehlung:* Harte Deadline 30.06. für den Live-n8n-Teaser setzen; wird sie gerissen, im Pitch ein **vorab aufgezeichneter** echter Deploy gezeigt + ehrlich so gerahmt — das schützt NFR-8 und nimmt das Bühnen-Risiko.

**D3 — H1-Scope auf „Stufe 1 voll + Stufe 2 statisch gerendert" priorisieren, Voice und Stufe-2-Generator als die zwei einzigen L-Wetten behandeln (Z2, Z4, U3, U6).**
*Empfehlung:* Falls die Zeit kippt, lieber den Ist→Ziel-Graphen aus **einem fix vorbereiteten** `SystemLandscape`-JSON des Mock-Hotels rendern (statt live generiert) — die visuelle Pitch-Wirkung bleibt, der riskante Live-Generator-Pfad wird optional.

**D4 — Teaser-Pattern + Minimal-`integration_catalog.yaml` diese Woche fixieren (V2, V3, U4).**
*Empfehlung:* Genau ein Teaser-Pattern und die ~10–15 Vendoren des Mock-Hotels handkuratiert festschreiben, damit der Graph im Demo-Lauf „verbunden" statt „lauter manual-Findings" aussieht und `n8n_compiler.py` überhaupt starten kann.

**D5 — Einen Demo-Freeze + Generalprobe-Tag spätestens 17.07. + einen vollständigen Fallback-Mitschnitt verbindlich planen (Z3, T5, T6, L-G5).**
*Empfehlung:* 17.07. Code-Freeze, 18.–20.07. nur noch Proben + aufgezeichneter End-to-End-Fallback der kompletten 3-Stufen-Story — damit der Pitch auch bei Live-Ausfall (Netz/Rate-Limit/n8n) stattfinden kann.

---

## Schluss-Einordnung

Die vier Pläne sind strategisch klug und ungewöhnlich diszipliniert in der H1/H2- und Stufen-Trennung. Ihre Schwäche ist nicht Struktur, sondern **optimistische Verifikations-Lücken**: Drei Fundament-Annahmen (A1 SDK-additiv, A2 n8n-VPS, U4 verwertbare `required_integrations`) sind als Fakten formuliert, aber unbestätigt — und auf ihnen ruht die gesamte Stufe-2/3-Story. Dazu kommt eine Zeit-Mathematik (Z2), die nur aufgeht, wenn die noch zu 83% offene Stufe 1 plötzlich fertig wäre. Wenn Alex **eine** Sache aus diesem Dokument umsetzt, dann D1: die zwei Spikes diese Woche. Alles andere am H1-Plan ist Folgekosten dieser zwei unbeantworteten Ja/Nein-Fragen.
