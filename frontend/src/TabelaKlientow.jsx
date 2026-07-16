const Th = ({ children }) => (
  <th className="px-3 py-2"> {children} </th>
);

const Td = ({ children }) => (
  <td className="px-3 py-2 text-center"> {children} </td>
);

const Button = ({ children, onClick, color = "blue" }) => {
  const baseClasses = 'px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer';

  const colorClasses = color === "red" 
  ? "bg-red-600 text-white hover:bg-red-900"
  : "bg-indigo-600 text-white hover:bg-indigo-900";

  return(
    <button onClick={onClick} className={`${baseClasses} ${colorClasses}`}> {children} </button>
  );
};

function TabelaKlientow({lista, onDelete, onEdit, onStatusChange}){
    return(
      lista.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          Nie znaleziono klientów spełniających kryteria.
        </div>
      ) : (
        <table className='min-w-full divide-y divide-gray-200'>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Nazwa firmy</Th>
              <Th>NIP</Th>
              <Th>Branża</Th>
              <Th>Osoba kontaktowa</Th>
              <Th>Email</Th>
              <Th>Numer telefonu</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {lista.map((klient) => (
              <tr key={klient.id}>
                <Td>{klient.id}</Td>
                <Td>{klient.nazwa}</Td>
                <Td>{klient.nip}</Td>
                <Td>{klient.branza}</Td>
                <Td>{klient.osoba_kontaktowa}</Td>
                <Td>{klient.email}</Td>
                <Td>{klient.numer_telefonu}</Td>
                <Td>
                  <select
                    value={klient.status}
                    onChange={(e) => onStatusChange(klient.id, e.target.value)}
                    className="border rounded p-1 w-full"
                  >
                    <option value="Lead">Lead</option>
                    <option value="W kontakcie">W kontakcie</option>
                    <option value="Wygrana">Wygrana</option>
                    <option value="Przegrana">Przegrana</option>
                  </select>
                </Td>
                <td>
                  <Button onClick={() => onEdit(klient)}>Edytuj</Button>
                </td>
                <td>
                  <Button onClick={() => onDelete(klient.id)} color="red">Usuń</Button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      )
    )
} 
export default TabelaKlientow;