import { Router } from 'express';
import { Controller } from './Controller.js';
import ensureAuthenticated from '../../users/infra/ensureAuthenticated.js';

export const categoryRouter = Router();
const controller = new Controller()

categoryRouter.get('/', ensureAuthenticated, controller.get);
categoryRouter.post('/', ensureAuthenticated, controller.create);
categoryRouter.patch('/:id', ensureAuthenticated, controller.update);
categoryRouter.delete('/:id', ensureAuthenticated, controller.delete);