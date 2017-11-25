import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import imageCtrl from '../controllers/image.controller';

const router = express.Router(); // eslint-disable-line new-cap


router.route('/:imageId')
  .get(imageCtrl.get)

router.param('imageId', imageCtrl.load);

export default router;
