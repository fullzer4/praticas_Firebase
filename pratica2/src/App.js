import firebase from "./firebaseConnection"
import {useState} from "react"

function App() { //definir variaveis
  const [email, setEmail] =useState("")
  const [senha, setSenha] =useState("")
  const [cargo, setCargo] =useState("")
  const [nome, setNome] =useState("")

  const [user, setUser] =useState({})

  async function novoUsuario(){ //criar novo usuario
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then( async (value) =>{ //passando dados de autenticacao para o banco de dados
      await firebase.firestore().collection("users")
      .doc(value.user.uid) 
      .set({
        nome: nome,
        cargo: cargo,
        status: true,
      })
      .then(()=>{
        setNome("")
        setCargo("")
        setEmail("")
        setSenha("")
      })
    })
    .catch((error) =>{ //erro
      if(error.code === "auth/weak-password"){
        alert("senha muito fraca")
      }else if(error.code === "auth/email-already-in-use"){
        alert("email ja existe")
      }
      else if(error.code === "auth/invalid-email"){
        alert("email invalido")
      }

    })
  }

  async function logout(){ //desogar
    await firebase.auth().signOut()
    setUser({})
  }

  async function login(){
    await firebase.auth().signInWithEmailAndPassword(email,senha)
    .then( async (value)=>{
      await firebase.firestore().collection("users")
      .doc(value.user.uid)
      .get()
      .then((snapshot)=>{
        setUser({
          nome: snapshot.data().nome,
          cargo: snapshot.data().cargo,
          status: snapshot.data().status,
          email: value.user.email
        })
      })

    })
    .catch((error)=>{
      console.log(`Erro ao logar ${error}`);
    })
  }

  return (
    <div className="App">
      <div>
        <h1>Autenticacao:</h1><br/>
        <label>Nome</label>
        <input type="text" value={nome} onChange={ (e)=> setNome(e.target.value)}/><br/>
        <label>Cargo</label>
        <input type="text" value={cargo} onChange={ (e)=> setCargo(e.target.value)}/><br/>
        <label>Email</label>
        <input type="text" value={email} onChange={ (e)=> setEmail(e.target.value)}/><br/>
        <label>Senha</label>
        <input type="password" value={senha} onChange={ (e)=> setSenha(e.target.value)}/><br/>
        <button onClick={login}>Fazer Login</button><br/>
        <button onClick={novoUsuario}>Cadastrar</button><br/>
        <button onClick={logout}> Sair da conta </button><br/><br/>
      </div>

      <hr/><br/>
      {Object.keys(user).length > 0 &&(
        <div> 
          <strong>Ola </strong> {user.nome} <br/>
          <strong>Cargo </strong> {user.cargo} <br/>
          <strong>Email </strong> {user.email} <br/>
          <strong>Status </strong> {String(user.status ? "Ativo" : "Desativado")} <br/>
        </div>
      )} 

    </div>
  );
}

export default App;
