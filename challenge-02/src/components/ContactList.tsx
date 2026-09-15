import type { Contact } from '../types';
import ContactItem from './ContactItem';

interface ContactListProps {
  contacts: Contact[];
  onDelete: (id: number) => void;
}

function ContactList({ contacts, onDelete }: ContactListProps) {
  return (
    <ul>
      {contacts.map((contact) => (
        <ContactItem key={contact.id} contact={contact} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default ContactList;
