import { useState } from 'react';

const ROW_OPTIONS = ['First', 'Second', 'Third'];
const CITY_OPTIONS = ['Prizren', 'Prishtine', 'Lipjan', 'Mitrovice'];
const SEAT_OPTIONS = ['Standard', 'VIP'];

function seatMultiplier(seatType) {
  return seatType === 'VIP' ? 1.55 : 1;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

function lineTotal(movie, selection) {
  const base = movie.price * seatMultiplier(selection.seatType);
  return base * selection.tickets;
}

const ORDER_LABEL_KEYS = {
  First: 'admin.orderFirst',
  Second: 'admin.orderSecond',
  Third: 'admin.orderThird',
};

const SEAT_LABEL_KEYS = {
  Standard: 'admin.seatStandard',
  VIP: 'admin.seatVip',
};

export default function AdminScreen({
  selectedMovies,
  onUpdateSelection,
  onRemoveSelection,
  onFinishOrder,
  t,
}) {
  const [successToast, setSuccessToast] = useState('');
  const [confirmOrderItem, setConfirmOrderItem] = useState(null);

  const totals = selectedMovies.reduce(
    (acc, item) => {
      const amount = lineTotal(item.movie, item);
      return {
        tickets: acc.tickets + item.tickets,
        amount: acc.amount + amount,
      };
    },
    { tickets: 0, amount: 0 }
  );

  const handleFinishOrder = (selectedItem) => {
    onFinishOrder(selectedItem);
    setSuccessToast(t('admin.orderCompleted'));
    window.clearTimeout(window.__qaFinishOrderToastTimer);
    window.__qaFinishOrderToastTimer = window.setTimeout(() => setSuccessToast(''), 1800);
    setConfirmOrderItem(null);
  };

  return (
    <section>
      <header className="screen-header">
        <div>
          <h2>{t('admin.title')}</h2>
          <p>{t('admin.subtitle')}</p>
        </div>
      </header>

      <div className="plan-summary panel">
        <div>
          <small>{t('admin.selectedMovies')}</small>
          <strong>{selectedMovies.length}</strong>
        </div>
        <div>
          <small>{t('admin.totalTickets')}</small>
          <strong>{totals.tickets}</strong>
        </div>
        <div>
          <small>{t('admin.estimatedTotal')}</small>
          <strong>€{totals.amount.toFixed(2)}</strong>
        </div>
      </div>

      {successToast && <div className="toast toast-success">{successToast}</div>}

      <div className="panel">
        {selectedMovies.length === 0 && (
          <div className="empty-state">
            <p>{t('admin.empty')}</p>
          </div>
        )}

        <div className="plan-list">
          {selectedMovies.map((item) => (
            <article key={item.movie.id} className="plan-row">
              <img src={item.movie.image} alt={item.movie.title} />

              <div className="plan-main">
                <h3>{item.movie.title}</h3>
                <p>
                  {item.movie.genre} · {item.movie.year} · {formatDuration(item.movie.durationMinutes)}
                </p>
                <p>
                  {item.movie.language} · {item.movie.formats.join('/')} · {t('admin.base')} €
                  {item.movie.price.toFixed(2)}
                </p>
                <strong>
                  {t('admin.lineTotal')}: €{lineTotal(item.movie, item).toFixed(2)}
                </strong>
              </div>

              <div className="plan-controls">
                <div className="plan-grid-two">
                  <div>
                    <label htmlFor={`row-${item.movie.id}`}>{t('admin.watchOrder')}</label>
                    <select
                      id={`row-${item.movie.id}`}
                      value={item.watchOrder}
                      onChange={(event) =>
                        onUpdateSelection(item.movie.id, 'watchOrder', event.target.value)
                      }
                    >
                      {ROW_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {t(ORDER_LABEL_KEYS[option])}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`city-${item.movie.id}`}>{t('admin.city')}</label>
                    <select
                      id={`city-${item.movie.id}`}
                      value={item.city}
                      onChange={(event) => onUpdateSelection(item.movie.id, 'city', event.target.value)}
                    >
                      {CITY_OPTIONS.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="plan-grid-two">
                  <div>
                    <label htmlFor={`showtime-${item.movie.id}`}>{t('admin.showtime')}</label>
                    <select
                      id={`showtime-${item.movie.id}`}
                      value={item.showtime}
                      onChange={(event) =>
                        onUpdateSelection(item.movie.id, 'showtime', event.target.value)
                      }
                    >
                      {item.movie.showtimes.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor={`seat-${item.movie.id}`}>{t('admin.seatType')}</label>
                    <select
                      id={`seat-${item.movie.id}`}
                      value={item.seatType}
                      onChange={(event) =>
                        onUpdateSelection(item.movie.id, 'seatType', event.target.value)
                      }
                    >
                      {SEAT_OPTIONS.map((type) => (
                        <option key={type} value={type}>
                          {t(SEAT_LABEL_KEYS[type])}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor={`tickets-${item.movie.id}`}>{t('admin.tickets')}</label>
                  <input
                    id={`tickets-${item.movie.id}`}
                    type="number"
                    min="1"
                    max="8"
                    value={item.tickets}
                    onChange={(event) => onUpdateSelection(item.movie.id, 'tickets', event.target.value)}
                    onFocus={(event) => event.target.select()}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => setConfirmOrderItem(item)}
                >
                  {t('admin.finishOrder')}
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => onRemoveSelection(item.movie.id)}
                >
                  {t('admin.removeMovie')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {confirmOrderItem && (
        <div className="modal-backdrop" onClick={() => setConfirmOrderItem(null)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <h3>{t('admin.finishOrder')}</h3>
            <p>
              {confirmOrderItem.movie.title} · {confirmOrderItem.city} · {confirmOrderItem.showtime}
            </p>
            <div className="confirm-actions">
              <button
                type="button"
                className="btn btn-success"
                onClick={() => handleFinishOrder(confirmOrderItem)}
              >
                {t('admin.confirmOrder')}
              </button>
              <button type="button" className="btn" onClick={() => setConfirmOrderItem(null)}>
                {t('admin.cancelOrder')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
