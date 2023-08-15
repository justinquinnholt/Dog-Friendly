import 'dotenv/config';
import express from 'express';
import errorMiddleware from './lib/error-middleware.js';
import ClientError from './lib/client-error.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import fetch from 'node-fetch';
import cors from 'cors';
import { authorizationMiddleware } from './lib/authorization-middleware.js';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/build', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());
app.use(cors());

const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{5,29}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }

    if (!usernameRegex.test(username)) {
      throw new ClientError(
        400,
        'Invalid username. Username must start with an alphabetic character and consist of 6 to 30 characters, including alphabetic characters, digits, and underscores.'
      );
    }

    if (!passwordRegex.test(password)) {
      throw new ClientError(
        400,
        'Invalid password. Password must be at least 8 characters long and contain at least one uppercase letter, one number, and one special character.'
      );
    }

    const hashedPassword = await argon2.hash(password);
    const sql = `
      INSERT INTO "users" ("username", "hashedPassword")
      VALUES ($1, $2)
      RETURNING *
    `;
    const params = [username, hashedPassword];
    const result = await db.query(sql, params);
    const [user] = result.rows;
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(401, 'Invalid login credentials.');
    }
    const sql = `
      SELECT "userId",
             "hashedPassword"
      FROM "users"
      WHERE "username" = $1
    `;
    const params = [username];
    const result = await db.query(sql, params);
    const userData = result.rows;
    if (userData.length === 0) {
      throw new ClientError(401, 'Invalid login credentials.');
    } else {
      if (!(await argon2.verify(userData[0].hashedPassword, password))) {
        throw new ClientError(401, 'invalid login');
      } else {
        const user = { userId: userData[0].userId, username };
        const token = jwt.sign(user, process.env.TOKEN_SECRET);
        res.status(200).json({ token, user });
      }
    }
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-out', async (req, res, next) => {
  try {
    res.setHeader('Authorization', '');
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (err) {
    next(err);
  }
});

// apiKey
app.get('/api/key', (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_API_KEY });
});

// yelp api
app.get('/api/businesses', async (req, res) => {
  try {
    const { address } = req.query;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?term=dog+pet+friendly&location=${encodeURIComponent(
      address
    )}&radius=2000`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data.businesses);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching businesses.' });
  }
});

app.get('/api/businesses/open', async (req, res) => {
  try {
    const { address } = req.query;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?term=dog+pet+friendly&location=${encodeURIComponent(
      address
    )}&radius=2000&open_now=true`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });

    const data = await response.json();

    res.json(data.businesses);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching open businesses.' });
  }
});

app.get('/api/businesses/:id', async (req, res) => {
  const businessId = req.params.id;

  try {
    const response = await fetch(
      `https://api.yelp.com/v3/businesses/${businessId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch business details' });
  }
});

app.get('/api/bookmarks', async (req, res) => {
  try {
    const sql = `
      select "placeId"
        from "bookmarks"
    `;
    const result = await db.query(sql);
    const placeId = result.rows;
    const newPlaceId = placeId.map((place) => place.placeId);
    res.json(newPlaceId);
  } catch (err) {
    res.status(500).json({ error: 'an unexpected error occurred' });
  }
});
app.get('/api/bookmarks/list', async (req, res) => {
  try {
    const sql = `
      SELECT p."placeId", p."placeName", p.title, p.latitude, p.longitude, p.address
      FROM places p
      JOIN bookmarks b ON p."placeId" = b."placeId"
    `;
    const result = await db.query(sql);
    const placeId = result.rows;
    res.json(placeId);
  } catch (err) {
    res.status(500).json({ error: 'an unexpected error occurred' });
  }
});

app.post('/api/bookmarks', async (req, res) => {
  const { placeId } = req.body;
  try {
    const checkPlaceQuery = `
      SELECT *
      FROM "places"
      WHERE "placeId" = $1
    `;
    const checkPlaceValues = [placeId];

    const placeResult = await db.query(checkPlaceQuery, checkPlaceValues);
    let place;

    if (placeResult.rows.length === 0) {
      const placeInfo = await fetch(
        `https://api.yelp.com/v3/businesses/${placeId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.YELP_API_KEY}`,
          },
        }
      );
      const res = await placeInfo.json();

      const insertPlaceQuery = `
        INSERT INTO "places" ("placeId", "placeName", "title", "latitude", "longitude", "address")
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING "placeId"
      `;
      const insertPlaceValues = [
        res.id,
        res.name,
        res.categories[0].title,
        res.coordinates.latitude,
        res.coordinates.longitude,
        `${res.location.city}, ${res.location.state}`,
      ];

      const insertPlaceResult = await db.query(
        insertPlaceQuery,
        insertPlaceValues
      );
      place = insertPlaceResult.rows[0].placeId;
    } else {
      place = placeResult.rows[0].placeId;
    }

    const insertBookmarkQuery = `
      INSERT INTO "bookmarks" ("placeId")
      VALUES ($1)
      RETURNING *
    `;
    const insertBookmarkValues = [place];

    const bookmarkResult = await db.query(
      insertBookmarkQuery,
      insertBookmarkValues
    );
    const bookmark = bookmarkResult.rows[0];
    res.json(bookmark);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save bookmark' });
  }
});

