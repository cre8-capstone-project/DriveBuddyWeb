import { auth, firestore } from "./firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { generateUUID } from "../utils/utils";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

let currentUser = null;

const signUpWithEmailAndPassword = async (
  email,
  password,
  userObj = { name: "", company: "", company_id: "" }
) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    userObj.company_id = generateUUID();
    // Create a document in the "admins" collection
    await setDoc(doc(firestore, "admins", user.uid), {
      email: user.email,
      createdAt: serverTimestamp(),
      company: userObj.company,
      company_id: userObj.company_id,
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
