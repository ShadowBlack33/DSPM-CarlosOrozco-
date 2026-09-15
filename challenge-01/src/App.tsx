import { useState, useEffect } from 'react';
import Loader from './components/Loader';
import ContactList from './components/ContactList';
import AddContactForm from './components/AddContactForm';
import type { Contact } from './types';

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula la carga inicial de contactos (ej. desde una API)
    setTimeout(() => {
      setContacts([
        { id: 1, name: 'Ana Torres', phone: '3001112233' },
        { id: 2, name: 'Luis Pérez', phone: '3009998877' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const addContact = (contact: Contact) => {
    setContacts((prev) => [...prev, contact]);
  };

  const deleteContact = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="App">
      <h1>Mis Contactos</h1>
      <AddContactForm onAdd={addContact} />
      <ContactList contacts={contacts} onDelete={deleteContact} />
    </div>
  );
}

export default App;