app.delete('/api/bookmarks/:placeId', async (req, res) => {
  const { placeId } = req.params;

  try {
    const query = `
      DELETE FROM "bookmarks"
      WHERE "placeId" = $1
    `;
    const values = [placeId];

    await db.query(query, values);

    res.status(200).json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove bookmark' });
  }
});

app.use(authorizationMiddleware);

// profile
app.get('/api/profile', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const sql = `
      SELECT "profileId", "dogName", "streetAddress", "city", "state", "zipcode"
      FROM "profile"
      WHERE "userId" = $1
    `;

    const params = [userId];
    const result = await db.query(sql, params);
    const rows = result.rows;

    let profileData = {};

    if (rows.length > 0) {
      profileData = {
        profileId: rows[0].profileId,
        dogName: rows[0].dogName,
        streetAddress: rows[0].streetAddress,
        city: rows[0].city,
        state: rows[0].state,
        zipcode: rows[0].zipcode,
      };
    }

    res.json(profileData);
  } catch (err) {
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

app.post('/api/profile', async (req, res, next) => {
  try {
    const { dogName, streetAddress, city, state, zipcode } = req.body;
    const userId = req.user.userId;

    if (!dogName || !streetAddress || !city || !state || !zipcode) {
      throw new ClientError('Required fields are missing');
    }
    const profileInsertSql = `
      INSERT INTO "profile" ("userId", "dogName", "streetAddress", "city", "state", "zipcode")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING "profileId";
    `;
    const profileInsertParams = [
      userId,
      dogName,
      streetAddress,
      city,
      state,
      zipcode,
    ];
    const profileResult = await db.query(profileInsertSql, profileInsertParams);
    const [profileId] = profileResult.rows;

    res.status(201).json(profileId);
  } catch (err) {
    next(err);
  }
});

app.put('/api/profile/:profileId', async (req, res, next) => {
  try {
    const profileId = Number(req.params.profileId);
    const { dogName, streetAddress, city, state, zipcode } = req.body;

    if (!dogName || !streetAddress || !city || !state || !zipcode) {
      throw new ClientError('Required fields are missing');
    }

    const profileUpdateSql = `
      UPDATE "profile"
      SET "dogName" = $1, "streetAddress" = $2, "city" = $3, "state" = $4, "zipcode" = $5
      WHERE "profileId" = $6;
    `;

    const profileUpdateParams = [
      dogName,
      streetAddress,
      city,
      state,
      zipcode,
      profileId,
    ];
    await db.query(profileUpdateSql, profileUpdateParams);

    res.json({ message: 'Profile and category data updated successfully' });
  } catch (err) {
    next(err);
  }
});

app.get('/api/service/all', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileQuery = `
      SELECT "streetAddress", "city", "state", "zipcode"
      FROM "profile"
      WHERE "profileId" = $1
    `;
    const profileValues = [userId];
    const profileResult = await db.query(profileQuery, profileValues);
    const profileData = profileResult.rows[0];

    if (!profileData) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const address = `${profileData.streetAddress}, ${profileData.city}, ${profileData.state} ${profileData.zipcode}`;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?term=dog+pet+friendly&location=${encodeURIComponent(
      address
    )}&radius=2000`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data.businesses);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching businesses.' });
  }
});

app.get('/api/service/open', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const profileQuery = `
      SELECT "streetAddress", "city", "state", "zipcode"
      FROM "profile"
      WHERE "profileId" = $1
    `;
    const profileValues = [userId];
    const profileResult = await db.query(profileQuery, profileValues);
    const profileData = profileResult.rows[0];

    if (!profileData) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const address = `${profileData.streetAddress}, ${profileData.city}, ${profileData.state} ${profileData.zipcode}`;
    const apiUrl = `https://api.yelp.com/v3/businesses/search?term=dog+pet+friendly&location=${encodeURIComponent(
      address
    )}&radius=2000&open_now=true`;

    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
    });

    const data = await response.json();
    res.json(data.businesses);
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while searching businesses.' });
  }
});

app.use(express.static(reactStaticDir));
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
