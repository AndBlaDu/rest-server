//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//TOKEN
//
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 54 * 30;

//semilla
process.env.SEED = process.env.SEED || 'este-es-el-seed-dev';

//DB

let urlDB;

if (process.env.NODE_ENV === 'dev')

    urlDB = 'mongodb://localhost:27017/cafe';
else
    urlDB = process.env.MONGO_URL;

process.env.URLDB = urlDB;


//GOOGLE CLIENTE
process.env.CLIENT_ID = process.env.CLIENT_ID || '632713451660-kvd8ckpgfuasvmen1ef4mntplj7gvldn.apps.googleusercontent.com';