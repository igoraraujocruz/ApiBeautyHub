import { Router } from 'express';
import { Controller } from './Controller.js';
import ensureAuthenticated from '../../users/infra/ensureAuthenticated.js';

export const productsRouter = Router();
const controller = new Controller()

productsRouter.get('/', ensureAuthenticated, controller.get);
productsRouter.post('/', ensureAuthenticated, controller.create);
productsRouter.patch('/:id', ensureAuthenticated, controller.update);
productsRouter.delete('/:id', ensureAuthenticated, controller.delete);

