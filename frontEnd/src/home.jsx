import React, { useState, useEffect ,useRef } from 'react';
import './home.css';
import jsPDF from 'jspdf';
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
const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');
const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('19:00');
  const [hours, setHours] = useState('12,00');
  const [remplace, setRemplace] = useState(false);
  const [natuabs, setNatuabs] = useState([]);
  const [selectedNatuabs, setSelectedNatuabs] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedEffet, setSelectedEffet] = useState('');
  const [salariesDisp, setSalariesDisp] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const inputRef = useRef(null);
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/absences')
      .then(response => response.json())
      .then(data => setAbsences(data))
      .catch(error => console.error('Erreur lors de la récupération des absences:', error));
  }, []);

  const checkAbsence = (persMatr, currentDate) => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    
    const currentDateString = new Date(Date.UTC(year, currentDate.getMonth(), day, hours, minutes, seconds)).toISOString();

   

    const isDateBetween = (startDate, endDate, date) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const current = new Date(date);
        
       
        const startDateNormalized = new Date(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
        const endDateNormalized = new Date(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59);
        const currentDateNormalized = new Date(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());

        return startDateNormalized <= currentDateNormalized && currentDateNormalized <= endDateNormalized;
    };

    const absence = absences.find(absence => {
        if (absence.PERSMATR === persMatr && isDateBetween(absence.ABSEDEHE, absence.ABSEFIHE, currentDateString)) {
           
            return true; 
        }
        
        return false; 
    });

    if (!absence) {
        
    }

    return absence ? absence.NAABCODE : null;
};






  
const generatePDF = () => {
  const doc = new jsPDF();
  doc.text('Hello world!', 10, 10);
  doc.addPage();
  doc.text('This is another page.', 10, 10);
  doc.save('document.pdf');
};


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
    fetch(`http://localhost:8081/natuabs`)
      .then(res => res.json())
      .then(data => setNatuabs(data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    if (selectedPeriodes && selectedPoles && selectedClientsId && selectedSitesId && selectedDayIndex+1) {
    
    
    
      if(selectedOption==='sameSite'){
        const [TIRID, CNAME] = selectedClientsId.split('-');
        const [ADRID, SNAME] = selectedSitesId.split('-');
        const [MONTH, YEAR] = selectedPeriodes.split('-');
        const [pole, npole] = selectedPoles.split('-');
        const selectedDay = (parseInt(selectedDayIndex) + 1).toString().padStart(2, '0');
        const formattedDate = `${YEAR}-${MONTH.padStart(2, '0')}-${selectedDay}`;
        const initialDate = `${YEAR}-${String(MONTH).padStart(2, '0')}-${String(selectedDayIndex + 1).padStart(2, '0')}`;

        fetch(`http://localhost:8081/salariesdispmc?TIRID=${TIRID}&ADRID=${ADRID}&MONTH=${MONTH}&YEAR=${YEAR}&startDate=${startDate}&endDate=${endDate}&startTime=${startTime}&endTime=${endTime}&pole=${pole}`)
            .then(res => res.json())
            .then(data => {
                console.log('Received data:', data);
                console.log(initialDate);
                setSalariesDisp(data);
                

            })
            .catch(err => console.log('Fetch error:', err));
    }
    else if (selectedOption===null){
      setSalariesDisp([]);
    }

    if(selectedOption==='samePole'){
      const [TIRID, CNAME] = selectedClientsId.split('-');
      const [MONTH, YEAR] = selectedPeriodes.split('-');
      const [pole, npole] = selectedPoles.split('-');
      const selectedDay = (parseInt(selectedDayIndex) + 1).toString().padStart(2, '0');
      const formattedDate = `${YEAR}-${MONTH.padStart(2, '0')}-${selectedDay}`;
      const initialDate = `${YEAR}-${String(MONTH).padStart(2, '0')}-${String(selectedDayIndex + 1).padStart(2, '0')}`;
      
    
      fetch(`http://localhost:8081/salariesdispmp?TIRID=${TIRID}&MONTH=${MONTH}&YEAR=${YEAR}&startDate=${startDate}&endDate=${endDate}&startTime=${startTime}&endTime=${endTime}&pole=${pole}`)
          .then(res => res.json())
          .then(data => {
              console.log('Received data:', data);
              console.log(initialDate);
              setSalariesDisp(data);
              

          })
          .catch(err => console.log('Fetch error:', err));
  }
  else if (selectedOption===null){
    setSalariesDisp([]);
  }
  if(selectedOption==='allAvailability'){
    const [pole, npole] = selectedPoles.split('-');
    
    const [MONTH, YEAR] = selectedPeriodes.split('-');
    
    const selectedDay = (parseInt(selectedDayIndex) + 1).toString().padStart(2, '0');
    const formattedDate = `${YEAR}-${MONTH.padStart(2, '0')}-${selectedDay}`;
    const initialDate = `${YEAR}-${String(MONTH).padStart(2, '0')}-${String(selectedDayIndex + 1).padStart(2, '0')}`;

    fetch(`http://localhost:8081/salariesdisptd?&pole=${pole}&startDate=${startDate}&endDate=${endDate}&pole=${pole}`)
        .then(res => res.json())
        .then(data => {
            console.log('Received data:', data);
            console.log(initialDate);
            setSalariesDisp(data);
            

        })
        .catch(err => console.log('Fetch error:', err));
}
else if (selectedOption===null){
  setSalariesDisp([]);
}

}



}, [selectedClientsId, selectedSitesId, selectedPeriodes, selectedDayIndex, selectedPoles ,selectedOption]);


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
  const handleCheckboxChange = () => {
    setAllDay(!allDay);
  };
  const handleCheckboxChange1 = () => {
    setRemplace(!remplace);
  };
  const handleChangeNatuabs = (event) => {
    setSelectedNatuabs(event.target.value);
  };
  const handleChangeEffet = (event) => {
    setSelectedEffet(event.target.value);
  };
  const handleRadioClick = (option) => {
    if (selectedOption === option) {
      setSelectedOption(null);
    } else {
      setSelectedOption(option); 
     
    }
    
  };
   useEffect(() => {
    if (selectedOption === 'manualEntry') {
      inputRef.current?.focus(); 
    }
    
  }, [selectedOption]);

  useEffect(() => {
    if (!allDay) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
  
      
      let startMs = start.getTime();
      let endMs = end.getTime();
  
      
      if (endMs < startMs) {
        endMs += 24 * 60 * 60 * 1000; 
      }
  
      
      let diffHours = (endMs - startMs) / (1000 * 60 * 60);
  
      
      setHours(diffHours.toFixed(2).replace('.', ','));
  
    } else {
     
      setStartTime('07:00');
      setEndTime('19:00');
      setHours('12,00');
    }
  }, [startTime, endTime, allDay]);
  
  

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

