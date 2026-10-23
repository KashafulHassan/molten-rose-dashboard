import React, { useState, useMemo, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

/* ---------------------------------- Theme --------------------------------- */
const THEME = {
  bgDeep: "#1a0a12",
  bgCard: "rgba(255, 209, 220, 0.06)",
  border: "rgba(255, 143, 177, 0.22)",
  roseLight: "#FFD1DC",
  rose: "#FF69B4",
  roseDeep: "#FF1493",
  gold: "#F8C471",
  goldSoft: "#F5D6A8",
  text: "#FDEFF4",
  textMuted: "#C79AB0",
};

const STATUS = {
  Active:   { color: "#4ADE80", bg: "rgba(74, 222, 128, 0.14)" },
  Pending:  { color: "#F8C471", bg: "rgba(248, 196, 113, 0.14)" },
  Review:   { color: "#FF69B4", bg: "rgba(255, 105, 180, 0.15)" },
  Inactive: { color: "#9CA3AF", bg: "rgba(156, 163, 175, 0.14)" },
};

/* ---------------------------------- Mock Data --------------------------------- */
const SEED = [
  { id: "ORD-1042", customer: "Amara Okafor",  product: "Rose Gold Serum",     amount: 4299, status: "Active",   date: "2026-10-21", region: "EMEA" },
  { id: "ORD-1041", customer: "Léa Fontaine",  product: "Velvet Blush Palette", amount: 8999, status: "Pending",  date: "2026-10-21", region: "EMEA" },
  { id: "ORD-1040", customer: "Diego Marín",   product: "Molten Lip Lacquer",  amount: 2599, status: "Review",   date: "2026-10-20", region: "LATAM" },
  { id: "ORD-1039", customer: "Sana Iqbal",     product: "Silk Setting Mist",   amount: 1899, status: "Active",   date: "2026-10-20", region: "APAC" },
  { id: "ORD-1038", customer: "Mia Kowalski",   product: "Gilded Highlighter",  amount: 5499, status: "Inactive", date: "2026-10-19", region: "EMEA" },
  { id: "ORD-1037", customer: "Ayesha Noor",    product: "Rose Quartz Roller",  amount: 3299, status: "Active",   date: "2026-10-19", region: "APAC" },
  { id: "ORD-1036", customer: "Tomás Silva",    product: "Amber Infusion Oil",  amount: 2799, status: "Pending",  date: "2026-10-18", region: "LATAM" },
  { id: "ORD-1035", customer: "Ines Petrova",   product: "Blush Ceramic Vase",  amount: 7999, status: "Review",   date: "2026-10-18", region: "EMEA" },
  { id: "ORD-1034", customer: "Kito Adeyemi",   product: "Molten Candle Trio",  amount: 1599, status: "Active",   date: "2026-10-17", region: "EMEA" },
  { id: "ORD-1033", customer: "Hina Raza",      product: "Dewdrop Primer",      amount: 2199, status: "Inactive", date: "2026-10-17", region: "APAC" },
];

const REGIONS = ["All", "EMEA", "APAC", "LATAM"];
const STATUS_KEYS = Object.keys(STATUS);

function money(n) {
  return "PKR " + n.toLocaleString();
}

/* ---------------------------------- Components --------------------------------- */

function StatusPill({ status }) {
  const s = STATUS[status] ?? STATUS.Inactive;
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (status !== "Active") return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 700);
    return () => clearTimeout(t);
  }, [status]);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide"
      style={{ color: s.color, backgroundColor: s.bg, border: `1px solid ${s.color}44` }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor: s.color,
          boxShadow: pulse ? `0 0 8px ${s.color}` : "none",
          transition: "box-shadow 0.6s ease",
        }}
      />
      {status}
    </span>
  );
}

function StatCard({ label, value, delta, sub }) {
  return (
    <div
      className="rounded-2xl p-4 sm:p-5 backdrop-blur-md"
      style={{
        background: `linear-gradient(145deg, rgba(255,105,180,0.10), rgba(255,209,220,0.04))`,
        border: `1px solid ${THEME.border}`,
        boxShadow: "0 8px 32px rgba(255,20,147,0.10)",
      }}
    >
      <div className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: THEME.textMuted }}>
        {label}
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-bold" style={{ color: THEME.text }}>
        {value}
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs">
        <span style={{ color: delta >= 0 ? "#4ADE80" : "#FF69B4" }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}%
        </span>
        <span style={{ color: THEME.textMuted }}>{sub}</span>
      </div>
    </div>
  );
}

