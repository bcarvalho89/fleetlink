# FleetLink - Fleet Management Dashboard

FleetLink is a modern, responsive web application designed for fleet management. It provides a centralized dashboard to monitor and manage drivers, trucks, and loads in real-time. Built with a robust and scalable tech stack, it offers a seamless user experience for tracking fleet operations.

## Live Demo

You can access the live application deployed on Firebase Hosting:

**URL:** [https://fleetlink-b2458.web.app](https://fleetlink-b2458.web.app)

Feel free to use the following credentials to log in and explore the application:

-   **Email:** `admin@fleetlink.com`
-   **Password:** `123456`

---

## Features

FleetLink comes packed with features designed to provide a comprehensive overview and control over fleet activities:

-   **Secure Authentication:** User login and session management powered by Firebase Authentication.
-   **Real-time Dashboard:** An at-a-glance overview of key metrics, including loads in-route, planned loads, available trucks, and total drivers.
-   **Recent Loads Table:** A summary of the most recent load activities on the dashboard for quick access.
-   **Driver Management:** Full CRUD (Create, Read, Update, Delete) functionality for drivers. Link drivers to available trucks.
-   **Truck Management:** Full CRUD functionality for trucks, including status updates (Active, Inactive, Maintenance) and document uploads (e.g., registration, insurance).
-   **Load Management:** Create new loads, assign them to available trucks (which automatically links the driver), and track their status (Planned, In-Route, Delivered).
-   **Interactive Map:** Visualize the origin and destination of a selected load on an interactive map powered by Mapbox.
-   **Responsive Design:** A mobile-first interface that adapts to various screen sizes, from mobile devices to desktops.
-   **Dark/Light Theme:** A theme toggle to switch between light and dark modes for user comfort.
-   **Real-time Updates:** Utilizes Firestore's real-time listeners to ensure the data displayed is always up-to-date.
-   **Toast Notifications:** User-friendly feedback for actions like successful operations or errors, using Sonner.
-   **Form Validation:** Robust client-side validation for all forms to ensure data integrity.

---

## Tech Stack

This project leverages a modern and powerful set of technologies to deliver a high-quality user experience and a maintainable codebase.

| Category             | Technology                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Core Framework**   | React, TypeScript, Vite |
| **Backend & DB**     | Firebase (Authentication, Firestore, Storage)                          |
| **State Management** | Zustand (Global UI State), TanStack Query (Server State) |
| **Routing**          | React Router                                                               |
| **Styling**          | Tailwind CSS                                                               |
| **Forms**            | React Hook Form, Yup (Validation)     |
| **UI & UX**          | Sonner (Toasts), Lucide React (Icons)            |
| **Mapping**          | Mapbox GL JS                                                    |
| **Testing**          | Vitest, React Testing Library, jsdom |
| **CI/CD**            | GitHub Actions                                                  |

---

## Project Structure

The project follows a feature-sliced design, organizing code by domain to enhance modularity and scalability.

```
src
├── api/              # (Not present, but would be for API layer)
├── assets/           # (Not present, but would be for static assets like images and fonts)
├── components/       # Shared, reusable UI components (e.g., Button, Dialog, Map)
├── features/         # Core application features, sliced by domain
│   ├── auth/         # Authentication logic, components, and store
│   ├── dashboard/    # Dashboard page and its components
│   ├── drivers/      # Drivers feature (page, components, hooks)
│   ├── loads/        # Loads feature
│   ├── misc/         # Miscellaneous pages like NotFound
│   └── trucks/       # Trucks feature
├── hooks/            # Shared, generic custom hooks
├── lib/              # Core libraries and utilities (e.g., Firebase config)
├── providers/        # (Not present, but would be for Context providers)
├── store/            # (Not present, Zustand stores are co-located in features)
├── test/             # Test utilities and setup files
└── types/            # Global TypeScript types
```

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm, yarn, or pnpm

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/billor-challenge.git
    cd billor-challenge
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in your Firebase and Mapbox credentials. These are required for the application to connect to the backend services.

    ```env
    VITE_FIREBASE_API_KEY=your_firebase_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_MAPBOX_TOKEN=your_mapbox_token
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on http://localhost:5173.

---

## Available Scripts

-   `npm run dev`: Starts the development server with hot-reloading.
-   `npm run build`: Compiles and bundles the application for production.
-   `npm run test`: Runs the test suite in watch mode.
-   `npm run test:ci`: Runs the test suite once, for continuous integration environments.
-   `npm run lint`: Lints the codebase for errors and style issues.
-   `npm run preview`: Serves the production build locally for previewing.

---

## Testing

The project has a comprehensive test suite built with **Vitest** and **React Testing Library**. The testing strategy focuses on:

-   **Component Testing:** Verifying that components render correctly and respond to user interactions as expected.
-   **Hook Testing:** Ensuring custom hooks that contain business logic and data fetching work correctly.
-   **Store Testing:** Validating the state management logic within Zustand stores.
-   **Mocking:** External dependencies like Firebase and `react-router-dom` are mocked to create a controlled and fast testing environment.

---

## Deployment

This project is configured for continuous deployment to **Firebase Hosting** using **GitHub Actions**.

The workflow is defined in `.github/workflows/firebase-hosting-merge.yml` and triggers on every push to the `master` branch. The CI/CD pipeline performs the following steps:

1.  **Checkout Code:** Clones the repository.
2.  **Install Dependencies:** Runs `npm ci` for a clean installation.
3.  **Lint:** Checks the code for linting errors.
4.  **Test:** Runs the entire test suite with `npm run test:ci`.
5.  **Build:** Creates a production-ready build of the application.
6.  **Deploy:** Deploys the build to the `live` channel on Firebase Hosting.

This automated process ensures that every change pushed to the main branch is automatically tested and deployed, guaranteeing code quality and a stable live application.
