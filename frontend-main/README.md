**SilverScreen Application README**

**Introduction:**
Welcome to SilverScreen, an innovative application designed to revolutionize the way users interact with movies and movie databases. SilverScreen combines cutting-edge technology with user-friendly interfaces to provide an immersive experience.

**Setup Instructions:**
To set up the SilverScreen project, follow these steps:

1. Unzip the Zip file: 
   
   - **Unzip Zip File:**
     - **Windows:**
       - Right-click the downloaded Zip file.
       - Select "Extract All...".
       - Choose the destination folder.
       - Click "Extract".
     - **Linux:**
       - Open Terminal.
       - Navigate to the directory containing the Zip file.
       - Use the following command to unzip:
         ```
         unzip filename.zip
         ```
         Replace `filename.zip` with the name of your Zip file.

2. Navigate to the root folder called "frontend":
   ```
   cd frontend
   ```

3. Install dependencies for the client:
   ```
   cd client && npm i
   ```

4. Navigate to the serverAuth folder:
   ```
   cd ../serverAuth
   ```

5. Install dependencies for the authentication server:
   ```
   npm i
   ```

6. Navigate back to the root folder:
   ```
   cd ..
   ```

7. Navigate to the server folder:
   ```
   cd server
   ```

8. Install dependencies for the main server:
   ```
   npm i
   ```

**Running the Services:**
To start each service, follow these commands (run each command from the project root folder):

1. Start the client service:
   ```
   cd client && npm run dev
   ```

2. Start the main server:
   ```
   cd server && node app.js
   ```

3. Start the authentication server:
   ```
   cd authServer && node server.js
   ```

**Usage:**
Once all services are running, you can access the SilverScreen application on port 3000 through your preferred web browser. The application offers a seamless and intuitive interface for users to interact with various features provided by SilverScreen.


Thank you for choosing SilverScreen! We hope you enjoy using our application.