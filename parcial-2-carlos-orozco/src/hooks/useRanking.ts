import { useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { collection, getCountFromServer, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { RankingRow } from '../types';

interface Row { uid: string; name: string; points: number }

/**
 * Top 5 con usuarios reales de Firestore (en vivo con onSnapshot).
 * Si tú no estás en el top 5 se muestran los 4 primeros + tu posición real,
 * así siempre te ves frente a los otros 4.
 */
const useRanking = (user: User | null, myPoints: number) => {
  const [top, setTop] = useState<Row[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users'), orderBy('points', 'desc'), limit(6));
    return onSnapshot(
      q,
      (snap) => {
        setTop(snap.docs.map((d) => ({
          uid: d.id,
          name: (d.get('name') as string) || 'Jugador',
          points: Number(d.get('points') ?? 0),
        })));
        setIsLoading(false);
        setError(null);
      },
      (e) => {
        console.error(e);
        setError('No se pudo cargar el ranking. Revisa la conexión o las reglas de Firestore.');
        setIsLoading(false);
      },
    );
  }, [user]);

  // Posición real: cuántos usuarios tienen más puntos que yo + 1
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getCountFromServer(query(collection(db, 'users'), where('points', '>', myPoints)))
      .then((r) => { if (!cancelled) setMyRank(r.data().count + 1); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [user, myPoints, top]);

  const rows = useMemo<RankingRow[]>(() => {
    if (!user) return [];
    const me: Row = {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Tú',
      points: myPoints, // mis puntos locales: se ven al instante aunque Firebase tarde
    };
    const others = top.filter((r) => r.uid !== user.uid);
    const all = [...others, me].sort((a, b) => b.points - a.points);
    const myIndex = all.findIndex((r) => r.uid === user.uid);

    if (myIndex < 5) {
      return all.slice(0, 5).map((r, i) => ({ ...r, rank: i + 1, isMe: r.uid === user.uid }));
    }
    return [
      ...others.slice(0, 4).map((r, i) => ({ ...r, rank: i + 1, isMe: false })),
      { ...me, rank: Math.max(myRank ?? myIndex + 1, 5), isMe: true },
    ];
  }, [top, user, myPoints, myRank]);

  return { rows, isLoading, error };
};

export default useRanking;
