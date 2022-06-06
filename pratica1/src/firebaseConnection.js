import firebase from "firebase/app";
import "firebase/firestore"; //banco de dados
import "firebase/auth" //autenticacao

let firebaseConfig = {
    apiKey: "AIzaSyCbj1aFEydMwcBSYT9MwuAerUt4xtlaAYY",
    authDomain: "praticasfirebase.firebaseapp.com",
    projectId: "praticasfirebase",
    storageBucket: "praticasfirebase.appspot.com",
    messagingSenderId: "1040274323033",
    appId: "1:1040274323033:web:cd22e8c5723c890ab9e348",
    measurementId: "G-REMG4PW3Z8"
  };
  
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export default firebase;