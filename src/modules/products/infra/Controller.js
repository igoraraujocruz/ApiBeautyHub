import { connection } from '../../../connection.js'

export class Controller {
    async get(request, response) {
        try {
            const products = await connection.query('SELECT * FROM products');
            return response.json(products);
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao obter as reservas.' });
            }
    }

    async create(request, response) {
        const { pname, descr, category_id, dt_validade } = request.body;
        try {
            const pool = await connection.query(`INSERT INTO products (pname, descr, category_id, dt_validade) VALUES ("${pname}", "${descr}", ${category_id}, ${Date.parse(dt_validade)});`);
            return response.status(201).json({ message: 'Criado com sucesso.' });

            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao obter as reservas.' });
            }
    }

    async update(request, response) {
        const { id } = request.params;
        const { pname, descr, category_id, dt_validade } = request.body;
        const product = await connection.query(`SELECT * FROM products WHERE id=${id}`);
        const pnameAtt = product[0][0].pname
        const descrAtt = product[0][0].descr
        const category_idAtt = product[0][0].category_id
        const dt_validadeAtt = product[0][0].dt_validade

        try {
            const pool = await connection.query(`UPDATE products SET pname="${pname ? pname : pnameAtt}", descr="${descr ? descr : descrAtt}", dt_validade="${dt_validade ? Date.parse(dt_validade) : Date.parse(dt_validadeAtt)}", category_id=${category_id ? category_id : category_idAtt} WHERE id=${id} `);
            return response.status(201).json({ message: 'Editato com sucesso.' });
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao obter as reservas.' });
            }
    }

    async delete(request, response) {
        const { id } = request.params;

        try {
            const pool = await connection.query(`DELETE FROM products WHERE id =${id} `);
            return response.status(201).json({ message: 'Deletado com sucesso.' });
            } catch (error) {
                console.error(error);
                return response.status(500).json({ message: 'Erro ao deletar produto.' });
            }
    }
}