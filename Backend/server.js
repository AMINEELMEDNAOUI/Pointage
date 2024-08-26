const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const moment = require('moment');
const cookieParser =require('cookie-parser');
const jwt =require('jsonwebtoken');

const app = express()
app.use(cors(
    {
        origin:["http://localhost:5173"],
        methods:["POST,GET","PUT","DELETE"],
        credentials:true
    }
))
app.use(express.json());
app.use(cookieParser());

const db =mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
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
    const SCPROUTI=req.query.SCPROUTI;
    const sql =`SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT CY.TIRID
FROM EXT_RHGENECYCL1 CY
INNER JOIN EXT_RHSECUPLAN C ON CY.IDENTECYCL = C.IDENTECYCL
INNER JOIN EXT_RHGENECYCL1 G ON G.IDENTECYCL = C.IDENTECYCL
WHERE C.SCPROUTI = '${SCPROUTI}'
AND EXISTS (
    SELECT 1
    FROM EXT_RHPLANNIN P
    INNER JOIN EXT_RHGENECYCL1 GE ON P.IDENTECYCL = GE.IDENTECYCL
    WHERE GE.TIRID = CY.TIRID
    AND GE.ADRID = CY.ADRID
    AND MONTH(P.PLANDATE)='${MONTH}' AND YEAR(P.PLANDATE)='${YEAR}'
    AND P.STATNATURE='${pole}'
)) AND CODESTAT='05';`;
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
    const SCPROUTI=req.query.SCPROUTI;
    const sql = `SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT CY.ADRID
FROM EXT_RHGENECYCL1 CY
INNER JOIN EXT_RHSECUPLAN C ON CY.IDENTECYCL = C.IDENTECYCL
INNER JOIN EXT_RHGENECYCL1 G ON G.IDENTECYCL = C.IDENTECYCL
WHERE C.SCPROUTI = '${SCPROUTI}'
AND EXISTS (
    SELECT 1
    FROM EXT_RHPLANNIN P
    INNER JOIN EXT_RHGENECYCL1 GE ON P.IDENTECYCL = GE.IDENTECYCL
    WHERE GE.TIRID = CY.TIRID
    AND GE.ADRID = CY.ADRID
    AND MONTH(P.PLANDATE)='${MONTH}' AND YEAR(P.PLANDATE)='${YEAR}'
    AND P.STATNATURE='${pole}'
    AND P.TIRID='${clientId}'
)) AND CODESTAT='07';`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.get('/poles', (req, res) => {
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const SCPROUTI=req.query.SCPROUTI;
    const sql = `SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT CY.STATNATURE
FROM EXT_RHGENECYCL1 CY
INNER JOIN EXT_RHSECUPLAN C ON CY.IDENTECYCL = C.IDENTECYCL
INNER JOIN EXT_RHGENECYCL1 G ON G.IDENTECYCL = C.IDENTECYCL
WHERE C.SCPROUTI = '${SCPROUTI}'
AND EXISTS (
    SELECT 1
    FROM EXT_RHPLANNIN P
    INNER JOIN EXT_RHGENECYCL1 GE ON P.IDENTECYCL = GE.IDENTECYCL
    WHERE GE.TIRID = CY.TIRID
    AND GE.ADRID = CY.ADRID
    AND MONTH(P.PLANDATE)='${MONTH}' AND YEAR(P.PLANDATE)='${YEAR}'
)) AND CODESTAT='04';`;
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
    const SCPROUTI=req.query.SCPROUTI;
    const sql = `SELECT DISTINCT IDDETASTAT , LIBESTAT FROM EXT_RHDETASTAT WHERE IDDETASTAT IN (SELECT CY.VILLCODE
FROM EXT_RHGENECYCL1 CY
INNER JOIN EXT_RHSECUPLAN C ON CY.IDENTECYCL = C.IDENTECYCL
INNER JOIN EXT_RHGENECYCL1 G ON G.IDENTECYCL = C.IDENTECYCL
WHERE C.SCPROUTI = '${SCPROUTI}'
AND EXISTS (
    SELECT 1
    FROM EXT_RHPLANNIN P
    INNER JOIN EXT_RHGENECYCL1 GE ON P.IDENTECYCL = GE.IDENTECYCL
    WHERE GE.TIRID = CY.TIRID
    AND GE.ADRID = CY.ADRID
    AND MONTH(P.PLANDATE)='${MONTH}' AND YEAR(P.PLANDATE)='${YEAR}'
    AND P.STATNATURE='${pole}'
    AND P.TIRID='${clientId}'
    AND P.ADRID='${siteId}'
)) AND CODESTAT='06';`;
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
    const sql = `SELECT PL.PERSMATR , P.PERSNOPE , P.PERSPRPE , PL.PLANPAJO,PL.PLANDATE,TA.LIBEABR,PL.PLANNBHE , (PL.PLANNBHE/PL.PLANBAJO) AS NBREJR ,PL.ETATVALI FROM EXT_RHPLANNIN PL JOIN EXT_RHPERSONNES P ON PL.PERSMATR = P.PERSMATR JOIN EXT_RHDETASTAT TA ON PL.STATCLAS = TA.IDDETASTAT WHERE PL.TIRID = '${clientId}'  AND PL.ADRID = '${siteId}'  AND MONTH(PL.PLANDATE) = '${MONTH}'  AND YEAR(PL.PLANDATE) = '${YEAR}'  AND PL.STATNATURE = '${pole}';`;
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

app.get('/salariesdispmc', (req, res) => {
    const clientId = req.query.TIRID; 
    const siteId = req.query.ADRID; 
    const MONTH = req.query.MONTH;
    const YEAR = req.query.YEAR;
    const pole = req.query.pole;
    const date = req.query.formattedDate;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    let sql = '';

    if (pole === '1122') {
        
        sql = `SELECT DISTINCT PL.PERSMATR, P.PERSNOPE, P.PERSPRPE, P.PERSNCIN
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
                                               AND pla.PLANDATE BETWEEN '${startDate}' AND '${endDate}'
                                               AND pla.TIRID = '${clientId}'
                                               AND pla.ADRID = '${siteId}'
                                               AND pla.STATNATURE = '${pole}'
                                               AND (
                                                   (pla.PLANDEHE <= '${startTime}' AND pla.PLANFIHE >= '${endTime}') OR
                                                   (pla.PLANDEHE >= '${startTime}' AND pla.PLANDEHE < '${endTime}') OR
                                                   (pla.PLANFIHE > '${startTime}' AND pla.PLANFIHE <= '${endTime}')
                                               )
                  WHERE pla.PERSMATR IS NULL
              );`;
    } else {
       
        sql = `SELECT DISTINCT PL.PERSMATR, P.PERSNOPE, P.PERSPRPE, P.PERSNCIN
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
                                           AND pla.PLANDATE BETWEEN '${startDate}' AND '${endDate}'
                                           AND pla.TIRID = '${clientId}'
                                           AND pla.ADRID = '${siteId}'
                                           AND pla.STATNATURE = '${pole}'
                                           
              WHERE pla.PERSMATR IS NULL
          );`;
    }

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});


app.get('/salariesdispmp', (req, res) => {
    const clientId = req.query.TIRID; 
    const MONTH = req.query.MONTH;
    const YEAR = req.query.YEAR;
    const pole = req.query.pole;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    let sql = '';

    if (pole === '1122') {
        
        sql = `SELECT DISTINCT PL.PERSMATR, P.PERSNOPE, P.PERSPRPE, P.PERSNCIN
            FROM EXT_RHPLANNIN PL
            JOIN EXT_RHPERSONNES P ON PL.PERSMATR = P.PERSMATR
            JOIN EXT_RHDETASTAT TA ON PL.STATCLAS = TA.IDDETASTAT
            WHERE PL.TIRID = '${clientId}'
              AND MONTH(PL.PLANDATE) = '${MONTH}'
              AND YEAR(PL.PLANDATE) = '${YEAR}'
              AND PL.STATNATURE = '${pole}'
              AND PL.PERSMATR IN (
                  SELECT sal.PERSMATR
                  FROM EXT_RHPERSONNES AS sal
                  LEFT JOIN EXT_RHPLANNIN AS pla ON sal.PERSMATR = pla.PERSMATR
                                               AND pla.PLANDATE BETWEEN '${startDate}' AND '${endDate}'
                                               AND pla.TIRID = '${clientId}'
                                               AND pla.STATNATURE = '${pole}'
                                               AND (
                                                   (pla.PLANDEHE <= '${startTime}' AND pla.PLANFIHE >= '${endTime}') OR
                                                   (pla.PLANDEHE >= '${startTime}' AND pla.PLANDEHE < '${endTime}') OR
                                                   (pla.PLANFIHE > '${startTime}' AND pla.PLANFIHE <= '${endTime}')
                                               )
                  WHERE pla.PERSMATR IS NULL
              );`;
    } else {
        sql = `SELECT DISTINCT PL.PERSMATR, P.PERSNOPE, P.PERSPRPE, P.PERSNCIN
            FROM EXT_RHPLANNIN PL
            JOIN EXT_RHPERSONNES P ON PL.PERSMATR = P.PERSMATR
            JOIN EXT_RHDETASTAT TA ON PL.STATCLAS = TA.IDDETASTAT
            WHERE PL.TIRID = '${clientId}'
              AND MONTH(PL.PLANDATE) = '${MONTH}'
              AND YEAR(PL.PLANDATE) = '${YEAR}'
              AND PL.STATNATURE = '${pole}'
              AND PL.PERSMATR IN (
                  SELECT sal.PERSMATR
                  FROM EXT_RHPERSONNES AS sal
                  LEFT JOIN EXT_RHPLANNIN AS pla ON sal.PERSMATR = pla.PERSMATR
                                               AND pla.PLANDATE BETWEEN '${startDate}' AND '${endDate}'
                                               AND pla.TIRID = '${clientId}'
                                               AND pla.STATNATURE = '${pole}'
                                              
                  WHERE pla.PERSMATR IS NULL
              );`;
    }

    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/salariesdisptd', (req, res) => {
    const MONTH = req.query.MONTH;
    const YEAR = req.query.YEAR;
    const pole = req.query.pole;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;

    let sql = '';

    if (pole === '1122') {
        
        sql = `SELECT PERSMATR ,PERSPRPE,PERSNOPE,PERSNCIN FROM EXT_RHPERSONNES WHERE CODSTA04='${pole}' AND PERSMATR NOT IN (SELECT PERSMATR FROM EXT_RHPLANNIN WHERE PLANDATE BETWEEN '${startDate}' AND '${endDate}' AND STATNATURE='${pole}');`;
    } else {
        sql = `SELECT PERSMATR ,PERSPRPE,PERSNOPE,PERSNCIN FROM EXT_RHPERSONNES WHERE CODSTA04='${pole}' AND PERSMATR NOT IN (SELECT PERSMATR FROM EXT_RHPLANNIN WHERE PLANDATE BETWEEN '${startDate}' AND '${endDate}' AND STATNATURE='${pole}');`;
    }

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
  app.get('/absences', (req, res) => {
    const sql = `
        SELECT 
            PERSMATR, 
            DATE_FORMAT(DATE_ADD(ABSEDEHE, INTERVAL IF(HOUR(ABSEDEHE) = 23, 1, 0) DAY), '%Y-%m-%dT%H:%i:%s.000Z') AS ABSEDEHE,
            DATE_FORMAT(DATE_ADD(ABSEFIHE, INTERVAL IF(HOUR(ABSEFIHE) = 23, 1, 0) DAY), '%Y-%m-%dT%H:%i:%s.000Z') AS ABSEFIHE,
            NAABCODE ,ABSENBHR 
        FROM EXT_RHABSENCES
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des absences :', err);
            res.status(500).json({ error: 'Erreur lors de la récupération des absences' });
        } else {
            console.log('Récupération des absences depuis la base de données :', results);
            res.json(results); 
        }
    });
});






app.post('/absence', (req, res) => {
    const {PERSMATR , NAABCODE , NATUDESI , NATUEFFE,ABSEDEHE,ABSEFIHE,ABSENBHR,ABSEDATE} = req.body; 

    const sql = `INSERT INTO EXT_RHABSENCES (PERSMATR , NAABCODE , NATUDESI , NATUEFFE , ABSEDEHE,ABSEFIHE,ABSENBHR,ABSEDATE) VALUES (?, ?, ?, ?,?, ?, ?, ?)`;
    db.query(sql, [PERSMATR , NAABCODE , NATUDESI , NATUEFFE,ABSEDEHE,ABSEFIHE,ABSENBHR,ABSEDATE], (err, result) => {
        if (err) return res.json(err);
        return res.json({ message: 'Ligne ajoutée avec succès', insertId: result.insertId });
    });
});

app.get('/absence/exist', (req, res) => {
    const { PERSMATR, ABSEDATE } = req.query;
    const sql = 'SELECT COUNT(*) AS count FROM EXT_RHABSENCES WHERE PERSMATR = ? AND ABSEDATE = ?';

    db.query(sql, [PERSMATR, ABSEDATE], (err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'existence de l\'absence :', err);
            res.status(500).json({ error: 'Erreur lors de la vérification de l\'existence de l\'absence' });
        } else {
            const exists = results[0].count > 0;
            res.json({ exists });
        }
    });
});

app.put('/absence/:PERSMATR/:ABSEDATE', (req, res) => {
    const { PERSMATR, ABSEDATE } = req.params;
    const {
        NAABCODE,
        NATUDESI,
        NATUEFFE,
        ABSEDEHE,
        ABSEFIHE,
        ABSENBHR,
    } = req.body;

    const sql = `
        UPDATE EXT_RHABSENCES
        SET NAABCODE = ?, NATUDESI = ?, NATUEFFE = ?, ABSEDEHE = ?, ABSEFIHE = ?, ABSENBHR = ?
        WHERE PERSMATR = ? AND ABSEDATE = ?
    `;

    db.query(sql, [NAABCODE, NATUDESI, NATUEFFE, ABSEDEHE, ABSEFIHE, ABSENBHR, PERSMATR, ABSEDATE], (err, results) => {
        if (err) {
            console.error('Erreur lors de la mise à jour de l\'absence :', err);
            res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'absence' });
        } else {
            res.json({ message: 'Absence mise à jour avec succès' });
        }
    });
});


const getDatesBetween = (startDate, endDate) => {
    let dates = [];
    let currentDate = moment(startDate);
    let stopDate = moment(endDate);
  
    while (currentDate <= stopDate) {
      dates.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'days');
    }
  
    return dates;
  };
  
  
  



  app.post('/insertEmployee', (req, res) => {
    const {
        PERSMATR, PLANDATE, PLANDATE2, PERSNOPE, PERSPRPE,
        PLANNBHE, PLANDEHE, PLANFIHE,
        PERSMATR2, POLE, CLIENT, CHANTIER
    } = req.body;

    if (!PERSMATR || !PLANDATE || !PERSNOPE || !PERSPRPE || !PLANNBHE || !PLANDEHE || !PLANFIHE || !PERSMATR2 || !POLE || !CLIENT || !CHANTIER) {
        return res.status(400).json({ error: 'Tous les champs requis doivent être fournis.' });
    }

    const dates = getDatesBetween(PLANDATE, PLANDATE2);

    const insertQuery = `
        INSERT INTO EXT_RHPLANNIN (
            PERSMATR, PLANDATE, PERSNOPE, PERSPRPE,
            PLANPAJO, PLANNBHE, PLANDEHE, PLANFIHE,
            PLANJOUR, PLANSEMA, PLANETPL,
            PLANBAJO, PERICODE, 
            PLANCLPA, PLANCLMC, PLANPLCM, PLANCLFI, 
            ETATVALI, ETATCLOT,
            STATZONE, TIRID, TIRCODE, ADRID, PCVID,
            GENUMCYC, GENECLPA, PCVNUM, ARTID, STATCLAS,
            STATNATURE, VILLCODE, IDENTECYCL, ETATCONS
        )
        SELECT
            ?, ?, ?, ?,
            PLANPAJO, ?, ?, ?,
            PLANJOUR, PLANSEMA, PLANETPL,
            PLANBAJO, PERICODE, 
            REPLACE(PLANCLPA, ?, ?), 
            REPLACE(PLANCLMC, ?, ?), 
            REPLACE(PLANPLCM, ?, ?), 
            REPLACE(PLANCLFI, ?, ?), 
            ETATVALI, ETATCLOT,
            STATZONE, TIRID, TIRCODE, ADRID, PCVID,
            GENUMCYC, GENECLPA, PCVNUM, ARTID, STATCLAS,
            STATNATURE, VILLCODE, IDENTECYCL, ETATCONS
        FROM
            EXT_RHPLANNIN
        WHERE
            PERSMATR = ? AND PLANDATE = ? AND STATNATURE = ? AND TIRID = ? AND ADRID = ?;
    `;

    const promises = dates.map((date) => {
        return new Promise((resolve, reject) => {
            const checkExistenceQuery = `
                SELECT COUNT(*) AS count 
                FROM EXT_RHPLANNIN 
                WHERE PERSMATR = ? AND PLANDATE = ? AND STATNATURE = ? AND TIRID = ? AND ADRID = ?;
            `;

            db.query(checkExistenceQuery, [PERSMATR2, date, POLE, CLIENT, CHANTIER], (error, results) => {
                if (error) {
                    return reject('Erreur lors de la vérification de l\'existence: ' + error);
                }

                const count = results[0].count;

                if (count === 0) {
                    db.query(
                        insertQuery,
                        [
                            PERSMATR2, date, PERSNOPE, PERSPRPE, 
                            PLANNBHE, PLANDEHE, PLANFIHE, 
                            PERSMATR, PERSMATR2, PERSMATR, PERSMATR2, 
                            PERSMATR, PERSMATR2, PERSMATR, PERSMATR2,
                            PERSMATR, date, POLE, CLIENT, CHANTIER
                        ],
                        (insertError) => {
                            if (insertError) {
                                return reject('Erreur lors de l\'insertion du salarié: ' + insertError);
                            }
                            resolve();
                        }
                    );
                } else {
                    resolve();
                }
            });
        });
    });

    Promise.all(promises)
        .then(() => res.status(200).json({ message: 'Insertion réussie pour toutes les dates spécifiées.' }))
        .catch((error) => res.status(500).json({ error }));
});



app.get('/heures', (req, res) => {
    const PERSMATR = req.query.PERSMATR; 
    const PLANDATE = req.query.PLANDATE; 
    const pole =req.query.pole ;
    const TIRID = req.query.TIRID ;
    const ADRID = req.query.ADRID;
    const sql =  `
            SELECT PLANDEHE, PLANFIHE, PLANNBHE
            FROM EXT_RHPLANNIN
            WHERE PERSMATR = '${PERSMATR}' AND PLANDATE = '${PLANDATE}' AND STATNATURE = '${pole}' AND TIRID = '${TIRID}' AND ADRID = '${ADRID}'
        `;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})



app.post('/login', (req, res) => {
    const sql = "SELECT SCPROUTI, SCDESUTI, SCMOTPAS FROM SECURITE WHERE SCPROUTI=? AND SCMOTPAS=?";
    db.query(sql, [req.body.Name, req.body.Password], (err, data) => {
      if (err) return res.json({ Message: "Erreur côté serveur" });
      if (data.length > 0) {
        const name = data[0].SCDESUTI;
        const scprouti = data[0].SCPROUTI; 
        const token = jwt.sign({ name, scprouti }, "our-jsonwebtoken-secret-key", { expiresIn: '1d' });
        res.cookie('token', token);
        return res.json({status:"Success", token, Message: `Bienvenue ${name} !`});
      } else {
        return res.json({Message:"nom ou mot de passe incorrect"});
      }
    });
  });

  

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ status: "Success", Message: "Déconnexion avec succès" });
});

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;
    
    if (token) {
        jwt.verify(token, 'our-jsonwebtoken-secret-key', (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = {
                name: decoded.name,
                scprouti: decoded.scprouti
            };
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.get('/protected-route', authenticateJWT, (req, res) => {
    res.json({ name: req.user.name, scprouti: req.user.scprouti });
});


app.put('/planning2', (req, res) => {
    const clientId = req.body.TIRID; 
    const siteId = req.body.ADRID; 
    const MONTH =req.body.MONTH ;
    const YEAR = req.body.YEAR ;
    const pole = req.body.pole;
  
    if (!clientId || !siteId || !MONTH || !YEAR|| !pole ) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }
  
    
    const query = `
      UPDATE EXT_RHPLANNIN
      SET ETATVALI = 0
      WHERE TIRID = ? AND ADRID = ? AND STATNATURE = ? AND MONTH(PLANDATE) = ? AND YEAR(PLANDATE) = ?
    `;
    const values = [clientId, siteId, pole,MONTH,YEAR];
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Erreur lors de la mise à jour du planning :', err);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du planning.' });
      }
      res.json({ message: 'Planning mis à jour avec succès.', results });
      console.log('Planning mis à jour avec succès.', results);
    });
  });

  app.get('/etatvali', (req, res) => {
    const clientId = req.query.TIRID; 
    const siteId = req.query.ADRID; 
    const MONTH =req.query.MONTH ;
    const YEAR = req.query.YEAR ;
    const pole = req.query.pole;
    const sql = `SELECT ETATVALI FROM EXT_RHPLANNIN WHERE TIRID = '${clientId}'  AND ADRID = '${siteId}'  AND MONTH(PLANDATE) = '${MONTH}'  AND YEAR(PLANDATE) = '${YEAR}'  AND STATNATURE = '${pole}' LIMIT 1;`;
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})


app.listen(8081,()=>{
    console.log("Listening");
})