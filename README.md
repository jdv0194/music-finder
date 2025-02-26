# Music Finder App

A web application for discovering, exploring, and managing music albums. Users can browse albums, view details, and create personal collections of albums.

## Features

- Album discovery with filtering by genre, artist, and release year
- Detailed album views with track listings
- User authentication (register/login)
- Album liking functionality to create personal collections
- Adding albums from last.fm api
- GraphQL API with JWT authentication
- Responsive UI built with Material UI

## Tech Stack

- **Frontend**: Next.js 15, Material UI, Apollo Client
- **Backend**: Next.js API Routes, Apollo Server, GraphQL
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with bcrypt password hashing

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or AWS RDS)
- Git

## Environment Variables

Create a `.env.local` file in the root directory with the following variables (I can provide if needed)

## Installation

1. Clone the repository

```bash
git clone https://github.com/jdv0194/music-finder-app.git
cd music-finder-app
```

2. Install dependencies

```bash
npm install
```

3. Setup the database

```bash
# Push Prisma schema to your database
npx prisma db push

# Seed the database with initial albums
npx prisma db seed
```

## Running the App

```bash
# Development mode
npm run dev
```

## Database Schema

The application uses the following main data models:

- **Album**: Music albums with metadata and cover art
- **Track**: Individual songs belonging to albums
- **User**: User accounts with authentication data
- **LikedAlbum**: Junction table for user's liked albums

## API Endpoints

The application primarily uses GraphQL for data operations, with the main endpoint at:

- `/api/graphql` - GraphQL API for all operations

### Key GraphQL Operations

- Queries:

  - `albums`: Get all albums with optional filtering
  - `album`: Get a single album by ID
  - `me`: Get current user profile

- Mutations:
  - `register`: Create a new user account
  - `login`: Authenticate user and get JWT token
  - `likeAlbum`: Add an album to user's liked albums
  - `unlikeAlbum`: Remove an album from user's liked albums
  - `addAlbum`: Adds an album from last.fm api with artist name and album as params

## Authentication

Authentication uses JWT tokens:

1. Register or login to receive a token
2. Token is stored in localStorage
3. Token is included in Authorization header for protected operations
4. Protected operations include liking/unliking albums and accessing user data
