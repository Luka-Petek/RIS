# RIS – spletna aplikacija za upravljanje receptov

RIS je full-stack spletna aplikacija za upravljanje kuharskih receptov.  
Uporabniku omogoča dodajanje, urejanje, brisanje in pregledovanje receptov prek React frontenda, ki komunicira s Spring Boot REST API-jem in MySQL podatkovno bazo.

---

## Vsebina

- [Glavne funkcionalnosti](#glavne-funkcionalnosti)
- [Arhitektura](#arhitektura)
- [Uporabljene tehnologije](#uporabljene-tehnologije)
- [Struktura projekta](#struktura-projekta)
- [Namestitev in zagon](#namestitev-in-zagon)
  - [Predpogoji](#predpogoji)
  - [Konfiguracija podatkovne baze](#konfiguracija-podatkovne-baze)
  - [Konfiguracija backenda](#konfiguracija-backenda)
  - [Konfiguracija frontenda](#konfiguracija-frontenda)
  - [Zagon backenda](#zagon-backenda)
  - [Zagon frontenda](#zagon-frontenda)
- [Model podatkov](#model-podatkov)
- [REST API dokumentacija](#rest-api-dokumentacija)
  - [Pregled](#pregled)
  - [Shema objekta Recipe](#shema-objekta-recipe)
  - [Seznam API končnih točk](#seznam-api-končnih-točk)
  - [Podrobnosti posameznih končnih točk](#podrobnosti-posameznih-končnih-točk)
- [Uporaba aplikacije (frontend)](#uporaba-aplikacije-frontend)
- [Možne izboljšave](#možne-izboljšave)
- [Licenca](#licenca)

---

## Glavne funkcionalnosti

- prikaz seznama vseh receptov (paginacija izvedena na frontendu)
- prikaz podrobnosti posameznega recepta
- dodajanje novega recepta
- urejanje obstoječega recepta
- brisanje recepta
- ločen **frontend** (React) in **backend** (Spring Boot)
- komunikacija prek JSON REST API-ja
- osnovna obravnava napak (npr. recept ne obstaja → HTTP 404)

---

## Arhitektura

Aplikacija je razdeljena na dva dela:

- **Backend** – Spring Boot REST API
  - izpostavlja CRUD končne točke za entiteto `Recipe`
  - uporablja Spring Data JPA za dostop do MySQL
  - ob zagonu po potrebi ustvari/posodobi shemo baze (Hibernate)

- **Frontend** – React enostranska aplikacija (SPA)
  - uporablja Axios za klice na REST API
  - omogoča pregled, dodajanje, urejanje in brisanje receptov
  - preprosta paginacija seznama receptov

---

## Uporabljene tehnologije

**Backend**

- Java 17
- Spring Boot (Web, Spring Data JPA)
- Hibernate
- MySQL
- Maven

**Frontend**

- React
- React Router
- Axios
- Bootstrap 5 (oz. CSS framework po izbiri)
- Node.js / npm

---

## Struktura projekta

```text
RIS/
├─ backend/                  # Spring Boot REST API
│  ├─ src/main/java/...      # (priporočeno mesto za model, controller, repository, exception)
│  ├─ src/test/java/...      # trenutno vsebuje model, controller, repository, exception
│  └─ src/main/resources/
│       └─ application.properties
│
└─ frontend/                 # React uporabniški vmesnik
   ├─ src/layout/            # postavitev (npr. navbar)
   ├─ src/pages/             # glavne strani (Home)
   └─ src/recipes/           # komponenta za seznam, dodajanje, urejanje receptov
```

> Priporočilo: produkcijska koda (`Recipe`, `RecipeController`, `RecipeRepository`, `RecipeNotFoundException`, `RecipeNotFoundAdvice`) naj bo v `src/main/java`, ne v `src/test/java`.

---

## Namestitev in zagon

### Predpogoji

- **Java** 17+
- **Maven** 3.x
- **Node.js** 16+ (priporočeno 18+)
- **npm**
- **MySQL** strežnik

### Konfiguracija podatkovne baze

1. Ustvarite bazo:

   ```sql
   CREATE DATABASE RIS
     CHARACTER SET utf8mb4
     COLLATE utf8mb4_unicode_ci;
   ```

2. Ustvarite uporabnika (po želji) ali uporabite `root`:

   ```sql
   CREATE USER 'ris_user'@'localhost' IDENTIFIED BY 'močno_geslo';
   GRANT ALL PRIVILEGES ON RIS.* TO 'ris_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### Konfiguracija backenda

Datoteka: `backend/src/main/resources/application.properties`:

```properties
spring.application.name=fullstack-backend

# Hibernate – samodejna kreacija/posodobitev sheme
spring.jpa.hibernate.ddl-auto=update

# Povezava na MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/RIS
spring.datasource.username=ris_user
spring.datasource.password=močno_geslo
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Port backenda
server.port=8081
```

Po potrebi prilagodite:

- URL, če ne uporabljate localhost ali porta 3306
- uporabniško ime in geslo

### Konfiguracija frontenda

V mapi `frontend` dodajte datoteko `.env` (če še ne obstaja):

```env
PORT=3001
REACT_APP_API_BASE_URL=http://localhost:8081
```

Frontend bo privzeto poslušal na `http://localhost:3001`, REST API pa na `http://localhost:8081`.

### Zagon backenda

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend bo na:  
`http://localhost:8081`

### Zagon frontenda

V drugem terminalu:

```bash
cd frontend
npm install
npm start
```

Frontend bo na:  
`http://localhost:3001`

Poskrbite, da:

- backend teče **pred** uporabo frontenda,
- se `REACT_APP_API_BASE_URL` ujema z dejanskim naslovom backenda,
- CORS konfiguracija v kontrolerju dovoljuje `http://localhost:3001`.

---

## Model podatkov

### Entiteta `Recipe`

Entiteta predstavlja en kuharski recept:

- `id` (`Long`) – primarni ključ, samodejno generiran
- `name` (`String`) – ime recepta
- `ingredients` (`String`, pogosto `@Lob`) – seznam sestavin (prosto besedilo)
- `instructions` (`String`, pogosto `@Lob`) – navodila za pripravo (prosto besedilo)

---

## REST API dokumentacija

### Pregled

- **Osnovni URL backenda:** `http://localhost:8081`
- **Format podatkov:** JSON
- **Avtentikacija:** ni (javni API, namenjen učni/demo uporabi)

Glavna entiteta: **Recipe**

### Shema objekta `Recipe`

Primer JSON objekta:

```json
{
  "id": 1,
  "name": "Čokoladna torta",
  "ingredients": "200 g čokolade
3 jajca
150 g sladkorja",
  "instructions": "Segrej pečico na 180 °C. Stopi čokolado ..."
}
```

Polja:

| Polje        | Tip    | Obvezno | Opis                               |
| ------------ | ------ | ------- | ---------------------------------- |
| `id`         | Long   | ne (POST) / da (GET/PUT/DELETE) | ID recepta, določi ga baza |
| `name`       | String | da      | ime recepta                        |
| `ingredients`| String | da      | sestavine v besedilni obliki      |
| `instructions`| String| da      | navodila za pripravo              |

---

### Seznam API končnih točk

| Metoda | Pot             | Opis                             |
| ------ | --------------- | -------------------------------- |
| GET    | `/recipes`      | Vrne seznam vseh receptov        |
| GET    | `/recipe/{id}`  | Vrne recept z danim ID           |
| POST   | `/recipe`       | Ustvari nov recept               |
| PUT    | `/recipe/{id}`  | Posodobi obstoječ recept         |
| DELETE | `/recipe/{id}`  | Izbriše recept                   |

> Opomba: imena poti so navedena glede na tipično implementacijo `RecipeController`. Če v kodi uporabljate prefiks (npr. `/api/recipes`), je potrebno poti tukaj uskladiti.

---

### Podrobnosti posameznih končnih točk

#### 1. `GET /recipes`

Vrne seznam vseh receptov.

**Zahtevek**

- Parametri: /
- Telo: /

**Odgovor – 200 OK**

```json
[
  {
    "id": 1,
    "name": "Čokoladna torta",
    "ingredients": "200 g čokolade
3 jajca
150 g sladkorja",
    "instructions": "Segrej pečico na 180 °C ..."
  },
  {
    "id": 2,
    "name": "Palačinke",
    "ingredients": "2 jajci
300 ml mleka
150 g moke",
    "instructions": "Vse sestavine zmešaj v gladko zmes ..."
  }
]
```

Frontend lahko na tem seznamu izvede paginacijo (npr. prikaz 5 receptov na stran).

---

#### 2. `GET /recipe/{id}`

Vrne podrobnosti enega recepta.

**Zahtevek**

- Pot: `/recipe/1`
- Telo: /

**Odgovori**

- **200 OK** – recept najden

  ```json
  {
    "id": 1,
    "name": "Čokoladna torta",
    "ingredients": "200 g čokolade
3 jajca
150 g sladkorja",
    "instructions": "Segrej pečico na 180 °C ..."
  }
  ```

- **404 Not Found** – recept ne obstaja  
  (sproži se `RecipeNotFoundException`, ki jo obdela `RecipeNotFoundAdvice`)

  Primer odgovora:

  ```json
  {
    "message": "Recipe with id=1 not found"
  }
  ```

---

#### 3. `POST /recipe`

Ustvari nov recept.

**Zahtevek**

- Pot: `/recipe`
- Zaglavje: `Content-Type: application/json`
- Telo (primer):

  ```json
  {
    "name": "Špageti carbonara",
    "ingredients": "200 g špagetov
2 jajci
100 g pancete
parmezan",
    "instructions": "Skuhaj špagete al dente. Na ponvi popraži panceto ..."
  }
  ```

**Odgovor – 201 Created (ali 200 OK, odvisno od implementacije)**

```json
{
  "id": 3,
  "name": "Špageti carbonara",
  "ingredients": "200 g špagetov
2 jajci
100 g pancete
parmezan",
  "instructions": "Skuhaj špagete al dente. Na ponvi popraži panceto ..."
}
```

**Tipične napake**

- **400 Bad Request** – če manjkajo obvezna polja ali je telo neveljavno

---

#### 4. `PUT /recipe/{id}`

Posodobi obstoječ recept.

**Zahtevek**

- Pot: `/recipe/1`
- Zaglavje: `Content-Type: application/json`
- Telo (primer):

  ```json
  {
    "name": "Čokoladna torta (posodobljena)",
    "ingredients": "200 g čokolade
3 jajca
150 g sladkorja
50 g masla",
    "instructions": "Segrej pečico na 180 °C. Stopi čokolado z maslom ..."
  }
  ```

**Odgovori**

- **200 OK** – uspešna posodobitev

  ```json
  {
    "id": 1,
    "name": "Čokoladna torta (posodobljena)",
    "ingredients": "200 g čokolade
3 jajca
150 g sladkorja
50 g masla",
    "instructions": "Segrej pečico na 180 °C. Stopi čokolado z maslom ..."
  }
  ```

- **404 Not Found** – recept z danim ID ne obstaja

  ```json
  {
    "message": "Recipe with id=1 not found"
  }
  ```

---

#### 5. `DELETE /recipe/{id}`

Izbriše recept.

**Zahtevek**

- Pot: `/recipe/1`
- Telo: /

**Odgovori**

- **204 No Content** (ali 200 OK – odvisno od implementacije) – recept izbrisan
- **404 Not Found** – recept ne obstaja

  ```json
  {
    "message": "Recipe with id=1 not found"
  }
  ```

---

## Uporaba aplikacije (frontend)

1. Odprite brskalnik na `http://localhost:3001`.
2. Na začetni (**Home**) strani se prikaže seznam vseh receptov.
3. In the recipes table you typically have buttons:
   - **View** – prikaz podrobnosti recepta
   - **Edit** – urejanje recepta (preusmeritev na obrazec s predizpolnjenimi podatki)
   - **Delete** – brisanje recepta
4. Z gumbom **Add Recipe** odprete obrazec za dodajanje novega recepta:
   - *Name*
   - *Ingredients* (večvrstično besedilo)
   - *Instructions* (večvrstično besedilo)
5. Po shranjevanju se uporabnik vrne na seznam, kjer se nov ali posodobljen recept prikaže v tabeli.

---

## Možne izboljšave

- premik vseh produkcijskih razredov v `src/main/java`
- validacija vnosov (Bean Validation na backendu + validacija na frontendu)
- iskanje in filtriranje receptov po imenu ali sestavinah
- dodajanje uporabnikov in avtentikacije (login, registracija)
- boljša obravnava napak na frontendu (globalna error komponenta)
- razdelitev na različne Spring profile (`dev`, `prod`)
- Docker konfiguracija za enostavnejši zagon (MySQL + aplikacija)

---

## Licenca

Projekt je namenjen učnim in razvojnim namenom.  
Po potrebi dodajte datoteko `LICENSE` z izbrano licenco (npr. MIT, Apache 2.0).
