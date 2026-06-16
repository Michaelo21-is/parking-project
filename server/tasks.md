# Sprint Tasks — Move to MongoDB Atlas + Models + CRUD + Authentication

Tracking doc. We work through it one task at a time. **(learn)** items are yours (Tom), not mine.

---

## 1. Infrastructure — Cloud Database

- [x] **(learn)** Create a MongoDB Atlas account (accessible from anywhere)
- [x] Create a cluster + database user + add IP whitelist (or `0.0.0.0/0` for dev)
- [x] Install `mongoose` on the server (`npm install mongoose`)
- [ ] **(learn)** Understand `mongoose.Schema` and `mongoose.model`
- [x] Store the connection string in `.env` (not committed) + add the connection in `index.js`
- [x] Add `dotenv` for reading environment variables

## 2. Models (Schemas)

Create a model for each entity under `server/models/`:

- [ ] **City** — city name, list of parking lots belonging to the city, list of authorized users
- [ ] **ParkingLot** — name, city (ref to City), address, number of parking spots
- [ ] **ParkingSpot** — belongs to a lot (ref to ParkingLot), status (free/occupied), which car is parked there (`null` for now if empty)
- [ ] **ParkingSession** — car plate number, parking lot, spot, entry time, exit time, status (active / completed)
- [ ] **Camera** — assigned parking lot (ref to ParkingLot), camera type (entry / exit), IP address
- [ ] **User** — full name, email, password (hashed), the city they are authorized to update (ref to City)
- [ ] Seed initial data into the DB: team members' usernames/emails + passwords

> Note to reconcile with existing code: the current mock uses a boolean status (`isOccupied`),
> while `loraService` expects the string `"free"`/`"occupied"`; and the spot type is `"normal"`
> vs. `"regular"` in the validator. We need to settle on a single model when building the Schemas.

## 3. CRUD endpoints

- [ ] **(learn)** What is CRUD (Create / Read / Update / Delete)
- [ ] Basic CRUD for ParkingLot (e.g. updating the spot count after renovation — from 100 to 30)
- [ ] Wire the existing `/parking` routes to read from the DB instead of the mock arrays
- [ ] Update `loraService.processData` to write the real spot status to the DB

## 4. Authentication (JWT)

- [ ] **(learn)** What is Middleware in the context of Authentication
- [ ] **(learn)** What is JWT (JSON Web Token)
- [ ] Install `jsonwebtoken` + `bcrypt` (for password hashing)
- [ ] Signup/login endpoint that returns a JWT
- [ ] Middleware that verifies the token and identifies the user on every protected request
- [ ] Protect the CRUD endpoints so only an authorized user (per their city) can update spots

---

### Suggested order of work
Infrastructure (1) → Models (2) → Wire CRUD to DB (3) → Authentication (4).
