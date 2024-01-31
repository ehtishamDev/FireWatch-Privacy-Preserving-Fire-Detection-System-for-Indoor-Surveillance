const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(bodyParser.json());
app.use(cors());
const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");
const nodemailer = require("nodemailer");
require("dotenv").config();
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Store OTP and expiration time in-memory 
const otpCache = new Map();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://firewatch-dashboard-a18fe-default-rtdb.firebaseio.com/", // Your Firebase database URL
});

const db = admin.database();

// Route to fetch users' data
app.get("/getUsers", (req, res) => {
  db.ref("users")
    .once("value")
    .then((snapshot) => {
      const users = snapshot.val();
      res.json(users);
      console.error("fetching data success ");
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      res.status(500).json({ error: "Failed to fetch data." });
    });
});

app.delete("/deleteUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const snapshot = await db.ref(`users/${userId}`).once("value");
    const user = snapshot.val();

    if (!user) {
      throw new Error("User not found");
    }
    if (user.accepted === true) {
      return res.status(400).json({ error: "Cannot delete an accepted user." });
    }

    // If the user is not accepted or pending, proceed with the deletion
    await db.ref(`users/${userId}`).remove();
    console.log("User deleted successfully.", userId);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ error: "Failed to delete user." });
  }
});
app.post("/forgotPassword/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { newPassword, confirmPassword } = req.body;

  try {
    // Validate that the user exists
    const userSnapshot = await db.ref(`users/${userId}`).once("value");
    const user = userSnapshot.val();
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user's password with the new password
    await db.ref(`users/${userId}`).update({ password: newPassword });

    console.log("Password updated successfully for user", userId);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password: ", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  // Check if the email already exists in the database
  db.ref("users")
    .orderByChild("email")
    .equalTo(email)
    .once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        // Email already exists, return an error
        return res.status(400).json({ error: "Email is already in use." });
      } else {
        // Email is not in use, proceed with user registration
        const newUserRef = db.ref("users").push();
        const userId = newUserRef.key;

        newUserRef
          .set({
            userId,
            email,
            username,
            password,
            accepted: false,
          })
          .then(() => {
            console.log("Data written successfully!");
            res.json({
              message: "Registration successful!",
              userId,
              email,
              username,
            });
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
            res.status(500).json({ error: "Failed to register user." });
          });
      }
    })
    .catch(error => {
      console.error("Error checking email existence: ", error);
      res.status(500).json({ error: "Failed to register user." });
    });
});

app.put("/editUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  const { email, username, password } = req.body;
  console.log(email);
  try {
    const snapshot = await db.ref(`users/${userId}`).once("value");
    const user = snapshot.val();
    if (!user) {
      throw new Error("User not found");
    }

    // Update the user data with the new values
    await db.ref(`users/${userId}`).update({
      email,
      username,
      password,
    });

    console.log("User updated successfully.", userId);
    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error editing user: ", error);
    res.status(500).json({ error: "Failed to edit user." });
  }
});

const user = process.env.USER;
const pass = process.env.USER_PASS;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "hammadnazir106@gmail.com",
    pass: "ctwckfrxebwgvsge",
  },
});

