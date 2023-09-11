import './App.css';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState } from 'react';
import { useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import { getFirestore, addDoc, collection } from 'firebase/firestore';

import 'react-toastify/dist/ReactToastify.css';

function App() {

  const getBrightSpaceData = async () => {
    const response = await fetch('https://devcop.brightspace.com/d2l/api/lp/1.0/users/whoami');
    const data = await response.json();
    console.log(data);
  }

  const firebaseConfig = {
    apiKey: "AIzaSyA4ooTUJu2hj-eG6NTep0rsn66TfVRhQ0I",
    authDomain: "creation1-118d4.firebaseapp.com",
    projectId: "creation1-118d4",
    storageBucket: "creation1-118d4.appspot.com",
    messagingSenderId: "569290294515",
    appId: "1:569290294515:web:1c0ae782a5b4b67f07e386",
    measurementId: "G-2P4ME3D37F"
  };

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const provider = new GoogleAuthProvider();
  const db = getFirestore();

  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  const auth = getAuth();
  const notify = () => toast(user.firstName + ' ' + user.lastName + ' has been added to the database!');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [duoAuth, setDuoAuth] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [user, setUser] = useState('');
  const [uid, setUid] = useState('');

  const signUp = async () => {
    console.log('signUp started...');
    console.log(email);
    console.log(password)
    console.log(duoAuth)
    console.log(firstName)
    console.log(lastName)
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        setUser(userCredential.user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log(errorCode);
        const errorMessage = error.message;
        console.log(errorMessage);
        // ..
      });
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: firstName,
        last: lastName,
        duoAuth: duoAuth,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.log(error);
    }
    notify();
  }

  const popup = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const signOut = () => {
    // signOut(auth).then(() => {
    //   console.log('Sign-out successful.');
    //   setUid('');
    // }).catch((error) => {
    //   console.log('An error happened.');
    //   console.log(error);
    // });
    console.log('Sign-out successful.');
    setUid('');
  }

  const signIn = () => {
    console.log('signIn started...');
    console.log(email);
    console.log(password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const buttonBackgroundChange = () => {
    document.getElementById('sign-up').style.opacity = '50%';
  }

  useEffect(() => {
    // getBrightSpaceData();
    console.log('useEffect started...');
    console.log(user);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUid(user.uid);
        // ...
      } else {
        // User is signed out
        setUid('');
        // ...
      }
    });
  }, [auth, user])

  return (
    <div className="App">
      <header className="App-header">
        <div className='Nav-bar'>
          <h2 className='title'>BOILER ASSIGNMENTS</h2>
          {uid !== '' ? (
            <div className='display' onClick={signOut}>{user}</div>
          ) : (
            <div className='sign-in' onClick={popup} />
          )}
        </div>
        <div className='base'>

        </div>
        <div>
          <div className="Log-in">
            <form className="Log-in-landing"  >
              <div style={{ marginTop: "10px" }} id="sign-up" >
                <b>Sign Up</b>
                <div className='line' />
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}>
                <div className='input'>
                  <label htmlFor='name'><b>First</b></label>
                  <input type="text" placeholder="First Name" id='first-name' required onChange={(e) => { setFirstName(e.target.value) }} />
                </div>
                <div className='input'>
                  <label htmlFor='name'><b>Last</b></label>
                  <input type="text" placeholder="Last Name" id='last-name' required onChange={(e) => { setLastName(e.target.value) }} />
                </div>
              </div>
              <div className="input">
                <label htmlFor="email"><b>Username</b></label>
                <input type="text" placeholder="Purdue Email" id='email' required onChange={(e) => { setEmail(e.target.value) }} />
              </div>
              <div className="input">
                <label htmlFor="password"><b>Password</b></label>
                <input type="password" placeholder="Password to Career Account" id='password' required onChange={(e) => { setPassword(e.target.value) }} />
              </div>
              <div className='input'>
                <label htmlFor='Duo Authentication'><b>Duo Authentication Code</b></label>
                <input type="text" placeholder="Enter your Duo Authentication Code" id='duo-code' required onChange={(e) => { setDuoAuth(e.target.value) }} />
              </div>
              <button type="submit" className='button' onClick={signUp} style={{ marginTop: "30px" }}><b>Submit!</b></button>
            </form>
          </div>
          <form className='Sign-in-box'>
            <div>
              <b>Sign In</b>
            </div>
            <div className='line' />
            <div className="input">
              <label htmlFor="email"><b>Username</b></label>
              <input type="text" placeholder="Purdue Email" id='sign-in-email' required style={{ width: "300px" }} />
            </div>
            <div className="input">
              <label htmlFor="password"><b>Password</b></label>
              <input type="password" placeholder="Password to Career Account" id='sign-in-password' required style={{ width: "300px" }} />
            </div>
            <button type="submit" className='button' onClick={signIn} style={{ marginTop: "20px", marginBottom: "20px" }}><b>Submit!</b></button>
          </form>
        </div>
        <footer className='footer'>
          <p>© 2023 Khwaja</p>
        </footer>
      </header>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default App;
