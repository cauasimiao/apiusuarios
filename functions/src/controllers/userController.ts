import {Request, Response} from 'express'
import { db } from '../database';
import { User } from '../models/user';


class UserController {

    static async create(req:Request, res:Response ){

   try {
        const user: User = {
            email: req.body["email"],
            lastName: req.body["lastName"],
            name: req.body["name"],
            telefone: req.body["telefone"]
        }

        const newDoc = await db.collection("users").add(user);
        res.status(201).send(`Created a new user: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`nao conseguiu criar`)
    }
    }


    static async getAllusers(req: Request , res: Response){
        try {
            const userQuerySnapshot = await db.collection("users").get();
            const users: any[] = [];
            userQuerySnapshot.forEach(
                (doc)=>{
                    users.push({
                        id: doc.id,
                        data:doc.data()
                });
                }
            );
            res.status(200).json(users);
        } catch (error) {
            res.status(500).send(error);
        }

    }

    static async getSingleUser(req: Request, res: Response) {
        const id = req.params.id; 

        db.collection("users").doc(id).get()
        .then(user => {
            if(!user.exists) throw new Error('User not found');
            res.status(200).json({id:user.id, data:user.data()})})
        .catch(error => res.status(500).send(error));
    }

    static async deleteUser(req:Request, res:Response){
        db.collection("users").doc(req.params.id).delete()
            .then(()=>res.status(204).send("Document successfully deleted!"))
            .catch(function (error) {
                    res.status(500).send(error);
            });

    }

    static async updateUser(req:Request, res:Response){
        await db.collection("users").doc(req.params.id).set(req.body,{merge:true})
        .then(()=> res.json({id:req.params.id}))
        .catch((error)=> res.status(500).send(error))
    }
  
}

export default UserController