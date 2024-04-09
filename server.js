/*una ditta informatica deve realizarre un sistema di gestione di un parcheggio.Il sistema deve rilasciare un biglietto 
all'entrata(contenente id univoco ed orario entrata).Al termine della sosta l'utente provvederà ad inserire il biglietto 
nel dispositivo previsto per il pagamento che segnerà l'ore di uscita ed il costo della sosta rilasciando un biglietto d'uscita.
Quest'ultima verrà utilizzato per alzare la sbarra all'uscita. All'uscita del veicolo il sistyema provvederà ad eliminare tutti 
i dati della sosta*/
const { response } = require('express');
const express = require('express');
const app = express();
const currentDate = new Date();

const port = 8888;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("compito.db");



app.post('/entrata', (req, res) => {
    const t = currentDate.getTime();
    const x = Date(t);
    const id = Math.random().toString().replace("0.", "");
    db.run(`INSERT INTO biglietto (id, ingresso) VALUES (?,?)`, id, t, (error, rows) => {
        if(error) {
            console.error(error.message);
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(error.response);
        }
        const response = {
            "code": 1,
            "data": "Benvenuto questo sarà il numero del tuo biglietto: " + id + ". L'entrata è stata effetuata: " + x
        }
        res.status(200).send(response);
    });
});

app.put('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    const t = currentDate.getTime();
    const x = Date(t);
    db.run(`UPDATE biglietto SET uscita = ? WHERE id=?`, t, id, (error, result) => {
        if(error){
            console.log(error.message);
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        const response = {
            "code": 1,
            "data": result
        }
        res.status(201).send(response);
    });
});

app.get('/biglietto/:id', (req, res) => {
    const id =req.params.id;
    db.get(`SELECT * FROM biglietto WHERE id=?`, id, (error, row) => {
        if(row != null){
            ingresso = row.ingresso;
            uscita = row.uscita;
            ris = uscita - ingresso;
            ris_secondi = ris / 1000;
            ris_minuti = ris_secondi / 60;
            prezzo = ris_minuti * 0.01;
            if(error){
                console.log(erorr.message);
                response = {
                    "code": -1,
                    "data": error.message
                }
                res.status(500).send(response);
            }
            const response = {
                "code": 1,
                "data": "Il prezzo sarà di: " + prezzo + "€ poiché la sosta è durata: " + ris_minuti + " minuti."
            }
            res.status(200).send(response);
        }
    });
});

app.delete('/biglietto/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM biglietto WHERE id = ?`, id, (error, result) => {
        if(error){
            response = {
                "code": -1,
                "data": error.message
            }
            res.status(500).send(response);
        }
        const response = {
            "code": 1,
            "data": "Grazie per aver effettuato il pagamento. Arrivederci."
        }
        res.status(200).send(response);
    });
});

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});