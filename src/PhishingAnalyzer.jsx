import { useState } from "react";

const SYSTEM_PROMPT = `You are an expert cybersecurity analyst specializing in phishing detection. Analyze the provided email for phishing indicators.

Respond ONLY with a JSON object (no markdown, no backticks) with this exact structure:
{
  "verdict": "PHISHING" | "SUSPICIOUS" | "LIKELY_SAFE",
  "confidence": 0-100,
  "riskScore": 0-100,
  "summary": "One sentence verdict summary",
  "indicators": [
    { "type": "DANGER" | "WARNING" | "INFO", "label": "short label", "detail": "explanation" }
  ],
  "redFlags": ["list of specific red flags found"],
  "recommendations": ["list of recommended actions"]
}

Be precise and technical. Look for: urgency/pressure tactics, spoofed sender domains, suspicious links, grammar errors, impersonation, credential harvesting attempts, unusual requests, mismatched URLs, lookalike domains.`;

const verdictConfig = {
  PHISHING: { label: "⚠ PHISHING DETECTED", color: "#ff2d2d", bg: "#1a0000", border: "#ff2d2d" },
  SUSPICIOUS: { label: "⚡ SUSPICIOUS", color: "#ffaa00", bg: "#1a1000", border: "#ffaa00" },
  LIKELY_SAFE: { label: "✓ LIKELY SAFE", color: "#00ff88", bg: "#001a0e", border: "#00ff88" },
};

const indicatorColors = {
  DANGER: "#ff2d2d",
  WARNING: "#ffaa00",
  INFO: "#00aaff",
};

const EXAMPLE_EMAIL = `From: security-alert@paypa1.com
Subject: URGENT: Your account has been compromised - Immediate action required!

Dear Valued Customer,

We have detected suspicious activity on your PayPal account. Your account has been temporarily limited.

To restore full access, you must verify your identity within 24 HOURS or your account will be permanently suspended.

Click here immediately: http://paypal-secure-verify.xyz/login

You will need to provide:
- Full name and date of birth
- Credit card number and CVV
- Social Security Number (for identity verification)

Failure to act will result in permanent account closure and legal action.

PayPal Security Team
© 2026 PayPal Inc.`;

