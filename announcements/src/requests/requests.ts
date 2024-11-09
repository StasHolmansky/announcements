const username = import.meta.env.VITE_APP_USERNAME;
const password = import.meta.env.VITE_APP_PASSWORD;
const origin = import.meta.env.VITE_APP_ORIGIN;

// Функция для получения токена
export async function fetchToken(host: string): Promise<string> {
    try {
      const response = await fetch(`${host}/login`, {
        method: 'POST',
        mode: 'cors', // Режим CORS для кросс-доменных запросов
        headers: {
          'Content-Type': 'application/json',
          'Origin': origin, // Укажите Origin, если сервер ожидает его
        },
        body: JSON.stringify({
          username,   // Используем значение из переменной окружения    
          password,   // Используем значение из переменной окружения    
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch token');
      }
  
      const data = await response.json();
      return data.accessToken;
    } catch (error: any) {
      alert(`Error fetching token from host: ${host}. Error: ${error.message}`);
      throw error;
    }
  }