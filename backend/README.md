# Backend - Eisenhower Todo

This is the backend part of the Eisenhower Todo application, built with Node.js, Express, and MongoDB.

## Project Structure

```bash
backend/
├── .env
├── allJsFun.js
├── app.js
├── config.js
├── index.js
├── model
│   ├── todoModel.js
│   └── userModel.js
├── package.json
├── routes
│   ├── authRoute.js
│   └── todoRoute.js
└── vercel.json
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Installation

1. Navigate to the backend directory:
    ```sh
    cd backend
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file and add your environment variables:
    ```env
    MONGO_NAME=your_mongo_username
    MONGO_PASSWORD=your_mongo_password
    SECRET=your_jwt_secret
    ```

### Running the Server

Start the server:
```sh
npm run dev
```

### API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## License

This project is licensed under the ISC License.