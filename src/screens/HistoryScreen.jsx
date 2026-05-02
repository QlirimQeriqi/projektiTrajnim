function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const mins = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${mins}`;
}

export default function HistoryScreen({ historyOrders, t }) {
  return (
    <section>
      <header className="screen-header">
        <div>
          <h2>{t('history.title')}</h2>
          <p>{t('history.subtitle')}</p>
        </div>
      </header>

      <div className="panel">
        {historyOrders.length === 0 && (
          <div className="empty-state">
            <p>{t('history.empty')}</p>
          </div>
        )}

        <div className="history-list">
          {historyOrders.map((order) => (
            <article key={order.id} className="history-row">
              <img src={order.movie.image} alt={order.movie.title} />

              <div>
                <h3>{order.movie.title}</h3>
                <p>
                  {order.movie.genre} · {order.movie.year} · {formatDuration(order.movie.durationMinutes)}
                </p>
                <p>
                  {t('history.orderedAt')}: {formatDateTime(order.orderedAt)}
                </p>
                <div className="history-meta">
                  <span>
                    {t('history.tickets')}: {order.tickets}
                  </span>
                  <span>
                    {t('history.city')}: {order.city}
                  </span>
                  <span>
                    {t('history.showtime')}: {order.showtime}
                  </span>
                  <span>
                    {t('history.seatType')}: {order.seatType}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
