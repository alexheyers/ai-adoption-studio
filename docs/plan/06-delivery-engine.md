# 06 · Delivery-Engine — kontinuierliches, off-Mac-Bauen (Webhook@VPS)

> Beschluss 09.06.2026: Wir bauen die **volle Webhook@VPS-Maschine** (Event-getrieben, One-Click, läuft auch wenn der Mac aus ist). E-Mail kommt **wenn ein Task fertig ist**, nicht morgens um 8. Linear ist das Control Plane — der Ablauf lebt in Linear, nicht in einer separaten App.

## Zielbild

```
Linear: Issue → Status "Ready"
   │  Linear-Webhook (Secret)
   ▼
n8n-Bridge @VPS  ──[Token-Auth]──►  Worker @VPS
   │                                  │ git worktree (isoliert, additiv, PR-only)
   │                                  │ Headless-Claude implementiert das Issue
   │                                  │ verifiziert → commit → push → PR (gh)
   │                                  │ Linear: In Progress → In Review
   ▼                                  ▼
   └────────────►  AgentMail: E-Mail "Task fertig"  ◄──┘
                     Buttons: [Merge & Next] · [Ablehnen]
                       │ Klick → n8n-Webhook (Token in URL)
                       ▼
                     gh merge → Deploy → myflowmotion.cloud → nächstes "Ready"
```

## Komponenten

| # | Komponente | Status | Linear |
|---|---|---|---|
| 1 | n8n-Bridge mit **Token-Auth** (kein offener Shell-Zugang mehr) | neu | **ALE-45** |
| 2 | **Worker @VPS**: nimmt Issue-ID, baut isoliert, PR, Linear-Sync, E-Mail | neu | **ALE-44** |
| 3 | **Linear-Webhook** „Ready" → Bridge (Auto-Trigger) | neu | *anzulegen* |
| 4 | **E-Mail + One-Click-Endpoints** (Merge&Next / Ablehnen) via AgentMail | neu | *anzulegen* |
| 5 | **Deploy-Trigger** bei Merge → `deploy-ai-adoption-studio` → myflowmotion.cloud | neu | *anzulegen* |
| 6 | **Status-Sync** Git/GitHub/Linear (schließt die fehlende Verknüpfung) | neu | **ALE-46** |

**Existiert bereits:** n8n@VPS + ungesicherte Bridge · AgentMail-Key · Deploy-Skill · Linear-API · SSH-Key (`~/.ssh/biz26_vps_claude`) · `gh`.

## Guardrails (nicht verhandelbar)
- Worker baut **nur in isolierten Git-Worktrees**, **additiv**, **PR-only**, **niemals direkt auf `main`**.
- **Kosten-Limit** pro Run; **eng pro Issue** gescoped (Lektion: „Agent strukturiert das ganze Repo um").
- **Merge bleibt menschlicher Klick** (deine E-Mail-Bestätigung). Kein Auto-Merge ohne dich.
- Pre-Deploy-greps bleiben Pflicht (kein „Münster", kein „BIZ 26" im Studio-Repo).

## Zug 0 — nur Alex (schaltet alles frei)
1. SSH-Pubkey auf den VPS:
   `ssh-copy-id -i ~/.ssh/biz26_vps_claude.pub root@<VPS-IP>`
   (Pubkey: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPt2AkAmO/qUNPdA7k0bkBTVpaDqfAkcI/4XfTiLcylW claude-code-deploy`)
2. **Anthropic-API-Key** auf dem VPS hinterlegen (für den Headless-Builder).
3. Optional: GitHub↔Linear-App für native PR-Verlinkung.

## Baureihenfolge
1. Zug 0 (Alex) · 2. ALE-45 Bridge absichern · 3. ALE-44 Worker E2E mit 1 Issue (Muster ALE-43) · 4. Linear-Webhook · 5. One-Click Merge→Deploy→Next · 6. Skelett live auf myflowmotion.cloud · 7. Produkt-Issues durch die Schleife cranken.

## Verweise
Architektur: [03-architecture.md](03-architecture.md) · Epics: [04-epics-and-stories.md](04-epics-and-stories.md) · Build-Map: 07-build-map.md (in Arbeit) · Risiken/Entscheidungen: [05-open-questions-and-risks.md](05-open-questions-and-risks.md).
