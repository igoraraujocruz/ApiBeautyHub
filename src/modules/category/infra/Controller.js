import { connection } from '../../../connection.js'

export class Controller {
    async get(request, response) {
        try {
            const category = await connection.query('SELECT * FROM category');
            return response.json(category[0]);
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao obter as categorias.' });
            }
    }

    async create(request, response) {
        const { cname } = request.body;
        try {
            const pool = await connection.query(`INSERT INTO category (cname) VALUES ("${cname}");`);
            return response.status(201).json({ message: 'Criado com sucesso.' });

            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao criar a categoria.' });
            }
    }

    async update(request, response) {
        const { id } = request.params;
        const { cname } = request.body;

        try {
            const pool = await connection.query(`UPDATE category SET cname="${cname }" WHERE id=${id};`);
            return response.status(201).json({ message: 'Editato com sucesso.' });
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao editar a categoria.' });
            }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            const pool = await connection.query(`DELETE FROM category WHERE id =${id} `);
            return response.status(201).json({ message: 'Deletado com sucesso.' });
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao deletar categoria.'});
            }
    }
}