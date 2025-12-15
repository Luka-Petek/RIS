# Poročilo o Unit Testiranju Modela `Recipe`

---

## 1. Cilj testiranja

Cilj je bil preveriti **celovitost in pričakovano obnašanje modela entitete `Recipe`** v zaledni aplikaciji z uporabo unit testov JUnit 5. Testi zagotavljajo, da metode getter in setter pravilno delujejo ter da model pravilno obravnava robne primere, kot so prazne in `null` vrednosti, kar je temelj za zanesljivo delovanje JPA entitet.

## 2. Opis Ustvarjenih Testov

Ustvarjenih je 9 unit testov v razredu `RecipeTest.java`, ki pokrivajo ključne atribute in scenarije modela.

| Metoda testa | Opis in namen testa | Pomen |
| :--- | :--- | :--- |
| `testNameRecipe()` | Preverja, ali je atribut `name` pravilno nastavljen in pridobljen. | Osnovna funkcionalnost. |
| `testIngredientsRecipe()` | Preverja, ali je vsebina sestavin pravilna in preverja, ali lahko navodila nastavimo na `null`. | Fleksibilnost modela in obravnavanje `null` vrednosti. |
| `testInstructionsNotBlank()` | Preverja, ali se navodila pravilno nastavijo in niso prazna (`isBlank()`). | Integriteta podatkov (preverjanje nepraznosti). |
| `testBlankName()` | Preverja robni primer: ali sistem pravilno obravnava in vrača prazen niz (`""`) za ime. | Obravnavanje praznih vnosov. |
| `testIngredientsNotNull()` | Preverja, ali so sestavine nastavljene in niso prazne. | Integriteta podatkov (preverjanje nepraznosti). |
| `testRecipeValidity()` | Preverja, da je objekt *veljaven* za shranjevanje, če so ključni atributi (`name`, `ingredients`) nastavljeni, `instructions` pa je lahko prazen niz. | Poslovna logika (minimalni potrebni podatki). |
| `testSetNegativeId()` | **Robni primer:** Preverja, ali model tehnično sprejme negativno `Long` vrednost za ID. S tem potrjuje, da se validacija ID-ja prenese na servisni sloj. | **Analiza Validacije:** Poudarja, da model sam ne izvaja validacije. |
| `testInstructionsSetToNull()` | Preverjanje, ali se polje `instructions` uspešno nastavi na `null`. | Eksplicitno testiranje `null` vrednosti. |
| `setUp()` | Metoda za inicializacijo testnega objekta pred vsakim testom. | Zagotavlja izoliranost in ponovljivost testov. |

## 3. Odgovornosti članov skupine

Odgovornosti so bile razdeljene glede na vložek v kodo v datoteki `RecipeTest.java`.

| Član Skupine | Prevzete Odgovornosti                                                                                                                         |
| :--- |:----------------------------------------------------------------------------------------------------------------------------------------------|
| **Miha Kitak** | Inicializacija (`setUp`), Osnovna funkcionalnost (`testNameRecipe`, `testIngredientsRecipe`, `testIngredientsNotNull`, `testRecipeValidity`). |
| **Miha Kostanjevec** | Testiranje robnih primerov vnosov (`testInstructionsNotBlank`, `testBlankName`).                                                              |
| **Luka Petek** | Testiranje negativnih in `null` vrednosti (`testSetNegativeId`, `testInstructionsSetToNull`).                                                 |

## 4. Analiza uspešnosti in ugotovljene napake

### Uspešnost in Odkrite Napake:
* **Uspešnost testov:** Vsi napisani unit testi so bili uspešni in potrdili, da se model `Recipe` obnaša, kot je pričakovano. V Javi kodi modela **niso bile odkrite napake** v funkcionalnosti getterjev/setterjev.
* **Odpravljene težave med razvojem:** Največje težave, ki so se pojavile, so bile povezane z okoljem in konfiguracijo, ne pa s kodo:
    1.  **Maven in JUnit napake:** Rešene so bile z odpravo podvojene odvisnosti (`pom.xml`) in s prisilno ponovno sinhronizacijo projekta v IDE, s čimer se je zagotovil dostop do JUnit 5 knjižnic.
    2.  **Napačna lokacija datoteke:** Testni razred je bil pomotoma postavljen v produkcijsko mapo (`src/main/java`), kar je bilo odpravljeno s premikom v pravilno testno mapo (`src/test/java`).

### Zaključek analize:
Model je tehnično pravilen, vendar je testiranje s pomočjo `testSetNegativeId()` poudarilo, da je za popolno poslovno integriteto potrebna implementacija **Bean Validation** (npr. z anotacijo `@Min(1)` na polju `id`), ki bo preprečila, da bi servisni sloj poskušal v bazo shraniti neveljavne ID-je.

---