export const baseUrl = "https://auth.nomoreparties.co";


export const register = async ({ password, email }) => {
  const res = await fetch(`${baseUrl}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  });
  return checkResponse(res);
};

export const login = async ({ password, email }) => {
  const res = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ password, email })
  });
  return checkResponse(res);
};

export const checkToken = async (token) => {
  const res = await fetch(`${baseUrl}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  });

  return checkResponse(res);
}

const checkResponse = res =>  res.ok ? res.json() : Promise.reject(`Ой! Ошибка: ${res.statusText}`); 
