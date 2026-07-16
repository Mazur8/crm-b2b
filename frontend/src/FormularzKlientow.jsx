import { useState, useEffect } from "react";


const Button = ({ children, type}) => (
    <button type={type} className='px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer bg-indigo-600 text-white hover:bg-indigo-900'>{children}</button>
);

const InputField = ({ name, value, onChange, placeholder, error}) =>(
    <div className="mb-4">
        <input
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className='w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none mb-4'
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);


function FormularzKlientow({ onSave, edytowanyKlient, isEditing, onCancel }){

    const [formData, setFormData] = useState(edytowanyKlient || {
        nazwa: '', 
        nip: '', 
        branza: '', 
        osoba_kontaktowa: '',
        numer_telefonu: '', 
        email: '' 
    });

    const [errors, setErrors] = useState({});

    useEffect (() => {
        if(edytowanyKlient){
            setFormData(edytowanyKlient);
        }else{
            setFormData({nazwa: '', nip: '', branza: '', osoba_kontaktowa: '', numer_telefonu: '', email: ''})
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
        let newErrors = {};

        if(!formData.nazwa.trim()) newErrors.nazwa = "Nazwa jest wymagana";

        const nipRegex = /^[0-9]{10}$/
        if(!nipRegex.test(formData.nip)) {
            newErrors.nip = "NIP musi składać się z dokładnie 10 cyfr";
        }

        if(!formData.osoba_kontaktowa.trim()) newErrors.osoba_kontaktowa = "Osoba kontaktowa jest wymagana";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData.email)){
            newErrors.email = "Podaj poprawny adres email";
        }

        const phoneRegex = /^[0-9\s-]{9,12}$/;
        if(formData.numer_telefonu.trim().length > 0 && !phoneRegex.test(formData.numer_telefonu)){
            newErrors.numer_telefonu = "Numer telefonu jest nieprawidłowy";
        }

        if (Object.keys(newErrors).length > 0){
            setErrors(newErrors);
            return;
        }
        setErrors({});
        await onSave(formData);

        setFormData({
            nazwa: '', 
            nip: '', 
            branza: '', 
            osoba_kontaktowa: '', 
            numer_telefonu: '', 
            email: ''
        });
    }

    return(
        <form onSubmit={handleSubmit}>
            <InputField
            name="nazwa"
            value={formData.nazwa}
            onChange={handleChange}
            placeholder="Nazwa firmy"
            error={errors.nazwa}
            />

            <InputField
            name="nip"
            value={formData.nip}
            onChange={handleChange}
            placeholder="Nip firmy"
            error={errors.nip}
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
            error={errors.email}
            />

            <InputField
            name='numer_telefonu'
            value={formData.numer_telefonu}
            onChange={handleChange}
            placeholder="Numer telefonu (opcjonalnie)"
            error={errors.numer_telefonu}
            />

            <Button type="submit">
                {isEditing ? "Zaktualizuj dane": "Dodaj klienta"}
            </Button>
            {isEditing && (
                <button 
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 mx-3 rounded-md text-sm font-medium transition-colors cursor-pointer bg-gray-400 text-white hover:bg-gray-700"
                >
                    Anuluj
                </button>
            )}
        </form>
    )
}
export default FormularzKlientow