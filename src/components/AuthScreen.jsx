import { useState } from 'react';
import BrandLogo from './BrandLogo';

const DEMO_CREDENTIALS = {
  email: 'instructor@cineplex.com',
  password: 'Cinema123',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.com$/i;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

export default function AuthScreen({
  onSuccess,
  language,
  onLanguageChange,
  t,
  onOpenLoginQualityComparison,
  onOpenProjectOne,
  onOpenProjectTwo,
  onOpenProjectThree,
  onOpenBugLab,
}) {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitError, setSubmitError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (fieldName, fieldValue) => {
    if (fieldName === 'email') {
      if (!fieldValue.trim()) {
        return t('auth.emailRequired');
      }
      if (!emailRegex.test(fieldValue.trim())) {
        return t('auth.emailInvalid');
      }
      return '';
    }

    if (fieldName === 'password') {
      if (!fieldValue.trim()) {
        return t('auth.passwordRequired');
      }
      if (fieldValue.length < 6) {
        return t('auth.passwordMin');
      }
      if (!passwordRegex.test(fieldValue)) {
        return t('auth.passwordInvalid');
      }
      return '';
    }

    return '';
  };

  const validateAll = () => {
    return {
      email: validateField('email', values.email),
      password: validateField('password', values.password),
    };
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!touched[name]) {
        return prev;
      }
      return { ...prev, [name]: validateField(name, value) };
    });
    setSubmitError('');
  };

  const onBlur = (event) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateAll();
    setTouched({ email: true, password: true });
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    const isValidUser =
      values.email.toLowerCase() === DEMO_CREDENTIALS.email &&
      values.password === DEMO_CREDENTIALS.password;

    if (!isValidUser) {
      setSubmitError(t('auth.wrongCredentials'));
      return;
    }

    onSuccess(values.email);
  };

  return (
    <div className="auth-page">
      <button type="button" className="auth-training-link" onClick={onOpenLoginQualityComparison}>
        Login QA Exercise
      </button>
      <button type="button" className="auth-project-link" onClick={onOpenProjectOne}>
        Projekti 1
      </button>
      <button type="button" className="auth-project-two-link" onClick={onOpenProjectTwo}>
        Projekti 2
      </button>
      <button type="button" className="auth-project-three-link" onClick={onOpenProjectThree}>
        Projekti 3
      </button>
      <button type="button" className="auth-buglab-link" onClick={onOpenBugLab}>
        Players Football
      </button>

      <div className="auth-layout">
        <section className="auth-visual">
          <BrandLogo eyebrow={t('app.qaProject')} title="Cineplex Stream" headingTag="h1" />
          <p>{t('auth.visualDescription')}</p>

          <div className="auth-bullets">
            <span>{t('auth.bulletMetadata')}</span>
            <span>{t('auth.bulletModal')}</span>
            <span>{t('auth.bulletBooking')}</span>
          </div>
        </section>

        <div className="auth-card">
          <div className="auth-card-head">
            <h2 data-testid="signin-title">{t('auth.signIn')}</h2>
            <div
              className="lang-switch"
              role="group"
              aria-label={t('app.language')}
              data-testid="language-switch"
            >
              <button
                type="button"
                className={language === 'en' ? 'active' : ''}
                onClick={() => onLanguageChange('en')}
                aria-label={t('app.langEnglish')}
                data-testid="lang-en"
              >
                EN
              </button>
              <button
                type="button"
                className={language === 'sq' ? 'active' : ''}
                onClick={() => onLanguageChange('sq')}
                aria-label={t('app.langAlbanian')}
                data-testid="lang-al"
              >
                AL
              </button>
            </div>
          </div>
          <p className="subtitle">{t('auth.demoHint')}</p>

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="email">{t('auth.email')}</label>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="name@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && <small className="field-error">{errors.email}</small>}

            <label htmlFor="password">{t('auth.password')}</label>
            <div className="password-input-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={onChange}
                onBlur={onBlur}
                placeholder="******"
                aria-invalid={Boolean(errors.password)}
              />
              <button
                type="button"
                className="password-visibility-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 12S5.5 5 12 5s10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2 4L20 22" />
                    <path d="M10.58 10.58A2 2 0 0 0 13.41 13.41" />
                    <path d="M9.36 5.37A11.59 11.59 0 0 1 12 5c5 0 9.27 3.11 11 7-0.68 1.52-1.79 2.89-3.2 4" />
                    <path d="M6.23 6.23C4.36 7.27 2.85 8.95 2 12c1.73 3.89 6 7 10 7 1.46 0 2.86-0.33 4.12-0.92" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <small className="field-error">{errors.password}</small>}

            {submitError && <p className="submit-error">{submitError}</p>}

            <button type="submit" className="btn btn-primary full">
              {t('auth.signIn')}
            </button>
          </form>

          <div className="demo-note">
            <p>
              {t('auth.demoCredentials')} <strong>{DEMO_CREDENTIALS.email}</strong> /{' '}
              <strong>{DEMO_CREDENTIALS.password}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
