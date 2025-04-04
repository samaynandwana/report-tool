# Full Stack Monorepo

This monorepo contains both the client (React) and server (Express + PostgreSQL) applications.

## Project Structure 

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Initial Setup

1. Clone the repository
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install dependencies
```bash
npm run install:all
```

3. Set up environment variables
```bash
npm run setup:env
```
Then edit the `.env` files in both client/ and server/ directories with your configuration.

4. Create and seed the database
```bash
cd server
npm run seed
```

### Development

Start both client and server in development mode:
```bash
npm run dev
```

Or run them separately:
```bash
npm run client  # Starts React app
npm run server  # Starts Express server
```

## Development

- Client runs on: http://localhost:3000
- Server runs on: http://localhost:8000 