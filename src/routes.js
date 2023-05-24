import { Router } from 'express';
import { usersRouter } from './modules/users/infra/routes.js';
import { categoryRouter } from './modules/category/infra/routes.js';
import { productsRouter } from './modules/products/infra/routes.js';
import { picturesRouter } from './modules/pictures/infra/routes.js';


const routes = Router();

routes.use('/users', usersRouter);
routes.use('/category', categoryRouter);
routes.use('/products', productsRouter);
routes.use('/pictures', picturesRouter);

export default routes
