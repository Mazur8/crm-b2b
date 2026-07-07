import { useEffect, useState } from 'react'
import FormularzKlientow from './FormularzKlientow';
import TabelaKlientow from './TabelaKlientow';

function App() {

  const [listaKlientow, setListaKlientow] = useState([]);

  const [edytowanyId, setEdytowanyId] = useState(null);

  useEffect(() =>{
    fetch('http://localhost:8000/api/klienci')
    .then(res => res.json())
    .then(data => setListaKlientow(data));
  }, []);


  
  async function downloadClientInformation(){
    const res = await fetch('http://localhost:8000/api/klienci');
    const data = await res.json()
    setListaKlientow(data);
  }

  async function deleteClient(id){
    const decision = confirm("Czy na pewno chcesz usunąć?");

    if(decision){
      const odpowiedz = await fetch(`http://localhost:8000/api/klienci/${id}`, {
        method: 'DELETE'
      });

      if (odpowiedz.ok){
        downloadClientInformation();
      }
      console.log("Usunięto");
    }
    else{
      console.log("Anulowano");
    }
  }

  function editClient(klient){
    setEdytowanyId(klient.id)
  }

  async function handleSave(formData){
    const isEditing = edytowanyId !==null;
    const url = isEditing 
    ? `http://localhost:8000/api/klienci/${edytowanyId}` 
    : 'http://localhost:8000/api/dodaj-klienta';
    
    const method = isEditing ? 'PUT' : 'POST'
    
    const odpowiedz = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
    });

    if(odpowiedz.ok){
      downloadClientInformation();
      setEdytowanyId(null);
    }
  }

  return (
    <div>
      <FormularzKlientow
        onSave={handleSave}
        edytowanyKlient={listaKlientow.find(k => k.id === edytowanyId) || null}
      />

      <TabelaKlientow
        lista={listaKlientow}
        onDelete={deleteClient}
        onEdit={editClient}
      />
    </div>
  )
}

export default App