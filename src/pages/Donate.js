import React, { useState } from 'react';
import './Donate.css';

function Donate() {
  const [amount, setAmount] = useState('5000');
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState('once');

  const predefinedAmounts = ['1000', '5000', '10000', '25000', '50000', '100000'];

  const handleAmountClick = (value) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const finalAmount = customAmount || amount;
  const numericAmount = Number(finalAmount);
  const isValidAmount = Number.isFinite(numericAmount) && numericAmount >= 100;

  const handleDonate = (e) => {
    e.preventDefault();

    // Don't open a payment page for an amount we can't honour.
    if (!isValidAmount) return;

    // The donation itself is completed on the external payment page. Passing
    // the chosen amount/frequency along at least lets that page prefill it
    // (and keeps the values in the URL for reference).
    const url = new URL('https://bit.ly/support-mydreamconnect');
    url.searchParams.set('amount', String(Math.round(numericAmount)));
    url.searchParams.set('frequency', frequency);

    window.open(url.toString(), '_blank', 'noopener');
  };

  return (
    <div className="donate-page">
      <div className="donate-container">
        
        {/* Clean Underlined Title */}
        <h1 className="donate-title">Support Our Mission</h1>
        <p className="donate-subtitle">
          Every donation helps us provide free developmental programs to teenagers, youth, 
          and women across Nigeria. From life skills training to tech bootcamps, your support fuels our mission.
        </p>

        <section className="donate-layout">

          {/* Left: Give form */}
          <div className="donate-form-wrap">
            <h3>Make a Donation</h3>

            {/* Frequency toggle */}
            <div className="frequency-toggle">
              <button
                className={frequency === 'once' ? 'freq-btn active' : 'freq-btn'}
                onClick={() => setFrequency('once')}
                type="button"
              >
                One Time
              </button>
              <button
                className={frequency === 'monthly' ? 'freq-btn active' : 'freq-btn'}
                onClick={() => setFrequency('monthly')}
                type="button"
              >
                Monthly
              </button>
            </div>

            {/* Amount buttons */}
            <label className="donate-label">Choose an amount (₦)</label>
            <div className="amount-grid">
              {predefinedAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={amount === amt ? 'amount-btn active' : 'amount-btn'}
                  onClick={() => handleAmountClick(amt)}
                >
                  ₦{Number(amt).toLocaleString()}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <label className="donate-label" htmlFor="donate-custom">Or enter a custom amount</label>
            <div className="custom-amount">
              <span>₦</span>
              <input
                id="donate-custom"
                type="number"
                placeholder="Enter amount (minimum ₦100)"
                value={customAmount}
                onChange={handleCustomChange}
                min="100"
                step="50"
                inputMode="numeric"
              />
            </div>

            {!isValidAmount && (
              <p className="donate-error" role="alert" style={{ color: '#c0392b', fontSize: 13, marginTop: 8 }}>
                Please enter an amount of at least ₦100.
              </p>
            )}

            {/* Submit */}
            <button
              type="button"
              className="donate-submit"
              onClick={handleDonate}
              disabled={!isValidAmount}
            >
              Donate ₦{isValidAmount ? numericAmount.toLocaleString('en-NG') : '0'} {frequency === 'monthly' ? 'Monthly' : 'Now'}
            </button>

            <p className="donate-note">
              🔒 Secure payment powered by Paystack &amp; Flutterwave. You will
              confirm the amount on the secure payment page.
            </p>
          </div>

          {/* Right: Why give */}
          <div className="donate-why">
            <h3>Why Your Gift Matters</h3>

            <div className="why-item">
              <span className="why-icon">🎓</span>
              <div>
                <h4>Education</h4>
                <p>Provides learning materials to students who cannot afford them.</p>
              </div>
            </div>

            <div className="why-item">
              <span className="why-icon">💻</span>
              <div>
                <h4>Tech Training</h4>
                <p>Funds free tech bootcamps for youths and career changers.</p>
              </div>
            </div>

            <div className="why-item">
              <span className="why-icon">🌱</span>
              <div>
                <h4>Life Skills</h4>
                <p>Supports mentoring and psychosocial development for teens.</p>
              </div>
            </div>

            <div className="why-item">
              <span className="why-icon">👩‍🏫</span>
              <div>
                <h4>Women Empowerment</h4>
                <p>Funds digital and business skills training for women.</p>
              </div>
            </div>

            <div className="donate-alt">
              <p>Prefer to donate directly?</p>
              <a href="https://bit.ly/support-mydreamconnect" target="_blank" rel="noreferrer">
                Click here to give via Bitly →
              </a>
            </div>
          </div>

        </section>

        {/* Closing */}
        <section className="donate-closing">
          <h2>Every Contribution Counts</h2>
          <p>No amount is too small. Together, we are raising a generation of changemakers.</p>
        </section>
      </div>
    </div>
  );
}

export default Donate;