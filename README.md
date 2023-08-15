## Project:1 - Building a WebApp

Dog-Friendly | [Figma](https://www.figma.com/file/1AjhvXajgU3jWRjsQQBw9C/Gyuli-Kim---Final-Project?type=design&node-id=1%3A3&mode=design&t=K18sViL8k7hP4OWh-1) | [Live](https://dog-friendly.gyulizoeykim.com/)

Built a webapp where user can search, view detail, save dog-friendly places

---

### Key Features:

1. Search for Businesses
   1. Users can search for pet-related businesses based on an address. The app queries an API to retrieve a list of businesses near searched address.
1. View Business Listings:
   1. Displays a list of businesses with their names, ratings, review counts, and addresses. Users can click on a business to view its detailed information.
1. Bookmarking
   1. Users can save businesses to their bookmarks. Bookmarked businesses are stored and can be accessed later from the bookmark page. Users can manage their bookmarks, including deleting them. Bookmarks are stored in a database on the server.
1. View Types
   1. Users can switch between list view and map view for business listings.
1. Recommended Businesses
   1. Suggests pet walking, training, grooming type of services to users. Recommendations are based on user's location saved on their profile.

---

### Skills

1. React Router
   1. Utilized React Router to to navigate between different sections of the app.
1. Hooks
   1. Managing states using useState and useEffect hooks.
1. API Integration
   1. Retrieve business data from Yelp's API based on user's search location.
   1. Used Google Maps API to show business locations.
1. Server Development
   1. Built a back-end server using Node.js and Express to handle API requests, manage bookmarks, and interact with the database.
1. Database
   1. Used PostgreSQL to manage data like bookmark, place and user's profile.

---
