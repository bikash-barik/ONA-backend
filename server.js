// import nodemailer from "nodemailer";

// let mailTransporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "info.odissanetacademy@gmail.com",
//     pass: "amzd qyqi gmlq ocua",
//   },
// });

// let details = {
//   from: "info.odissanetacademy@gmail.com",
//   to: "21328@iiitu.ac.in",
//   subject: "testing our nodemailer",
//   text: "testing out first sender send by sarthak singh",
// };

// mailTransporter.sendMail(details, (err) => {
//   if (err) {
//     console.log("it has some error", err);
//   } else {
//     console.log("email send successfully !!");
//   }
// });

import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import pkg from "firebase-admin";
const { initializeApp, credential, firestore } = pkg;
import admin from 'firebase-admin';
import cors from "cors"; 

// Initialize Firebase
// var admin = require("firebase-admin");

import serviceAccount from "./odishanetacademynew-firebase-adminsdk-46adh-792aa2dc1e.json" assert { type: "json" };

const adminConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://odishanetacademynew-default-rtdb.firebaseio.com",
};

admin.initializeApp(adminConfig);

// initializeApp(adminConfig);

const app = express();
const port = 5500;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "info.odissanetacademy@gmail.com",
    pass: "amzd qyqi gmlq ocua",
  },
});

// Firebase Firestore setup
const db = admin.firestore();

app.post("/submitForm", async (req, res) => {
  try {
    const { name, email, phonenumber, mscin, interest, message } = req.body;

    // Send email
    const mailOptions = {
      from: email,
      to: "info.odissanetacademy@gmail.com",
      subject: "Form Submission",
      text: `Hello ${name},\nThank you for your submission.
      Msc In : ${mscin} \n
      Phone Number : ${phonenumber}\n
      Interest : ${interest},\n
      Your message: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    // Save form data to Firebase
    const formData = {
      name,
      email,
      phonenumber,
      mscin,
      interest,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("formSubmissions").add(formData);

    res.status(200).send("Form submitted successfully!");
  } catch (error) {
    console.error("thats the ->",error);
    res.status(500).send("Internal Server Error");
  }
});
app,get("/",(req,res)=>{
res.send("server is working")
})
app.post("/contactusform", async (req, res) => {
  try {
    const { name, email, contact, mscin, programs } = req.body;

    // Send email
    const mailOptions = {
      from: email,
      to: "info.odissanetacademy@gmail.com",
      subject: "Form Submission",
      text: `Hello ${name},\nThank you for your submission.
      Msc In : ${mscin} \n
      Contact : ${contact}\n
      Programs: ${programs.join(", ")}\n`,
    };

    await transporter.sendMail(mailOptions);

    // Save form data to Firebase
    const formData = {
      name,
      email,
      contact,
      mscin,
      programs,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("contactusForm").add(formData);

    res.status(200).send("Form submitted successfully!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
