import axios from 'axios'

const headers = {
    'Content-Type': 'application/json',
}

const clientAxios = axios.create({
    headers: headers
})


const GET = (url, params, successCB, errorCb) => {
    const config = {}
    console.log(params)
    if (params) config.params = params
    console.log(url);
    clientAxios
        .get(url, config)
        .then(response => {
            console.log(response)
            if (successCB) successCB(response.data)
        })
        .catch(error => {
            if (error.response && error.response.data && error.response.data.message && errorCb) 
                errorCb(error.response.data.message)
            else if (errorCb)
                errorCb(error)
        })
}

const POST = (url, params, data, successCB, errorCb) => {
    const config = {}
    if (params) config.params = params
    clientAxios
        .post(url, data, config)
        .then(response => {
            if (successCB) console.log(response)
            successCB(response.data)
        })
        .catch(error => {
            console.log(error.response)
            if (error.response && error.response.data && (error.response.data.message || error.response.data.error.message)  && errorCb) 
                errorCb((error.response.data.message || error.response.data.error.message))
            else if (errorCb)
                errorCb(error)
        })
}

const PUT = (url, params, data, successCb, errorCb) => {
    const config = {}
    if (params) config.params = params
    clientAxios
        .put(url, data, config)
        .then(response => {
            if (successCb) console.log(response)
            successCb(response.data)
        })
        .catch(error => {
            console.log(error)
            if (error.response && error.response.data && error.response.data.message && errorCb) 
                errorCb(error.response.data.message)
            else if (errorCb)
                errorCb(error)
        })
}

const DELETE = (url, params, successCb, errorCb) => {
    const config = {}
    if (params) config.params = params

    clientAxios
        .delete(url, config)
        .then(response => {
            if (successCb) console.log(response)
            successCb(response.data)
        })
        .catch(error => {
            console.log(error)
            if (errorCb) errorCb(error.message)
        })
}





export default {
    GET,
    POST,
    PUT,
    DELETE,
    
}
