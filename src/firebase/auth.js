import { auth, firestore } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { createCompany, createAdmin } from "../api/api.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

let currentUser = null;

const signUpWithEmailAndPassword = async (
  email,
  password,
  userObj = { name: "", company: "" }
) => {
  try {
    // Create user in Firebase Authentication
    const companyDoc = await createCompany(userObj.company);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Create a document in the "admins" collection
    await createAdmin(user.uid, {
      email: user.email,
      company_id: companyDoc.data.id,
      name: userObj.name,
    });

    return user; // Successfully created user and Firestore doc
  } catch (error) {
    console.error("Auth Error", error.code, error.message);
    throw error; // Throw the error so it can be handled elsewhere
  }
};
const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Retrieve the admin document from Firestore
    const adminDocRef = doc(firestore, "admins", userId);
    const adminDoc = await getDoc(adminDocRef);

    if (!adminDoc.exists()) {
      throw new Error("Admin record not found.");
    }
    return { id: adminDoc.id, ...adminDoc.data() }; // Return the document with ID
  } catch (error) {
    console.error("Auth Error", error.code, error.message);
    throw error; // Throw the error so it can be handled by the caller
  }
};
export { signUpWithEmailAndPassword, logInWithEmailAndPassword, currentUser };
