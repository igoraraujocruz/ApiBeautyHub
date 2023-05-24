import { Router } from 'express';
import { Controller } from './Controller.js';
import uploadConfig from '../../../uploadConfig.js';
import multer from 'multer';

export const picturesRouter = Router();
const controller = new Controller();
const upload = multer(uploadConfig.multer);

picturesRouter.post('/', upload.single('foto'), controller.upload)