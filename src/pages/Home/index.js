import { Header } from "../../components/Header";
import backgroun from "../../assets/background.png";
import ItemList from "../../components/ItemList";
import { useState } from "react";

import "./styles.css";

function App() {
  const [user, setUser] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [repos, setRepos] = useState(null);
  const [error, setError] = useState(null);

  const handleGetData = async () => {
    setError(null);
    setCurrentUser(null);
    setRepos(null);

    try {
      const userData = await fetch(`https://api.github.com/users/${user}`);
      
      if (userData.status === 404) {
        setError("Usuário não encontrado");
        return;
      }

      const newUser = await userData.json();

      if (newUser.name) {
        const { avatar_url, name, bio, login } = newUser;
        setCurrentUser({ avatar_url, name, bio, login });

        const reposData = await fetch(
          `https://api.github.com/users/${user}/repos`
        );
        const newRepos = await reposData.json();

        if (newRepos.length) {
          setRepos(newRepos);
        }
      }
    } catch (err) {
      setError("Erro ao buscar dados. Tente novamente.");
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="content">
        <img src={backgroun} className="background" alt="background-app"></img>
        <div className="info">
          <div>
            <input
              name="user"
              value={user}
              onChange={(event) => setUser(event.target.value)}
              placeholder="@username"
            />
            <button onClick={handleGetData}>Buscar</button>
          </div>

          {error && <p className="error">{error}</p>}

          {currentUser?.name ? (
            <>
              <div className="profile">
                <img
                  src={currentUser.avatar_url}
                  className="profile-img"
                  alt="imagem de perfil"
                />
                <div>
                  <h2>{currentUser.name}</h2>
                  <span>@{currentUser.login}</span>
                  <p>{currentUser.bio}</p>
                </div>
              </div>
              <hr />
            </>
          ) : null}

          {repos?.length ? (
            <div>
              <h4 className="repositorio">Repositórios</h4>
              {repos.map((repo) => (
                <ItemList
                  key={repo.id}
                  title={repo.name}
                  description={repo.description}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