const fetchData = async () => {
  try {
    const response = await fetch('http://localhost:8081/absences');
    const data = await response.json();
    setAbsences(data); 
    console.log('Données rafraîchies avec succès', data);
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des données', error);
  }
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

  const handleFormSubmit2 = () => {
  if (remplace) {
    submitWithReplacement();
    fetchUpdatedData(); 
  } else {
    submitWithoutReplacement();
    fetchUpdatedData(); 
  }
};

const checkExistence = async (PERSMATR, ABSEDATE) => {
  try {
    const response = await fetch(`http://localhost:8081/absence/exist?PERSMATR=${PERSMATR}&ABSEDATE=${ABSEDATE}`);
    const result = await response.json();
    return result.exists; 
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'existence', error);
    return false;
  }
};



const insertEmployee = async () => {
  const PLANDATE = startDate;
  const PLANDATE2 = endDate;
  const PERSMATR = selectedSalary.PERSMATR;
  const PERSMATR2 = selectedEmployee.PERSMATR;
  const PERSNOPE = selectedEmployee.PERSNOPE;
  const PERSPRPE = selectedEmployee.PERSPRPE;
  const [CLIENT, CNAME] = selectedClientsId.split('-');
  const [CHANTIER, SNAME] = selectedSitesId.split('-');
  const [POLE, npole] = selectedPoles.split('-');
  const PLANNBHE = parseFloat(hours.replace(',', '.')) + 0.000000;
  const PLANDEHE = startTime;
  const PLANFIHE = endTime;
  

  const remplaceData = {
    PERSMATR2,
    PLANDATE,
    PLANDATE2,
    PERSNOPE,
    PERSPRPE,
    PLANNBHE,
    PLANDEHE,
    PLANFIHE,
    PERSMATR,
    POLE,
    CLIENT,
    CHANTIER,
  };

  try {
    const response = await fetch('http://localhost:8081/insertEmployee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(remplaceData),
    });

    if (!response.ok) {
      console.error('Erreur lors de l\'insertion de l\'employé:', response.statusText);
      throw new Error('Erreur lors de l\'insertion de l\'employé');
    }

    const result = await response.json();
    console.log('Insertion de l\'employé traitée avec succès', result);
    await fetchData();
    fetchUpdatedData();
  } catch (error) {
    console.error('Erreur lors de l\'insertion de l\'employé:', error.message);
    throw error;
  }
};


