class Api {
    constructor({ baseUrl, headers }) {
        this._url = baseUrl;
        this._headers = headers
    }

    _request(url, options) {
        return fetch(url, options).then(this._checkResponse);
    }

    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        } else {
            return Promise.reject(`Что-то пошло не так: ${res.status}`);
        }
    }

    getCardsInfo() {
        return this._request(`${this._url}/cards`, {
            method: "GET",
            headers: this._headers
        })
    }

    getProfileInfo() {
        return this._request(`${this._url}/users/me`, {
            method: "GET",
            headers: this._headers
        })
    }


    editProfileInfo(data) {
        return this._request(`${this._url}/users/me`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify(data)
        })
    }

    sendCardData(data) {
        return this._request(`${this._url}/cards`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify(data)
        })
    }

    deleteCard(id) {
        return this._request(`${this._url}/cards/${id}`, {
            method: "DELETE",
            headers: this._headers,
        })
    }


    setLike(id) {
        return this._request(`${this._url}/cards/${id}/likes`, {
            method: "PUT",
            headers: this._headers,
        })
    }

    removeLike(id) {
        return this._request(`${this._url}/cards/${id}/likes`, {
            method: "DELETE",
            headers: this._headers,
        })
    }

    changeAvatar(link) {
        return this._request(`${this._url}/users/me/avatar`, {
            method: "PATCH",
            headers: this._headers,
            body: JSON.stringify(link)
        })
    }
}

const api = new Api({
    baseUrl: "https://mesto.nomoreparties.co/v1/cohort-50",
    headers: {
        authorization: "5c6bea92-b6ce-497a-bd3b-67e992c0fccd",
        "Content-Type": "application/json"
    }
});

export default api;