import './App.css';
import { useToken } from './context/TokenContext';
import hostsList from "./hosts";
import { fetchToken } from "./requests/requests"
import { Host } from './types/types';

function App() {
  const { token, setToken } = useToken();
  const hosts: Host[] = hostsList;

  const handleLogin = async (host:{name:string,url:string}) => {
    try {
      const fetchedToken = await fetchToken(host.url);
      setToken((prevTokens) => {
        // Проверяем, есть ли токен для данного хоста
        const existingTokenIndex = prevTokens.findIndex((t) => t.name === host.name);
  
        if (existingTokenIndex !== -1) {
          // Если токен для хоста найден, заменяем его на новый
          const updatedTokens = [...prevTokens];
          updatedTokens[existingTokenIndex] = { name: host.name, token: fetchedToken };
          return updatedTokens;
        } else {
          // Если токен не найден, добавляем новый
          return [...prevTokens, { name: host.name, token: fetchedToken }];
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>Automatic placement of announcements</h1>
      <h3>Select hosts:</h3>
      {
        hosts.map((host, index) => {
          return (
            <div>
              <label>
                <input
                  key={index}
                  type="checkbox"
                  name="host"
                  value={host.name}
                />
                {host.name}
              </label>
            </div>
          )
        })
      }
    </>
  )
}

export default App
