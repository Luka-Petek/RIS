# Scrum poročilo – Prilagoditev porcij receptov

## Funkcionalnost
Spletna aplikacija z recepti – funkcionalnost prilagoditve količin sestavin glede na število porcij.
**Kot uporabnik želim možnost prilagoditve količin sestavin glede na število porcij, da lahko skuham točno toliko, kot potrebujem.**

---

## Razdelitev dela (Scrum naloge)

Uporabniško zgodbo smo razdelili na manjše, izvedljive naloge, ki so bile vodene na GitHub Projects Scrum tabli (Todo → In Progress → Done).

### Zaključene naloge (Done)

#### 1. Razširitev baze – število sestavin
**Miha Kitak**
- Podatkovnega modela nismo spreminjali.
- Količine sestavin so dodane neposredno v besedilni zapis (LONGTEXT).
- S tem smo omogočili prilagoditev porcij brez posega v strukturo baze.

#### 2. Spremenjeni UI za vnos števila porcij
**Miha Kostanjevec**
- Dodan uporabniški vmesnik z gumbi (+ / −) za izbiro števila oseb.
- Preprečeno je zmanjšanje števila oseb pod 1.
- Spremembe se vmesniku odražajo v realnem času.

#### 3. Dinamični prikaz spremenjene količine sestavin
**Luka Petek**
- Implementirana funkcija za preračun količin sestavin glede na število oseb.
- Uporabljeni so regularni izrazi za zaznavo številskih vrednosti v besedilu.
- Preračun deluje dinamično in ne zahteva ponovnega nalaganja strani.
- Preračunane količine se pravilno izvozijo tudi v PDF.

---

## Potek dela po Scrum metodologiji
**Luka Petek**
- Naloge so bile najprej dodane v stolpec **Todo**.
- Ob začetku dela so se premaknile v **In Progress**.
- Po uspešni implementaciji in preverjanju delovanja so bile premaknjene v **Done**.
- Stanje nalog na GitHub Projects tabli odraža dejanski napredek razvoja.
