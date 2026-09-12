# DriveFleet - Premium Car Rental Platform

**Live Website:** [DriveFleet Live Deployment](https://assignment-9-beta.vercel.app/)  
**Backend API:** [DriveFleet Server API](https://assignment-server.vercel.app/)  
**Client Repository:** [DriveFleet Client Repo](https://github.com/abdulmunnaf/assignment9-clint)  
**Server Repository:** [DriveFleet Server Repo](https://github.com/azizul-dev/assignment-server)  

---

## 🚀 About DriveFleet
**DriveFleet** is a modern, full-stack car rental platform designed to deliver seamless vehicle discovery, instant reservation management, and private fleet hosting. From high-performance electric sedans to rugged all-terrain SUVs, DriveFleet pairs a sleek, recruiter-friendly dark/light glassmorphism interface with enterprise-grade security and state-of-the-art MongoDB querying.

---

## 🌟 Key Website Features (Minimum 5 Highlights)
1. **Dynamic Available Fleet & Instant Reservation**: Live MongoDB-backed inventory displaying top available vehicles with transparent daily rates, seating capacities, powertrain specs, and an interactive **Book Now** modal that automatically computes rental duration, optional chauffeur fees, and total pricing.
2. **MongoDB `$inc` Booking Popularity Engine**: Automatically tracks and increments each vehicle's `booking_count` using the atomic MongoDB `$inc` operator upon confirmed reservations to highlight trending cars across the platform.
3. **Advanced Search & Multi-Criteria Filtering**: Instant real-time search powered by MongoDB `$regex` (case-insensitive) combined with category filtering (Luxury, SUV, Sedan, Electric, Hatchback), availability status toggling, and multi-mode sorting (Price Low/High, Most Popular).
4. **Host Fleet Management (Full CRUD Operations)**: Private host portal allowing logged-in car owners to add new vehicle listings with live image preview, update existing listings via an interactive modal (Price, Description, Availability, Image, Type, Location), and delete listings with a custom confirmation modal.
5. **My Bookings & Trip Dashboard**: Dedicated private dashboard where renters can view active reservations with booking dates (`new Date()`), rental periods, chauffeur preferences, total charges, and the ability to cancel bookings with confirmation dialogs.
6. **Robust Authentication & JWT Cookie Protection**: User authentication powered by Better-Auth with secure session management, real-time password criteria validation (uppercase, lowercase, 6+ characters), and automatic synchronization with the Express backend's HTTPOnly JWT cookies (`/jwt` and `/logout` endpoints).
7. **Theme Switcher & Recruiter-Friendly UI**: Seamless Dark/Light mode toggle, customized loading animations, responsive mobile drawer navigation, custom automotive 404 page, and the modern **X logo** replacing outdated Twitter branding.

---

## 🛠️ Technology Stack
- **Frontend Framework:** Next.js 16 (App Router & Turbopack), React 19
- **Styling:** Vanilla CSS & Tailwind CSS with Glassmorphism, Theme Variables, and HeroUI Components
- **Icons:** React Icons (`react-icons`) with modern X (formerly Twitter) branding
- **Notifications:** React Hot Toast (`react-hot-toast`)
- **Backend Framework:** Node.js & Express.js (v5)
- **Database:** MongoDB Atlas (Native MongoDB Node.js Driver v7)
- **Authentication & Security:** Better-Auth, JSON Web Tokens (`jsonwebtoken`), `cookie-parser`, CORS with credentials

---

## 📂 Project Architecture
```
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── page.js             # Hero Banner, Available Cars (DB), Static Sections, Testimonials
│   │   │   ├── cars/               # Explore Cars (Search $regex, Type filter, Sort, Status)
│   │   │   │   └── [id]/           # Car Details & Booking Modal ($inc trigger)
│   │   │   ├── add-car/            # Add Car listing (Private Route)
│   │   │   ├── my-cars/            # My Added Cars with Update & Delete Modals (Private Route)
│   │   │   ├── my-bookings/        # My Bookings with date formatting & cancel (Private Route)
│   │   │   ├── login/              # Login Page with credentials & Google auth
│   │   │   └── signup/             # Register Page with strict password validation
│   │   ├── loading.jsx             # Custom automotive speedometer loading spinner
│   │   ├── not-found.jsx           # Custom 404 Roadblock Detour page
│   │   ├── layout.js               # ThemeProvider & global metadata
│   │   └── globals.css             # Theme variables, glassmorphism, scrollbars
│   ├── components/
│   │   ├── NavBar.jsx              # Responsive header, dynamic dropdown, theme toggle
│   │   ├── Footer.jsx              # Useful links, contact info, 24/7 hotline, X logo
│   │   ├── Banner.jsx              # Hero banner with search bar & key statistics
│   │   ├── FeaturedCars.jsx        # Dynamic 6+ Available Cars from MongoDB
│   │   ├── WhyChooseUs.jsx         # Extra Static Section 1 (6 service guarantees)
│   │   ├── HowItWorks.jsx          # Extra Static Section 2 (3-step booking flow)
│   │   ├── Testimonials.jsx        # Extra Static Section 3 (Verified driver reviews)
│   │   └── ThemeToggle.jsx         # Dark / Light mode toggle button
│   ├── context/
│   │   └── ThemeContext.jsx        # Client theme state management
│   └── lib/
│       ├── auth.js                 # Better-Auth server configuration
│       └── auth-client.js          # Better-Auth client SDK
```

---

## 🔑 Environment Variables Setup

### Client (`.env.local`)
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:8000
BETTER_AUTH_SECRET=drivefleet_better_auth_secret_token_key_2026
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.sq0nbb4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

### Server (`.env`)
```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.sq0nbb4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
CLIENT_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=drivefleet_jwt_secret_super_secure_key_2026_cat05
```

---

## 🏃 Running Locally

### 1. Start Backend Server
```bash
cd assignment-server
npm install
node seed.js    # Seed 12 luxury & everyday vehicles into MongoDB
npm start       # Launches server on port 8000
```

### 2. Start Frontend Application
```bash
cd car-adoption-platform
npm install
npm run dev     # Launches Next.js dev server on http://localhost:3000
```

---

## 🛡️ License
Distributed under the MIT License. Built for Assignment Category CAT_05 - DriveFleet Car Rental Platform.