app.post("/acceptUser/:userId", async (req, res) => {
  const userId = req.params.userId;

  const snapshot = await db.ref(`users/${userId}`).once("value");
  const user = snapshot.val();
  console.log(user.email);

  await transporter.sendMail({
    from: "hammadnazir106@gmail.com",
    to: `${user.email}`,
    subject: "Request Accepted",
    html:`

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f0f0; /* Light grey background for the body */
    }

    .header {
      background-color: #191970; /* Dark blue header */
      color: #800080; /* Dark purple text color */
      text-align: center;
      padding: 20px;
      font-size: 28px; /* Larger font size */
    }

    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
    }

    .card {
      background: #fff; /* White background for the card */
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px; /* Add space between cards */
    }

    .section {
      padding: 20px; /* Increased padding for each section */
      margin: 0; /* Remove margin for each section */
      text-align: center; /* Center align text */
      border-bottom: 1px solid #f0f0f0; /* Light grey separator line between sections */
    }

    .section-gray {
      background-color: #f5f5f5; /* Light grey background for the fourth section */
      padding: 20px; /* Increased padding for the grey section */
      margin: 0; /* Remove margin for the grey section */
      text-align: center; /* Center align text */
    }

    .footer {
      background-color: #191970; /* Dark blue footer */
      color: #FFFF00; /* Dark purple text color */
      text-align: center;
      padding: 15px;
      font-size: 18px; /* Larger font size for the footer */
    }

    .ascii-box {
      border: 2px solid #fff; /* White border for the ASCII box */
      padding: 10px;
      border-radius: 5px;
      display: inline-block;
      font-size: 24px; /* Larger font size for the ASCII box */
    }

    .otp-box {
      border: 2px solid #191970; /* Dark blue border for the OTP box */
      padding: 10px;
      border-radius: 5px;
      display: inline-block;
      font-size: 36px; /* Larger font size for the OTP box */
    }

    
  </style>
</head>

<body>
  <div class="header">
    <div class="ascii-box">[FireWatch]</div>
  </div>

  <div class="container">
    <div class="card">
      <!-- First Section: Big Text -->
      <div class="section">
        <h1 style="font-size: 36px;">Hi,</h1> 
      </div>

  
      <div class="section">
        <p style="font-size: 24px;">Your Request has been Aceepted:</p> 
      </div>

    
    </div>
  </div>

  <!-- Footer Section -->
  <div class="footer">&copy; 2024 FireWatch</div>
</body>
`,
  });

  db.ref(`users/${userId}`)
    .update({ accepted: true })
    .then(() => {
      console.log("User accepted successfully.", userId);
      res.status(200).json({ message: "User accepted successfully." });
    })
    .catch((error) => {
      console.error("Error accepting user: ", error);
      res.status(500).json({ error: "Failed to accept user." });
    });
});
app.post("/sendOTP", async (req, res) => {
  const { email } = req.body;

  const usersRef = db.ref("users");

  usersRef
    .orderByChild("email")
    .equalTo(email)
    .once("value")
    .then(async (snapshot) => {
      const user = snapshot.val();

      if (!user) {
        return res
          .status(404)
          .json({ error: "Email not found in the database." });
      }

      const otp = generateOTP();
      const expirationTime = Date.now() + 2 * 60 * 1000; // OTP valid for 60 seconds

      // Store OTP and expiration time in the cache
      otpCache.set(email, { otp, expirationTime });

      // Get the userId
      const userId = Object.keys(user)[0];

      try {
        await sendOTPByEmail(email, otp);
        // Return the userId along with the success message
        res.status(200).json({ message: "OTP sent successfully, expired in 2 minutes.", userId });
      } catch (error) {
        console.error("Error sending OTP: ", error);
        res.status(500).json({ error: "Failed to send OTP." });
      }
    })
    .catch((error) => {
      console.error("Error checking email in the database: ", error);
      res.status(500).json({ error: "Failed to check email in the database." });
    });
});

