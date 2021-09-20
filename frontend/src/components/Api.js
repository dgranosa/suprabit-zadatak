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

    static async getBeers(filters, token) {
        return await Api.execute(() => axios.get(Api.url + '/beers', {
            headers: { Authorization: `Bearer ${token}` },
            params: {filter: filters}
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
    
    static async getBeerFood(id, token) {
        return await Api.execute(() => axios.get(Api.url + '/beers/' + id + '/foods', {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }
    
    static async editBeer(id, beer, token) {
        return await Api.execute(() => axios.patch(Api.url + '/beers/' + id, beer, {
            headers: { Authorization: `Bearer ${token}` }
        }));
    }

    static async editBeerFood(beerId, ids, foods, token) {
        var i = 0, j = 0;
        for (; i < ids.length && j < foods.length; i++, j++) {
            // eslint-disable-next-line no-loop-func
            await Api.execute(() => axios.patch(Api.url + '/foods/' + ids[i], {
                name: foods[j]
            },{
                headers: { Authorization: `Bearer ${token}` }
            }));
        }
        while (i < ids.length) {
            // eslint-disable-next-line no-loop-func
            await Api.execute(() => axios.delete(Api.url + '/foods/' + ids[i], {
                headers: { Authorization: `Bearer ${token}` }
            }));
            i++;
        }
        while (j < foods.length) {
            // eslint-disable-next-line no-loop-func
            await Api.execute(() => axios.post(Api.url + '/beers/' + beerId + '/foods', {
                name: foods[j]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            }));
            j++;
        }
    }

    static async deleteBeer(id, token) {
        await Api.execute(() => axios.delete(Api.url + '/beers/' + id + '/foods', {
            headers: { Authorization: `Bearer ${token}` }
        }));
        
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