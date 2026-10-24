import Dexie, { type EntityTable } from 'dexie';

export interface Fruta {
  id: number;
  nombre: string;
  proveedor: string;
  fechaCosecha: string;
  precio: number;
  favorita: boolean;
  createdAt: string;
}

const db = new Dexie('MiAppDB') as Dexie & {
  frutas: EntityTable<Fruta, 'id'>;
};

// Versión 1: campos iniciales
db.version(1).stores({
  frutas: '++id, nombre, createdAt',
});

// Versión 2: nuevos campos indexados (proveedor, fechaCosecha)
db.version(2).stores({
  frutas: '++id, nombre, proveedor, fechaCosecha, createdAt',
});

// Versión 3: nueva función -> favoritas (índice para filtrarlas)
db.version(3).stores({
  frutas: '++id, nombre, proveedor, fechaCosecha, precio, favorita, createdAt',
});

export default db;
