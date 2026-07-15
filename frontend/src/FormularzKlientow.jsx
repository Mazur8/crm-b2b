import { useState, useEffect } from "react";


const Button = ({ children, type}) => (
    <button type={type} className='px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer bg-indigo-600 text-white hover:bg-indigo-900'>{children}</button>
);

const InputField = ({ name, value, onChange, placeholder}) =>(
    <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none mb-4'
    />
);

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
            <InputField
            name="nazwa"
            value={formData.nazwa}
            onChange={handleChange}
            placeholder="Nazwa firmy"
            />

            <InputField
            name="nip"
            value={formData.nip}
            onChange={handleChange}
            placeholder="Nip firmy"
            />

            <InputField
            name='branza'
            value={formData.branza}
            onChange={handleChange}
            placeholder="Nazwa branży"
            />

            <InputField
            name='osoba_kontaktowa'
            value={formData.osoba_kontaktowa}
            onChange={handleChange}
            placeholder="Osoba kontaktowa"
            />

            <InputField
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder="Email kontaktowy"
            />

            <Button type="submit">Dodaj klienta</Button>
        </form>
    )
}
export default FormularzKlientow