const db = require('./database');
const bcrypt = require('bcrypt');

class Sign
{
    async up(name, user_name, password, email)
    {
        let regExpEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
        let emailOk = regExpEmail.test(email);
        let test = regExpEmail.test(email);
        if (name === '' || user_name === '' || password === '' || email === '') return {"error": "Debes llenar todos los datos"};
        else if ((await db.query(`SELECT id FROM users WHERE user_name = '${user_name}'`))[0]) return {"error": "Nombre de usuario en uso"};
        else if (!emailOk) return {"error": "Debes ingresar un correo válido"};
        else if ((await db.query(`SELECT id FROM private WHERE email = '${email}'`))[0]) return {"error": "Este correo ya está registrado"};
        else
        {
            password = await bcrypt.hash(password, 8);
            await db.query(`INSERT INTO users(name, user_name, created_at) VALUES('${name}', '${user_name}', NOW())`);
            let id = await db.query(`SELECT id FROM users WHERE user_name = '${user_name}'`)
            id = id[0].id
            await db.query(`INSERT INTO private(id, user_name, password, email) VALUES(${id}, '${user_name}', '${password}', '${email}')`)
            return {"error": ""};
        }
    }
    async in(data, password)
    {
        if (data === '') return {"error": "Debes utilizar un correo electrónico, nombre de usuario, id o teléfono válido para ingresar"};
        else if (password === '') return {"error": "Debes utilizar una contraseña para ingresar"};
        else
        {
            let id = !isNaN(parseInt(data)) ? parseInt(data) : -1;
            let privateData = (await db.query(`SELECT * FROM private WHERE id = ${id} OR email = '${data}' OR user_name = '${data}'`))[0];
            if (!privateData) return {"error": "Unvalid User or Password"};
            let hash = await privateData.password;
            if (await bcrypt.compare(password, hash))
            {
                let userInfo = await db.query(`SELECT * FROM users WHERE id = ${parseInt(privateData.id)}`);
                return {
                    "error": '',
                    "name": await userInfo[0].name,
                    "user_name": await userInfo[0].user_name,
                    "id": await userInfo[0].id
                };
            }
            else return {"error": "Unvalid User or Password"};
        }
    }
}

module.exports = new Sign();