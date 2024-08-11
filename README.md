# Eisenhower Todo

This project is a full-stack application for managing tasks using the Eisenhower Matrix. It consists of a frontend built with React and a backend built with Node.js and Express.

## Project Structure

```bash
.
├── .gitignore
├── backend
│   ├── .env
│   ├── allJsFun.js
│   ├── app.js
│   ├── config.js
│   ├── index.js
│   ├── model
│   │   ├── todoModel.js
│   │   └── userModel.js
│   ├── package.json
│   ├── routes
│   │   ├── authRoute.js
│   │   └── todoRoute.js
│   └── vercel.json
├── frontend
│   ├── components.json
│   ├── index.html
│   ├── jsconfig.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   ├── src
│   │   ├── App.jsx
│   │   ├── assets
│   │   ├── components
│   │   ├── config.js
│   │   ├── contexts
│   │   ├── index.css
│   │   ├── lib
│   │   ├── main.jsx
│   │   └── pages
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/eisenhowertodo.git
    cd eisenhowertodo
    ```

2. Install dependencies for both frontend and backend:
    ```sh
    cd backend
    npm install
    cd ../frontend
    npm install
    ```

3. Create a `.env` file inside backend directory and add your environment variables:
    ```env
    MONGO_NAME=your_mongo_username
    MONGO_PASSWORD=your_mongo_password
    SECRET=your_jwt_secret
    ```

### Running the Application

1. Start the backend server:
    ```sh
    cd backend
    npm run dev
    ```

2. Start the frontend development server:
    ```sh
    cd frontend
    npm run dev
    ```

3. Open your browser and navigate to `http://localhost:3000`.

## License

This project is licensed under the ISC License.