import React, { useState, useEffect } from 'react';
import './home.css';
import Header from './header.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Select } from 'antd';

const { Option } = Select;

function Home() {
  const [clients, setClients] = useState([]);
  const [selectedClientsId, setSelectedClientsId] = useState('');
  const [sites, setSites] = useState([]);
  const [selectedSitesId, setSelectedSitesId] = useState('');
  const [periodes, setPeriodes] = useState([]);
  const [selectedPeriodes, setSelectedPeriodes] = useState('');
  const [poles,setPoles] = useState([]);
  const [selectedPoles ,setSelectedPoles] =useState('')
  const [villes,setVilles] = useState([]);
  const [selectedVilles ,setSelectedVilles] =useState('')
  const [planningData, setPlanningData] = useState([]);
  const [planningDataFromFetch, setPlanningDataFromFetch] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [matriculeValue, setMatriculeValue] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
   
  useEffect(() => {
    fetch(`http://localhost:8081/periodes`)
      .then(res => res.json())
      .then(data => setPeriodes(data))
      .catch(err => console.log(err));
  }, );

  useEffect(() => {
    if (selectedPeriodes && selectedPoles) {
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      const [pole, npole] = selectedPoles.split('-');
      
    fetch(`http://localhost:8081/clients?MONTH=${MONTH}&YEAR=${YEAR}&pole=${pole}`)
      .then(res => res.json())
      .then(data => setClients(data))
      .catch(err => console.log(err));
  }}, [selectedPeriodes,selectedPoles]);

  useEffect(() => {
    if (selectedPeriodes && selectedPoles && selectedClientsId) {
      const [TIRID, NAME] = selectedClientsId.split('-');
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      const [pole, npole] = selectedPoles.split('-');
      fetch(`http://localhost:8081/sites?TIRID=${TIRID}&MONTH=${MONTH}&YEAR=${YEAR}&pole=${pole}`)
        .then(res => res.json())
        .then(data => setSites(data))
        .catch(err => console.log(err));
    }
  }, [selectedPeriodes,selectedPoles,selectedClientsId]);

  useEffect(() => {
    if (selectedPeriodes) {
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      fetch(`http://localhost:8081/poles?MONTH=${MONTH}&YEAR=${YEAR}`)
        .then(res => res.json())
        .then(data => setPoles(data))
        .catch(err => console.log(err));
    }
  }, [selectedPeriodes])

  useEffect(() => {
    if (selectedPeriodes && selectedPoles && selectedClientsId && selectedSitesId) {
      const [TIRID, CNAME] = selectedClientsId.split('-');
      const [ADRID, SNAME] = selectedSitesId.split('-');
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      const [pole, npole] = selectedPoles.split('-');
      fetch(`http://localhost:8081/villes?TIRID=${TIRID}&ADRID=${ADRID}&MONTH=${MONTH}&YEAR=${YEAR}&pole=${pole}`)
        .then(res => res.json())
        .then(data => setVilles(data))
        .catch(err => console.log(err));
    }
  }, [selectedPeriodes,selectedPoles,selectedClientsId,selectedSitesId])
 

  const handleClientChange = value => {
    setSelectedClientsId(value);
    setSelectedSitesId('');
    setSelectedVilles('');
  };

  const handleSiteChange = value => {
    setSelectedSitesId(value);
    setSelectedVilles('');
  };

  const handlePoleChange = value => {
    setSelectedPoles(value);
    setSelectedClientsId('');
    setSelectedSitesId('');
    setSelectedVilles('');
  };

  const handleVilleChange = value => {
    setSelectedVilles(value);
  };

  const handlePeriodeChange = value => {
    setSelectedPeriodes(value);
    setSelectedPoles('');
    setSelectedClientsId('');
    setSelectedSitesId('');
    setSelectedVilles('');
  }
  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  useEffect(() => {
    if (selectedPeriodes) {
      const [month, year] = selectedPeriodes.split('/');
      const daysInMonth = new Date(year, month - 1, 0).getDate();

      const initialData = {};

      for (let i = 1; i <= daysInMonth; i++) {
        initialData[i] = {};
      }

      setPlanningData(initialData);
    }
  }, [selectedPeriodes]);

  useEffect(() => {
    if (selectedClientsId && selectedSitesId && selectedPeriodes) {
      const [month, year] = selectedPeriodes.split('/');

      const url = `http://localhost:8081/planning?client=${selectedClientsId}&site=${selectedSitesId}&month=${month}&year=${year}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          setPlanningDataFromFetch(data);
        })
        .catch(err => console.log(err));
    }
  }, [selectedClientsId, selectedSitesId, selectedPeriodes]);

  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formattDate = dateString => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  };

  const handleUpdate = (matricule, date, currentState) => {
    setSelectedDate(date);
    setCurrentState(currentState);
    setIsFormVisible(true);
    setMatriculeValue(matricule);
  };

  const handleInputChange = event => {
    setCurrentState(event.target.value);
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    const url = 'http://localhost:8081/planning';
    const [year, month, day] = selectedDate.split('-');

    const [selectedMonth, selectedYear] = selectedPeriodes.split('/');
    const requestBody = {
      client: selectedClientsId,
      site: selectedSitesId,
      matricule: matriculeValue,
      annee: selectedYear,
      mois: selectedMonth,
      date: selectedDate
    };

    if (currentState === 'O') {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          fetchUpdatedData();
        })
        .catch(err => console.log(err));
    } else {
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          fetchUpdatedData();
        })
        .catch(err => console.log(err));
    }

    setIsFormVisible(false);
  };

  const fetchUpdatedData = () => {
    const [month, year] = selectedPeriodes.split('/');

    const url = `http://localhost:8081/planning?client=${selectedClientsId}&site=${selectedSitesId}&month=${month}&year=${year}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPlanningDataFromFetch(data);
      })
      .catch(err => console.log(err));
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const uniqueMonthsAndYears = [...new Set(periodes.map(period => formattDate(period.PLANDATE)))];

  // const uniqueMatricules = planningDataFromFetch.reduce((uniqueMatricules, matriculeData) => {
  //   if (!uniqueMatricules.includes(matriculeData.PERSMATR)) {
  //     uniqueMatricules.push(matriculeData.PERSMATR);
  //   }
  //   return uniqueMatricules;
  // }, []);

  // const [selectedMonth, selectedYear] = selectedPeriodes.split('/');

  // const handlePrint = () => {
  //   const doc = new jsPDF('landscape');

  // // Ajouter un titre
  // doc.setFontSize(18);
  // doc.text('Planning', 14, 20);

  // // Ajouter le nom du client
  // doc.setFontSize(12);
  // doc.text(`Client: ${selectedClientsId}`, 14, 40);

  // // Ajouter le nom du site
  // doc.text(`Site: ${selectedSitesId}`, 14, 50);

  // // Ajouter la période
  // doc.text(`Période: ${selectedPeriodes}`, 14, 60);

  // // Ajouter un espace
  // doc.text('', 14, 70);
  
  
  
  //   // Préparer le tableau
  //   const head = [
  //     ['Matricule', ...Array.from({ length: new Date(selectedYear, selectedMonth, 0).getDate() }, (_, i) => formatDate(new Date(selectedYear, selectedMonth - 1, i + 1)))],
  //   ];
  //   const body = uniqueMatricules.map((uniqueMatricule) => {
  //     const matriculeDates = planningDataFromFetch
  //       .filter(matriculeData => matriculeData.PERSMATR === uniqueMatricule)
  //       .map(matriculeData => matriculeData.PLANDATE);
  //     return [
  //       uniqueMatricule,
  //       ...Array.from({ length: new Date(selectedYear, selectedMonth, 0).getDate() }, (_, i) => {
  //         const currentDate = new Date(selectedYear, selectedMonth - 1, i + 1);
  //         const formattedDate = currentDate.toISOString().split('T')[0];
  //         const matriculeDatesFormatted = matriculeDates.map(date => new Date(date).toISOString().split('T')[0]);
  //         const currentState = matriculeDatesFormatted.includes(formattedDate) ? 'O' : 'N';
  //         return currentState;
  //       }),
  //     ];
  //   });
  
  //   // Ajouter le tableau
  //   doc.autoTable({
  //     startY: 80, // Ajouter de l'espace après les informations du client, site et période
  //     head: head,
  //     body: body,
  //     columnStyles: {
  //       0: { cellWidth: 30 },
  //     },
  //     styles: {
  //       fontSize: 10,
  //       cellPadding: 2,
  //       valign: 'middle',
  //       halign: 'center',
  //     },
  //   });
  
  //   doc.save('planning.pdf');
  // };
  function getMonthName(monthNumber) {
    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames[monthNumber - 1]; 
}
  

  return (
    <>
      <Header className="header" />
      <div className='class1'>
        <hr />
      </div>
      <div className='select-container '>
        <div>
      <div className='select-wrapper'>
        <label htmlFor='poleSelect'>Pôle</label>
        <Select
            id='poleSelect'
            value={selectedPoles}
            onChange={handlePoleChange}
            disabled={!selectedPeriodes}
            showSearch
            filterOption={(input, option) =>
              typeof option.children === 'string' &&
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value='' disabled hidden>Sélectionnez un pôle</Option>
            {poles.map((pole, i) => (
              <Option key={i} value={`${pole.IDDETASTAT}-${pole.LIBESTAT}`}>
                {`${pole.LIBESTAT}`}
              </Option>
            ))}
        </Select>
        </div>
        <div className='select-wrapper'>
          <label htmlFor='clientSelect'>Clients</label>
        <Select
             id='clientSelect'
             value={selectedClientsId}
             onChange={handleClientChange}
             disabled={!selectedPoles}
            showSearch
            filterOption={(input, option) =>
              typeof option.children === 'string' &&
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value='' disabled hidden>Sélectionnez un client</Option>
            {clients.map((client, i) => (
              <Option key={i} value={`${client.IDDETASTAT}-${client.LIBESTAT}`}>
                {`${client.LIBESTAT}`}
              </Option>
            ))}
        </Select>
        </div>
        <div className='select-wrapper'>
          <label htmlFor='villeSelect'>Ville</label>
        <Select
            id='villeSelect'
            value={selectedVilles}
            onChange={handleVilleChange}
            disabled={!selectedSitesId}
            showSearch
            filterOption={(input, option) =>
              typeof option.children === 'string' &&
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value='' disabled hidden>Sélectionnez une ville</Option>
            {villes.map((ville, i) => (
              <Option key={i} value={`${ville.IDDETASTAT}-${ville.LIBESTAT}`}>
                {`${ville.LIBESTAT}`}
              </Option>
            ))}
        </Select>
        </div>
        <div className='select-wrapper'>
          <label htmlFor='siteSelect'>Chantier</label>
        <Select
            id='siteSelect'
            value={selectedSitesId}
            onChange={handleSiteChange}
            disabled={!selectedClientsId}
            showSearch
            filterOption={(input, option) =>
              typeof option.children === 'string' &&
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value='' disabled hidden>Sélectionnez un chantier</Option>
            {sites.map((site, i) => (
              <Option key={i} value={`${site.IDDETASTAT}-${site.LIBESTAT}`}>
                {`${site.LIBESTAT}`}
              </Option>
            ))}
        </Select>
        </div>
        </div>

        <div className='select-wrapper'>
        <label htmlFor='periodSelect'>Période</label>
        <Select
            id='periodSelect'
            value={selectedPeriodes}
            onChange={handlePeriodeChange}
            showSearch
            filterOption={(input, option) =>
              typeof option.children === 'string' &&
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
        >
            <Option value='' disabled hidden>Sélectionnez une période</Option>
            {periodes.map((periode, i) => (
              <Option key={i} value={`${periode.Mois}-${periode.Annee}`}>
                {`${getMonthName(periode.Mois)} ${periode.Annee}`}
              </Option>
            ))}
        </Select>



        </div>
        {/* {selectedPeriodes && selectedClientsId && selectedSitesId && (
        // <div className="d-flex justify-content-end">
        //   <button onClick={handlePrint} className="btn btn-primary ml-5">Print PDF</button>
        // </div>
        )} */}
      </div>
      
      {isFormVisible && (
        <form className='form-container m-lg-3' onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="selectedDate" className="label fw-bolder ">Date:</label>
            <p id="selectedDate" className="date fw-medium ">{selectedDate}</p>
          </div>
          <div className="form-group">
            <label htmlFor="currentStateInput" className="label fw-bolder mb-2  ">État du planning :</label>
            <select id="currentStateInput" value={currentState} onChange={handleInputChange} className="form-control w-25">
              <option value="O">O</option>
              <option value="N">N</option>
            </select>
          </div>
          <div className="button-group mt-3">
            <button type="submit" className="btn btn-primary me-2 ">Modifier</button>
            <button type="button" onClick={handleCancel} className="btn btn-secondary">Annuler</button>
          </div>
        </form>
      )}
      {selectedPeriodes && selectedClientsId && selectedSitesId && (
        <>
          {planningDataFromFetch.length === 0 ? (
            <div className='table-container'>
              <p style={{ fontWeight: 'bolder', fontSize: '50px', textAlign: 'center', marginTop: '170px' }}>Pas de données pour le moment ...</p>
            </div>
          ) : (
            
            <div className='table-container '>
              {/* <table border={4}>
                <thead>
                  <tr>
                    <th>Matricule</th>
                    {[...Array(new Date(selectedYear, selectedMonth, 0).getDate())].map((_, i) => {
                      const currentDate = new Date(selectedYear, selectedMonth - 1, i + 1);
                      return (
                        <th key={i}>{formatDate(currentDate)}</th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {uniqueMatricules.map((uniqueMatricule, index) => {
                    const matriculeDates = planningDataFromFetch
                      .filter(matriculeData => matriculeData.PERSMATR === uniqueMatricule)
                      .map(matriculeData => matriculeData.PLANDATE);

                    return (
                      <tr key={index}>
                        <td className='mat'>{uniqueMatricule}</td>
                        {[...Array(new Date(selectedYear, selectedMonth, 0).getDate())].map((_, i) => {
                          const currentDate = new Date(selectedYear, selectedMonth - 1, i + 1);
                          const formattedDate = currentDate.toISOString().split('T')[0];
                          const matriculeDatesFormatted = matriculeDates.map(date => new Date(date).toISOString().split('T')[0]);
                          const currentState = matriculeDatesFormatted.includes(formattedDate) ? 'O' : 'N';
                          console.log(matriculeDatesFormatted);
                          console.log(formattedDate);

                          return (
                            <td key={i} className={currentState === 'O' ? "text-green" : "text-red"}>
                              {currentState}
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="update-icon"
                                onClick={() => handleUpdate(uniqueMatricule, formattedDate, currentState)}
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table> */}
              
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Home;
