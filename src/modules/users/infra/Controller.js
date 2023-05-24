import { connection } from '../../../connection.js'
import jwt from 'jsonwebtoken';
import authConfig from '../../../auth.js';

export class Controller {
    async get(request, response) {
        try {
            const user = await connection.query('SELECT * FROM users');
            return response.json(user[0]);
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao obter usuarios.' });
            }
    }

    async create(request, response) {
        const { email, passwrd } = request.body;
        try {
            const pool = await connection.query(`INSERT INTO users (email, passwrd ) VALUES ("${email}", "${passwrd}");`);
            return response.status(201).json({ message: 'Criado com sucesso.' });

            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao criar usuário'});
            }
    }

    async auth(request, response) {
        const { email, passwrd } = request.body;
        const user = await connection.query(`SELECT * FROM users WHERE email LIKE "${email}" && passwrd LIKE "${passwrd}";`);

        if(user[0][0]?.id == undefined){
            return response.status(404).json({
                message: 'Usuário não encontrado'
            }); 
        } 

        return response.status(201).json({ 
            id: user[0][0].id,
            email: user[0][0].email,
            token: jwt.sign({ token: user[0][0].id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        }); 
    }

    async update(request, response) {
        const { id } = request.params;
        const { email, passwrd } = request.body;
        const user = await connection.query(`SELECT * FROM users WHERE id=${id}`);
        const emailAtt = user[0][0].email
        const passwrdAtt = user[0][0].passwrd

        try {
            const pool = await connection.query(`UPDATE users SET email="${email ? email : emailAtt}", passwrd="${passwrd ? passwrd : passwrdAtt}" WHERE id=${id} `);
            return response.status(201).json({ message: 'Editato com sucesso.' });
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao editar usuario' });
            }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            const pool = await connection.query(`DELETE FROM users WHERE id =${id} `);
            return response.status(201).json({ message: 'Deletado com sucesso.' });
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao deletar produto.' });
            }
    }
}