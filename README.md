# User Authentication and Management Backend
This is a simple backend API for user authentication and management using **Node.js**, **Express**, **MySQL**, and **JWT** for secure user login. The API includes routes for user registration, login, password reset, and password change. 

## Features
- **User Registration**: Allows new users to register by providing a username, email, password, phone number, gender, and date of birth.
- **User Login**: Authenticated login via email and password with JWT token generation.
- **Forgot Password**: Endpoint to verify if a user with a given email exists.
- **Reset Password**: Endpoint to reset the password if the email exists and if the new password is not the same as the old one.
- **Password Hashing**: Passwords are securely hashed using **bcrypt**.
- **JWT Authentication**: A **JSON Web Token** (JWT) is issued upon login to authenticate subsequent requests.

## Requirements
- Node.js (v12.x or higher)
- MySQL database
- npm (Node Package Manager)

## Installation

Follow these steps to set up the project locally:
1. Clone the repository or download the **.zip** file.
2. Initialize and update the package.json file by the following command:
   ```bash
   npm init -y
3. Install the following dependencies by using this command
   ```bash
   npm install express mysql2 body-parser cors bcryptjs jsonwebtoken dotenv express-validator
   
## Environmental Variables
4. Setup the **.env** file in the root directory of the project and add the environment variables:
   ```dotenv
   DB_HOST=localhost
   DB_USER=<your_mysql_username>
   DB_PASSWORD=<your_mysql_password>
   DB_NAME=<your_database_name>
   JWT_SECRET=<your_jwt_secret_key>
   PORT=5000
Note: Replace the placeholders (<your_mysql_username>, <your_mysql_password>, etc.) with your actual values.

## Create MySQL Database and Users Table
5. Create a database and table by running the following commands:

   ```sql
      -- Create the database
           CREATE DATABASE IF NOT EXISTS user_auth;
            -- Use the created database
            USE user_auth;
            -- Create the 'users' table
            CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,  
              username VARCHAR(255) NOT NULL,      
              email VARCHAR(255) NOT NULL UNIQUE,  
              password VARCHAR(255) NOT NULL,     
              phoneNumber VARCHAR(15),             
              gender ENUM('Male', 'Female', 'Other'), 
              dob DATE,                           
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          );
   
## Start the sever
6. Once everything is setup, start the server by running:
    ```bash
    npm start
The server will start on port 5000 (or the port specified in your **.env** file).



   
