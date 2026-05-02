import { useSwipe } from '../hooks/useSwipe';

export default function SwipeableCartRow({ application, onWithdraw, onAdvanceStage, onEditNote }) {
  const { bind, offsetX } = useSwipe({
    threshold: 75,
    onSwipeLeft: () => onWithdraw(application.id),
    onSwipeRight: () => onAdvanceStage(application.id),
  });

  return (
    <div className="cart-row-wrap">
      <div className="swipe-hint swipe-left">Swipe left: withdraw</div>
      <div className="swipe-hint swipe-right">Swipe right: next stage</div>

      <article className="cart-row" style={{ transform: `translateX(${offsetX}px)` }} {...bind}>
        <img src={application.job.logo} alt={application.job.title} />

        <div className="cart-main">
          <h4>{application.job.title}</h4>
          <p>
            {application.job.company} · {application.job.location}
          </p>

          <div className="application-row-meta">
            <span className="chip">{application.status}</span>
            <button type="button" className="btn" onClick={() => onAdvanceStage(application.id)}>
              Next Stage
            </button>
            <button type="button" className="btn" onClick={() => onEditNote(application.id)}>
              Edit Note
            </button>
          </div>
        </div>

        <button type="button" className="btn btn-danger" onClick={() => onWithdraw(application.id)}>
          Withdraw
        </button>
      </article>
    </div>
  );
}
