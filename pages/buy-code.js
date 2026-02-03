// pages/buy-code.js
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";

const CODE_PRICE = 5500;
const WA = "+2348136347797";

function PurchaseLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden role="img">
      <path d="M3 6h2l1 9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-7H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="10" cy="20" r="1" fill="currentColor" />
      <circle cx="18" cy="20" r="1" fill="currentColor" />
      <path d="M16 10a2 2 0 1 0-4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BuyCode() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [selected, setSelected] = useState("merchant");
  const [showModal, setShowModal] = useState(false);
  const [confirmName, setConfirmName] = useState("");
  const [processing, setProcessing] = useState(false);

  const modalRef = useRef(null);
  const nameInputRef = useRef(null);
  const buyButtonRef = useRef(null);

  const normalizePhone = (v) => {
    let x = String(v || "").replace(/\s+/g, "");
    if (x.startsWith("+234")) x = "0" + x.slice(4);
    return x.replace(/[^0-9]/g, "").slice(0, 11);
  };

  const handleBuyClick = (e) => {
    e.preventDefault();
    setShowModal(true);
    buyButtonRef.current = e.currentTarget;
  };

  useEffect(() => {
    if (!showModal) {
      if (buyButtonRef.current) buyButtonRef.current.focus();
      return;
    }

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (nameInputRef.current) nameInputRef.current.focus();
    }, 60);

    const onKey = (ev) => {
      if (ev.key === "Escape") {
        setShowModal(false);
        return;
      }
      if (ev.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;
        const focusable = modal.querySelectorAll('a[href], button:not([disabled]), textarea, input, select');
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (ev.shiftKey) {
          if (document.activeElement === first) {
            ev.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            ev.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showModal]);

  const handleProceed = () => {
    if (!confirmName) {
      alert("Please enter your name to proceed");
      return;
    }
    if (!phone) {
      alert("Please enter your phone number");
      return;
    }
    const normalized = normalizePhone(phone);
    setProcessing(true);
    setTimeout(() => {
      const q = `?name=${encodeURIComponent(confirmName)}&phone=${encodeURIComponent(normalized)}`;
      router.push(`/checkout${q}`);
    }, 450);
  };

  const openWhatsApp = () => window.open(`https://wa.me/${WA.replace("+", "")}`, "_blank", "noopener");

  return (
    <Layout>
      <style>{`
        /* ensure consistent sizing behavior */
        *, *::before, *::after { box-sizing: border-box; }

        :root{ --gw-gold:#d4af37; --gw-muted:#94a3b8; --gw-surface:#0f1724; --max-wrap:960px; }

        /* container */
        .wrap { max-width:var(--max-wrap); margin:26px auto; padding:22px; box-sizing:border-box; }
        .hero { text-align:center; margin-bottom:14px; }
        .hero h1{ margin:0; font-size:22px; color:var(--gw-gold); font-weight:800; letter-spacing:0.2px; }
        .hero p{ margin-top:8px; color:var(--gw-muted); font-size:13px }

        /* grid that centers the card and allows wrapping on small widths */
        .payment-grid { display:flex; justify-content:center; gap:16px; margin-top:10px; flex-wrap:wrap; padding:0 8px; }

        /*
          Card sizing:
          - max-width reduced to 320px for a sleeker appearance
          - min-height increased so content breathes and buttons sit lower
          - use flex column + space-between to distribute content vertically
        */
        .card {
          width: 100%;
          max-width: 320px;          /* reduced width */
          min-height: 360px;         /* increased length (height) */
          border-radius:14px;
          overflow:hidden;
          background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
          border:1px solid rgba(255,255,255,0.03);
          box-shadow: 0 10px 34px rgba(2,6,23,0.14);
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          margin: 0 auto;
        }

        .card-top { padding:16px 18px; display:flex; align-items:center; gap:12px; justify-content:flex-start; }
        .logo-wrap { width:52px; height:52px; border-radius:12px; display:flex; align-items:center; justify-content:center; background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); box-shadow: 0 10px 22px rgba(0,0,0,0.12); flex-shrink:0; }
        .brand { display:flex; flex-direction:column; gap:4px; align-items:flex-start; }
        .brand .title { font-weight:900; color: #e6e7ea; font-size:15px; letter-spacing:0.2px; }

        .card-body { padding:16px 16px 20px 16px; background:var(--gw-surface); display:flex; flex-direction:column; gap:12px; flex:1; box-sizing:border-box; }

        .note { color:var(--gw-muted); font-size:13px; line-height:1.35 }

        .amount { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-radius:12px; background: linear-gradient(90deg, rgba(0,0,0,0.02), rgba(255,255,255,0.01)); border:1px solid rgba(255,255,255,0.02) }
        .amount .label { color:var(--gw-muted); font-size:13px }
        .amount .value { font-weight:900; color:var(--gw-gold); font-size:18px }

        /* actions are pinned to the bottom of the card using the container flex layout */
        .actions { display:flex; gap:10px; margin-top:6px; align-items:center; }
        .btn { flex:1; padding:12px 14px; border-radius:999px; font-weight:800; cursor:pointer; border:0; font-size:14px; box-sizing:border-box; }
        .btn.primary { background: linear-gradient(90deg, var(--gw-gold), #efd78d); color:#071224; box-shadow:0 12px 30px rgba(212,175,55,0.09) }
        .btn.flat { background:transparent; border:1px solid rgba(255,255,255,0.04); color:var(--gw-muted) }

        /* overlay modal styles */
        .overlay { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; z-index:80; padding:20px; }
        .overlay .backdrop { position:absolute; inset:0; background:rgba(2,6,23,0.56); backdrop-filter: blur(6px); }

        .modal { position:relative; z-index:90; width:420px; max-width:92%; border-radius:12px; padding:18px; background: linear-gradient(180deg, #0b1220, #071224); box-shadow: 0 20px 60px rgba(2,6,23,0.6); border:1px solid rgba(255,255,255,0.04); color:#fff; box-sizing:border-box; }
        .modal h3{ margin:0 0 8px 0; font-size:16px }
        .modal p{ margin:0 0 12px 0; color:rgba(255,255,255,0.85); font-size:13px }
        .modal .field { width:100%; margin-bottom:10px }
        .modal .field input { width:100%; padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); color:inherit; box-sizing:border-box; }
        .modal .proceed { margin-top:8px; display:flex; gap:8px }

        /* responsive tweaks for smaller screens to ensure the card looks great */
        @media (max-width: 860px) {
          .card { max-width: 300px; min-height: 380px; }
          .logo-wrap { width:48px; height:48px; }
          .amount .value { font-size:17px; }
        }

        @media (max-width: 460px) {
          .wrap { padding:14px; }
          .card { max-width: 100%; min-height: 420px; border-radius:12px; }
          .card-top { padding:12px 14px; gap:10px; }
          .card-body { padding:14px; gap:10px; }
          .brand .title { font-size:14px; }
          .note { font-size:13px; }
          .actions { flex-direction:column-reverse; gap:10px; align-items:stretch; margin-top:12px; }
          .btn { width:100%; padding:12px; font-size:15px; }
        }
      `}</style>

      <div className="wrap">
        <div className="hero">
          <h1>BUY YOUR WITHDRAWAL CODE</h1>
          <p>Fast & secure — confirm your details before you proceed.</p>
        </div>

        <div className="payment-grid" role="list" aria-label="Payment methods">
          <motion.div
            role="listitem"
            tabIndex={0}
            className={`card ${selected === "merchant" ? "selected" : ""}`}
            onMouseEnter={() => setSelected("merchant")}
            onFocus={() => setSelected("merchant")}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            aria-pressed={selected === "merchant"}
          >
            <div className="card-top">
              <div className="logo-wrap" aria-hidden>
                <PurchaseLogo size={28} />
              </div>

              <div className="brand">
                <div className="title">Pay Vendor</div>
                <div style={{ fontSize: 12, color: "var(--gw-muted)", fontWeight: 700 }}>Manual vendor payment</div>
              </div>
            </div>

            <div className="card-body">
              <div>
                <div className="note">Ready to purchase — click <strong>Buy Now</strong> and confirm your details in a secure popup. No charges will be made at this step.</div>
              </div>

              <div className="amount" aria-hidden>
                <div className="label">Price</div>
                <div className="value">₦{CODE_PRICE.toLocaleString()}</div>
              </div>

              <div className="actions" aria-hidden>
                <button
                  className="btn primary"
                  onClick={handleBuyClick}
                  aria-label="Buy now"
                >
                  Buy Now
                </button>

                <button className="btn flat" onClick={openWhatsApp} aria-label="Contact vendor on WhatsApp">
                  Contact
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ textAlign: "center", marginTop: 14, color: "var(--gw-muted)" }}>
          Need help?{" "}
          <a href={`https://wa.me/${WA.replace("+", "")}`} target="_blank" rel="noreferrer" style={{ color: "var(--gw-gold)", fontWeight: 700 }}>
            Contact support
          </a>
        </div>

        <AnimatePresence>
          {showModal && (
            <motion.div className="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="backdrop" />

              <motion.div
                className="modal"
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 10, opacity: 0, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
              >
                <h3 id="confirm-title">Confirm your details</h3>
                <p>Please confirm the name and phone number we should use for this payment. This will not charge you — it only prepares the payment instructions.</p>

                <div className="field">
                  <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>Full name</label>
                  <input ref={nameInputRef} value={confirmName} onChange={(e) => setConfirmName(e.target.value)} placeholder="Enter your full name" />
                </div>

                <div className="field">
                  <label style={{ display: "block", fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. 0803xxxxxxx" />
                </div>

                <div className="proceed">
                  <button className="btn primary" onClick={handleProceed} disabled={!confirmName}>
                    {processing ? "Processing…" : "CLICK HERE TO PROCEED"}
                  </button>

                  <button className="btn flat" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
