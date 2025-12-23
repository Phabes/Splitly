# Splitly

## To run project locally follow steps below:

1. Clone repository:
   ```
   git clone https://github.com/Phabes/Splitly.git
   ```
2. Add to "server" folder ".env" file with below variables:
   - "MONGO_URI" - connection string to MongoDB,
   - "PORT" - server port number,
   - "JWT_SECRET" - private key token,
   - "JWT_TIME" - private key token expiration time,
   - "JWT_REFRESH_SECRET" - private key refresh token,
   - "JWT_REFRESH_TIME" - private key refresh token expiration time.
3. Add to "app" folder ".env" file with below variables:
   - "EXPO_PUBLIC_API_URL" - server address,
   - "EXPO_PUBLIC_API_PORT" - server port (same as above).
4. Run 2 consoles (cmd) in downloaded folder (originally "Splitly").
5. First console commands:
   ```
   cd server
   npm install
   npm run dev
   ```
6. Second console commands:
   ```
   cd app
   npm install
   npx expo
   ```
7. Enjoy
