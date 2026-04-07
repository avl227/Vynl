# Vynl  
1. Team Members & Their Roles  
   * Angelina Le \- Frontend / UX Design  
   * Tian Hao Sheng \- Server / Backend  
   * Ryan Hammond \-  Database  
2. Application Functionality: Clearly describe how your application meets each of the project requirements. (Not sure if this is correct; Please add more details if needed \- THS)  
   * User Accounts and Roles: Our website will be similar to Beli, so user roles such as user / admin will definitely be necessary  
   * Database: Our website will store the data gathered directly into a database for storage and fast retrieval, we will also likely call an API for the top 100 songs from Spotify.  
   * Interactive UI: We will inherently have real-time updates due to the nature of our project; Forms will be necessary for the users to input their ratings and descriptions; Animations and other dynamic elements will also be included as a final flourish to make the website “pop”.  
   * New Library or Framework: We are most likely going to be using an API framework from Spotify to get the list of tracks  
   * Internal REST API: obviously included to get the routes  
   * External REST API: Spotify API and another one to parse already existing reviews  
3. User Story / Use Case: Explain what happens when a user visits your application and what features they can interact with.  
   * **New User:** A first time visitor / anonymous lands on the home page and sees a feed of recently rated or top rated albums from the community, which will display various labels such as runtime, ranked position, artist name, song name, track average rating, etc. They can click on a song which will immediately take them to the Login Page (probably a simple form / modal). There, they will click “Sign Up,” enter their username, email, and password, and are taken to their personal dashboard.  
   * **Searching and Rating / Adding an Album:** The user types an album name into the search bar. Results appear instantly and show album art, artist name, etc. They click on an album, and land on its detail page. The user can then rate it by classifying it as one of three different options: “I liked it”, “It was okay”, or “I didn’t like it”. If they have fewer than a handful of albums logged, they simply confirm the classification and a starting score is assigned.   
   * **How Rating Works:** Once they have more albums logged, the app runs a binary search comparing between the new album and albums already in their log. The app picks comparison targets strategically to narrow down the new album’s position with each answer. After a few comparisons, the app places the album in their ranked list and generates a 0-10 score based on where it landed relative to everything else they’ve rated  
   * **Managing Their Listening Log:** The user’s profile displays every album they’ve rated ordered by their personalized ranking. They can filter by genre. If their taste evolves, they can re-rank an album, which triggers a new short comparison sequence to find its updated position.  
   * **Social Features (Community):** Users can search for other users and visit their public profile, which shows their full ranked list and recent activity. Following another user adds their ratings to their home feed. On any album’s detail page, the app displays the user’s score as well as a “Friend Score”, calculated from ratings across their follow network.  
   * **Returning User:** A returning user logs in with their username and password. They will then see a feed of new ratings from people they follow since their last visit. If a friend rated an album they’ve also logged, they can tap through to compare where each person ranked it in their respective lists.   
4. Technical Design:  
   * Tech stack (Frontend, Backend, Database, Libraries, etc.)  
     1. **Frontend in REACT**  
     2. **Backend in Node Express / Typescript**  
     3. **Database will either be Supabase or PostgresSQL accessed using DBeaver**  
     4. **Libraries \- react-query, spotify-web-api-node, express, cors, dotenv, bcrypt (password hashing)**  
   * High-level architecture diagram (if applicable)  
   * Prototype: (replace with actual diagram if applicable)  
```
[ React Frontend ]  
        |  
        | (REST API / HTTP Requests)  
        v  
[ Node.js + Express Backend ]  
        |  
        | (ORM / Query Layer)  
        v  
[ PostgreSQL Database (Supabase) ]
```
