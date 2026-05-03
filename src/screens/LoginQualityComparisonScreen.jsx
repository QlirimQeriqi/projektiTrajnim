import { useEffect, useMemo, useRef, useState } from 'react';

const GOOD_CREDENTIALS = {
  email: 'student@test.com',
  password: 'Test1234',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function VersionCardFrame({
  variant,
  onSubmit,
  children,
  message,
  messageTone,
  submitText = 'Login',
  submitDisabled = false,
}) {
  return (
    <article className={`lqc-card lqc-card-${variant}`}>
      <form className="lqc-form" onSubmit={onSubmit} noValidate>
        {children}
        <button type="submit" className="btn lqc-submit" disabled={submitDisabled}>
          {submitText}
        </button>
        <div className="lqc-message-wrap" aria-live="polite">
          {message ? <p className={`lqc-message ${messageTone}`}>{message}</p> : null}
        </div>
      </form>
    </article>
  );
}

function VersionA() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    setMessage('Error');
  };

  return (
    <VersionCardFrame
      variant="rough"
      message={message}
      messageTone="error"
      onSubmit={onSubmit}
    >
      <label htmlFor="a-email">Email</label>
      <input
        id="a-email"
        type="text"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <label htmlFor="a-password">Password</label>
      <input
        id="a-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
    </VersionCardFrame>
  );
}

function VersionB() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!email.includes('@') || !email.includes('.')) {
      nextErrors.email = 'Invalid email';
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage('');
      return;
    }

    setMessage('Something went wrong');
  };

  return (
    <VersionCardFrame
      variant="balanced"
      message={message}
      messageTone="error"
      onSubmit={onSubmit}
    >
      <label htmlFor="b-email">Email</label>
      <input
        id="b-email"
        type="text"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setMessage('');
        }}
      />
      <div className="lqc-inline-feedback">{errors.email ? <small>{errors.email}</small> : null}</div>

      <label htmlFor="b-password">Password</label>
      <input
        id="b-password"
        type="password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setMessage('');
        }}
      />
      <div className="lqc-inline-feedback">
        {errors.password ? <small>{errors.password}</small> : null}
      </div>
    </VersionCardFrame>
  );
}

function VersionC() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageTone, setMessageTone] = useState('error');
  const timerRef = useRef(null);

  const validate = (nextEmail, nextPassword) => {
    const nextErrors = {};

    if (!nextEmail.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!emailRegex.test(nextEmail.trim())) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (!nextPassword.trim()) {
      nextErrors.password = 'Password is required';
    }

    return nextErrors;
  };

  const canSubmit = useMemo(() => {
    return Boolean(email.trim() && emailRegex.test(email.trim()) && password.trim() && !loading);
  }, [email, password, loading]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    setMessage('');

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    timerRef.current = window.setTimeout(() => {
      const isValidUser =
        email.trim().toLowerCase() === GOOD_CREDENTIALS.email && password === GOOD_CREDENTIALS.password;

      if (isValidUser) {
        setMessage('Login successful');
        setMessageTone('success');
      } else {
        setMessage('Invalid email or password');
        setMessageTone('error');
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <VersionCardFrame
      variant="polished"
      message={message}
      messageTone={messageTone}
      submitText={loading ? 'Logging in...' : 'Login'}
      submitDisabled={!canSubmit}
      onSubmit={onSubmit}
    >
      <label htmlFor="c-email">Email</label>
      <input
        id="c-email"
        type="email"
        value={email}
        onChange={(event) => {
          const nextEmail = event.target.value;
          setEmail(nextEmail);
          setErrors(validate(nextEmail, password));
          setMessage('');
        }}
      />
      <div className="lqc-inline-feedback">{errors.email ? <small>{errors.email}</small> : null}</div>

      <label htmlFor="c-password">Password</label>
      <div className="lqc-password-wrap">
        <input
          id="c-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(event) => {
            const nextPassword = event.target.value;
            setPassword(nextPassword);
            setErrors(validate(email, nextPassword));
            setMessage('');
          }}
        />
        <button
          type="button"
          className="lqc-toggle-password"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="lqc-inline-feedback">
        {errors.password ? <small>{errors.password}</small> : null}
      </div>

    </VersionCardFrame>
  );
}

export default function LoginQualityComparisonScreen({ onBack }) {
  return (
    <div className="lqc-page">
      <div className="lqc-container">
        <button type="button" className="lqc-back-btn" onClick={onBack}>
          Back to Login
        </button>

        <header className="lqc-header">
          <h1>Login Quality Comparison</h1>
          <p>
            Compare 3 login experiences and decide which one has better quality from a QA
            perspective.
          </p>
        </header>

        <section className="lqc-grid">
          <VersionA />
          <VersionC />
          <VersionB />
        </section>

      </div>
    </div>
  );
}