export default function PhishingAnalyzer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Analyze this email:\n\n${email}` }],
        }),
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cfg = result ? verdictConfig[result.verdict] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c10",
      color: "#c9d4e0",
      fontFamily: "'JetBrains Mono', 'Courier New', monospace",
      padding: "32px 16px",
    }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#00ff88", boxShadow: "0 0 8px #00ff88",
              animation: "pulse 2s infinite",
            }} />
            <span style={{ fontSize: 11, color: "#00ff88", letterSpacing: 3, textTransform: "uppercase" }}>
              THREATSCOPE // AI PHISHING ANALYZER
            </span>
          </div>
          <h1 style={{
            fontSize: 28, fontWeight: 700, color: "#e8f0f8",
            margin: 0, letterSpacing: -0.5,
          }}>
            Email Threat Analysis
          </h1>
          <p style={{ fontSize: 13, color: "#5a6a7a", marginTop: 6, fontFamily: "system-ui, sans-serif" }}>
            Paste any suspicious email below. AI will scan for phishing indicators.
          </p>
        </div>

        {/* Input */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: 2, textTransform: "uppercase" }}>
              // EMAIL INPUT
            </span>
            <button
              onClick={() => setEmail(EXAMPLE_EMAIL)}
              style={{
                background: "transparent", border: "1px solid #1e2d3d",
                color: "#5a6a7a", fontSize: 11, padding: "4px 10px",
                borderRadius: 4, cursor: "pointer", letterSpacing: 1,
                fontFamily: "inherit",
              }}
            >
              LOAD EXAMPLE
            </button>
          </div>
          <textarea
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Paste email content here (headers, body, links)..."
            rows={10}
            style={{
              width: "100%", background: "#0d1520", border: "1px solid #1e2d3d",
              borderRadius: 8, color: "#c9d4e0", fontSize: 13, padding: "14px 16px",
              resize: "vertical", outline: "none", fontFamily: "inherit",
              lineHeight: 1.6, boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={analyze}
          disabled={loading || !email.trim()}
          style={{
            width: "100%", padding: "14px",
            background: loading || !email.trim() ? "#0d1520" : "#003322",
            border: `1px solid ${loading || !email.trim() ? "#1e2d3d" : "#00ff88"}`,
            borderRadius: 8, color: loading || !email.trim() ? "#3a4a5a" : "#00ff88",
            fontSize: 13, fontWeight: 700, letterSpacing: 2, cursor: loading || !email.trim() ? "not-allowed" : "pointer",
            textTransform: "uppercase", fontFamily: "inherit", transition: "all 0.2s",
            marginBottom: 28,
          }}
        >
          {loading ? "SCANNING..." : "▶ ANALYZE EMAIL"}
        </button>

        {/* Loading */}
        {loading && (
          <div style={{
            background: "#0d1520", border: "1px solid #1e2d3d",
            borderRadius: 8, padding: 24, textAlign: "center", marginBottom: 24,
          }}>
            <div style={{ color: "#00ff88", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>
              SCANNING FOR THREATS
            </div>
            {["Parsing email headers...", "Checking domain reputation...", "Analyzing language patterns...", "Identifying social engineering..."].map((s, i) => (
              <div key={i} style={{ color: "#3a4a5a", fontSize: 12, marginBottom: 4 }}>$ {s}</div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ background: "#1a0000", border: "1px solid #ff2d2d", borderRadius: 8, padding: 16, color: "#ff2d2d", fontSize: 13, marginBottom: 24 }}>
            ✗ {error}
          </div>
        )}

        {/* Results */}
        {result && cfg && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Verdict */}
            <div style={{
              background: cfg.bg, border: `1px solid ${cfg.border}`,
              borderRadius: 8, padding: "20px 24px",
              boxShadow: `0 0 24px ${cfg.color}22`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: cfg.color, letterSpacing: 1, marginBottom: 6 }}>
                    {cfg.label}
                  </div>
                  <div style={{ fontSize: 14, color: "#c9d4e0", fontFamily: "system-ui, sans-serif" }}>
                    {result.summary}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 36, fontWeight: 700, color: cfg.color, lineHeight: 1 }}>
                    {result.riskScore}
                  </div>
                  <div style={{ fontSize: 10, color: "#5a6a7a", letterSpacing: 2 }}>RISK SCORE</div>
                  <div style={{
                    width: 80, height: 4, background: "#1e2d3d", borderRadius: 2, marginTop: 6,
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: `${result.riskScore}%`, background: cfg.color,
                    }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Indicators */}
            {result.indicators?.length > 0 && (
              <div style={{ background: "#0d1520", border: "1px solid #1e2d3d", borderRadius: 8, padding: 20 }}>
                <div style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>
                  // Threat Indicators
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {result.indicators.map((ind, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        minWidth: 8, height: 8, borderRadius: "50%", marginTop: 5,
                        background: indicatorColors[ind.type],
                        boxShadow: `0 0 6px ${indicatorColors[ind.type]}`,
                      }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: indicatorColors[ind.type], marginBottom: 2 }}>
                          {ind.label}
                        </div>
                        <div style={{ fontSize: 12, color: "#7a8a9a", fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
                          {ind.detail}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Red Flags + Recommendations */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {result.redFlags?.length > 0 && (
                <div style={{ background: "#0d1520", border: "1px solid #1e2d3d", borderRadius: 8, padding: 20 }}>
                  <div style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
                    // Red Flags
                  </div>
                  {result.redFlags.map((f, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#c9d4e0", marginBottom: 8, display: "flex", gap: 8, fontFamily: "system-ui, sans-serif", lineHeight: 1.4 }}>
                      <span style={{ color: "#ff2d2d", flexShrink: 0 }}>✗</span> {f}
                    </div>
                  ))}
                </div>
              )}
              {result.recommendations?.length > 0 && (
                <div style={{ background: "#0d1520", border: "1px solid #1e2d3d", borderRadius: 8, padding: 20 }}>
                  <div style={{ fontSize: 11, color: "#5a6a7a", letterSpacing: 2, marginBottom: 12, textTransform: "uppercase" }}>
                    // Recommendations
                  </div>
                  {result.recommendations.map((r, i) => (
                    <div key={i} style={{ fontSize: 12, color: "#c9d4e0", marginBottom: 8, display: "flex", gap: 8, fontFamily: "system-ui, sans-serif", lineHeight: 1.4 }}>
                      <span style={{ color: "#00ff88", flexShrink: 0 }}>→</span> {r}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => { setResult(null); setEmail(""); }}
              style={{
                background: "transparent", border: "1px solid #1e2d3d",
                borderRadius: 8, padding: "10px", color: "#5a6a7a",
                fontSize: 12, cursor: "pointer", fontFamily: "inherit", letterSpacing: 1,
              }}
            >
              ↺ ANALYZE ANOTHER EMAIL
            </button>
          </div>
        )}

        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </div>
    </div>
  );
}