function Sparkline({ data }) {
  return (
    <div className="rounded-2xl p-4 sm:p-5 backdrop-blur-md" style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}` }}>
      <div className="mb-3 flex items-baseline justify-between">
        <div className="text-sm font-semibold" style={{ color: THEME.text }}>Revenue Flow</div>
        <div className="text-[11px]" style={{ color: THEME.textMuted }}>last 12 hrs</div>
      </div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
            <defs>
              <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF69B4" stopOpacity={0.7} />
                <stop offset="60%" stopColor="#FF1493" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#FF1493" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" tick={{ fill: THEME.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={["dataMin - 20", "dataMax + 20"]} />
            <Tooltip
              contentStyle={{
                background: "#2a0f1d",
                border: `1px solid ${THEME.border}`,
                borderRadius: 12,
                color: THEME.text,
                fontSize: 12,
              }}
              labelStyle={{ color: THEME.textMuted }}
            />
            <Area type="monotone" dataKey="v" stroke={THEME.rose} strokeWidth={2.5} fill="url(#roseGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function App() {
  const [orders, setOrders] = useState(SEED);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [liveFeed, setLiveFeed] = useState(true);
  const [clock, setClock] = useState("");

  // Real-time status ticker: randomly flips a status every few seconds.
  useEffect(() => {
    if (!liveFeed) return;
    const id = setInterval(() => {
      setOrders((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        const nextStatus = STATUS_KEYS[Math.floor(Math.random() * STATUS_KEYS.length)];
        next[i] = { ...next[i], status: nextStatus };
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [liveFeed]);

  useEffect(() => {
    const id = setInterval(() => {
      setClock(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = orders.filter((o) => {
      const matchQ =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.product.toLowerCase().includes(q);
      const matchR = region === "All" || o.region === region;
      const matchS = statusFilter === "All" || o.status === statusFilter;
      return matchQ && matchR && matchS;
    });
    rows = [...rows].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [orders, search, region, statusFilter, sortKey, sortDir]);

  const spark = useMemo(() => {
    let v = 180;
    return Array.from({ length: 12 }, (_, i) => {
      v = Math.max(120, Math.min(260, v + Math.round((Math.random() - 0.45) * 40)));
      return { t: `${i}:00`, v };
    });
  }, [orders]);

  const revenue = orders.reduce((s, o) => s + o.amount, 0);
  const activeCount = orders.filter((o) => o.status === "Active").length;

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const SortHeader = ({ label, k, right }) => (
    <th
      onClick={() => toggleSort(k)}
      className="cursor-pointer select-none px-3 py-3 text-[11px] uppercase tracking-widest font-semibold"
      style={{ color: THEME.textMuted, textAlign: right ? "right" : "left" }}
    >
      {label} {sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : ""}
    </th>
  );

  const chip = (label, active, onClick) => (
    <button
      key={label}
      onClick={onClick}
      className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
      style={{
        color: active ? "#1a0a12" : THEME.textMuted,
        background: active ? `linear-gradient(135deg, ${THEME.rose}, ${THEME.roseDeep})` : "transparent",
        border: `1px solid ${active ? "transparent" : THEME.border}`,
        boxShadow: active ? "0 4px 16px rgba(255,20,147,0.35)" : "none",
      }}
    >
      {label}
    </button>
  );

  return (
    <div
      className="min-h-screen w-full font-sans"
      style={{
        background: `radial-gradient(1200px 800px at 15% -10%, rgba(255,105,180,0.22), transparent 60%),
                     radial-gradient(1000px 700px at 110% 20%, rgba(248,196,113,0.14), transparent 55%),
                     radial-gradient(900px 900px at 50% 120%, rgba(255,20,131,0.18), transparent 60%),
                     ${THEME.bgDeep}`,
        color: THEME.text,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              <span style={{ background: `linear-gradient(90deg, ${THEME.roseLight}, ${THEME.rose}, ${THEME.gold})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Molten Rose
              </span>{" "}
              Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm" style={{ color: THEME.textMuted }}>
              Orders, revenue & live pipeline status · {clock}
            </p>
          </div>
          <button
            onClick={() => setLiveFeed((v) => !v)}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all"
            style={{
              color: liveFeed ? "#1a0a12" : THEME.text,
              background: liveFeed ? `linear-gradient(135deg, ${THEME.gold}, ${THEME.rose})` : "transparent",
              border: `1px solid ${liveFeed ? "transparent" : THEME.border}`,
              boxShadow: liveFeed ? "0 4px 20px rgba(255,105,180,0.4)" : "none",
            }}
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{
                backgroundColor: liveFeed ? "#1a0a12" : THEME.textMuted,
                animation: liveFeed ? "pulse 1.4s ease-in-out infinite" : "none",
              }}
            />
            {liveFeed ? "Live feed ON" : "Live feed OFF"}
          </button>
        </header>

        {/* Stats */}
        <section className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Total Revenue" value={money(revenue)} delta={12.4} sub="vs last week" />
          <StatCard label="Orders" value={orders.length} delta={3.1} sub="this period" />
          <StatCard label="Active" value={activeCount} delta={8.7} sub="live pipeline" />
          <StatCard label="Refund Rate" value="1.8%" delta={-0.6} sub="improving" />
        </section>

        {/* Chart + table */}
        <section className="mb-6">
          <Sparkline data={spark} />
        </section>

        <section
          className="rounded-2xl backdrop-blur-md overflow-hidden"
          style={{ background: THEME.bgCard, border: `1px solid ${THEME.border}`, boxShadow: "0 8px 32px rgba(255,20,147,0.08)" }}
        >
          {/* Filter bar */}
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID, customer, product…"
              className="w-full sm:max-w-xs rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2"
              style={{
                background: "rgba(26,10,18,0.6)",
                border: `1px solid ${THEME.border}`,
                color: THEME.text,
              }}
            />
            <div className="flex flex-wrap items-center gap-2">
              {REGIONS.map((r) => chip(r, region === r, () => setRegion(r)))}
              <div className="mx-1 h-5 w-px" style={{ background: THEME.border }} />
              {["All", ...STATUS_KEYS].map((s) =>
                chip(s, statusFilter === s, () => setStatusFilter(s))
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead style={{ background: "rgba(255,20,131,0.08)" }}>
                <tr>
                  <SortHeader label="Order" k="id" />
                  <SortHeader label="Customer" k="customer" />
                  <SortHeader label="Product" k="product" />
                  <th className="px-3 py-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: THEME.textMuted }}>Status</th>
                  <th className="px-3 py-3 text-[11px] uppercase tracking-widest font-semibold" style={{ color: THEME.textMuted }}>Region</th>
                  <SortHeader label="Amount" k="amount" right />
                  <SortHeader label="Date" k="date" right />
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t transition-colors hover:bg-[rgba(255,105,180,0.07)]"
                    style={{ borderColor: "rgba(255,143,177,0.10)" }}
                  >
                    <td className="px-3 py-3 font-mono text-xs" style={{ color: THEME.roseLight }}>{o.id}</td>
                    <td className="px-3 py-3">{o.customer}</td>
                    <td className="px-3 py-3" style={{ color: THEME.textMuted }}>{o.product}</td>
                    <td className="px-3 py-3"><StatusPill status={o.status} /></td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-semibold" style={{ color: THEME.goldSoft }}>{o.region}</span>
                    </td>
                    <td className="px-3 py-3 text-right font-semibold" style={{ color: THEME.gold }}>{money(o.amount)}</td>
                    <td className="px-3 py-3 text-right text-xs" style={{ color: THEME.textMuted }}>{o.date}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-10 text-center text-sm" style={{ color: THEME.textMuted }}>
                      No orders match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs" style={{ color: THEME.textMuted, borderTop: `1px solid ${THEME.border}` }}>
            <span>Showing {filtered.length} of {orders.length} orders</span>
            <span>Auto-refreshing status pills every 4s while live feed is on</span>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px rgba(255,105,180,0.9); }
          50% { opacity: 0.4; box-shadow: 0 0 2px rgba(255,105,180,0.3); }
        }
      `}</style>
    </div>
  );
}