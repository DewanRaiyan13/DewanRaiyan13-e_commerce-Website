# DoneShop E-Commerce Platform

A full-stack MERN e-commerce application featuring a modern UI, user authentication, product management, cart functionality, and Stripe integration.

## 🚀 Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS (or Custom CSS), Framer Motion
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Authentication:** JWT, Cookies
- **Payments:** Stripe
- **Deployment:** Vercel

## ⚙️ Prerequisites

- Node.js (v18+)
- MongoDB URI
- Stripe Account (for payments)
- Cloudinary Account (for image uploads)

## 🛠️ Local Development

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd "e_commerce Website"
   ```

2. **Install Dependencies:**
   Install dependencies for both frontend and backend concurrently:
   ```bash
   npm install --prefix frontend
   npm install --prefix backend
   npm install # in the root
   ```

3. **Set up Environment Variables:**
   - Create `backend/.env` based on `backend/.env.example`
   - Create `frontend/.env` (if applicable) and add your `VITE_API_URL` pointing to the backend (e.g. `http://localhost:5000/api`)

4. **Run the Application Locally:**
   Run both the Vite frontend and Express backend concurrently from the root directory:
   ```bash
   npm run dev
   ```

## 🌍 Deployment on Vercel

The application is structured to be deployed easily on Vercel as two separate projects (Recommended for MERN stacks).

### 1. Deploying the Backend
1. Go to your Vercel Dashboard and click **Add New... > Project**.
2. Import your GitHub repository.
3. In the **Configure Project** section:
   - Expand **Root Directory** and select `backend`.
   - Set **Framework Preset** to `Other`.
   - Ensure the **Build Command** is empty or set to `echo "no build"`.
4. Open **Environment Variables** and add your backend secrets from your `.env` file (`MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, etc.).
5. Click **Deploy**.
6. Once deployed, copy the backend URL (e.g., `https://doneshop-backend.vercel.app`).

### 2. Deploying the Frontend
1. Go back to your Vercel Dashboard and click **Add New... > Project**.
2. Import the same GitHub repository.
3. In the **Configure Project** section:
   - Expand **Root Directory** and select `frontend`.
   - Set **Framework Preset** to `Vite`.
4. Open **Environment Variables** and add:
   - `VITE_API_URL`: Your deployed backend URL + `/api` (e.g., `https://doneshop-backend.vercel.app/api`).
5. Click **Deploy**.
6. Once the frontend is deployed, copy the frontend URL (e.g., `https://doneshop.vercel.app`).

### 3. Final Integration
1. Go back to your **Backend Project** settings on Vercel.
2. In **Environment Variables**, add a new variable called `FRONTEND_URL`.
3. Set its value to your deployed frontend URL (e.g., `https://doneshop.vercel.app`).
4. Redeploy the backend so the updated CORS configuration takes effect.
5. You're done! Your application should now be live and fully functional.
