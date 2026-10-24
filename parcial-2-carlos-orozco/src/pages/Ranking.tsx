import { IonContent, IonPage, IonSpinner } from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import useRanking from '../hooks/useRanking';
import TabBar from '../components/TabBar';

const Ranking = () => {
  const { user } = useAuth();
  const { progress } = useGame();
  const { rows, isLoading, error } = useRanking(user, progress.points);
  const gap = rows.length === 5 && rows[4].rank > 5;

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="topbar"><span className="brand">RANKING</span><span className="live"><i />En vivo</span></div>
        <header className="page-head">
          <h1>Top 5</h1>
          <p>Usuarios reales y sus puntos en Firebase.</p>
        </header>
        {isLoading && <div className="center-fill pad"><IonSpinner name="crescent" /></div>}
        {error && <div className="form-error mx">{error}</div>}
        <ol className="ranking">
          {rows.map((r, i) => (
            <li key={r.uid} className={`${r.isMe ? 'is-me' : ''} ${gap && i === 4 ? 'has-gap' : ''}`}>
              <span className="ranking__pos">#{r.rank}</span>
              <span className="ranking__name">{r.name}{r.isMe && <em>Tú</em>}</span>
              <span className="ranking__pts">{r.points}<small> pts</small></span>
            </li>
          ))}
        </ol>
        {!isLoading && rows.length < 5 && (
          <p className="hint center">Aún hay pocos usuarios registrados. Crea más cuentas para llenar el top 5.</p>
        )}
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Ranking;
