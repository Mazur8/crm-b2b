import { useState, useEffect } from "react";

function FormularzKlientow({ onSave, edytowanyKlient }){

    const [formData, setFormData] = useState(edytowanyKlient || {
        nazwa: '', 
        nip: '', 
        branza: '', 
        osoba_kontaktowa: '', 
        email: '' 
    });

    useEffect (() => {
        if(edytowanyKlient){
            setFormData(edytowanyKlient);
        }else{
            setFormData({nazwa: '', nip: '', branza: '', osoba_kontaktowa: '', email: ''})
        }
    }, [edytowanyKlient]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    
    async function handleSubmit(e){
        e.preventDefault();
        onSave(formData);
    }

    return(
        <form onSubmit={handleSubmit}>
            <input
            name="nazwa"
            value={formData.nazwa}
            onChange={handleChange}
            placeholder="Nazwa firmy"
            />

            <input
            name="nip"
            value={formData.nip}
            onChange={handleChange}
            placeholder="Nip firmy"
            />

            <input
            name='branza'
            value={formData.branza}
            onChange={handleChange}
            placeholder="Nazwa branży"
            />

            <input
            name='osoba_kontaktowa'
            value={formData.osoba_kontaktowa}
            onChange={handleChange}
            placeholder="Osoba kontaktowa"
            />

            <input
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder="Email kontaktowy"
            />

            <button type="submit">Dodaj klienta</button>
        </form>
    )
}
export default FormularzKlientow