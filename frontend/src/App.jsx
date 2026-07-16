import { useEffect, useState } from 'react'
import FormularzKlientow from './FormularzKlientow';
import TabelaKlientow from './TabelaKlientow';
import './index.css'

function App() {

  const [listaKlientow, setListaKlientow] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [edytowanyId, setEdytowanyId] = useState(null);

  useEffect(() =>{
    fetch('http://localhost:8000/api/klienci')
    .then(res => res.json())
    .then(data => setListaKlientow(data));
  }, []);

  const filteredList = listaKlientow.filter((klient) => {
    const searchLower = searchTerm.toLowerCase();
    return(
      klient.nazwa.toLowerCase().includes(searchLower) ||
      klient.nip.includes(searchLower) || 
      klient.branza.toLowerCase().includes(searchLower) || 
      klient.osoba_kontaktowa.toLowerCase().includes(searchLower) ||
      klient.email.toLowerCase().includes(searchLower)
    )
  });


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
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">CRM B2B</h1>
          <p className="text-gray-600 mt-2">Zarządzanie bazą klientów</p>
        </header>
        <main className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <p className='p-3 text-center font-bold text-md'>Wyszukiwarka</p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Szukaj firmy..."
            className="border p-2 mb-6 w-full rounded-2xl"
          />
          <p className='p-3 text-center font-bold text-md'>Dodawanie klientów</p>
          <FormularzKlientow
            onSave={handleSave}
            edytowanyKlient={listaKlientow.find(k => k.id === edytowanyId) || null}
          />
        </main>
        <section className='text-center'>
          <p className='text-4xl pb-4 font-bold text-gray-800'>Aktualna lista klientów</p>
          <TabelaKlientow
            lista={filteredList}
            onDelete={deleteClient}
            onEdit={editClient}
          />
        </section>
      </div>
    </div>
  )
}

export default App