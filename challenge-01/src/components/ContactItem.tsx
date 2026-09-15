import type { Contact } from '../types';

interface ContactItemProps {
  contact: Contact;
  onDelete: (id: number) => void;
}

function ContactItem({ contact, onDelete }: ContactItemProps) {
  return (
    <li>
      <span>{contact.name} - {contact.phone}</span>
      <button onClick={() => onDelete(contact.id)}>Eliminar</button>
    </li>
  );
}

export default ContactItem;
