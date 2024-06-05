import React, { useState, useEffect } from 'react';
import './home.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import { faUmbrellaBeach } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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


  const handlePrint = () => {
    window.print();
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
            {salaries.map((data, index) => (
              <tr key={index}>
                <td style={{fontSize:'15px'}}>{data.PERSMATR}/-{data.PERSNOPE} {data.PERSPRPE}</td>
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <td key={i + 1}>
                    {data[`D${(i + 1).toString().padStart(2, '0')}`]}
                  </td>
                  
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      )}
    </>
  );
}

export default Home;
