import * as express from 'express';
import { UserController } from '../controllers';

const userRouter = express();

userRouter.post('/', UserController.create);
userRouter.get('/', UserController.getAllusers);
userRouter.get('/:id', UserController.getSingleUser);
userRouter.put('/:id', UserController.updateUser);
userRouter.delete('/:id', UserController.deleteUser);

export default userRouter;