async function sendOTPByEmail(email, otp) {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "One-Time Password (OTP)",
    html:`

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f0f0f0; /* Light grey background for the body */
    }

    .header {
      background-color: #191970; /* Dark blue header */
      color: #800080; /* Dark purple text color */
      text-align: center;
      padding: 20px;
      font-size: 28px; /* Larger font size */
    }

    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
    }

    .card {
      background: #fff; /* White background for the card */
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px; /* Add space between cards */
    }

    .section {
      padding: 20px; /* Increased padding for each section */
      margin: 0; /* Remove margin for each section */
      text-align: center; /* Center align text */
      border-bottom: 1px solid #f0f0f0; /* Light grey separator line between sections */
    }

    .section-gray {
      background-color: #f5f5f5; /* Light grey background for the fourth section */
      padding: 20px; /* Increased padding for the grey section */
      margin: 0; /* Remove margin for the grey section */
      text-align: center; /* Center align text */
    }

    .footer {
      background-color: #191970; /* Dark blue footer */
      color: #FFFF00; /* Dark purple text color */
      text-align: center;
      padding: 15px;
      font-size: 18px; /* Larger font size for the footer */
    }

    .ascii-box {
      border: 2px solid #fff; /* White border for the ASCII box */
      padding: 10px;
      border-radius: 5px;
      display: inline-block;
      font-size: 24px; /* Larger font size for the ASCII box */
    }

    .otp-box {
      border: 2px solid #191970; /* Dark blue border for the OTP box */
      padding: 10px;
      border-radius: 5px;
      display: inline-block;
      font-size: 36px; /* Larger font size for the OTP box */
    }

    button {
      background-color: #191970; /* Dark blue button color */
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      display: block; /* Display the button on a new line */
      margin-top: 10px; /* Add some spacing above the button */
    }
  </style>
</head>

<body>
  <div class="header">
    <div class="ascii-box">[FireWatch]</div>
  </div>

  <div class="container">
    <div class="card">
      <!-- First Section: Big Text -->
      <div class="section">
        <h1 style="font-size: 36px;">Hi,</h1> <!-- Larger font size for "Hi" -->
      </div>

      <!-- Second Section: OTP Information -->
      <div class="section">
        <p style="font-size: 24px;">Your one-time password is:</p> <!-- Larger font size for the OTP text -->
        <div class="otp-box">${otp}</div> <!-- Border around the OTP -->
      </div>

      <!-- Third Section: OTP Validity Information -->
      <div class="section">
        <p style="font-size: 20px;">OTP is valid for the next 2 minutes. Please do not share it with anyone.</p> <!-- Adjusted font size -->
      </div>

      <!-- Fourth Section: Contact Us Section with Light Grey Background -->
      <div class="section-gray">
        <p style="font-size: 20px;">If you did not request the OTP, <button style="margin: 10px auto 0">hammadnazir106@gmail.com</button></p>
      </div>
    </div>
  </div>

  <!-- Footer Section -->
  <div class="footer">&copy; 2024 FireWatch</div>
</body>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send email: " + error);
  }
}
app.post("/verifyOTP", async (req, res) => {
  const { email, enteredOTP } = req.body;
  const cachedOTPData = otpCache.get(email);

  if (!cachedOTPData) {
    return res
      .status(404)
      .json({ error: "OTP data not found. Please request a new OTP." });
  }

  const { otp, expirationTime } = cachedOTPData;

  if (otp.toString().trim() === enteredOTP.toString().trim()) {
    const currentTime = Date.now();
    if (currentTime > expirationTime) {
      return res
        .status(401)
        .json({ error: "OTP has expired. Please request a new OTP." });
    }

    res.status(200).json({ message: "OTP verified successfully." });
  } else {
    return res.status(401).json({ error: "Invalid OTP. Please try again." });
  }
});

app.post("/signin", (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Username or email and password are required.",
    });
  }

  // Check if the user exists and has the correct password
  db.ref("users")
    .orderByChild("username")
    .equalTo(identifier)
    .once("value")
    .then((usernameSnapshot) => {
      const usernameUser = usernameSnapshot.val();

      // Check if the user exists and has the correct password
      db.ref("users")
        .orderByChild("email")
        .equalTo(identifier)
        .once("value")
        .then((emailSnapshot) => {
          const emailUser = emailSnapshot.val();

          if (!usernameUser && !emailUser) {
            return res.status(401).json({
              success: false,
              message: "User not found.",
            });
          }

          // Choose the user data based on username or email match
          const user = usernameUser || emailUser;

          const userId = Object.keys(user)[0];
          const userData = user[userId];

          if (userData.password === password) {
            if (userData.accepted) {
              // Send all user data to the frontend
              return res.status(200).json({
                success: true,
                message: "User logged in successfully.",
                user: userData,
              });
            } else {
              return res.status(401).json({
                success: false,
                message: "Account not accepted. Contact administrator.",
              });
            }
          } else {
            return res.status(401).json({
              success: false,
              message: "Invalid credentials.",
            });
          }
        })
        .catch((error) => {
          console.error("Error during sign in:", error);
          return res.status(500).json({
            success: false,
            message: "Error during sign in.",
          });
        });
    })
    .catch((error) => {
      console.error("Error during sign in:", error);
      return res.status(500).json({
        success: false,
        message: "Error during sign in.",
      });
    });
});


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
