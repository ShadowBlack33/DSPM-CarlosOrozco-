import { useState, type FormEvent } from 'react';
import type { Contact } from '../types';

interface AddContactFormProps {
  onAdd: (contact: Contact) => void;
}

function AddContactForm({ onAdd }: AddContactFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !phone) return;
    onAdd({ id: Date.now(), name, phone });
    setName('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button type="submit">Agregar</button>
    </form>
  );
}

export default AddContactForm;
