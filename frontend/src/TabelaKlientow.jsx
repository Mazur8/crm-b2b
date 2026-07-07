function TabelaKlientow({lista, onDelete, onEdit}){
    return(
        <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nazwa firmy</th>
            <th>NIP</th>
            <th>Branża</th>
            <th>Osoba kontaktowa</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((klient) => (
            <tr key={klient.id}>
              <td>{klient.id}</td>
              <td>{klient.nazwa}</td>
              <td>{klient.nip}</td>
              <td>{klient.branza}</td>
              <td>{klient.osoba_kontaktowa}</td>
              <td>{klient.email}</td>
              <td>{klient.status}</td>
              <td>
                <button onClick={() => onDelete(klient.id)}>Usuń</button>
              </td>
              <td>
                <button onClick={() => onEdit(klient)}>Edytuj</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
} 
export default TabelaKlientow;