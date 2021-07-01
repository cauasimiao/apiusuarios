//import libraries
import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import * as express from 'express';
import {User} from './models/user';

//inicializar o firebase para acessar o servidor
admin.initializeApp(functions.config().firebase)

const main = express();
const app = express();

main.use('/api/v1', app);


//inicializar o banco de dados e a coleção
const database =  admin.firestore();
const userCollection = "users";

app.post('/users', async(request, response) =>{

    try{
        const user: User = {
            email: request.body["email"],
            lastName: request.body["lastName"],
            name: request.body["name"],
            telefone: request.body["telefone"]
        }

        await database.collection(userCollection).add(user);

        response.status(201).send(`Created user ${user.name}`);

    } catch(error){
        response.status(400).send("confira as informacoes e tente novamente");
    }
});

app.get('/users', async (req, res) => {
    try {
        const userQuerySnapshot = await database.collection(userCollection).get();
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
});

//get a single contact
app.get('/users/:userId', (req,res) => {

    const userId = req.params.userId; 
    database.collection(userCollection).doc(userId).get()
    .then(user => {
        if(!user.exists) throw new Error('User not found');
        res.status(200).json({id:user.id, data:user.data()})})
    .catch(error => res.status(500).send(error));

});


// Delete a user
app.delete('/users/:userId', (req, res) => {
    database.collection(userCollection).doc(req.params.userId).delete()
    .then(()=>res.status(204).send("Document successfully deleted!"))
    .catch(function (error) {
            res.status(500).send(error);
    });
})

// Update user
app.put('/users/:userId', async (req, res) => {
    await database.collection(userCollection).doc(req.params.userId).set(req.body,{merge:true})
    .then(()=> res.json({id:req.params.userId}))
    .catch((error)=> res.status(500).send(error))

});

export const webApi = functions.https.onRequest(main);