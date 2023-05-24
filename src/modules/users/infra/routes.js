import { Router } from 'express';
import { Controller } from './Controller.js';
import ensureAuthenticated from './ensureAuthenticated.js';

export const usersRouter = Router();
const controller = new Controller();

usersRouter.get('/', ensureAuthenticated, controller.get)
usersRouter.post('/', ensureAuthenticated, controller.create);
usersRouter.post('/login', controller.auth);
usersRouter.patch('/:id', ensureAuthenticated, controller.update);
usersRouter.delete('/:id', ensureAuthenticated, controller.delete);