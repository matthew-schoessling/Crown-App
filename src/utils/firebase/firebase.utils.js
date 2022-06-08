import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsfcmDJSyO5GIH8YeVM3ZEgmuc6sPFjGE",
    authDomain: "crwn-project-8b6bb.firebaseapp.com",
    projectId: "crwn-project-8b6bb",
    storageBucket: "crwn-project-8b6bb.appspot.com",
    messagingSenderId: "92702865937",
    appId: "1:92702865937:web:99ded7b967cafb19f44fb0"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
      prompt: 'select_account'
  });

  //Google SignIn
  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

  //Firestore Setup and Document Access 
  export const db = getFirestore();

  // NoSQL stuff (categories which we'll get from firestore itself )
  export const addCollectionAndDocuments = async (collectionKey, objectsToAdd ) =>  {
    const collectionRef = collection(db, collectionKey);
    //Batch is used to make sure transaction happens successfully and fully
    const batch = writeBatch(db);

    objectsToAdd.forEach( (object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase()) //tells collectionRef which db and collectionKey to us
        batch.set(docRef, object) //firebase gives a reference even if it doesn't exist. So set docRef location with that object value

    })

    await batch.commit();

  }

  export const getCategoriesAndDocuments = async () => {
      const collectionRef = collection(db, 'categories');
      const q = query(collectionRef);

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(docSnapshot => docSnapshot.data());

  }
  
  //Storing authentication into Firestore
  export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
    if (!userAuth) return 
    const userDocRef = doc(db, 'users', userAuth.uid);

    const userSnapshot = await getDoc(userDocRef);

    if(!userSnapshot.exists()) {
        const { displayName, email } = userAuth;
        const createdAt = new Date();

        try {
            await setDoc(userDocRef, {
                displayName, 
                email,
                createdAt,
                ...additionalInformation, //
            });
        } catch (error) {
            console.log('error creating the user', error.message);
        }
    }
        return userSnapshot;

  }

  export const createAuthUserWithEmailAndPassword = async (email, password) => {
      if (!email || !password) return;
        
      return await createUserWithEmailAndPassword( auth, email, password);

  }
  export const signInAuthUserWithEmailAndPassword = async (email, password) => {
      if (!email || !password) return;
        
      return await signInWithEmailAndPassword( auth, email, password);
  }

//auth 
  export const signOutUser = async () => await signOut(auth);

  // In user context - Sends in a callback to onAuthStateChanged() in firebase.utils. That call back is called anytime auth is changed
  //Permanent listener now forever when auth is changed. A
export const onAuthStateChangedListener = (callback) => 
    onAuthStateChanged(auth, callback);

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => { //resolve and reject are positive/negative responses to a promise
        const unsubscribe = onAuthStateChanged(
            auth, 
            (userAuth) => {
                unsubscribe();
                resolve(userAuth);
            },
            reject //this will pass an error if it occurs
        )
    })
}