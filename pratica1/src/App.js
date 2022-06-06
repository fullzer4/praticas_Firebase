import firebase from "./firebaseConnection"
import {useState, useEffect} from "react"

function App() { //definir variaveis
  const [idPost, setIdPost] = useState("")
  const [titulo, setTitulo] = useState("")
  const [autor, setAutor] = useState("")
  const [posts, setPosts] = useState([])

  const [email, setEmail] =useState("")
  const [senha, setSenha] =useState("")
  const [user, setUser]=useState(false)
  const [userLogged, setUserLogged]=useState({})


  useEffect(()=>{
    async function loadPosts(){
      await firebase.firestore().collection("posts")
      .onSnapshot((doc)=>{ //monitorar realtime
        let meusPosts = []

        doc.forEach((item)=>{
          meusPosts.push({
            id:item.id,
            titulo: item.data().titulo,
            autor: item.data().autor,
          })
        })

        setPosts(meusPosts)
      })
    }
    loadPosts()
  }, [])

  useEffect(() =>{
    async function checkLogin(){ //verificar se o usuario esta logado
      await firebase.auth().onAuthStateChanged((user)=>{
        if(user){
          setUser(true)
          setUserLogged({
            uid: user.uid,
            email: user.email
          })
        }else{
          setUser(false)
          setUserLogged({})
        }
      })
    }

    checkLogin()
  },[])

  async function handleAdd(){
    await firebase.firestore().collection("posts") //sera adicionado em post
    .add({ //variaveis a serem adicionadas
      titulo: titulo,
      autor: autor,
    })
    .then(()=>{ //depois limpar campo titulo e autor e printar foi
      console.log("foi");
      setTitulo("")
      setAutor("")
    })
    .catch((error) =>{ //erro
      console.log(`erro: ${error}`);
    })
  }

  async function buscaPost (){
    await firebase.firestore().collection("posts")
    .get()
    .then((snapshot)=> { //pegar 
      let lista = [] //armazena todos os dados
      snapshot.forEach((doc)=>{ //para todos os documentos
        lista.push({
          id: doc.id ,//pegar nome dos documentos
          titulo: doc.data().titulo, //buscar a variavel titulo 
          autor: doc.data().autor,//buscar a variavel autor
        })
      })

      setPosts(lista) //atualiza o state com os posts

    })
    .catch((error) =>{ //erro
      console.log(`erro: ${error}`);
    })
  } 

  async function editarPost(){
    await firebase.firestore().collection("posts")
    .doc(idPost)
    .update({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log("Dados att");
      setIdPost("")
      setAutor("")
      setTitulo("")
    })
    .catch((error) =>{ //erro
      console.log(`erro: ${error}`);
    })
  }

  async function excluirPost(id){
    await firebase.firestore().collection("posts").doc(id)
    .delete()
    .then(()=>{
      alert(`Voce excluiu o post de id: ${id}`)
    })
    .catch((error) =>{ //erro
      console.log(`erro: ${error}`);
    })
  }

  async function novoUsuario(){ //criar novo usuario
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(()=>{
      setEmail("")
      setSenha("")
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
  }

  async function fazerlogin(){
    await firebase.auth().signInWithEmailAndPassword(email,senha)
    .then(()=>{
      console.log("foi");
    })
    .catch((error) =>{
      console.log(`erro: ${error}`);
    })
  }

  return (
    <div className="App">
      {user && (
        <div>
          <strong>Seja Bem vindo</strong>
          <span>{userLogged.uid} - {userLogged.email}</span>
          <br/>
        </div>
      )} 
      <div>
        <h1>Autenticacao:</h1><br/>
        <label>Email</label>
        <input type="text" value={email} onChange={ (e)=> setEmail(e.target.value)}/><br/>
        <label>Senha</label>
        <input type="password" value={senha} onChange={ (e)=> setSenha(e.target.value)}/><br/>
        <button onClick={fazerlogin}>Fazer login</button>
        <button onClick={novoUsuario}>Cadastrar</button><br/>
        <button onClick={logout}> Sair da conta </button><br/><br/>
      </div>
      <hr/>
      <div>
        <h2>banco de Dados:</h2><br/>
        <label>ID:</label>
        <input type="text" value={idPost} onChange={ (e) => setIdPost(e.target.value)}/>

        <label>Titulo:</label>
        <textarea type="text" value={titulo} onChange={ (e) => setTitulo(e.target.value)}/>

        <label>Autor:</label>
        <textarea type="text" value={autor} onChange={ (e) => setAutor(e.target.value)}/>

        <button onClick={ handleAdd }>Cadastrar</button>
        <button onClick={ buscaPost }>Bucar Post</button>
        <button onClick={ editarPost }>Editar</button>

        <ul>
          {posts.map((post)=>{ //busca os posts
            return(
              <li key={post.id}>
                <span>Id - {post.id}</span> <br/>
                <span>Titulo: {post.titulo}</span> <br/>
                <span>Autor: {post.autor}</span> <br/>
                <button onClick={ ()=> excluirPost(post.id)}> Excluir</button> <br/><br/>
              </li>
            )
          })}
        </ul>'
      </div>
    </div>
  );
}

export default App;
