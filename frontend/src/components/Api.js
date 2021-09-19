import axios from 'axios';;

class Api {
    static url = 'http://localhost:3000';

    static async login(user, pass) {
        return await Api.execute(() => axios.post(Api.url + '/users/login', {
            email: user,
            password: pass,
        }));
    }

    static async register(user, pass) {
        return await Api.execute(() => axios.post(Api.url + '/users/sign-up', {
            email: user,
            password: pass,
        }));
    }

    static async getBeers(token) {
        return await Api.execute(() => axios.get(Api.url + '/beers', {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }

    static async addBeer(beer, token) {
        return await Api.execute(() => axios.post(Api.url + '/beers', beer, {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }
    
    static async getBeer(id, token) {
        return await Api.execute(() => axios.get(Api.url + '/beers/' + id, {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }
    
    static async editBeer(id, beer, token) {
        return await Api.execute(() => axios.patch(Api.url + '/beers/' + id, beer, {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }

    static async deleteBeer(id, token) {
        return await Api.execute(() => axios.delete(Api.url + '/beers/' + id, {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }

    static async execute(req) {
        try {
            const resp = await req();
            return [true, resp];
        } catch (err) {
            return [false, err.response];
        }
    }
}

export default Api;