const submitWithReplacement = async () => {
  const PERSMATR = selectedSalary.PERSMATR;
  const [NAABCODE, NATUDESI, NATUABRE] = selectedNatuabs.split('-');
  const NATUEFFE = selectedEffet;
  const ABSEDEHE = startDate;
  const ABSEFIHE = endDate;
  const ABSENBHR = hours.replace(',', '.');
  const ABSEDATE = startDate;

  

  const absenceData = {
    PERSMATR,
    NAABCODE,
    NATUDESI,
    NATUEFFE,
    ABSEDEHE,
    ABSEFIHE,
    ABSENBHR,
    ABSEDATE,
  };

  const exists = await checkExistence(PERSMATR, ABSEDATE);

  try {
    let response;
    if (exists) {
      response = await fetch(`http://localhost:8081/absence/${PERSMATR}/${ABSEDATE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(absenceData),
      });
    } else {
      response = await fetch('http://localhost:8081/absence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(absenceData),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur lors du traitement de l\'absence:', errorText);
      throw new Error(errorText);
    }

    const result = await response.json();
    console.log('Absence traitée avec succès', result);

  
    await insertEmployee();

    await fetchData();  
    console.log('Ligne traitée avec succès');
  } catch (error) {
    console.error('Erreur lors du traitement de la ligne:', error.message);
  }

  setShowModalAbsence(false);
};
const submitWithoutReplacement = async () => {
  const [NAABCODE, NATUDESI, NATUABRE] = selectedNatuabs.split('-');
  const PERSMATR = selectedSalary.PERSMATR;
  const NATUEFFE = selectedEffet;
  const ABSEDEHE = startDate;
  const ABSEFIHE = endDate;
  const ABSENBHR = hours.replace(',', '.');
  const ABSEDATE = startDate;
  const absenceData = {
    PERSMATR,
    NAABCODE,
    NATUDESI,
    NATUEFFE,
    ABSEDEHE,
    ABSEFIHE,
    ABSENBHR,
    ABSEDATE,
  };

  const exists = await checkExistence(PERSMATR, ABSEDATE);

  try {
    let response;
    if (exists) {
      
      response = await fetch(`http://localhost:8081/absence/${PERSMATR}/${ABSEDATE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(absenceData),
      });
    } else {
      
      response = await fetch('http://localhost:8081/absence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(absenceData),
      });
    }

    const result = await response.json();

    if (response.ok) {
      console.log('Ligne traitée avec succès', result);
      await fetchData();
    } else {
      console.error('Erreur lors du traitement de la ligne', result);
    }
  } catch (error) {
    console.error('Erreur réseau ou serveur', error);
  }
  setShowModalAbsence(false);
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
            PLANDATE: [],
            values: []
        };
        uniqueValuesArray.push(entry);
    }
    entry.PLANDATE.push(salary.PLANDATE); 
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
    setShowModalAbsence(false); 
    setSelectedNatuabs('');
    setSelectedEffet('');
    setStartTime('07:00');
    setEndTime('19:00');
    setHours('12,00');
   setRemplace(false);
  setSelectedOption(null);
  setSalariesDisp([]);
  setSearchTerm('');
  setSelectedEmployee(null);
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
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredSalaries = Array.isArray(salariesDisp) ? salariesDisp.filter((salarie) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    return (
      salarie.PERSMATR.toLowerCase().includes(searchTermLowerCase) ||
      salarie.PERSNOPE.toLowerCase().includes(searchTermLowerCase) ||
      salarie.PERSPRPE.toLowerCase().includes(searchTermLowerCase) ||
      salarie.PERSNCIN.toLowerCase().includes(searchTermLowerCase)
    );
  }):[];

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
  const handleRowClick = (salarie) => {
    if (selectedEmployee === salarie) {
      setSelectedEmployee(null);
    } else {
      setSelectedEmployee(salarie);
    }
  };
  
  const [mois,annee]=selectedPeriodes.split('-');
 useEffect(() => {
  
  const initialDate = `${annee}-${String(mois).padStart(2, '0')}-${String(selectedDayIndex + 1).padStart(2, '0')}`;
  setStartDate(initialDate);
  setEndDate(initialDate);
}, [selectedPeriodes, mois, annee, selectedDayIndex]);

