import React, { useState, useEffect ,useRef } from 'react';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes ,faExpand, faCompress ,faClock } from '@fortawesome/free-solid-svg-icons';
import { Select } from 'antd';
const { Option } = Select;



function Home() {
  const [clients, setClients] = useState([]);
  const [selectedClientsId, setSelectedClientsId] = useState('');
  const [sites, setSites] = useState([]);
  const [selectedSitesId, setSelectedSitesId] = useState('');
  const [periodes, setPeriodes] = useState([]);
  const [selectedPeriodes, setSelectedPeriodes] = useState('');
  const [poles, setPoles] = useState([]);
  const [selectedPoles, setSelectedPoles] = useState('');
  const [villes, setVilles] = useState([]);
  const [selectedVilles, setSelectedVilles] = useState('');
  const [salaries, setSalaries] = useState([]);
  const [planningData, setPlanningData] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [matriculeValue, setMatriculeValue] = useState('');
  const [showListModal,setShowListModal]= useState(false);
 const [tdKey,setTdKey]= useState(null);
 const [trKey,setTrKey]= useState(null);
 const [showModalHoraire,setShowModalHoraire]=useState(false);
 const [showModalAbsence,setShowModalAbsence]=useState(false)
 const listModalRef = useRef(null);
const horaireModalRef = useRef(null);
const absenceModalRef = useRef(null);
const [selectedHoraire,setSelectedHoraire]=useState('');
const [selectedSalary, setSelectedSalary] = useState(null);
const [selectedDayIndex, setSelectedDayIndex] = useState(null);
const [selectedValue, setSelectedValue] = useState(null);
const [isMaximized, setIsMaximized] = useState(false);

  
  useEffect(() => {
    fetch(`http://localhost:8081/periodes`)
      .then(res => res.json())
      .then(data => setPeriodes(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedPeriodes && selectedPoles) {
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      const [pole, npole] = selectedPoles.split('-');
      fetch(`http://localhost:8081/clients?MONTH=${MONTH}&YEAR=${YEAR}&pole=${pole}`)
        .then(res => res.json())
        .then(data => setClients(data))
        .catch(err => console.log(err));
    }
  }, [selectedPeriodes, selectedPoles]);

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
  }, [selectedPeriodes, selectedPoles, selectedClientsId]);

  useEffect(() => {
    if (selectedPeriodes) {
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      fetch(`http://localhost:8081/poles?MONTH=${MONTH}&YEAR=${YEAR}`)
        .then(res => res.json())
        .then(data => setPoles(data))
        .catch(err => console.log(err));
    }
  }, [selectedPeriodes]);

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
  }, [selectedPeriodes, selectedPoles, selectedClientsId, selectedSitesId]);

  useEffect(() => {
    if (selectedPeriodes && selectedPoles && selectedClientsId && selectedSitesId) {
      const [TIRID, CNAME] = selectedClientsId.split('-');
      const [ADRID, SNAME] = selectedSitesId.split('-');
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      const [pole, npole] = selectedPoles.split('-');
      fetch(`http://localhost:8081/planning?TIRID=${TIRID}&ADRID=${ADRID}&MONTH=${MONTH}&YEAR=${YEAR}&pole=${pole}`)
        .then(res => res.json())
        .then(data => setSalaries(data))
        .catch(err => console.log(err));
    }
  }, [selectedPeriodes, selectedPoles, selectedClientsId, selectedSitesId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listModalRef.current && !listModalRef.current.contains(event.target)) {
        setShowListModal(false);
      }
      if (horaireModalRef.current && !horaireModalRef.current.contains(event.target)) {
        setShowModalHoraire(false);
      }
      if (absenceModalRef.current && !absenceModalRef.current.contains(event.target)) {
        setShowModalAbsence(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  

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
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFormSubmit = event => {
    event.preventDefault();
    const url = 'http://localhost:8081/planning';
    
   
    const [selectedMonth, selectedYear] = selectedPeriodes.split('-');
    const [TIRID, CNAME] = selectedClientsId.split('-');
      const [ADRID, SNAME] = selectedSitesId.split('-');
      const [pole, npole] = selectedPoles.split('-');
   
    const selectedDay = (parseInt(selectedDayIndex) + 1).toString().padStart(2, '0');
    
    
    const formattedDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay}`;
    
    
    const requestBody = {
      client: TIRID,
      site: ADRID,
      matricule:selectedSalary.PERSMATR,
      pole:pole,
      horaire:selectedHoraire,
      date: formattedDate
    };
    
    
    fetch(url, {
      method: 'PUT',
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
    
    setShowModalHoraire(false);
};


  
  const fetchUpdatedData = () => {
    const [TIRID, CNAME] = selectedClientsId.split('-');
    const [ADRID, SNAME] = selectedSitesId.split('-');
    const [MONTH, YEAR] = selectedPeriodes.split('-');
    const [pole, npole] = selectedPoles.split('-');
     const url=`http://localhost:8081/planning?TIRID=${TIRID}&ADRID=${ADRID}&MONTH=${MONTH}&YEAR=${YEAR}&pole=${pole}`;
  
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setSalaries(data); 
      })
      .catch(err => console.log(err));
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const getMonthName = monthNumber => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return monthNames[monthNumber - 1];
  };

  const daysInMonth = selectedPeriodes ? getDaysInMonth(...selectedPeriodes.split('-')) : 0;

  const getDayAbbreviation = dayNumber => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return dayNames[dayNumber ];
  };

  const uniqueValuesArray = [];

  salaries.forEach(salary => {
      const isSameGroup = (item) => 
          item.PERSMATR === salary.PERSMATR && 
          item.PERSNOPE === salary.PERSNOPE &&
          item.PERSPRPE === salary.PERSPRPE &&
          item.LIBEABR === salary.LIBEABR;
  
      let entry = uniqueValuesArray.find(isSameGroup);
      
      if (!entry) {
          entry = {
              PERSMATR: salary.PERSMATR,
              PERSNOPE: salary.PERSNOPE,
              PERSPRPE: salary.PERSPRPE,
              LIBEABR: salary.LIBEABR,
              values: []
          };
          uniqueValuesArray.push(entry);
      }
      entry.values.push(salary.PLANPAJO);
  });

  const getColor = (value) => {
    switch (value) {
      case 1:
        return 'blue';
      case 2:
        return 'Darkslategray';
      case 3:
        return 'red';
      default:
        return 'black';
    }
  };
  
  const getText = (value) => {
    switch (value) {
      case 1:
        return 'J';
      case 2:
        return 'N';
      case 3:
        return 'R';
      default:
        return '';
    }
  };
  const handleCancel = () => {
    setShowModalHoraire(false); 
  };

  const handleRightClick=(e,i,index,v)=> {
    e.preventDefault();
    setTdKey(i);
    setTrKey(index);
    setShowListModal(true); 
    setSelectedSalary(uniqueValuesArray[index]);
    setSelectedDayIndex(i);
    setSelectedValue(v);

    
     
  }

  const handleChangeHoraire=(e)=> {
    e.preventDefault();
    setShowListModal(false)
    setShowModalHoraire(true);   
  }
  const handleAbsence=(e)=> {
    e.preventDefault();
    setShowListModal(false)
    setShowModalAbsence(true)
       
  }
  const handleChangeSHoraire=(e)=>{
    setSelectedHoraire(e.target.value);
    handleCellClick(e, selectedSalary,selectedDayIndex,selectedValue );
  }
  const handleCellClick = (e, salary, dayIndex ,v) => {
    const { PERSMATR, PERSNOPE, PERSPRPE } = salary;
    const employeeId = `${PERSMATR}/-${PERSNOPE} ${PERSPRPE}`;
    const selectedDay = dayIndex + 1; 
    v = e.target.textContent; 
    
  };
  
 const [mois,annee]=selectedPeriodes.split('-');
 const contentStyle = isMaximized ? { fontSize: '30px',  } : {};
 const contentStyleSelect = isMaximized ? { width: '500px',height:'50px',fontSize:'30px' } : {};
 const contentStyleButt = isMaximized ? { width: '140px',height:'50px',fontSize:'25px' ,marginLeft:'13px' } : {};
 const contentStyleButtx = isMaximized ? { fontSize:'30px' } : {};
 const contentStylep = isMaximized ? { fontSize:'19px' ,marginRight:'680px' } : {};
 const contentStylediv = isMaximized ? { height:'350px' } : {};
  return (
    <>
      <p className='header-title'>Pointage - Cycles par chantier</p>
      <div className='select-container'>
        <div className="pcvc-container">
          <p className='pcvc-title'>Critère de recherche</p>
          <div className='select-w'>
            <div className='select-pc'>
              <div className="select-p">
                <label htmlFor='poleSelect'>Pôle</label>
                <Select
                  className='pole-select'
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
              <div className="select-cl">
                <label htmlFor='clientSelect'>Clients</label>
                <Select
                  className='cvc-select'
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
            </div>
            <div className='select-vc'>
              <div className="select-v">
                <label htmlFor='villeSelect'>Ville</label>
                <Select
                  className='cvc-select'
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
              <div className="select-ch">
                <label htmlFor='siteSelect'>Chantier</label>
                <Select
                  className='cvc-select'
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
          </div>
        </div>
        <div className='period-container'>
          <p className='period-title'>Période du planning</p>
          <div className="period-select">
            <label htmlFor='periodSelect'>Période</label>
            <Select
              className='select-pe'
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
         
          <div className="button-container">
            <div className="print-container">
              <button className='beach-button'>
              <FontAwesomeIcon icon={faWater} className='faWater'/> 
              </button>
              <button className='umbrella-button'>
              <FontAwesomeIcon icon={faUmbrellaBeach} className='faUmbrellaBeach' /> 
              </button>
              <button className="print-button" onClick={handlePrint}>
              Imprimer <FontAwesomeIcon icon={faPrint} className='faPrint'/> 
              </button>
            </div>
            <div className="consolider">
              <button className='consolider-button'>
                Consolider <FontAwesomeIcon icon={faLock} className='falock' /> 
              </button>
              <button className='exit-button'>
              <FontAwesomeIcon icon={faSignOutAlt} className='faSignOutAlt'/>
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedPeriodes && selectedPoles && selectedClientsId && selectedSitesId &&(
      <div className="table-c">
      <div className="table-container">
        <table border={3}>
          <thead>
            <tr>
          <th colSpan="2" style={{ width: '200px' }}> </th>
          {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i + 1} style={{ width: '40px' }}>{String(i + 1).padStart(2, '0')}</th>
              ))}
          </tr>
            <tr>
           
              <th style={{ width: '250px' , textAlign:'center'}}>Salariés</th>
              <th style={{ width: '50px' }}></th>
              {Array.from({ length: daysInMonth }, (_, i) => (
      <th key={i + 1} style={{ width: '40px' }}>{getDayAbbreviation(new Date(selectedPeriodes.split('-')[1], selectedPeriodes.split('-')[0] - 1, i + 1).getDay())}</th>
    ))}
            </tr>
          </thead>
          
          <tbody>
                {uniqueValuesArray.map((entry, index) => (
                  <tr key={index}>
                    <td style={{ fontSize: '15px' }}>
                      {entry.PERSMATR}/-{entry.PERSNOPE} {entry.PERSPRPE}
                    </td>
                <td style={{textAlign:'center'}}>
                {entry.LIBEABR}
                  </td>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <td key={i + 1} style={{ textAlign: 'center', color: getColor(entry.values[i]) , fontWeight:'bolder' }} onContextMenu={(e)=>handleRightClick(e,i,index,entry.values[i])} className='tdtable'  onClick={(e) => handleCellClick(e, entry, i,v)}>
                  {getText(entry.values[i])}
                  {showListModal && tdKey===i && trKey===index ? <div  className="liste" ref={listModalRef}><p className='pliste1' onClick={(e)=>handleChangeHoraire(e)} >Modifier Horaire </p> <p className='pliste2' onClick={(e)=>handleAbsence(e)}>Ajouter abscence</p></div> : ''}
                   

                  </td>
                  
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModalHoraire ? <div className={`listehor ${isMaximized ? 'maximized' : ''}`} ref={horaireModalRef}>
      <div className='modal-header'>
        <p className="titrehor" style={contentStylep}>Fiche - Gestion des Horaires</p>
          <FontAwesomeIcon icon={isMaximized ? faCompress : faExpand} className='modal-maximize' onClick={handleMaximize} style={contentStyleButtx}/>
          <FontAwesomeIcon icon={faTimes} className='modal-close' onClick={handleCancel} style={contentStyleButtx} />
        </div>
        
        <h1 className='h1listehor'>Changement d'horaire <FontAwesomeIcon icon={faClock} /></h1>
        <div className='hordiv' style={contentStylediv}>
        <p className='psal' style={contentStyle}>Salarié : <span className='spansal' style={contentStyle}>{`${selectedSalary.PERSMATR}/-${selectedSalary.PERSNOPE} ${selectedSalary.PERSPRPE}`}</span></p><p className='pperi' style={contentStyle}>Période : <span className='spanperi' style={contentStyle}>{selectedDayIndex+1} {getMonthName(mois)} {annee}</span></p>
        <p className='phor' style={contentStyle}>Horaire actuelle : <span style={{ color:getColor(selectedValue)}}>{getText(selectedValue)}</span></p>
        <div><label htmlFor='horaireSelect' style={contentStyle}>Nouvel Horaire :</label><select className='selecthor'id='horaireSelect' value={selectedHoraire} onChange={handleChangeSHoraire} style={contentStyleSelect}><option value='' disabled hidden>Sélectionner nouvel Horaire </option>
        <option className='optionj' value={1}>J</option><option className='optionn' value={2}>N</option><option className='optionr' value={3}>R</option>
        </select></div><div className='horbutt' ><button className='buttonvhor' style={contentStyleButt} onClick={handleFormSubmit}>Valider <FontAwesomeIcon icon={faCheck} /></button><button className='buttonahor' style={contentStyleButt} onClick={handleCancel}>Fermer <FontAwesomeIcon icon={faTimes} /></button></div></div></div> : ''}
        
        {showModalAbsence ? <div className='listeabsence' ref={absenceModalRef}>
        <div className='absdiv1'><p className='abspdvi1'>Type d'évènement</p></div><div className='absdiv2'></div></div> : ''}
      </div>
      )}
    
    </>
  );
}

export default Home;
