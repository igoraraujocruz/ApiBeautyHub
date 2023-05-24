import { connection } from '../../../connection.js'

export class Controller {
    async upload(request, response) {
       const { nprod, picdesc } = request.body;
        try {
            const pool = await connection.query(`INSERT INTO pictures (nprod, picdesc ) VALUES ("${nprod}", "${picdesc}");`);
            return response.status(201).json({ message: 'Upload feito com sucesso.' });

            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro a enviar foto'});
            }
    }
}