const getAbsNat = (naabcode, color) => {
  let text;
  switch (naabcode) {
    case '01':
      text = 'CD';
      break;
    case '02':
      text = 'AA';
      break;
    case '03':
      text = 'ANA';
      break;
    case '04':
      text = 'CA';
      break;
    case '05':
      text = 'CN';
      break;
    case '06':
      text = 'JF';
      break;
    case '07':
      text = 'MAP';
      break;
    case '08':
      text = 'CM';
      break;
    case '09':
      text = 'AM';
      break;
    case '10':
      text = 'AT';
      break;
    default:
      text = null;
  }

  if (text !== null) {
    return <span style={{ color: color }}>{text}</span>;
  } else {
    return null;
  }
};




 const contentStyle = isMaximized ? { fontSize: '30px',  } : {};
 const contentStyleSelect = isMaximized ? { width: '500px',height:'50px',fontSize:'30px' } : {};
 const contentStyleButt = isMaximized ? { width: '140px',height:'45px',fontSize:'25px' ,marginLeft:'13px' } : {};
 const contentStyleButtx = isMaximized ? { fontSize:'30px' } : {};
 const contentStylep = isMaximized ? { fontSize:'22px' ,marginRight:'625px' } : {};
 const contentStylediv = isMaximized ? { height:'350px' } : {};
 const contentStylepe = isMaximized ? { fontSize:'22px' ,marginRight:'1025px' } : {};


 
 const getMinMaxTimes = (planpajo) => {
  if (planpajo === 1) {
    return { min: '06:00', max: '19:00' };
  } else if (planpajo === 2) {
    return { min: '19:00', max: '06:00' };
  }
  return { min: '00:00', max: '23:59' }; 
};

const { min, max } = getMinMaxTimes(selectedValue);

const parseTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const validateTime = (time, min, max) => {

  const parsedTime = parseTime(time);
  const parsedMin = parseTime(min);
  const parsedMax = parseTime(max);


  if (parsedMin > parsedMax) {
   
    if (parsedTime >= parsedMin || parsedTime <= parsedMax) {
      return time;
    } else {
      return min; 
    }
  } else {
  
    if (parsedTime >= parsedMin && parsedTime <= parsedMax) {
      return time; 
    } else {
      return min;
    }
  }
};


const handleStartTimeChange = (e) => {
  const time = e.target.value;
  const validatedTime = validateTime(time, min, max);
  setStartTime(validatedTime);
};

