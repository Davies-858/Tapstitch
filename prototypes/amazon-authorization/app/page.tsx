"use client";

import { useEffect, useState } from "react";

type FlowStep = "intro" | "market" | "account" | "loading" | "success" | "error";

const regions = {
  "North America": [
    ["US", "United States", "amazon.com"],
    ["CA", "Canada", "amazon.ca"],
    ["MX", "Mexico", "amazon.com.mx"],
  ],
  Europe: [
    ["UK", "United Kingdom", "amazon.co.uk"],
    ["DE", "Germany", "amazon.de"],
    ["FR", "France", "amazon.fr"],
    ["IT", "Italy", "amazon.it"],
    ["ES", "Spain", "amazon.es"],
  ],
} as const;

const integrations = [
  ["E", "Etsy", "Connect your Etsy shop and sync orders."],
  ["W", "WooCommerce", "Bring your WooCommerce store to Tapstitch."],
  ["S", "Squarespace", "Connect your Squarespace storefront."],
  ["API", "API", "Build your own custom integration."],
];

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function Home() {
  const [step, setStep] = useState<FlowStep | null>(null);
  const [region, setRegion] = useState<keyof typeof regions>("North America");
  const [markets, setMarkets] = useState<string[]>(["US"]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (step !== "loading") return;
    const timer = window.setTimeout(() => setStep("success"), 1900);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openAmazon = () => {
    setRegion("North America");
    setMarkets(["US"]);
    setStep("intro");
  };

  const closeFlow = () => {
    setCancelOpen(false);
    setStep(null);
  };

  const toggleMarket = (code: string) => {
    setMarkets((current) =>
      current.includes(code) ? current.filter((item) => item !== code) : [...current, code],
    );
  };

  return (
    <main className="shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Tapstitch home">
          <span className="brand-mark"><i /><i /><i /></span>
          <span>tapstitch</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#how">How it works</a>
          <a href="#products">Products</a>
          <a href="#pricing">Pricing</a>
          <a href="#resources">Resources</a>
        </nav>
        <div className="header-actions">
          <button className="text-button">Log in</button>
          <button className="dark-button">Start creating <Arrow /></button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">SELL WHERE YOUR CUSTOMERS SHOP</p>
          <h1 id="hero-title">Connect your store.<br />We’ll handle the rest.</h1>
          <p className="lede">Bring Tapstitch products to the channels you already sell on. Orders flow in automatically, and we take care of production and delivery.</p>

          <article className="shopify-card">
            <div className="shopify-logo">S</div>
            <div>
              <strong>Shopify</strong>
              <span>Connected</span>
            </div>
            <button className="connected" aria-label="Shopify is connected">✓ Connected</button>
          </article>
        </div>

        <div className="channel-panel" aria-label="Sales channel connections">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="center-badge"><span className="brand-mark light"><i /><i /><i /></span></div>

          <button className="channel-card tiktok-card" onClick={() => setToast("TikTok Shop authorization entry is unchanged.")}>
            <span className="channel-logo tiktok">♪</span>
            <span><b>TikTok Shop</b><small>Connect your TikTok storefront</small></span>
            <Arrow />
          </button>

          <button className="channel-card amazon-card" onClick={openAmazon}>
            <span className="channel-logo amazon">a</span>
            <span><b>Amazon</b><small>Connect your Seller Central account</small></span>
            <Arrow />
          </button>

          <div className="floating-chip shopify-chip">S</div>
          <div className="floating-chip bag-chip">▣</div>
          <div className="floating-chip globe-chip">◎</div>
        </div>
      </section>

      <section className="integrations" id="products">
        <div className="section-heading">
          <div><p className="eyebrow">MORE WAYS TO SELL</p><h2>Made to fit your business</h2></div>
          <p>Choose the tools you already use. Tapstitch keeps your products, inventory, and fulfillment in sync.</p>
        </div>
        <div className="integration-grid">
          {integrations.map(([icon, name, copy]) => (
            <article key={name} className="integration-card">
              <span className="mini-logo">{icon}</span>
              <h3>{name}</h3>
              <p>{copy}</p>
              <button onClick={() => setToast(`${name} integration is coming soon.`)}>Learn more <Arrow /></button>
            </article>
          ))}
        </div>
      </section>

      {toast && <div className="toast" role="status">{toast}</div>}

      {step && (
        <div className="modal-backdrop" role="presentation">
          <section className="flow-modal" role="dialog" aria-modal="true" aria-labelledby="flow-title">
            <div className="flow-topbar">
              <a className="brand compact" href="#"><span className="brand-mark"><i /><i /><i /></span><span>tapstitch</span></a>
              {step !== "success" && step !== "loading" && (
                <button className="close-button" onClick={() => setCancelOpen(true)} aria-label="Close authorization">×</button>
              )}
            </div>

            <div className="flow-layout">
              <aside className="steps" aria-label="Authorization progress">
                <div className="amazon-identity"><span className="channel-logo amazon">a</span><span><b>Connect Amazon</b><small>Seller Central</small></span></div>
                {[["intro", "Before you begin"], ["market", "Choose marketplaces"], ["account", "Authorize account"]].map(([id, label], index) => {
                  const order: FlowStep[] = ["intro", "market", "account", "loading", "success"];
                  const current = order.indexOf(step);
                  const complete = current > index;
                  const active = step === id || (id === "account" && ["loading", "success", "error"].includes(step));
                  return <div className={`step-item ${active ? "active" : ""} ${complete ? "complete" : ""}`} key={id}><span>{complete ? "✓" : index + 1}</span><b>{label}</b></div>;
                })}
                <div className="secure-note">⌾ Secure connection<br /><small>Your credentials stay with Amazon.</small></div>
              </aside>

              <div className="flow-content">
                {step === "intro" && (
                  <div className="flow-screen">
                    <p className="flow-kicker">AMAZON INTEGRATION</p>
                    <h2 id="flow-title">Connect Amazon to Tapstitch</h2>
                    <p className="flow-lede">Publish products and let Tapstitch automatically fulfill your Amazon orders.</p>
                    <div className="permission-box">
                      <h3>Tapstitch will be able to</h3>
                      <div className="permission"><span>↗</span><div><b>Publish and update listings</b><small>Sync product details, images, pricing, and inventory.</small></div></div>
                      <div className="permission"><span>□</span><div><b>Receive order details</b><small>Import the information needed to produce and ship orders.</small></div></div>
                      <div className="permission"><span>↻</span><div><b>Send fulfillment updates</b><small>Return tracking details and order status to Amazon.</small></div></div>
                    </div>
                    <p className="legal">You can disconnect Amazon at any time from your Tapstitch settings.</p>
                    <div className="flow-actions"><button className="ghost-button" onClick={() => setCancelOpen(true)}>Cancel</button><button className="primary-button" onClick={() => setStep("market")}>Continue <Arrow /></button></div>
                  </div>
                )}

                {step === "market" && (
                  <div className="flow-screen">
                    <p className="flow-kicker">STEP 2 OF 3</p>
                    <h2 id="flow-title">Choose your marketplaces</h2>
                    <p className="flow-lede">Select the Amazon regions and stores you want to connect.</p>
                    <div className="region-tabs" role="tablist">
                      {(Object.keys(regions) as (keyof typeof regions)[]).map((item) => <button key={item} className={region === item ? "selected" : ""} onClick={() => { setRegion(item); setMarkets([]); }}>{item}</button>)}
                    </div>
                    <div className="market-list">
                      {regions[region].map(([code, name, domain]) => (
                        <label key={code} className={markets.includes(code) ? "chosen" : ""}>
                          <input type="checkbox" checked={markets.includes(code)} onChange={() => toggleMarket(code)} />
                          <span className="flag">{code}</span><span><b>{name}</b><small>{domain}</small></span><span className="checkmark">✓</span>
                        </label>
                      ))}
                    </div>
                    {markets.length === 0 && <p className="inline-error">Select at least one marketplace to continue.</p>}
                    <div className="flow-actions"><button className="ghost-button" onClick={() => setStep("intro")}>← Back</button><button className="primary-button" disabled={!markets.length} onClick={() => setStep("account")}>Continue <Arrow /></button></div>
                  </div>
                )}

                {step === "account" && (
                  <div className="flow-screen">
                    <p className="flow-kicker">STEP 3 OF 3</p>
                    <h2 id="flow-title">Authorize your seller account</h2>
                    <p className="flow-lede">You’ll be redirected to Amazon Seller Central to approve access for Tapstitch.</p>
                    <div className="account-summary">
                      <div className="amazon-lock"><span className="channel-logo amazon">a</span><i>↗</i></div>
                      <h3>Sign in securely on Amazon</h3>
                      <p>Amazon will ask you to confirm the marketplaces and permissions shown in the previous steps.</p>
                      <div className="selected-markets"><span>Marketplaces</span><b>{markets.join(" · ")}</b></div>
                    </div>
                    <button className="error-link" onClick={() => setStep("error")}>Preview an authorization error</button>
                    <div className="flow-actions"><button className="ghost-button" onClick={() => setStep("market")}>← Back</button><button className="amazon-button" onClick={() => setStep("loading")}>Continue to Amazon <span>↗</span></button></div>
                  </div>
                )}

                {step === "loading" && (
                  <div className="status-screen">
                    <div className="spinner" />
                    <h2 id="flow-title">Connecting to Amazon…</h2>
                    <p>Confirming your seller account and marketplaces. Keep this window open.</p>
                    <button className="text-link" onClick={() => setStep("account")}>Cancel redirect</button>
                  </div>
                )}

                {step === "success" && (
                  <div className="status-screen success-screen">
                    <div className="success-icon">✓</div>
                    <p className="flow-kicker">CONNECTION COMPLETE</p>
                    <h2 id="flow-title">Amazon is connected</h2>
                    <p>Your Seller Central account is ready. You can now publish products and automatically fulfill orders from {markets.join(", ")}.</p>
                    <div className="success-card"><span className="channel-logo amazon">a</span><div><b>Amazon Seller Central</b><small>{markets.length} marketplace{markets.length > 1 ? "s" : ""} connected</small></div><span className="success-pill">Active</span></div>
                    <button className="primary-button wide" onClick={closeFlow}>Go to my stores <Arrow /></button>
                    <button className="text-link" onClick={() => { setStep("intro"); setMarkets(["US"]); }}>Connect another account</button>
                  </div>
                )}

                {step === "error" && (
                  <div className="status-screen error-screen">
                    <div className="error-icon">!</div>
                    <p className="flow-kicker">AUTHORIZATION NOT COMPLETED</p>
                    <h2 id="flow-title">We couldn’t connect Amazon</h2>
                    <p>Amazon didn’t approve the request. This can happen if the session expires or the required permissions aren’t selected.</p>
                    <div className="error-callout"><b>No changes were made</b><span>Your Tapstitch and Amazon accounts are safe. Try again when you’re ready.</span></div>
                    <button className="primary-button wide" onClick={() => setStep("account")}>Try again <Arrow /></button>
                    <button className="text-link" onClick={() => setCancelOpen(true)}>Cancel setup</button>
                  </div>
                )}
              </div>
            </div>

            {cancelOpen && (
              <div className="confirm-layer">
                <div className="confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="cancel-title">
                  <div className="confirm-icon">×</div>
                  <h3 id="cancel-title">Cancel Amazon setup?</h3>
                  <p>Your progress won’t be saved. You can restart this connection at any time.</p>
                  <div><button className="ghost-button" onClick={() => setCancelOpen(false)}>Keep setting up</button><button className="danger-button" onClick={closeFlow}>Cancel setup</button></div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
