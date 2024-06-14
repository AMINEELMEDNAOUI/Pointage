const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express()
app.use(cors())
app.use(express.json());

const db =mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"secret",
    database:"POINTAGE"
})

app.get('/',(re,res)=>{
    return res.json("From Backend Side");
})

app.get('/periodes', (req, res) => {
    const sql = `SELECT DISTINCT 
        MONTH(PLANDATE) AS Mois,
        YEAR(PLANDATE) AS Annee
    FROM EXT_RHPLANNIN;`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


app.get('/clients',(req,res)=>{
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const pole = req.query.pole;
    const sql =`SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT TIRID FROM EXT_RHPLANNIN WHERE MONTH(PLANDATE)='${MONTH}' AND YEAR(PLANDATE)='${YEAR}' AND STATNATURE='${pole}') AND CODESTAT='05'`;
    db.query(sql,(err,data)=>{
        if(err)return res.json(err);
        return res.json(data);
    })
})
app.get('/sites', (req, res) => {
    const clientId = req.query.TIRID;
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const pole = req.query.pole; 
    const sql = `SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT ADRID FROM EXT_RHPLANNIN WHERE TIRID='${clientId}' AND MONTH(PLANDATE)='${MONTH}' AND YEAR(PLANDATE)='${YEAR}' AND STATNATURE='${pole}') AND CODESTAT='07'`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/poles', (req, res) => {
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const sql = `SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT STATNATURE FROM EXT_RHPLANNIN WHERE MONTH(PLANDATE)='${MONTH}' AND YEAR(PLANDATE)='${YEAR}') AND CODESTAT='04'`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/villes', (req, res) => {
    const clientId = req.query.TIRID; 
    const siteId = req.query.ADRID; 
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const pole = req.query.pole; 
    const sql = `SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT VILLCODE FROM EXT_RHPLANNIN WHERE TIRID='${clientId}' AND ADRID='${siteId}' AND MONTH(PLANDATE)='${MONTH}' AND YEAR(PLANDATE)='${YEAR}' AND STATNATURE='${pole}') AND CODESTAT='06'`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})



app.get('/planning', (req, res) => {
    const clientId = req.query.TIRID; 
    const siteId = req.query.ADRID; 
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const pole = req.query.pole;
    const sql = `SELECT PL.PERSMATR , P.PERSNOPE , P.PERSPRPE , PL.PLANPAJO,PL.PLANDATE,TA.LIBEABR  FROM EXT_RHPLANNIN PL JOIN EXT_RHPERSONNES P ON PL.PERSMATR = P.PERSMATR JOIN EXT_RHDETASTAT TA ON PL.STATCLAS = TA.IDDETASTAT WHERE PL.TIRID = '${clientId}'  AND PL.ADRID = '${siteId}'  AND MONTH(PL.PLANDATE) = '${MONTH}'  AND YEAR(PL.PLANDATE) = '${YEAR}'  AND PL.STATNATURE = '${pole}';`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})
app.get('/natuabs', (req, res) => {
    const sql = `SELECT NAABCODE , NATUDESI ,NATUABRE FROM EXT_RHNATUABSE`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/salariesdisp', (req, res) => {
    const clientId = req.query.TIRID; 
    const siteId = req.query.ADRID; 
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const pole = req.query.pole;
    const date=req.query.formattedDate;
    const sql = `SELECT DISTINCT PL.PERSMATR,P.PERSNOPE,P.PERSPRPE,P.PERSNCIN
FROM EXT_RHPLANNIN PL
JOIN EXT_RHPERSONNES P ON PL.PERSMATR = P.PERSMATR
JOIN EXT_RHDETASTAT TA ON PL.STATCLAS = TA.IDDETASTAT
WHERE PL.TIRID = '${clientId}'
  AND PL.ADRID = '${siteId}'
  AND MONTH(PL.PLANDATE) = '${MONTH}'
  AND YEAR(PL.PLANDATE) = '${YEAR}'
  AND PL.STATNATURE = '${pole}'
  AND PL.PERSMATR IN (
      SELECT sal.PERSMATR
      FROM EXT_RHPERSONNES AS sal
      LEFT JOIN EXT_RHPLANNIN AS pla ON sal.PERSMATR = pla.PERSMATR
                                       AND pla.PLANDATE= '${date}'
                                       AND pla.TIRID = '${clientId}'
                                       AND pla.ADRID = '${siteId}'
                                       AND pla.STATNATURE = '${pole}'
      WHERE pla.PERSMATR IS NULL
  );`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.put('/planning', (req, res) => {
    const { client, site, matricule, pole, date, horaire } = req.body;
  
    if (!client || !site || !matricule || !pole || !date || !horaire) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }
  
    const query = `
      UPDATE EXT_RHPLANNIN
      SET PLANPAJO = ?
      WHERE TIRID = ? AND ADRID = ? AND PERSMATR = ? AND STATNATURE = ? AND PLANDATE = ?
    `;
    const values = [horaire, client, site, matricule, pole, date];
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du planning :', err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du planning.' });
      }
      res.json({ message: 'Planning mis à jour avec succès.', results });
    });
  });

app.delete('/planning', (req, res) => {
    const { client, site, matricule, date } = req.body;

    const sql = `DELETE FROM PLANNING WHERE TIRID = ? AND ADRID = ? AND PERSMATR = ? AND PLANDATE = ?`;
    db.query(sql, [client, site, matricule, date], (err, result) => {
        if (err) return res.json(err);
        return res.json({ message: 'Ligne supprimée avec succès', affectedRows: result.affectedRows });
    });
});


app.post('/planning', (req, res) => {
    const { client, site, matricule, date } = req.body; 

    const sql = `INSERT INTO PLANNING (TIRID , ADRID , PERSMATR , PLANDATE) VALUES (?, ?, ?, ?)`;
    db.query(sql, [client, site, matricule, date], (err, result) => {
        if (err) return res.json(err);
        return res.json({ message: 'Ligne ajoutée avec succès', insertId: result.insertId });
    });
});

app.listen(8081,()=>{
    console.log("Listening");
})