const handleEndTimeChange = (e) => {
  const time = e.target.value;
  const validatedTime = validateTime(time, min, max);
  setEndTime(validatedTime);
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
                  disabled={!selectedClientsId}
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
      <td style={{ textAlign: 'center' }}>
        {entry.LIBEABR}
      </td>
      {Array.from({ length: daysInMonth }, (_, i) => {
  const currentDate = new Date(selectedPeriodes.split('-')[1], selectedPeriodes.split('-')[0] - 1, i + 1);
  const currentDateString = currentDate.toISOString().slice(0, 10); 
  const matchingIndex = entry.PLANDATE.findIndex(date => date.slice(0, 10) === currentDateString);
  const matchingValue = matchingIndex !== -1 ? entry.values[matchingIndex] : null;
  const absence = checkAbsence(entry.PERSMATR, currentDate);

 

  const cellValue = absence !== null ? getAbsNat(absence, "black")  : getText(matchingValue);
  
  

  return (
    <td 
      key={i + 1} 
      style={{ textAlign: 'center', color: getColor(matchingValue), fontWeight: 'bolder' }} 
      onContextMenu={(e) => handleRightClick(e, i, index, matchingValue)} 
      className='tdtable' 
      onClick={(e) => handleCellClick(e, entry, i, matchingValue)}
    >
      {cellValue}
           
            {showListModal && tdKey === i && trKey === index && matchingValue ? 
              <div className="liste" ref={listModalRef}>
                <p className='pliste1' onClick={(e) => handleChangeHoraire(e)}>Modifier Horaire</p> 
                <p className='pliste2' onClick={(e) => handleAbsence(e)}>Ajouter Abscence</p>
              </div> 
              : ''
            }
          </td>
        );
      })}
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
        <div className='modal-header'> 
        <p className="titreabs" style={contentStylepe}>Fiche - Evènements</p>
          <FontAwesomeIcon icon={isMaximized ? faCompress : faExpand} className='modal-maximize' onClick={handleMaximize} style={contentStyleButtx}/>
          <FontAwesomeIcon icon={faTimes} className='modal-close' onClick={handleCancel} style={contentStyleButtx} />
        </div>
        <div className='absdibcont'>
        <div className='absdiv1'><p className='abspdvi1'>Type d'évènement</p>
        <div className="typeevcont">
        <div className='typeev'>
          <p className='modalpperi'>Période</p> <span className='spanperi2'>{selectedDayIndex+1} {getMonthName(mois)} {annee}</span>
          </div>
          <div className='typeev2'>
          <label htmlFor='codeabsSelect'  className='modalpcabs'>Code absence </label><select className='selectabs'id='absSelect' value={selectedNatuabs} onChange={handleChangeNatuabs} ><option value='' disabled hidden className='optionabsdis'> selectionner code absence </option>
          {natuabs.map((abs, index) => (
          <option 
            key={index}  
            value={`${abs.NAABCODE}-${abs.NATUDESI}-${abs.NATUABRE}`}
          >
            {abs.NATUDESI}
          </option>
        ))}
        </select>
          </div>
          <div className='typeev3'>
          <label htmlFor='effetSelect'  className='modalpeff'>Effet </label><select className='selecteffet'id='effetSelect' value={selectedEffet} onChange={handleChangeEffet} ><option value='' disabled hidden className='optioneffdis'> selectionner effet </option>
        <option className='optionaucun' value={2}>Aucun</option><option className='optionadeduire' value={1}>À deduire</option>
        </select>


          </div>
          </div>
          
          <p className='pintev'>Interval - Evènement </p>
          <div className='intev'>
          <div className='divstd'>
        <label className='labeldd'>Date début </label>
        <input className='startdate'
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div className='divend'>
        <label className='labeldf'>Date fin </label>
        <input className='enddate'
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className='eventcnc'>
      <label className='labelev'>
        <input className='inpev'
          type="checkbox"
          checked={allDay}
          onChange={handleCheckboxChange}
        />
        Evènement concerne toute la journée
      </label>
      <div className='stentime'>
        <label>
          <div className='pinst'>
         <p className='pde'> De </p>
          <input className='starttime'
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            min={min}
            max={max}
            disabled={allDay}
          />
        </div>
      </label>

      <label>
        <div className="pinend">
          <p className='pa'> à </p>
          <input className='endtime'
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            min={min}
            max={max}
            disabled={allDay}
          />
          </div>
        </label>
      </div>
      <div className='divnbrhr'>
        <p className='pnbrhr'>Nbre. Heure</p>
        <input className='innbrh'
          type="text"
          value={hours}
          readOnly
          disabled={allDay}
        />
      </div>
      </div>
      <div className='avecremp'>
      <label className='labelev2'>
        <input className='inpev2'
          type="checkbox"
          checked={remplace}
          onChange={handleCheckboxChange1}
        />
        Evènement avec remplacement
      </label>
      </div>
      </div>
        </div>
        <div className={remplace ? 'absdiv2' : 'absdiv2 disabled'}>  
        <p className='plists'>Liste des salariés disponibles </p>
        <div className='absdiv3'>
         <p className='typt'>Type de traitement </p>
         <div className='divtypt'>

         <div className='check1'>
        <div className='checkbox1'>
          <label className='lcheck1'>
            <input className='incheck1'
              type="radio"
              name="options"
              checked={selectedOption === 'manualEntry'}
              onClick={() => handleRadioClick('manualEntry')}
              readOnly
             
            />
            Saisie manuel du matricule 
          </label>
        </div>
        <div className='checkbox2'>
          <label className='lcheck2'>
            <input className='incheck2'
              type="radio"
              name="options"
              checked={selectedOption === 'samePole'}
              onClick={() => handleRadioClick('samePole')}
              readOnly
            />
            Disponibilité dans le même pôle
          </label>
        </div>
      </div >
      <div className='check2'>
        <div className='checkbox3'>
          <label className='lcheck3'>
            <input className='incheck3'
              type="radio"
              checked={selectedOption === 'sameSite'}
              onClick={() => handleRadioClick('sameSite')}
              readOnly
            />
            Disponibilité dans le même chantier 
          </label>
        </div>
        <div className='checkbox4'>
          <label className='lcheck4'>
            <input className='incheck4'
              type="radio"
              checked={selectedOption === 'allAvailability'}
              onClick={() => handleRadioClick('allAvailability')}
              readOnly
            />
            Toutes les Disponibilités
          </label>
        </div>
      </div>
         </div>
         <div className='divrech'>
          <p className='matp'>Matricule</p>
        <input className='rechinp'
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={handleSearchChange}
          ref={inputRef}
          disabled={selectedOption !== 'manualEntry'}
        />
      </div>
         <div className='divtab' style={{ maxHeight: '330px', overflowY: 'auto' }}>
         <table className='tablesal' border={2}>
  <thead>
    <tr>
      <th>Matricule</th>
      <th>Nom</th>
      <th>Prénom</th>
      <th>N°CIN</th>
    </tr>
  </thead>
  <tbody>
  
    {filteredSalaries.map((salarie,i) => (
      <tr key={i} onClick={() => handleRowClick(salarie)} style={{ cursor: 'pointer', backgroundColor: selectedEmployee === salarie ? 'lightblue' : '' }}>
        <td>{salarie.PERSMATR}</td>
        <td>{salarie.PERSNOPE}</td>
        <td>{salarie.PERSPRPE}</td>
        <td>{salarie.PERSNCIN}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>
<div className='evbutt'>

  </div>


        </div>
        
        </div> 
        <div className='buttonsabs'>
        <button className='buttonvabs'  onClick={handleFormSubmit2}>Valider <FontAwesomeIcon icon={faCheck} /></button><button className='buttonfabs'  onClick={handleCancel}>Fermer <FontAwesomeIcon icon={faTimes} /></button>
        </div>
        </div>
        </div> : ''}
      </div>
      )}
    
    </>
  );
}

export default Home;
