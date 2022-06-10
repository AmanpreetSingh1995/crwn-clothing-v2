import { initializeApp } from "firebase/app";
import {
	getAuth,
	signInWithRedirect,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyAujGYq9j8w-1QlAedVPAINYbiGAaFLAYU",
	authDomain: "crwn-clothing-db-38e0e.firebaseapp.com",
	projectId: "crwn-clothing-db-38e0e",
	storageBucket: "crwn-clothing-db-38e0e.appspot.com",
	messagingSenderId: "196330171194",
	appId: "1:196330171194:web:306933f0363b8f6e503e03",
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	promt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () =>
	signInWithPopup(auth, googleProvider);
export const signInwithGoogleRedirect = () =>
	signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const createUserDocumentFromAuth = async (
	userAuth,
	additionalInformation = {}
) => {
	if (!userAuth) return;

	const userDocRef = doc(db, "users", userAuth.uid);

	const userSnapshot = await getDoc(userDocRef);

	if (!userSnapshot.exists()) {
		//userSnapshot doesn't exists
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation,
			});
		} catch (error) {
			console.log("error creating the user", error.message);
		}
	}

	return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
	onAuthStateChanged(auth, callback);
