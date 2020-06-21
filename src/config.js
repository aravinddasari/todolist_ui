const dev = {
    todolistHost: "http://localhost:8080"
}

const production = {
 
}

const staging = {


}

const config = (environment => {  
    switch (environment) {
        case 'production':
            return production
        case 'staging':
            return staging
        default:
            return dev
    }
})(process.env.REACT_APP_STAGE || process.env.NODE_ENV)

export default config;