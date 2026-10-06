# SVARA — Wear Your Voice

A premium, production-style women's fashion e-commerce platform combining curated luxury fashion with AI-powered virtual try-on, avatar validation, wardrobe management, credit subscriptions, and Razorpay transactions.

---

## 🌟 Key Highlights

- **MERN Fullstack Architecture**: Built with Node.js, Express, MongoDB Atlas, Mongoose, and React (Vite).
- **Refined Glassmorphic Aesthetics**: Tailored fashion color palette (Ivory, Champagne, Mauve, Rose, Burgundy, Charcoal) with subtle blur effects, refined serif typography (Playfair Display), and responsive design.
- **Provider-Abstracted AI Virtual Try-On**:
  - Out-of-the-box support for **Google Gemini Free Tier Multimodal Image Generation** (`gemini-2.0-flash-exp`).
  - Switchable via `VTO_PROVIDER` in `.env` to **FASHN** or **fal.ai** without changing application code.
- **AI Avatar Verification**:
  - Automatically analyzes standing photographs using Gemini Vision (`gemini-1.5-flash`).
  - Flags missing feet, cropped bodies, or multiple people before accepting avatars.
- **Safe Credit Economy**:
  - Credits are atomically reserved before AI generation and consumed only upon verified success.
  - Automatic refund on AI error or timeout.
- **Razorpay Payments**:
  - Dual integration for buying Credit Bundles and purchasing physical garments.
  - Server-side cryptographic HMAC-SHA256 signature verification.
- **Persistent Image Storage**:
  - Direct integration with Cloudinary for product catalogs, user silhouettes, and virtual try-on outputs.
- **Integrated Admin Atelier (`/admin`)**:
  - Embedded inside the same application under role-based authorization (`role: "admin"`).
  - Manage inventory, catalog images, customer roles, and virtual try-on audit logs.

---

## 🏗 Project Architecture

```text
SVARA/
├── backend/
│   ├── config/             # DB and Cloudinary configurations
│   ├── controllers/        # Thin business logic handlers
│   ├── middleware/         # JWT Auth, Role guards, Multer uploads, Rate limiters, Error handling
│   ├── models/             # 13 Mongoose schemas
│   ├── routes/             # REST API endpoints
│   ├── services/           # VTO abstraction, Gemini vision, Credits, Razorpay, Cloudinary
│   ├── utils/              # Custom ApiError, slug generator, buffer magic-byte validation
│   ├── seed/               # Realistic seed script (70+ catalog looks across 7 categories)
│   ├── server.js           # Server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI primitives, layout, products, avatar, playground, wardrobe, admin
│   │   ├── context/        # Auth, Cart, Wishlist, Credit providers
│   │   ├── hooks/          # useAuth, useCart, useWishlist, useCredits, useDebounce
│   │   ├── pages/          # 14 Full views (Home, Shop, Detail, Login, Register, Profile, etc.)
│   │   ├── services/       # Axios API client modules
│   │   ├── utils/          # Price, date formatters, and constants
│   │   ├── App.jsx         # App router and authentication guards
│   │   └── main.jsx        # App root
│   ├── tailwind.config.js  # SVARA custom design tokens & glassmorphic classes
│   ├── vite.config.js      # Vite config with backend proxy
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Database (Local or MongoDB Atlas connection string)
- Cloudinary Account (Free tier)
- Google Gemini API Key (Free tier from Google AI Studio)
- Razorpay Test Account

---

### 2. Backend Setup

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` file from the provided example:
   ```bash
   cp .env.example .env
   ```

4. Populate your `.env` configuration:
   ```env
   PORT=5000
   NODE_ENV=development

   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/svara?retryWrites=true&w=majority

   JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
   JWT_EXPIRE=7d

   CLIENT_URL=http://localhost:5173

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   VTO_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key

   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

5. Seed the database with 70+ luxury fashion items, credit packages, and default admin:
   ```bash
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot up at `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The web platform will be accessible at `http://localhost:5173`.*

---

## 🔑 Default Admin Account

When you execute `npm run seed`, a default administrator profile is generated:
- **Email**: `admin@svara.in`
- **Password**: `Admin@123`
- **Role**: `admin`
- **Credits**: 100

Sign in with these credentials to unlock the **Admin Portal** at `/admin` from your profile menu.

---

## 👗 The Virtual Try-On Workflow

1. **Sign Up**: New accounts automatically receive **5 Welcome AI Credits**.
2. **Setup Avatar**: Navigate to `/profile` or `/playground` and upload a standing, full-body photo.
3. **AI Validation**: Gemini Vision automatically validates that head, torso, legs, and feet are visible and posture is upright.
4. **Select Garment**: Browse `/shop` and select **"Try On"** or **"Add to Playground"**.
5. **Generate Look**: Inside `/playground`, click **"Generate Try-On"**. 1 Credit is reserved, the AI drapes the garment onto your silhouette, and the resulting preview is automatically persisted in your `/wardrobe`.
6. **Download / Buy**: Download high-resolution images from `/wardrobe` or add the exact garment to `/cart` and check out using Razorpay.

---

## 🛡 Security & Design Principles

- **No Secret Exposure**: All AI calls and payment verifications occur strictly backend-side.
- **Idempotent Credit Handling**: Double-clicks and network drops will never consume credits without a completed output.
- **Glassmorphism With Restraint**: Contrast and readability remain paramount—text is clear, and product photography is visually dominant.
