import { useEffect, useState, type ReactNode } from "react";
import { apiRequest, getApiHealth, getTransactions } from "./lib/api";

type Page = "overview" | "transactions" | "alerts" | "analytics" | "users" | "create-user" | "change-password" | "settings" | "admin" | "create" | "detail";
type IconName = "grid" | "card" | "shield" | "chart" | "users" | "settings" | "search" | "bell" | "plus" | "arrow" | "more" | "filter" | "download" | "check" | "clock" | "lock" | "globe" | "database" | "server" | "activity" | "eye" | "chevron" | "logout" | "trash" | "x";

const iconPaths: Record<IconName, ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M7 15h3"/></>,
  shield: <><path d="M12 22s8-3.8 8-10V5l-8-3-8 3v7c0 6.2 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 5-7"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63h.01A1.7 1.7 0 0 0 10 3.08V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9v.01A1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>, arrow: <path d="m5 12 4 4L19 6"/>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  filter: <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z"/>,
  download: <><path d="M12 3v12m-4-4 4 4 4-4"/><path d="M4 19h16"/></>,
  check: <path d="m5 12 4 4L19 6"/>, clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/></>,
  server: <><rect x="3" y="3" width="18" height="7" rx="1"/><rect x="3" y="14" width="18" height="7" rx="1"/><path d="M7 6.5h.01M7 17.5h.01"/></>,
  activity: <path d="M3 12h4l2.5-7 5 14 2.5-7h4"/>, eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>, logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
  x: <path d="M6 6l12 12M18 6 6 18"/>
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>;
}

function Logo() {
  return <div className="logo"><span className="logo-mark"><Icon name="shield" size={19}/></span><span>FinTrack</span></div>;
}

function Button({ children, kind = "primary", icon, onClick, type = "button", disabled = false }: { children: ReactNode; kind?: "primary" | "secondary" | "ghost" | "danger"; icon?: IconName; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean }) {
  return <button type={type} className={`btn btn-${kind}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={16}/>} {children}</button>;
}

const navItems: { page: Page; label: string; icon: IconName }[] = [
  { page: "overview", label: "Overview", icon: "grid" }, { page: "transactions", label: "Transactions", icon: "card" },
  { page: "alerts", label: "Fraud Alerts", icon: "shield" }, { page: "analytics", label: "Analytics", icon: "chart" },
  { page: "users", label: "Users", icon: "users" }, { page: "settings", label: "Settings", icon: "settings" },
];

type AccessRole = "ADMIN" | "ANALYST" | "USER";
type SessionRecord = {
  id: string;
  userId: string;
  device: string;
  browser: string;
  location: string;
  loginAt: string;
  status: "ACTIVE" | "SIGNED OUT";
};

function Sidebar({ page, setPage, role, name, onLogout }: { page: Page; setPage: (p: Page) => void; role: AccessRole; name: string; onLogout: () => void }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const visibleNav = navItems.filter(item => role === "ADMIN" || (role === "ANALYST" ? !["users", "settings"].includes(item.page) : ["overview", "transactions", "analytics"].includes(item.page)));
  const initials = name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
  return <aside className="sidebar">
    <Logo/>
    <div className="workspace"><span>FT</span><div><b>FinTrack Inc.</b><small>Enterprise workspace</small></div><Icon name="chevron" size={14}/></div>
    <nav><p className="nav-label">WORKSPACE</p>{visibleNav.map(item => <button key={item.page} onClick={() => setPage(item.page)} className={page === item.page ? "nav-item active" : "nav-item"}><Icon name={item.icon}/><span>{item.label}</span></button>)}</nav>
    <div className="sidebar-bottom">
      {role === "ADMIN" && <button className={page === "admin" ? "nav-item active" : "nav-item"} onClick={() => setPage("admin")}><Icon name="server"/><span>Admin Console</span></button>}
      <div className="security-note"><Icon name="lock" size={16}/><span><b>Bank-grade security</b><small>256-bit encryption</small></span></div>
      <div className="profile-menu-wrap"><button className="profile-row" onClick={() => setProfileMenuOpen(open => !open)} aria-expanded={profileMenuOpen}><span className="avatar">{initials}</span><span><b>{name}</b><small>{role === "ADMIN" ? "Administrator" : role === "ANALYST" ? "Fraud Analyst" : "Registered User"}</small></span><Icon name="more" size={16}/></button>{profileMenuOpen && <div className="profile-menu"><button onClick={() => { setProfileMenuOpen(false); setPage("change-password"); }}><Icon name="lock" size={15}/><span><b>Change password</b><small>Update your login credentials</small></span></button><button className="logout-option" onClick={onLogout}><Icon name="logout" size={15}/><span><b>Logout</b><small>End your secure session</small></span></button></div>}</div>
    </div>
  </aside>;
}

function Topbar({ role }: { role: AccessRole }) {
  const [databaseConnected, setDatabaseConnected] = useState(false);
  useEffect(() => {
    let active = true;
    const check = () => getApiHealth().then(health => {
      if (active) setDatabaseConnected(health.database === "connected");
    }).catch(() => { if (active) setDatabaseConnected(false); });
    void check();
    const timer = window.setInterval(check, 30_000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  return <header className="topbar"><div className="mobile-logo"><Logo/></div><label className="search"><Icon name="search" size={17}/><input placeholder="Search transactions, alerts, users..." aria-label="Global search"/><kbd>⌘ K</kbd></label><div className="top-actions"><span className="live-dot"><i/> {databaseConnected ? "Database connected" : "Database offline"}</span><button className="icon-btn" aria-label="Notifications"><Icon name="bell"/><b/></button><span className="role-pill">{role}</span></div></header>;
}

function MobileNav({ page, setPage, role }: { page: Page; setPage: (p: Page) => void; role: AccessRole }) {
  const visibleNav = navItems.filter(item => role === "ADMIN" || (role === "ANALYST" ? !["users", "settings"].includes(item.page) : ["overview", "transactions", "analytics"].includes(item.page)));
  return <nav className="mobile-nav">{visibleNav.slice(0,5).map(n => <button key={n.page} className={page === n.page ? "active" : ""} onClick={() => setPage(n.page)}><Icon name={n.icon}/><span>{n.label === "Fraud Alerts" ? "Alerts" : n.label}</span></button>)}</nav>;
}

function Sparkline({ color = "blue" }: { color?: "blue" | "green" | "red" | "amber" }) {
  return <svg className={`spark ${color}`} viewBox="0 0 100 34" preserveAspectRatio="none"><path className="area" d="M0 28L12 25 24 27 38 17 52 20 66 10 80 15 100 4V34H0Z"/><path className="line" d="M0 28L12 25 24 27 38 17 52 20 66 10 80 15 100 4"/></svg>;
}

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) { return <span className={`badge ${tone}`}>{children}</span>; }

type MetricData = { label: string; value: string; icon: IconName; color: "blue" | "green" | "amber" | "red" };

function MetricCard({ data }: { data: MetricData }) {
  return <div className="card metric-card"><div className="metric-head"><span className={`metric-icon ${data.color}`}><Icon name={data.icon}/></span><Badge tone="neutral">TODAY</Badge></div><p>{data.label}</p><strong>{data.value}</strong></div>;
}

type TransactionRecord = {
  id: string;
  customer: string;
  ownerId?: string;
  amount: number;
  currency: string;
  merchant: string;
  location: string;
  type: string;
  description: string;
  date: string;
  createdAt?: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
  score: number;
  status: "SUCCESS" | "PENDING" | "BLOCKED" | "FAILED";
};
type DetectionRules = {
  enabled: boolean;
  mediumThreshold: number;
  highThreshold: number;
  holdHighRisk: boolean;
};

function TransactionTable({ transactions, compact = false, onCreate }: { transactions: TransactionRecord[]; compact?: boolean; onCreate: () => void }) {
  if (!transactions.length) return <div className="card transactions-empty"><span><Icon name="card" size={28}/></span><h2>No transactions created yet</h2><p>Only transactions submitted through FinTrack will appear here.</p><Button icon="plus" onClick={onCreate}>Create transaction</Button></div>;
  const visibleTransactions = transactions.slice(0, compact ? 4 : 10);
  return <div className="table-card card"><div className="table-wrap"><table><thead><tr><th>Transaction ID</th><th>Customer</th><th>Amount</th>{!compact && <th>Merchant</th>}<th>Location</th><th>Date & Time</th><th>Risk Score</th><th>Status</th><th></th></tr></thead><tbody>{visibleTransactions.map(transaction => <tr key={transaction.id}><td><span className="link">{transaction.id}</span></td><td><div className="customer"><span className="avatar sm">{transaction.customer.split(" ").map(name => name[0]).slice(0,2).join("").toUpperCase()}</span><b>{transaction.customer}</b></div></td><td><b>{new Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.amount)}</b><small className="currency">{transaction.currency}</small></td>{!compact && <td>{transaction.merchant}</td>}<td>{transaction.location}</td><td>{transaction.date}</td><td><div className="risk-cell"><Badge tone={transaction.risk.toLowerCase()}>{transaction.risk}</Badge><span>{transaction.score}</span></div></td><td><Badge tone={transaction.status.toLowerCase()}><i/>{transaction.status}</Badge></td><td><button className="icon-btn mini"><Icon name="more" size={17}/></button></td></tr>)}</tbody></table></div>{!compact && <div className="pagination"><span>Showing <b>1–{visibleTransactions.length}</b> of <b>{transactions.length}</b> transactions</span><div><Button kind="secondary">Previous</Button><button className="page active">1</button><Button kind="secondary">Next</Button></div></div>}</div>;
}

function PageHeader({ eyebrow, title, copy, actions }: { eyebrow?: string; title: string; copy: string; actions?: ReactNode }) {
  return <div className="page-header"><div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1><p>{copy}</p></div>{actions && <div className="header-actions">{actions}</div>}</div>;
}

function VolumeChart() {
  return <div className="chart-area"><div className="y-labels"><span>$1.2M</span><span>$900K</span><span>$600K</span><span>$300K</span><span>$0</span></div><svg viewBox="0 0 720 220" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3563e9" stopOpacity=".18"/><stop offset="1" stopColor="#3563e9" stopOpacity="0"/></linearGradient></defs><g className="grid-lines"><path d="M0 10H720M0 60H720M0 110H720M0 160H720M0 210H720"/></g><path className="chart-fill" d="M0 170 C45 155 55 162 90 135 S155 148 190 118 255 104 290 120 340 65 390 82 450 100 485 54 545 70 580 42 640 60 720 20V220H0Z"/><path className="chart-line" d="M0 170 C45 155 55 162 90 135 S155 148 190 118 255 104 290 120 340 65 390 82 450 100 485 54 545 70 580 42 640 60 720 20"/><g className="chart-dots"><circle cx="190" cy="118" r="4"/><circle cx="390" cy="82" r="4"/><circle cx="580" cy="42" r="4"/><circle cx="720" cy="20" r="4"/></g></svg><div className="x-labels"><span>May 18</span><span>May 19</span><span>May 20</span><span>May 21</span><span>May 22</span><span>May 23</span><span>May 24</span></div></div>;
}

function Donut({ value = 95, label = "Successful" }: { value?: number; label?: string }) {
  return <div className="donut" style={{ "--value": `${value * 3.6}deg` } as React.CSSProperties}><div><strong>{value}%</strong><span>{label}</span></div></div>;
}

function Overview({ setPage, transactions, name }: { setPage: (p: Page) => void; transactions: TransactionRecord[]; name: string }) {
  const totalValue = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const currency = transactions.length && transactions.every(transaction => transaction.currency === transactions[0].currency) ? transactions[0].currency : null;
  const formatValue = (value: number) => currency ? new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }).format(value) : transactions.length ? "Mixed currencies" : "—";
  const count = (predicate: (transaction: TransactionRecord) => boolean) => transactions.filter(predicate).length;
  const successful = count(transaction => transaction.status === "SUCCESS");
  const pending = count(transaction => transaction.status === "PENDING");
  const failed = count(transaction => transaction.status === "FAILED" || transaction.status === "BLOCKED");
  const low = count(transaction => transaction.risk === "LOW");
  const medium = count(transaction => transaction.risk === "MEDIUM");
  const high = count(transaction => transaction.risk === "HIGH");
  const percent = (value: number) => transactions.length ? Math.round((value / transactions.length) * 100) : 0;
  const metrics: MetricData[] = [
    { label: "Total Transactions", value: String(transactions.length), icon: "card", color: "blue" },
    { label: "Transaction Volume", value: formatValue(totalValue), icon: "chart", color: "blue" },
    { label: "Successful", value: String(successful), icon: "check", color: "green" },
    { label: "Fraud Alerts", value: String(pending + failed), icon: "shield", color: "amber" },
    { label: "High Risk", value: String(high), icon: "activity", color: "red" },
  ];
  const locations = Object.values(transactions.reduce<Record<string, { name: string; value: number; count: number }>>((groups, transaction) => {
    const key = transaction.location.toLowerCase();
    groups[key] ||= { name: transaction.location, value: 0, count: 0 };
    groups[key].value += transaction.amount;
    groups[key].count += 1;
    return groups;
  }, {})).sort((a, b) => b.value - a.value).slice(0, 3);
  return <><PageHeader title={`Good morning, ${name}`} copy="Monitor your transactions, risk activity and financial insights." actions={<><Button kind="secondary" icon="download">Export report</Button><Button icon="plus" onClick={() => setPage("create")}>Create transaction</Button></>}/>
    <section className="metrics-grid">{metrics.map(metric => <MetricCard key={metric.label} data={metric}/>)}</section>
    <section className="dashboard-grid">
      <div className="card panel wide"><div className="panel-head"><div><h2>Transaction volume</h2><p>Your submitted value over the last 7 days</p></div><Badge tone="blue">USER DATA</Badge></div><AnalyticsValueChart transactions={transactions} currency={currency}/></div>
      <div className="card panel success-panel"><div className="panel-head"><div><h2>Transaction status</h2><p>Your processing results</p></div></div>{transactions.length ? <><Donut value={percent(successful)} label="Successful"/><div className="legend"><span><i className="green"/>Successful <b>{successful}</b></span><span><i className="amber"/>Pending <b>{pending}</b></span><span><i className="red"/>Failed / Blocked <b>{failed}</b></span></div></> : <div className="analytics-no-data small"><Icon name="card" size={25}/><b>No status data yet</b><span>Create your first transaction to begin.</span></div>}</div>
      <div className="card panel risk-panel"><div className="panel-head"><div><h2>Risk distribution</h2><p>Your transactions by risk level</p></div>{transactions.length > 0 && high === 0 && <Badge tone="low">HEALTHY</Badge>}</div>{transactions.length ? [["Low risk",low,"low"],["Medium risk",medium,"medium"],["High risk",high,"high"]].map(([label,value,tone]) => <div className="bar-row" key={String(label)}><div><span>{label}</span><b>{value}</b></div><div className="bar"><i className={String(tone)} style={{ width: `${percent(Number(value))}%` }}/></div><small>{percent(Number(value))}%</small></div>) : <div className="analytics-no-data small"><Icon name="shield" size={25}/><b>No risk data yet</b><span>Risk analysis appears after submission.</span></div>}</div>
      <div className="card panel activity-panel"><div className="panel-head"><div><h2>Geographic activity</h2><p>Locations from your transactions</p></div></div>{locations.length ? <><div className="map"><span className="map-dot d1"/><span className="map-dot d2"/><span className="map-dot d3"/><Icon name="globe" size={84}/></div><div className="country-list">{locations.map(location => <div key={location.name}><span><i/>{location.name}</span><b>{currency ? formatValue(location.value) : `${location.count} entries`}</b><small>{percent(location.count)}%</small></div>)}</div></> : <div className="analytics-no-data small"><Icon name="globe" size={25}/><b>No location data yet</b><span>Entered locations will appear here.</span></div>}</div>
    </section>
    <section className="section-head"><div><h2>Recent transactions</h2><p>Transactions created in FinTrack</p></div><Button kind="secondary" onClick={() => setPage("transactions")}>View all <Icon name="chevron" size={15}/></Button></section><TransactionTable transactions={transactions} compact onCreate={() => setPage("create")}/>
  </>;
}

function Transactions({ setPage, transactions }: { setPage: (p: Page) => void; transactions: TransactionRecord[] }) {
  const exportCsv = () => {
    if (!transactions.length) return;
    const safeCell = (value: string | number) => {
      const text = String(value);
      const formulaSafe = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${formulaSafe.replaceAll('"', '""')}"`;
    };
    const headers = ["Transaction ID", "Customer", "Amount", "Currency", "Merchant", "Location", "Transaction Type", "Description", "Date & Time", "Risk Level", "Risk Score", "Status"];
    const rows = transactions.map(transaction => [
      transaction.id, transaction.customer, transaction.amount.toFixed(2), transaction.currency,
      transaction.merchant, transaction.location, transaction.type, transaction.description,
      transaction.date, transaction.risk, transaction.score, transaction.status,
    ]);
    const csv = [headers, ...rows].map(row => row.map(safeCell).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fintrack-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  return <><PageHeader eyebrow="TRANSACTIONS" title="Transaction management" copy="Review, filter and manage all financial activity." actions={<><Button kind="secondary" icon="download" onClick={exportCsv} disabled={!transactions.length}>Export CSV</Button><Button icon="plus" onClick={() => setPage("create")}>New transaction</Button></>}/>
    <div className="card filter-card"><label className="search grow"><Icon name="search"/><input placeholder="Search by ID, customer or merchant..."/></label><select><option>All statuses</option><option>Success</option><option>Blocked</option></select><select><option>All risk levels</option><option>High risk</option><option>Medium risk</option></select><button className="date-control"><Icon name="clock"/> May 18 – May 24</button><Button kind="secondary" icon="filter">More filters</Button></div>
    <div className="result-info"><span><b>{transactions.length}</b> {transactions.length === 1 ? "transaction" : "transactions"} found</span><span>{transactions.length ? "Updated just now" : "No transaction data"}</span></div><TransactionTable transactions={transactions} onCreate={() => setPage("create")}/>
  </>;
}

function Alerts({ transactions, detectionRules, onSaveRules, onUpdateStatus }: { transactions: TransactionRecord[]; detectionRules: DetectionRules; onSaveRules: (rules: DetectionRules) => void; onUpdateStatus: (transactionId: string, status: TransactionRecord["status"]) => void }) {
  const [rulesOpen, setRulesOpen] = useState(false);
  const [draftRules, setDraftRules] = useState(detectionRules);
  const [rulesError, setRulesError] = useState("");
  const [alertFilter, setAlertFilter] = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");
  const [decision, setDecision] = useState<{ transaction: TransactionRecord; action: "CONTINUE" | "BLOCK" } | null>(null);
  const alerts = transactions.filter(transaction => transaction.risk === "HIGH" || transaction.risk === "MEDIUM");
  const filteredAlerts = alerts.filter(transaction => alertFilter === "ALL" || transaction.risk === alertFilter);
  const highRisk = alerts.filter(transaction => transaction.risk === "HIGH").length;
  const mediumRisk = alerts.filter(transaction => transaction.risk === "MEDIUM").length;
  const resolved = alerts.filter(transaction => transaction.status === "SUCCESS").length;
  const alertStats = [["Total alerts",String(alerts.length),"shield","blue"],["High-risk alerts",String(highRisk),"activity","red"],["Medium-risk alerts",String(mediumRisk),"clock","amber"],["Resolved alerts",String(resolved),"check","green"]] as const;
  const exportPdf = () => {
    if (!filteredAlerts.length) return;
    const clean = (value: string | number) => String(value).replace(/[^\x20-\x7E]/g, " ").replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)").slice(0, 92);
    const lines = [
      "FINTRACK - FRAUD ALERTS REPORT",
      `Generated: ${new Date().toLocaleString()}`,
      `Exported alerts: ${filteredAlerts.length}  |  Filter: ${alertFilter}`,
      "",
      ...filteredAlerts.flatMap((transaction, index) => {
        const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.amount);
        return [
          `${index + 1}. ${transaction.id} - ${transaction.risk} RISK (${transaction.score}/100)`,
          `Customer: ${transaction.customer}  |  Amount: ${amount}`,
          `Merchant: ${transaction.merchant}  |  Location: ${transaction.location}`,
          `Date: ${transaction.date}  |  Status: ${transaction.status}`,
          "",
        ];
      }),
    ].map(clean);
    const pageLines = Array.from({ length: Math.ceil(lines.length / 46) }, (_, index) => lines.slice(index * 46, (index + 1) * 46));
    const objects: Record<number, string> = {};
    const pageIds = pageLines.map((_, index) => 4 + index * 2);
    objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objects[2] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
    objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
    pageLines.forEach((page, index) => {
      const pageId = 4 + index * 2;
      const contentId = pageId + 1;
      const content = `BT\n/F1 10 Tf\n48 795 Td\n14 TL\n${page.map(line => `(${line}) Tj T*`).join("\n")}\nET`;
      objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentId} 0 R >>`;
      objects[contentId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
    });
    const maxObject = Math.max(...Object.keys(objects).map(Number));
    let pdf = "%PDF-1.4\n";
    const offsets: number[] = [0];
    for (let id = 1; id <= maxObject; id += 1) {
      offsets[id] = pdf.length;
      pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
    }
    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${maxObject + 1}\n0000000000 65535 f \n`;
    for (let id = 1; id <= maxObject; id += 1) pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
    pdf += `trailer\n<< /Size ${maxObject + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `fintrack-fraud-alerts-${new Date().toISOString().slice(0, 10)}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const saveRules = () => {
    if (draftRules.mediumThreshold < 1 || draftRules.highThreshold < 1) {
      setRulesError("Threshold amounts must be greater than zero.");
      return;
    }
    if (draftRules.highThreshold <= draftRules.mediumThreshold) {
      setRulesError("The high-risk threshold must be greater than the medium-risk threshold.");
      return;
    }
    setRulesError("");
    onSaveRules(draftRules);
    setRulesOpen(false);
  };
  return <><PageHeader eyebrow="FRAUD MONITORING" title="Fraud alerts" copy="Review suspicious activity prioritized by risk intelligence." actions={<><Button kind="secondary" icon="download" onClick={exportPdf} disabled={!filteredAlerts.length}>Export PDF</Button><Button kind="primary" icon="settings" onClick={() => { setDraftRules(detectionRules); setRulesError(""); setRulesOpen(true); }}>Detection rules</Button></>}/>
    <div className="alert-stats">{alertStats.map(alert => <div className="card alert-stat" key={alert[0]}><span className={`metric-icon ${alert[3]}`}><Icon name={alert[2]}/></span><div><p>{alert[0]}</p><strong>{alert[1]}</strong></div><small>{alert[0] === "Resolved alerts" ? "Successfully processed" : "Submitted data only"}</small></div>)}</div>
    <div className="alert-toolbar"><div><button className={alertFilter === "ALL" ? "tab active" : "tab"} onClick={() => setAlertFilter("ALL")}>All alerts</button><button className={alertFilter === "HIGH" ? "tab active" : "tab"} onClick={() => setAlertFilter("HIGH")}>High risk</button><button className={alertFilter === "MEDIUM" ? "tab active" : "tab"} onClick={() => setAlertFilter("MEDIUM")}>Medium risk</button></div><div><label className="search"><Icon name="search"/><input placeholder="Search alerts..."/></label><Button kind="secondary" icon="filter">Filters</Button></div></div>
    {filteredAlerts.length ? <div className="alert-list">{filteredAlerts.map(transaction => {
      const isHigh = transaction.risk === "HIGH";
      const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: transaction.currency }).format(transaction.amount);
      const reason = transaction.amount >= detectionRules.highThreshold ? "High transaction amount" : "Elevated transaction risk";
      const explanation = transaction.amount >= detectionRules.highThreshold ? `The entered amount of ${amount} exceeded the high-value review threshold.` : "This transaction received a medium risk score and requires monitoring.";
      return <article className="card alert-card" key={transaction.id}><div className={`alert-risk ${isHigh ? "high" : "medium"}`}><Icon name={isHigh ? "shield" : "activity"}/></div><div className="alert-main"><div className="alert-title"><Badge tone={isHigh ? "high" : "medium"}>{transaction.risk} RISK</Badge><span className="link">{transaction.id}</span><span>{transaction.date}</span></div><h3>{reason}</h3><p>{explanation}</p><div className="alert-meta"><span><small>Customer</small><b>{transaction.customer}</b></span><span><small>Amount</small><b>{amount}</b></span><span><small>Merchant</small><b>{transaction.merchant}</b></span><span><small>Location</small><b>{transaction.location}</b></span></div></div><div className="score"><small>Risk score</small><strong>{transaction.score}<span>/100</span></strong><Badge tone={transaction.status === "SUCCESS" ? "success" : transaction.status.toLowerCase()}>{transaction.status}</Badge>{isHigh && transaction.status === "PENDING" && <div className="alert-decision-actions"><Button onClick={() => setDecision({ transaction, action: "CONTINUE" })}>Continue</Button><Button kind="danger" onClick={() => setDecision({ transaction, action: "BLOCK" })}>Block</Button></div>}{isHigh && transaction.status === "SUCCESS" && <small className="decision-result success"><Icon name="check" size={12}/>Sent to merchant</small>}{isHigh && transaction.status === "BLOCKED" && <small className="decision-result blocked"><Icon name="x" size={12}/>Transaction stopped</small>}</div></article>;
    })}</div> : <div className="card transactions-empty"><span><Icon name="shield" size={28}/></span><h2>No {alertFilter === "ALL" ? "fraud alerts" : `${alertFilter.toLowerCase()}-risk alerts`}</h2><p>{alertFilter === "ALL" ? "Medium- and high-risk transactions submitted in FinTrack will appear here." : `No submitted transactions currently match the ${alertFilter.toLowerCase()}-risk filter.`}</p></div>}
    {decision && <div className="modal-backdrop"><section className="card delete-modal decision-modal" role="dialog" aria-modal="true" aria-labelledby="decision-title"><span className={`decision-modal-icon ${decision.action === "CONTINUE" ? "continue" : "block"}`}><Icon name={decision.action === "CONTINUE" ? "check" : "shield"} size={24}/></span><h2 id="decision-title">{decision.action === "CONTINUE" ? "Continue this transaction?" : "Block this transaction?"}</h2><p>{decision.action === "CONTINUE" ? <>The payment will be marked successful and released to <b>{decision.transaction.merchant}</b>. This update will appear in the Admin and User dashboards.</> : <>The payment will be stopped and marked as blocked. No funds will be sent to <b>{decision.transaction.merchant}</b>.</>}</p><div className="decision-summary"><div><small>Transaction</small><b>{decision.transaction.id}</b></div><div><small>Amount</small><b>{new Intl.NumberFormat("en-US", { style: "currency", currency: decision.transaction.currency }).format(decision.transaction.amount)}</b></div><div><small>Customer</small><b>{decision.transaction.customer}</b></div><div><small>Risk score</small><b>{decision.transaction.score}/100</b></div></div><div className="delete-modal-actions"><Button kind="secondary" onClick={() => setDecision(null)}>Cancel</Button><Button kind={decision.action === "CONTINUE" ? "primary" : "danger"} icon={decision.action === "CONTINUE" ? "check" : "shield"} onClick={() => { onUpdateStatus(decision.transaction.id, decision.action === "CONTINUE" ? "SUCCESS" : "BLOCKED"); setDecision(null); }}>{decision.action === "CONTINUE" ? "Continue & Send" : "Block Transaction"}</Button></div></section></div>}
    {rulesOpen && <div className="modal-backdrop"><section className="card rules-modal" role="dialog" aria-modal="true" aria-labelledby="rules-title"><div className="rules-modal-head"><span className="setting-icon"><Icon name="shield"/></span><div><h2 id="rules-title">Fraud detection rules</h2><p>Configure amount-based risk evaluation for new transactions.</p></div><button className="icon-btn mini" onClick={() => setRulesOpen(false)} aria-label="Close detection rules"><Icon name="x"/></button></div><div className="rules-list"><div><div><b>Amount-based detection</b><p>Evaluate transaction risk using the configured amount thresholds.</p></div><Toggle on={draftRules.enabled} onChange={enabled => setDraftRules(rules => ({ ...rules, enabled }))} label="Toggle amount-based detection"/></div><div className="rule-thresholds"><label><span>Medium-risk threshold</span><div><b>$</b><input type="number" min="1" step="100" value={draftRules.mediumThreshold} onChange={event => setDraftRules(rules => ({ ...rules, mediumThreshold: Number(event.target.value) }))}/></div><small>Amounts at or above this value receive MEDIUM risk.</small></label><label><span>High-risk threshold</span><div><b>$</b><input type="number" min="1" step="100" value={draftRules.highThreshold} onChange={event => setDraftRules(rules => ({ ...rules, highThreshold: Number(event.target.value) }))}/></div><small>Amounts at or above this value receive HIGH risk.</small></label></div><div><div><b>Hold high-risk transactions</b><p>Automatically set new high-risk transactions to PENDING for review.</p></div><Toggle on={draftRules.holdHighRisk} onChange={holdHighRisk => setDraftRules(rules => ({ ...rules, holdHighRisk }))} label="Toggle high-risk transaction hold"/></div></div>{rulesError && <div className="settings-form-message error"><Icon name="x" size={14}/>{rulesError}</div>}<div className="rules-note"><Icon name="activity" size={16}/><span>Rule changes apply to newly submitted transactions. Existing risk records remain unchanged.</span></div><div className="delete-modal-actions"><Button kind="secondary" onClick={() => setRulesOpen(false)}>Cancel</Button><Button icon="check" onClick={saveRules}>Save rules</Button></div></section></div>}
  </>;
}

function RiskGauge() {
  return <div className="gauge"><svg viewBox="0 0 200 110"><path className="g-bg" d="M20 100a80 80 0 0 1 160 0"/><path className="g-val" d="M20 100a80 80 0 0 1 160 0" pathLength="100"/><line x1="100" y1="100" x2="56" y2="49"/></svg><div><strong>82</strong><span>/ 100</span><Badge tone="high">HIGH RISK</Badge></div></div>;
}

function Detail({ setPage }: { setPage: (p: Page) => void }) {
  return <><button className="back-link" onClick={() => setPage("alerts")}><Icon name="chevron"/> Back to fraud alerts</button><PageHeader eyebrow="INVESTIGATION CASE • #FT-89420" title="Transaction investigation" copy="Flagged May 24, 2025 at 10:38 AM by FinTrack Risk Engine" actions={<><Button kind="secondary">Mark as safe</Button><Button kind="danger" icon="shield">Confirm fraud</Button></>}/>
    <div className="detail-grid"><div className="detail-main">
      <div className="card panel summary-card"><div className="panel-head"><div><h2>Transaction summary</h2><p>Core payment details</p></div><Badge tone="blocked"><i/>BLOCKED</Badge></div><div className="summary-amount"><span>Transaction amount</span><strong>$8,230.50 <small>EUR</small></strong></div><div className="info-grid">{[["Transaction ID","#FT-89420"],["Merchant","Stripe Payments"],["Type","Online purchase"],["Payment method","Visa •••• 4832"],["Date & time","May 24, 2025 • 10:38 AM"],["Authorization","Declined by risk engine"]].map(x => <div key={x[0]}><small>{x[0]}</small><b>{x[1]}</b></div>)}</div></div>
      <div className="card panel"><div className="panel-head"><div><h2>Why this was flagged</h2><p>Detection rules contributing to this score</p></div><Badge tone="high">3 RULES TRIGGERED</Badge></div><div className="rule-list">{[["Unusual transaction location","+34","Transaction occurred in Berlin, 6,200 km from the customer's usual activity in Austin."],["High transaction amount","+28","Amount is 4.2× greater than the customer's average purchase of $1,940."],["New device & IP address","+20","First transaction from this device. IP reputation confidence is below threshold."]].map((r,i) => <div key={r[0]}><span className={`rule-num r${i}`}>0{i+1}</span><div><h3>{r[0]}</h3><p>{r[2]}</p></div><b>{r[1]} pts</b></div>)}</div></div>
      <div className="card panel"><div className="panel-head"><div><h2>Transaction timeline</h2><p>Event sequence in milliseconds</p></div></div><div className="timeline">{[["10:38:12.084","Authorization request received","Payment initiated from Berlin, Germany"],["10:38:12.126","Risk analysis completed","3 detection rules triggered • Score 82"],["10:38:12.141","Transaction blocked","Authorization declined automatically"],["10:38:14.920","Alert created","Assigned to Fraud Operations team"]].map((t,i) => <div key={t[0]}><span className={i === 2 ? "danger" : ""}><Icon name={i === 2 ? "x" : "check"} size={14}/></span><div><b>{t[1]}</b><p>{t[2]}</p></div><time>{t[0]}</time></div>)}</div></div>
    </div><aside className="detail-side">
      <div className="card panel"><div className="panel-head"><div><h2>Fraud score</h2><p>Risk engine assessment</p></div></div><RiskGauge/><div className="confidence"><span>Model confidence</span><b>94.6%</b><div><i/></div></div></div>
      <div className="card panel customer-panel"><div className="panel-head"><h2>Customer information</h2></div><div className="person"><span className="avatar lg">EW</span><div><b>Ethan Williams</b><span>Customer since Aug 2021</span></div></div>{[["Email","ethan.williams@example.com"],["Account ID","CUS-203948"],["Usual location","Austin, United States"],["30-day average","$1,940.20"],["Previous alerts","1 • Resolved as safe"]].map(x => <div className="key-value" key={x[0]}><span>{x[0]}</span><b>{x[1]}</b></div>)}</div>
      <div className="card panel"><div className="panel-head"><h2>Location information</h2></div><div className="location-map"><Icon name="globe" size={70}/><span><i/></span></div><div className="key-value"><span>Origin</span><b>Berlin, Germany</b></div><div className="key-value"><span>Distance from usual</span><b className="danger-text">6,200 km</b></div><div className="key-value"><span>IP reputation</span><Badge tone="medium">UNCERTAIN</Badge></div></div>
    </aside></div>
  </>;
}

function AnalyticsValueChart({ transactions, currency }: { transactions: TransactionRecord[]; currency: string | null }) {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    return date;
  });
  const values = days.map(day => transactions.filter(transaction => {
    const date = transaction.createdAt ? new Date(transaction.createdAt) : new Date();
    return date.toDateString() === day.toDateString();
  }).reduce((sum, transaction) => sum + transaction.amount, 0));
  const maxValue = Math.max(...values, 0);
  if (!maxValue) return <div className="analytics-no-data"><Icon name="chart" size={26}/><b>No transaction value yet</b><span>Create a transaction to populate this chart.</span></div>;
  const points = values.map((value, index) => `${index * 120},${200 - (value / maxValue) * 170}`);
  const line = `M${points.join(" L")}`;
  const area = `${line} L720,220 L0,220 Z`;
  const compact = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1, style: currency ? "currency" : "decimal", currency: currency || undefined }).format(value);
  return <div className="chart-area real-chart"><div className="y-labels"><span>{compact(maxValue)}</span><span>{compact(maxValue * .75)}</span><span>{compact(maxValue * .5)}</span><span>{compact(maxValue * .25)}</span><span>{compact(0)}</span></div><svg viewBox="0 0 720 220" preserveAspectRatio="none"><defs><linearGradient id="real-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3563e9" stopOpacity=".18"/><stop offset="1" stopColor="#3563e9" stopOpacity="0"/></linearGradient></defs><g className="grid-lines"><path d="M0 10H720M0 60H720M0 110H720M0 160H720M0 210H720"/></g><path d={area} fill="url(#real-area)"/><path className="chart-line" d={line}/>{points.map((point, index) => { const [cx, cy] = point.split(","); return values[index] ? <circle key={index} cx={cx} cy={cy} r="4" className="real-chart-dot"/> : null; })}</svg><div className="x-labels">{days.map(day => <span key={day.toISOString()}>{day.toLocaleDateString("en", { month: "short", day: "numeric" })}</span>)}</div></div>;
}

function Analytics({ transactions }: { transactions: TransactionRecord[] }) {
  const total = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const currency = transactions.length && transactions.every(transaction => transaction.currency === transactions[0].currency) ? transactions[0].currency : null;
  const money = (value: number) => currency ? new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value) : transactions.length ? "Mixed currencies" : "—";
  const countByRisk = (risk: TransactionRecord["risk"]) => transactions.filter(transaction => transaction.risk === risk).length;
  const percent = (count: number) => transactions.length ? Math.round((count / transactions.length) * 100) : 0;
  const low = countByRisk("LOW");
  const medium = countByRisk("MEDIUM");
  const high = countByRisk("HIGH");
  const hourly = Array.from({ length: 24 }, (_, hour) => transactions.filter(transaction => {
    const date = transaction.createdAt ? new Date(transaction.createdAt) : new Date();
    return date.getHours() === hour;
  }).length);
  const maxHourly = Math.max(...hourly, 0);
  const locations = Object.values(transactions.reduce<Record<string, { location: string; value: number; count: number }>>((groups, transaction) => {
    const key = transaction.location.toLowerCase();
    groups[key] ||= { location: transaction.location, value: 0, count: 0 };
    groups[key].value += transaction.amount;
    groups[key].count += 1;
    return groups;
  }, {})).sort((a, b) => b.value - a.value).slice(0, 4);
  const downloadReport = () => {
    if (!transactions.length) return;
    const safeCell = (value: string | number) => {
      const text = String(value);
      const formulaSafe = /^[=+\-@]/.test(text) ? `'${text}` : text;
      return `"${formulaSafe.replaceAll('"', '""')}"`;
    };
    const summary = [
      ["FinTrack Analytics Report"],
      ["Generated", new Date().toLocaleString()],
      ["Transaction volume", transactions.length],
      ["Transaction value", currency ? money(total) : "Mixed currencies"],
      ["High-risk rate", `${percent(high)}%`],
      ["Average transaction", transactions.length ? money(total / transactions.length) : "—"],
      ["Low-risk transactions", low],
      ["Medium-risk transactions", medium],
      ["High-risk transactions", high],
      [],
      ["Transaction ID", "Customer", "Amount", "Currency", "Merchant", "Location", "Type", "Date & Time", "Risk Level", "Risk Score", "Status"],
    ];
    const records = transactions.map(transaction => [
      transaction.id, transaction.customer, transaction.amount.toFixed(2), transaction.currency,
      transaction.merchant, transaction.location, transaction.type, transaction.date,
      transaction.risk, transaction.score, transaction.status,
    ]);
    const csv = [...summary, ...records].map(row => row.map(safeCell).join(",")).join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fintrack-analytics-report-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  return <><PageHeader eyebrow="INTELLIGENCE" title="Advanced analytics" copy="Analytics calculated only from transactions entered in FinTrack." actions={<><Button kind="secondary" icon="download" onClick={downloadReport} disabled={!transactions.length}>Download report</Button><Badge tone="blue">LIVE DATA</Badge></>}/>
    <div className="analytics-kpis">{[["Transaction volume",String(transactions.length),transactions.length === 1 ? "submitted transaction" : "submitted transactions"],["Transaction value",money(total),currency || "No currency data"],["High-risk rate",`${percent(high)}%`,`${high} high-risk ${high === 1 ? "transaction" : "transactions"}`],["Average transaction",transactions.length ? money(total / transactions.length) : "—","Based on submitted data"]].map(item => <div className="card mini-kpi real-kpi" key={item[0]}><p>{item[0]}</p><strong>{item[1]}</strong><small>{item[2]}</small></div>)}</div>
    <div className="analytics-grid"><div className="card panel chart-large"><div className="panel-head"><div><h2>Transaction value</h2><p>Submitted transaction amounts over the last 7 days</p></div><div className="chart-legend"><span><i/>Entered value</span></div></div><AnalyticsValueChart transactions={transactions} currency={currency}/></div>
      <div className="card panel"><div className="panel-head"><div><h2>Risk distribution</h2><p>Calculated from submitted transactions</p></div></div>{transactions.length ? <><Donut value={percent(low)} label="Low risk"/><div className="legend compact"><span><i className="green"/>Low risk <b>{low} · {percent(low)}%</b></span><span><i className="amber"/>Medium <b>{medium} · {percent(medium)}%</b></span><span><i className="red"/>High risk <b>{high} · {percent(high)}%</b></span></div></> : <div className="analytics-no-data small"><Icon name="shield" size={25}/><b>No risk data yet</b><span>Risk levels appear after a transaction is submitted.</span></div>}</div>
      <div className="card panel"><div className="panel-head"><div><h2>Hourly activity</h2><p>Actual transaction count by submission time</p></div></div>{transactions.length ? <><div className="hour-bars real-hours">{hourly.map((count,hour)=><i key={hour} style={{height: maxHourly ? `${(count / maxHourly) * 100}%` : "0%"}} title={`${hour}:00 — ${count} ${count === 1 ? "transaction" : "transactions"}`}/>)}</div><div className="hour-labels"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>11 PM</span></div></> : <div className="analytics-no-data small"><Icon name="clock" size={25}/><b>No hourly activity yet</b><span>Submission times will populate this chart.</span></div>}</div>
      <div className="card panel geo-panel"><div className="panel-head"><div><h2>Geographic analysis</h2><p>Locations entered in submitted transactions</p></div></div>{locations.length ? <div className="geo-content"><div className="map big"><Icon name="globe" size={120}/>{locations.slice(0,3).map((location,index) => <span key={location.location} className={`map-dot d${index + 1}`}/>)}</div><div className="country-list">{locations.map(location=><div key={location.location}><span><i/>{location.location}</span><b>{currency ? new Intl.NumberFormat("en-US", { style: "currency", currency, notation: "compact" }).format(location.value) : `${location.count} entries`}</b><small>{percent(location.count)}%</small></div>)}</div></div> : <div className="analytics-no-data geo-empty"><Icon name="globe" size={30}/><b>No location data yet</b><span>Locations entered in transactions will appear here.</span></div>}</div>
    </div>
  </>;
}

type UserRecord = {
  id: string;
  name: string;
  email: string;
  username: string;
  passwordHash: string;
  role: string;
  status: string;
  registered: string;
  activity: string;
  timezone?: string;
};

async function hashPassword(password: string) {
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function Users({ setPage, users, onDeleteUser }: { setPage: (p: Page) => void; users: UserRecord[]; onDeleteUser: (user: UserRecord) => void }) {
  const [pendingDelete, setPendingDelete] = useState<UserRecord | null>(null);
  const activeUsers = users.filter(user => user.status === "ACTIVE").length;
  const analysts = users.filter(user => user.role === "ANALYST").length;
  const inactiveUsers = users.filter(user => user.status === "INACTIVE").length;
  return <><PageHeader eyebrow="ADMINISTRATION" title="User management" copy="Manage access, roles and account permissions." actions={<Button icon="plus" onClick={() => setPage("create-user")}>Add user</Button>}/>
    <div className="user-summary">{[["Registered users",String(users.length),"users"],["Active users",String(activeUsers),"check"],["Analysts",String(analysts),"shield"],["Inactive",String(inactiveUsers),"lock"]].map(x=><div className="card" key={x[0]}><span className="metric-icon blue"><Icon name={x[2] as IconName}/></span><div><small>{x[0]}</small><strong>{x[1]}</strong></div></div>)}</div>
    <div className="card filter-card"><label className="search grow"><Icon name="search"/><input placeholder="Search users by name, email or ID..."/></label><select><option>All roles</option><option>USER</option><option>ANALYST</option></select><select><option>All statuses</option><option>ACTIVE</option><option>INACTIVE</option></select><Button kind="secondary" icon="filter">Filters</Button></div>
    {users.length ? <div className="card table-card"><div className="table-wrap"><table><thead><tr><th>User</th><th>User ID</th><th>Role</th><th>Status</th><th>Registration date</th><th>Last activity</th><th>Action</th></tr></thead><tbody>{users.map(user=><tr key={user.id}><td><div className="customer"><span className="avatar sm">{user.name.split(" ").map(name=>name[0]).slice(0,2).join("").toUpperCase()}</span><div><b>{user.name}</b><small>{user.email}</small></div></div></td><td>{user.id}</td><td><Badge tone="neutral">{user.role}</Badge></td><td><Badge tone={user.status === "ACTIVE" ? "success" : "neutral"}><i/>{user.status}</Badge></td><td>{user.registered}</td><td>{user.activity}</td><td><button className="delete-user-btn" onClick={() => setPendingDelete(user)} aria-label={`Delete ${user.name}`}><Icon name="trash" size={14}/>Delete</button></td></tr>)}</tbody></table></div></div> :
    <div className="card users-empty"><span><Icon name="users" size={28}/></span><h2>No registered users yet</h2><p>Users created through FinTrack will appear here. Start by registering your first user.</p><Button icon="plus" onClick={() => setPage("create-user")}>Register first user</Button></div>}
    {pendingDelete && <div className="modal-backdrop" role="presentation"><section className="card delete-modal" role="dialog" aria-modal="true" aria-labelledby="delete-user-title"><span className="delete-modal-icon"><Icon name="trash" size={23}/></span><h2 id="delete-user-title">Delete user account?</h2><p>This permanently deletes <b>{pendingDelete.name}</b>, their login credentials, transactions, and associated fraud alerts. This action cannot be undone.</p><div className="delete-user-summary"><span className="avatar">{pendingDelete.name.split(" ").map(name => name[0]).slice(0,2).join("").toUpperCase()}</span><div><b>{pendingDelete.name}</b><small>{pendingDelete.username} · {pendingDelete.role}</small></div></div><div className="delete-modal-actions"><Button kind="secondary" onClick={() => setPendingDelete(null)}>Cancel</Button><Button kind="danger" icon="trash" onClick={() => { onDeleteUser(pendingDelete); setPendingDelete(null); }}>Delete User</Button></div></section></div>}
  </>;
}

type RegistrationErrors = Partial<Record<"fullName" | "dob" | "email" | "phone" | "username" | "password" | "confirmPassword", string>>;

function CreateUser({ setPage, onUserCreated }: { setPage: (p: Page) => void; onUserCreated: (user: UserRecord) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [resetKey, setResetKey] = useState(0);
  const [createdUser, setCreatedUser] = useState<{ id: string; username: string; role: string; status: string } | null>(null);
  const [userId] = useState(() => `USR-${Math.floor(10000 + Math.random() * 89999)}`);

  const passwordScore = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const strength = passwordScore <= 2 ? "Weak" : passwordScore <= 4 ? "Good" : "Strong";

  const resetForm = () => {
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setShowPassword(false);
    setResetKey(key => key + 1);
  };

  const submitUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;
    const nextErrors: RegistrationErrors = {};
    if (!values.fullName?.trim() || values.fullName.trim().length < 3) nextErrors.fullName = "Enter the user's full name.";
    if (!values.dob) nextErrors.dob = "Select a valid date of birth.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || "")) nextErrors.email = "Enter a valid email address.";
    if (!/^\+?[0-9 ()-]{8,18}$/.test(values.phone || "")) nextErrors.phone = "Enter a valid phone number with 8–15 digits.";
    if (!/^[a-zA-Z][a-zA-Z0-9._-]{3,19}$/.test(values.username || "")) nextErrors.username = "Use 4–20 letters, numbers, dots, dashes, or underscores.";
    if (passwordScore < 4) nextErrors.password = "Use at least 8 characters with uppercase, lowercase, and a number.";
    if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const newUser = {
      id: userId,
      name: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      dob: values.dob,
      username: values.username,
      passwordHash: await hashPassword(password),
      role: values.role,
      status: values.status,
      registered: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date()),
      activity: "Just now",
    };
    void apiRequest("/users", { method: "POST", body: JSON.stringify(newUser) })
      .catch(error => console.error("Could not save user to the database:", error));
    onUserCreated(newUser);
    setCreatedUser({ id: newUser.id, username: newUser.username, role: newUser.role, status: newUser.status });
  };

  if (createdUser) {
    return <div className="registration-page">
      <div className="registration-brand"><Logo/></div>
      <section className="card registration-success">
        <span className="success-seal"><Icon name="check" size={32}/></span>
        <span className="eyebrow">REGISTRATION COMPLETE</span>
        <h1>User Created Successfully</h1>
        <p>The user account is ready and access has been configured.</p>
        <div className="success-user">
          <div><small>User ID</small><strong>{createdUser.id}</strong></div>
          <div><small>Username</small><strong>{createdUser.username}</strong></div>
          <div><small>Assigned Role</small><Badge tone="blue">{createdUser.role}</Badge></div>
          <div><small>Account Status</small><Badge tone={createdUser.status === "ACTIVE" ? "success" : "neutral"}><i/>{createdUser.status}</Badge></div>
        </div>
        <div className="success-note"><Icon name="shield"/><span><b>Account securely provisioned</b><small>Role-based permissions have been applied. No password information is stored on this screen.</small></span></div>
        <Button icon="users" onClick={() => setPage("users")}>Back to Users</Button>
      </section>
    </div>;
  }

  return <div className="registration-page">
    <button className="back-link" onClick={() => setPage("users")}><Icon name="chevron"/> Back to user management</button>
    <div className="registration-brand"><Logo/><Badge tone="blue">ADMIN PORTAL</Badge></div>
    <div className="registration-heading"><span className="eyebrow">USER PROVISIONING</span><h1>Create New User</h1><p>Register a new user and configure their account access.</p></div>
    <form key={resetKey} className="card registration-card" onSubmit={submitUser} noValidate>
      <section className="registration-section">
        <div className="registration-section-title"><span>1</span><div><h2>Personal Information</h2><p>Basic identity and contact information.</p></div></div>
        <div className="registration-fields">
          <label className={errors.fullName ? "has-error" : ""}><span>Full Name <em>*</em></span><input name="fullName" placeholder="e.g. Aisha Rahman" autoComplete="name"/>{errors.fullName && <small className="field-error">{errors.fullName}</small>}</label>
          <label className={errors.dob ? "has-error" : ""}><span>Date of Birth <em>*</em></span><input name="dob" type="date" max="2007-12-31"/>{errors.dob && <small className="field-error">{errors.dob}</small>}</label>
          <label className={errors.email ? "has-error" : ""}><span>Email Address <em>*</em></span><input name="email" type="email" placeholder="name@company.com" autoComplete="email"/>{errors.email && <small className="field-error">{errors.email}</small>}</label>
          <label className={errors.phone ? "has-error" : ""}><span>Phone Number <em>*</em></span><input name="phone" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel"/>{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
        </div>
      </section>
      <section className="registration-section">
        <div className="registration-section-title"><span>2</span><div><h2>Login Information</h2><p>Create secure credentials for account access.</p></div></div>
        <div className="registration-fields">
          <label className={`span-2 ${errors.username ? "has-error" : ""}`}><span>Username <em>*</em></span><input name="username" placeholder="e.g. aisha.rahman" autoComplete="username"/><small className={errors.username ? "field-error" : "field-hint"}>{errors.username || "4–20 characters. Letters, numbers, dots, dashes, and underscores only."}</small></label>
          <label className={errors.password ? "has-error" : ""}><span>Password <em>*</em></span><div className="secure-input"><input name="password" type={showPassword ? "text" : "password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Create a secure password" autoComplete="new-password"/><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><Icon name="eye"/></button></div><div className={`password-strength strength-${strength.toLowerCase()}`}><div><i/><i/><i/></div><span>{password ? `${strength} password` : "Password strength"}</span></div>{errors.password && <small className="field-error">{errors.password}</small>}</label>
          <label className={errors.confirmPassword ? "has-error" : ""}><span>Confirm Password <em>*</em></span><div className="secure-input"><input name="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Re-enter the password" autoComplete="new-password"/><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}><Icon name="eye"/></button></div>{confirmPassword && confirmPassword === password && <small className="field-valid"><Icon name="check" size={12}/> Passwords match</small>}{errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}</label>
        </div>
      </section>
      <section className="registration-section">
        <div className="registration-section-title"><span>3</span><div><h2>Account Information</h2><p>Assign a role and initial account status.</p></div></div>
        <div className="registration-fields account-fields">
          <label><span>User ID</span><div className="generated-id"><Icon name="lock" size={15}/><input value={userId} readOnly name="userId"/></div><small className="field-hint">Automatically generated by FinTrack</small></label>
          <label><span>Role <em>*</em></span><select name="role" defaultValue="USER"><option value="USER">USER</option><option value="ANALYST">ANALYST</option></select><small className="field-hint">Controls available features and permissions.</small></label>
          <fieldset className="span-2"><legend>Account Status <em>*</em></legend><div className="status-options"><label><input type="radio" name="status" value="ACTIVE" defaultChecked/><span><i className="status-dot active"/><b>ACTIVE</b><small>User can sign in immediately</small></span></label><label><input type="radio" name="status" value="INACTIVE"/><span><i className="status-dot"/><b>INACTIVE</b><small>Access remains disabled</small></span></label></div></fieldset>
        </div>
      </section>
      <div className="registration-security"><Icon name="shield"/><span><b>Secure user provisioning</b><small>Credentials are encrypted and protected with role-based access control.</small></span></div>
      <div className="registration-actions"><button type="button" className="reset-link" onClick={resetForm}>Reset Form</button><div><Button kind="secondary" onClick={() => setPage("users")}>Cancel</Button><Button type="submit" icon="plus">Create User</Button></div></div>
    </form>
  </div>;
}

function ChangePassword({ setPage, verifyCurrent, onPasswordChanged }: { setPage: (page: Page) => void; verifyCurrent: (password: string) => Promise<boolean>; onPasswordChanged: (passwordHash: string) => void }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const score = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword),
    /[a-z]/.test(newPassword),
    /\d/.test(newPassword),
    /[^A-Za-z0-9]/.test(newPassword),
  ].filter(Boolean).length;
  const strength = score <= 2 ? "Weak" : score <= 4 ? "Good" : "Strong";

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!oldPassword) nextErrors.oldPassword = "Enter your current password.";
    else if (!(await verifyCurrent(oldPassword))) nextErrors.oldPassword = "Current password is incorrect.";
    if (newPassword && newPassword === oldPassword) nextErrors.newPassword = "New password cannot be the same as your current password.";
    else if (score < 4) nextErrors.newPassword = "Use at least 8 characters with uppercase, lowercase, and a number.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your new password.";
    else if (confirmPassword !== newPassword) nextErrors.confirmPassword = "New passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onPasswordChanged(await hashPassword(newPassword));
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true);
  };

  if (success) return <div className="password-page"><div className="registration-brand"><Logo/><Badge tone="success"><i/>SECURE</Badge></div><section className="card password-success"><span className="success-seal"><Icon name="check" size={31}/></span><span className="eyebrow">PASSWORD UPDATED</span><h1>Password Changed Successfully</h1><p>Your new password is active. Use it the next time you sign in.</p><div className="success-note"><Icon name="shield"/><span><b>Your account remains protected</b><small>The previous password can no longer be used to access this account.</small></span></div><Button onClick={() => setPage("overview")}>Return to dashboard</Button></section></div>;

  return <div className="password-page"><button className="back-link" onClick={() => setPage("overview")}><Icon name="chevron"/> Back to dashboard</button><div className="registration-brand"><Logo/><Badge tone="blue">SECURE ACCOUNT</Badge></div><div className="registration-heading"><span className="eyebrow">ACCOUNT SECURITY</span><h1>Change Password</h1><p>Verify your current password and create a secure replacement.</p></div><form className="card password-card" onSubmit={submit} noValidate><div className="password-card-head"><span><Icon name="lock" size={22}/></span><div><h2>Update login credentials</h2><p>All fields are required. Your password is never displayed or stored as plain text.</p></div></div><div className="password-fields"><label className={errors.oldPassword ? "has-error" : ""}><span>Current Password <em>*</em></span><div className="secure-input"><input type={showPasswords ? "text" : "password"} value={oldPassword} onChange={event => setOldPassword(event.target.value)} placeholder="Enter your current password" autoComplete="current-password"/><button type="button" onClick={() => setShowPasswords(!showPasswords)} aria-label={showPasswords ? "Hide passwords" : "Show passwords"}><Icon name="eye"/></button></div>{errors.oldPassword && <small className="field-error">{errors.oldPassword}</small>}</label><label className={errors.newPassword ? "has-error" : ""}><span>New Password <em>*</em></span><div className="secure-input"><input type={showPasswords ? "text" : "password"} value={newPassword} onChange={event => setNewPassword(event.target.value)} placeholder="Create a new secure password" autoComplete="new-password"/><button type="button" onClick={() => setShowPasswords(!showPasswords)} aria-label={showPasswords ? "Hide passwords" : "Show passwords"}><Icon name="eye"/></button></div><div className={`password-strength strength-${strength.toLowerCase()}`}><div><i/><i/><i/></div><span>{newPassword ? `${strength} password` : "Password strength"}</span></div>{errors.newPassword && <small className="field-error">{errors.newPassword}</small>}</label><label className={errors.confirmPassword ? "has-error" : ""}><span>Confirm New Password <em>*</em></span><div className="secure-input"><input type={showPasswords ? "text" : "password"} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Enter the new password again" autoComplete="new-password"/><button type="button" onClick={() => setShowPasswords(!showPasswords)} aria-label={showPasswords ? "Hide passwords" : "Show passwords"}><Icon name="eye"/></button></div>{confirmPassword && confirmPassword === newPassword && <small className="field-valid"><Icon name="check" size={12}/> Passwords match</small>}{errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}</label></div><div className="password-rules"><h3>Password requirements</h3><div><span className={newPassword.length >= 8 ? "met" : ""}><Icon name="check" size={12}/>At least 8 characters</span><span className={/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) ? "met" : ""}><Icon name="check" size={12}/>Uppercase and lowercase letters</span><span className={/\d/.test(newPassword) ? "met" : ""}><Icon name="check" size={12}/>At least one number</span><span className={/[^A-Za-z0-9]/.test(newPassword) ? "met" : ""}><Icon name="check" size={12}/>Special character recommended</span></div></div><div className="password-actions"><Button kind="secondary" onClick={() => setPage("overview")}>Cancel</Button><Button type="submit" icon="lock">Update Password</Button></div></form></div>;
}

function Toggle({ on = true, onChange, label = "Toggle setting" }: { on?: boolean; onChange?: (value: boolean) => void; label?: string }) { return <button type="button" className={`toggle ${on ? "on" : ""}`} aria-label={label} aria-pressed={on} onClick={() => onChange?.(!on)}><i/></button>; }

function Settings({ name, email, role, timezone, accountId, sessions, onSave }: { name: string; email: string; role: AccessRole; timezone: string; accountId: string; sessions: SessionRecord[]; onSave: (profile: { name: string; email: string; timezone: string }) => void }) {
  const [section,setSection] = useState("Account");
  const nameParts = name.trim().split(/\s+/);
  const [firstName, setFirstName] = useState(nameParts[0] || "");
  const [lastName, setLastName] = useState(nameParts.slice(1).join(" "));
  const [emailAddress, setEmailAddress] = useState(email);
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);
  const [accountError, setAccountError] = useState("");
  const [accountSaved, setAccountSaved] = useState(false);
  const [securityPreferences, setSecurityPreferences] = useState<{ twoFactor: boolean; rbac: boolean }>(() => {
    try { return JSON.parse(localStorage.getItem(`fintrack-security-${accountId}`) || '{"twoFactor":false,"rbac":true}'); }
    catch { return { twoFactor: false, rbac: true }; }
  });
  const [notificationPreferences, setNotificationPreferences] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`fintrack-notifications-${accountId}`) || '{"highRisk":true,"transactionStatus":true,"weeklyReport":true,"systemUpdates":false}'); }
    catch { return { highRisk: true, transactionStatus: true, weeklyReport: true, systemUpdates: false }; }
  });
  const [apiConfiguration, setApiConfiguration] = useState<{ enabled: boolean; key: string }>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(`fintrack-api-${accountId}`) || "{}");
      return { enabled: saved.enabled ?? true, key: saved.key || `ft_live_${crypto.randomUUID().replaceAll("-", "")}` };
    } catch {
      return { enabled: true, key: `ft_live_${crypto.randomUUID().replaceAll("-", "")}` };
    }
  });
  const [apiMessage, setApiMessage] = useState("");
  const [systemPreferences, setSystemPreferences] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`fintrack-preferences-${accountId}`) || '{"approval":true,"compactTables":false,"autoRefresh":true,"currency":"USD","dateFormat":"MM/DD/YYYY"}'); }
    catch { return { approval: true, compactTables: false, autoRefresh: true, currency: "USD", dateFormat: "MM/DD/YYYY" }; }
  });
  const [preferencesSaved, setPreferencesSaved] = useState(false);
  useEffect(() => {
    localStorage.setItem(`fintrack-security-${accountId}`, JSON.stringify(securityPreferences));
  }, [accountId, securityPreferences]);
  useEffect(() => {
    localStorage.setItem(`fintrack-notifications-${accountId}`, JSON.stringify(notificationPreferences));
  }, [accountId, notificationPreferences]);
  useEffect(() => {
    localStorage.setItem(`fintrack-api-${accountId}`, JSON.stringify(apiConfiguration));
  }, [accountId, apiConfiguration]);
  useEffect(() => {
    localStorage.setItem(`fintrack-preferences-${accountId}`, JSON.stringify(systemPreferences));
  }, [accountId, systemPreferences]);
  const timezoneApi = Intl as typeof Intl & { supportedValuesOf?: (key: "timeZone") => string[] };
  const timezones = timezoneApi.supportedValuesOf?.("timeZone") || ["UTC", "America/New_York", "Europe/London", "Asia/Dubai", "Asia/Kolkata", "Asia/Singapore", "Australia/Sydney"];
  if (!timezones.includes(selectedTimezone)) timezones.unshift(selectedTimezone);
  const sections = [["Account","users"],["Security","lock"],["Notifications","bell"],["API configuration","server"],["System preferences","settings"]] as [string,IconName][];
  const saveAccount = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccountSaved(false);
    if (!firstName.trim()) {
      setAccountError("First name is required.");
      return;
    }
    if (!lastName.trim()) {
      setAccountError("Last name is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      setAccountError("Enter a valid email address.");
      return;
    }
    setAccountError("");
    onSave({ name: `${firstName.trim()} ${lastName.trim()}`, email: emailAddress.trim(), timezone: selectedTimezone });
    setAccountSaved(true);
  };
  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(apiConfiguration.key);
      setApiMessage("API key copied securely.");
    } catch {
      setApiMessage("Unable to copy automatically. Check browser clipboard permission.");
    }
  };
  const rotateApiKey = () => {
    setApiConfiguration(configuration => ({ ...configuration, key: `ft_live_${crypto.randomUUID().replaceAll("-", "")}` }));
    setApiMessage("A new production API key has been generated. The previous key is no longer valid.");
  };
  return <><PageHeader eyebrow="PREFERENCES" title="Settings" copy="Manage your account and system configuration."/>
    <div className="settings-layout"><div className="card settings-nav">{sections.map(s=><button className={section===s[0]?"active":""} onClick={()=>setSection(s[0])} key={s[0]}><Icon name={s[1]}/>{s[0]}<Icon name="chevron" size={14}/></button>)}</div><div className="card settings-content">
      <div className="settings-heading"><div><h2>{section}</h2><p>{section === "Security" ? "Protect your account and active sessions." : section === "API configuration" ? "Manage API access and webhooks." : "Update your personal details and preferences."}</p></div><Badge tone="success"><i/>SECURE</Badge></div>
      {section === "Account" ? <form className="form-grid" onSubmit={saveAccount} noValidate><label><span>First name <em>*</em></span><input value={firstName} onChange={event => { setFirstName(event.target.value); setAccountSaved(false); }} placeholder="Enter first name"/></label><label><span>Last name <em>*</em></span><input value={lastName} onChange={event => { setLastName(event.target.value); setAccountSaved(false); }} placeholder="Enter last name"/></label><label className="span-2"><span>Email address <em>*</em></span><input type="email" value={emailAddress} onChange={event => { setEmailAddress(event.target.value); setAccountSaved(false); }} placeholder="name@company.com"/></label><label>Role<input value={role === "ADMIN" ? "Administrator" : role === "ANALYST" ? "Fraud Analyst" : "Registered User"} disabled readOnly/></label><label>Timezone<select value={selectedTimezone} onChange={event => { setSelectedTimezone(event.target.value); setAccountSaved(false); }}>{timezones.map(zone => <option value={zone} key={zone}>{zone.replaceAll("_", " ")}</option>)}</select></label>{accountError && <div className="settings-form-message error span-2"><Icon name="x" size={14}/>{accountError}</div>}{accountSaved && <div className="settings-form-message success span-2"><Icon name="check" size={14}/><span><b>Changes saved successfully</b>Your profile information has been updated across FinTrack.</span></div>}<div className="form-actions span-2"><Button type="submit">Save changes</Button></div></form> :
      section === "Security" ? <div className="security-settings"><div className="setting-list"><div><span className="setting-icon"><Icon name="lock"/></span><div><b>Two-factor authentication</b><p>{securityPreferences.twoFactor ? "Two-factor protection is enabled for this account." : "Add an extra verification step when signing in."}</p></div><div className="security-control"><Badge tone={securityPreferences.twoFactor ? "success" : "neutral"}>{securityPreferences.twoFactor ? "ON" : "OFF"}</Badge><Toggle on={securityPreferences.twoFactor} onChange={value => setSecurityPreferences(preferences => ({ ...preferences, twoFactor: value }))} label="Toggle two-factor authentication"/></div></div><div><span className="setting-icon"><Icon name="shield"/></span><div><b>Role-based access control</b><p>{securityPreferences.rbac ? `${role} permissions are actively enforced.` : "Role-based restrictions are currently marked as disabled."}</p></div><div className="security-control"><Badge tone={securityPreferences.rbac ? "success" : "medium"}>{securityPreferences.rbac ? "ON" : "OFF"}</Badge><Toggle on={securityPreferences.rbac} onChange={value => setSecurityPreferences(preferences => ({ ...preferences, rbac: value }))} label="Toggle role-based access control"/></div></div></div><div className="sessions-section"><div className="sessions-heading"><div><span className="setting-icon"><Icon name="activity"/></span><div><h3>Login sessions</h3><p>Devices and locations where this account has signed in.</p></div></div><Badge tone="blue">{sessions.filter(session => session.status === "ACTIVE").length} ACTIVE</Badge></div>{sessions.length ? <div className="sessions-list">{sessions.map((session, index) => <div key={session.id}><span className="session-device"><Icon name={session.device.includes("Mobile") ? "users" : "server"}/></span><div><b>{session.device} · {session.browser}</b><p><Icon name="globe" size={12}/>{session.location}</p><small>Signed in {session.loginAt}</small></div><div className="session-status"><Badge tone={session.status === "ACTIVE" ? "success" : "neutral"}><i/>{session.status === "ACTIVE" && index === 0 ? "CURRENT" : session.status}</Badge></div></div>)}</div> : <div className="sessions-empty"><Icon name="activity" size={22}/><span>No session history is available.</span></div>}</div></div> :
      section === "Notifications" ? <div className="setting-list notification-settings">{[["highRisk","High-risk fraud alerts","Immediately notify me when a submitted transaction is classified as high risk.","shield"],["transactionStatus","Transaction status updates","Notify me when transactions are successful, pending, blocked, or failed.","card"],["weeklyReport","Weekly analytics report","Receive a weekly summary of real transaction and fraud data.","chart"],["systemUpdates","System and security updates","Receive information about important FinTrack security changes.","bell"]].map(item => { const key = item[0] as keyof typeof notificationPreferences; const enabled = Boolean(notificationPreferences[key]); return <div key={key}><span className="setting-icon"><Icon name={item[3] as IconName}/></span><div><b>{item[1]}</b><p>{item[2]}</p></div><div className="security-control"><Badge tone={enabled ? "success" : "neutral"}>{enabled ? "ON" : "OFF"}</Badge><Toggle on={enabled} onChange={value => setNotificationPreferences((preferences: typeof notificationPreferences) => ({ ...preferences, [key]: value }))} label={`Toggle ${item[1]}`}/></div></div>; })}<div className="notification-destination"><Icon name="bell"/><span><b>Notification destination</b><small>Account notifications will be associated with {emailAddress}.</small></span></div></div> :
      section === "API configuration" ? <div className="api-box enabled-api"><div className="api-status-row"><div><Badge tone={apiConfiguration.enabled ? "success" : "neutral"}><i/>{apiConfiguration.enabled ? "API ACCESS ON" : "API ACCESS OFF"}</Badge><p>Enable or pause programmatic access for this account.</p></div><Toggle on={apiConfiguration.enabled} onChange={enabled => { setApiConfiguration(configuration => ({ ...configuration, enabled })); setApiMessage(enabled ? "API access enabled." : "API access disabled."); }} label="Toggle API access"/></div><h3>Production API key</h3><div className="api-key"><code>{apiConfiguration.enabled ? `${apiConfiguration.key.slice(0, 12)}••••••••••••${apiConfiguration.key.slice(-4)}` : "API access is disabled"}</code><Button kind="secondary" onClick={copyApiKey} disabled={!apiConfiguration.enabled}>Copy</Button></div><p>API requests use JWT authentication and TLS 1.3 encrypted communication. Keep this key private.</p>{apiMessage && <div className="api-message"><Icon name="check" size={14}/>{apiMessage}</div>}<div className="api-actions"><Button kind="danger" onClick={rotateApiKey} disabled={!apiConfiguration.enabled}>Rotate key</Button></div></div> :
      <div className="system-preferences"><div className="setting-list"><div><span className="setting-icon"><Icon name="shield"/></span><div><b>Require approval for high-value transactions</b><p>Keep high-value transactions pending for administrator review.</p></div><Toggle on={systemPreferences.approval} onChange={value => { setSystemPreferences((preferences: typeof systemPreferences) => ({ ...preferences, approval: value })); setPreferencesSaved(false); }} label="Toggle high-value approval"/></div><div><span className="setting-icon"><Icon name="card"/></span><div><b>Compact data tables</b><p>Use reduced row spacing to display more records at once.</p></div><Toggle on={systemPreferences.compactTables} onChange={value => { setSystemPreferences((preferences: typeof systemPreferences) => ({ ...preferences, compactTables: value })); setPreferencesSaved(false); }} label="Toggle compact tables"/></div><div><span className="setting-icon"><Icon name="activity"/></span><div><b>Automatic data refresh</b><p>Keep dashboard records synchronized while the application is open.</p></div><Toggle on={systemPreferences.autoRefresh} onChange={value => { setSystemPreferences((preferences: typeof systemPreferences) => ({ ...preferences, autoRefresh: value })); setPreferencesSaved(false); }} label="Toggle automatic refresh"/></div></div><div className="preference-selects"><label>Default currency<select value={systemPreferences.currency} onChange={event => { setSystemPreferences((preferences: typeof systemPreferences) => ({ ...preferences, currency: event.target.value })); setPreferencesSaved(false); }}><option>USD</option><option>EUR</option><option>GBP</option><option>INR</option><option>AED</option><option>SGD</option><option>AUD</option><option>CAD</option><option>JPY</option></select></label><label>Date format<select value={systemPreferences.dateFormat} onChange={event => { setSystemPreferences((preferences: typeof systemPreferences) => ({ ...preferences, dateFormat: event.target.value })); setPreferencesSaved(false); }}><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></label></div>{preferencesSaved && <div className="settings-form-message success"><Icon name="check" size={14}/><span><b>Preferences saved</b>Your system preferences are now active.</span></div>}<div className="preference-actions"><Button onClick={() => setPreferencesSaved(true)}>Save preferences</Button></div></div>}
    </div></div>
  </>;
}

function Admin({ users, transactions, setPage }: { users: UserRecord[]; transactions: TransactionRecord[]; setPage: (page: Page) => void }) {
  const userCount = (role: string) => users.filter(user => user.role === role).length;
  const activeUsers = users.filter(user => user.status === "ACTIVE").length;
  const inactiveUsers = users.filter(user => user.status === "INACTIVE").length;
  const transactionCount = (status: TransactionRecord["status"]) => transactions.filter(transaction => transaction.status === status).length;
  const riskCount = (risk: TransactionRecord["risk"]) => transactions.filter(transaction => transaction.risk === risk).length;
  const successful = transactionCount("SUCCESS");
  const pending = transactionCount("PENDING");
  const blocked = transactionCount("BLOCKED");
  const failed = transactionCount("FAILED");
  const low = riskCount("LOW");
  const medium = riskCount("MEDIUM");
  const high = riskCount("HIGH");
  const alerts = medium + high;
  const percent = (value: number, total: number) => total ? Math.round((value / total) * 100) : 0;
  return <><PageHeader eyebrow="ADMIN CONSOLE" title="Administration overview" copy="Real account and transaction records entered in FinTrack." actions={<Badge tone="blue">LIVE APPLICATION DATA</Badge>}/>
    <div className="admin-kpis">{[["Registered users",String(users.length),`${activeUsers} active`,"users"],["Active users",String(activeUsers),`${inactiveUsers} inactive`,"activity"],["Transactions",String(transactions.length),`${successful} successful`,"card"],["Fraud alerts",String(alerts),`${high} high risk`,"shield"]].map(item=><div className="card admin-kpi" key={item[0]}><span className="metric-icon blue"><Icon name={item[3] as IconName}/></span><p>{item[0]}</p><strong>{item[1]}</strong><small>{item[2]}</small></div>)}</div>
    <div className="admin-real-grid">
      <div className="card panel admin-data-panel"><div className="panel-head"><div><h2>User accounts</h2><p>Registered accounts by role and status</p></div><Button kind="ghost" onClick={() => setPage("users")}>Manage users</Button></div>{users.length ? <div className="admin-data-list">{[["USER accounts",userCount("USER"),"users"],["ANALYST accounts",userCount("ANALYST"),"shield"],["Active accounts",activeUsers,"check"],["Inactive accounts",inactiveUsers,"lock"]].map(item=><div key={item[0]}><span className="service-icon"><Icon name={item[2] as IconName}/></span><b>{item[0]}</b><strong>{item[1]}</strong></div>)}</div> : <div className="analytics-no-data small"><Icon name="users" size={25}/><b>No registered users</b><span>Create a user to populate account information.</span></div>}</div>
      <div className="card panel admin-data-panel"><div className="panel-head"><div><h2>Transaction status</h2><p>Actual processing results</p></div></div>{transactions.length ? <div className="admin-progress-list">{[["Successful",successful,"low"],["Pending",pending,"medium"],["Blocked",blocked,"high"],["Failed",failed,"high"]].map(item=><div key={item[0]}><span>{item[0]} <b>{item[1]}</b></span><div className="bar"><i className={String(item[2])} style={{width:`${percent(Number(item[1]),transactions.length)}%`}}/></div><small>{percent(Number(item[1]),transactions.length)}%</small></div>)}</div> : <div className="analytics-no-data small"><Icon name="card" size={25}/><b>No transactions</b><span>Submitted transactions will appear here.</span></div>}</div>
      <div className="card panel admin-data-panel span-all"><div className="panel-head"><div><h2>Risk distribution</h2><p>Risk levels calculated from submitted transactions</p></div>{transactions.length > 0 && high === 0 && <Badge tone="success">NO HIGH RISK</Badge>}</div>{transactions.length ? <div className="admin-risk-summary">{[["Low risk",low,"green"],["Medium risk",medium,"amber"],["High risk",high,"red"]].map(item=><div key={item[0]}><span className={`metric-icon ${item[2]}`}><Icon name={item[0] === "Low risk" ? "check" : "activity"}/></span><div><small>{item[0]}</small><strong>{item[1]}</strong><p>{percent(Number(item[1]),transactions.length)}% of submitted transactions</p></div></div>)}</div> : <div className="analytics-no-data small"><Icon name="shield" size={25}/><b>No risk records</b><span>Risk information is created with each transaction.</span></div>}</div>
    </div>
    <section className="section-head"><div><h2>Submitted transactions</h2><p>All transaction records currently stored in FinTrack</p></div><Button kind="secondary" onClick={() => setPage("transactions")}>View transactions <Icon name="chevron" size={14}/></Button></section>
    <TransactionTable transactions={transactions} compact onCreate={() => setPage("create")}/>
  </>;
}

function CreateTransaction({ setPage, customer, ownerId, detectionRules, onTransactionCreated }: { setPage: (p: Page) => void; customer: string; ownerId: string; detectionRules: DetectionRules; onTransactionCreated: (transaction: TransactionRecord) => void }) {
  const [saveError, setSaveError] = useState("");
  const submitTransaction = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries()) as Record<string, string>;
    const amount = Number(values.amount);
    const score = !detectionRules.enabled ? 12 : amount >= detectionRules.highThreshold ? 68 : amount >= detectionRules.mediumThreshold ? 42 : 12;
    const risk = score >= 65 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";
    const transaction: TransactionRecord = {
      id: `#FT-${Math.floor(10000 + Math.random() * 89999)}`,
      customer,
      ownerId,
      amount,
      currency: values.currency,
      merchant: values.merchant.trim(),
      location: values.location.trim(),
      type: values.type,
      description: values.description.trim(),
      date: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date()),
      createdAt: new Date().toISOString(),
      risk,
      score,
      status: risk === "HIGH" && detectionRules.holdHighRisk ? "PENDING" : "SUCCESS",
    };
    setSaveError("");
    try {
      await apiRequest("/transactions", { method: "POST", body: JSON.stringify(transaction) });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save transaction to the database.");
      return;
    }
    onTransactionCreated(transaction);
    setPage("transactions");
  };
  return <><button className="back-link" onClick={()=>setPage("transactions")}><Icon name="chevron"/> Back to transactions</button><PageHeader eyebrow="SECURE PAYMENT" title="Create transaction" copy="Initiate a new financial transaction securely."/>
    <div className="create-layout"><form className="card transaction-form" onSubmit={submitTransaction}><div className="form-section"><h2>Transaction details</h2><p>Enter the payment information below.</p></div>{saveError && <p role="alert" className="login-error">{saveError}</p>}<div className="amount-input"><label>Amount</label><div><span>$</span><input name="amount" type="number" placeholder="0.00" required min="1" step="0.01"/><select name="currency"><option>USD</option><option>EUR</option><option>GBP</option></select></div><small>Minimum transaction amount is $1.00</small></div><div className="form-grid"><label>Merchant<input name="merchant" placeholder="Search or enter merchant name" required/></label><label>Transaction type<select name="type" required><option>Online purchase</option><option>Transfer</option><option>Subscription</option></select></label><label>Location<input name="location" placeholder="City, Country" required/></label><label>Reference ID<input name="reference" placeholder="Optional reference"/></label><label className="span-2">Description<textarea name="description" placeholder="Add a brief description for this transaction" rows={4}/></label></div><div className="form-actions"><Button kind="secondary" onClick={()=>setPage("transactions")}>Cancel</Button><Button type="submit" icon="lock">Submit transaction</Button></div></form>
      <aside><div className="card security-card"><span className="security-large"><Icon name="shield" size={28}/></span><h2>Secure transaction</h2><p>Your transaction is protected by FinTrack's enterprise security infrastructure.</p>{[["JWT Authentication","Identity verified"],["Encrypted communication","TLS 1.3 active"],["Fraud monitoring","Real-time risk analysis"],["Role-based access","Administrator approved"]].map(x=><div key={x[0]}><Icon name="check"/><span><b>{x[0]}</b><small>{x[1]}</small></span></div>)}</div><div className="card help-card"><h3>Need assistance?</h3><p>Contact your finance administrator or review the transaction documentation.</p><Button kind="ghost">View documentation</Button></div></aside>
    </div>
  </>;
}

function Login({ onLogin, users, adminPasswordHash, loggedOut }: { onLogin: (role: AccessRole, name: string, userId: string) => void; users: UserRecord[]; adminPasswordHash: string; loggedOut: boolean }) {
  const [show,setShow] = useState(false);
  const [loginType, setLoginType] = useState<"USER" | "ADMIN">("USER");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const switchLogin = (type: "USER" | "ADMIN") => {
    setLoginType(type);
    setUsername("");
    setPassword("");
    setError("");
    setShow(false);
  };

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Enter both your username and password.");
      return;
    }
    const passwordHash = await hashPassword(password);
    const recordLogin = (success: boolean, role = loginType) => {
      void apiRequest("/users/login-log", {
        method: "POST",
        body: JSON.stringify({ username: username.trim(), role, success }),
      }).catch(error => console.error("Could not send login event to the API:", error));
    };
    if (loginType === "ADMIN" && username === "abubakkar" && (adminPasswordHash ? passwordHash === adminPasswordHash : password === "10092004")) {
      recordLogin(true, "ADMIN");
      onLogin("ADMIN", "Abubakkar", "ADMIN-abubakkar");
      return;
    }
    const matchedUser = users.find(user => user.username.toLowerCase() === username.trim().toLowerCase() && user.passwordHash === passwordHash && user.status === "ACTIVE");
    if (loginType === "USER" && matchedUser?.role === "USER") {
      recordLogin(true, "USER");
      onLogin("USER", matchedUser.name, matchedUser.id);
      return;
    }
    if (loginType === "ADMIN" && matchedUser?.role === "ANALYST") {
      recordLogin(true, "ANALYST");
      onLogin("ANALYST", matchedUser.name, matchedUser.id);
      return;
    }
    recordLogin(false);
    setError(loginType === "USER" ? "Username or password is incorrect. Use an active USER account registered by an administrator." : "Admin or analyst credentials are incorrect. Analyst accounts must be active and registered by an administrator.");
  };

  return <main className="login-page"><section className="login-form-side"><Logo/><div className="login-form-wrap"><span className="eyebrow">SECURE ACCESS</span><h1>Welcome back</h1><p>Choose your access type and sign in securely.</p>{loggedOut && <div className="logout-success"><Icon name="check" size={16}/><span><b>Successfully logged out</b><small>Your FinTrack session has ended securely.</small></span></div>}<div className="login-tabs"><button className={loginType === "USER" ? "active" : ""} onClick={() => switchLogin("USER")}><Icon name="users" size={16}/>User Login</button><button className={loginType === "ADMIN" ? "active" : ""} onClick={() => switchLogin("ADMIN")}><Icon name="shield" size={16}/>Admin Login</button></div><div className="login-type-note"><Icon name={loginType === "USER" ? "users" : "shield"} size={17}/><span><b>{loginType === "USER" ? "Registered user access" : "Admin & analyst access"}</b><small>{loginType === "USER" ? "Use the username and password assigned during registration." : "Administrators and registered analysts sign in here."}</small></span></div><form onSubmit={submitLogin}><label>Username<input value={username} onChange={event => setUsername(event.target.value)} placeholder={loginType === "USER" ? "Enter your registered username" : "Enter admin or analyst username"} autoComplete="username" required/></label><label>Password<div className="password"><input type={show?"text":"password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required/><button type="button" onClick={()=>setShow(!show)} aria-label={show ? "Hide password" : "Show password"}><Icon name="eye"/></button></div></label>{error && <div className="login-error" role="alert"><Icon name="x" size={15}/><span>{error}</span></div>}<div className="login-options"><label><input type="checkbox" defaultChecked/> Remember me</label><button type="button">Forgot password?</button></div><Button type="submit">Sign in securely <Icon name="chevron" size={15}/></Button></form><div className="secure-copy"><Icon name="lock"/><span><b>Secure financial transaction platform</b><small>Passwords are verified using one-way credential hashes.</small></span></div></div><small className="copyright">© 2025 FinTrack Technologies. All rights reserved.</small></section><section className="login-visual"><div className="visual-copy"><Badge tone="blue">ENTERPRISE SECURITY</Badge><h2>Financial intelligence.<br/>Built for trust.</h2><p>Monitor every transaction, identify risk in real time, and protect your business with confidence.</p></div><div className="security-visual"><div className="orbit o1"/><div className="orbit o2"/><div className="center-shield"><Icon name="shield" size={58}/><span><i/> Protected</span></div><div className="float-card fc1"><span className="metric-icon green"><Icon name="check"/></span><div><small>Transaction verified</small><b>$12,580.00</b></div></div><div className="float-card fc2"><span className="metric-icon blue"><Icon name="activity"/></span><div><small>Risk monitoring</small><b>24/7 Active</b></div></div><div className="float-card fc3"><span className="metric-icon blue"><Icon name="lock"/></span><div><small>Encryption</small><b>AES-256</b></div></div></div><div className="trust-row"><span><Icon name="shield"/> SOC 2 TYPE II</span><span><Icon name="lock"/> PCI DSS</span><span><Icon name="globe"/> GDPR READY</span></div></section></main>;
}

export default function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [page,setPage] = useState<Page>("overview");
  const [currentRole, setCurrentRole] = useState<AccessRole>("ADMIN");
  const [currentName, setCurrentName] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fintrack-admin-profile") || "{}").name || "Abubakkar Admin"; }
    catch { return "Abubakkar Admin"; }
  });
  const [currentEmail, setCurrentEmail] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fintrack-admin-profile") || "{}").email || "abubakkar@fintrack.io"; }
    catch { return "abubakkar@fintrack.io"; }
  });
  const [currentTimezone, setCurrentTimezone] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fintrack-admin-profile") || "{}").timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"; }
    catch { return "UTC"; }
  });
  const [currentUserId, setCurrentUserId] = useState("ADMIN-abubakkar");
  const [currentSessionId, setCurrentSessionId] = useState("");
  const [loggedOut, setLoggedOut] = useState(false);
  const [adminPasswordHash, setAdminPasswordHash] = useState(() => localStorage.getItem("fintrack-admin-password") || "");
  const [registeredUsers, setRegisteredUsers] = useState<UserRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("fintrack-users") || "[]") as UserRecord[];
    } catch {
      return [];
    }
  });
  const [createdTransactions, setCreatedTransactions] = useState<TransactionRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("fintrack-transactions") || "[]") as TransactionRecord[];
    } catch {
      return [];
    }
  });
  const [loginSessions, setLoginSessions] = useState<SessionRecord[]>(() => {
    try { return JSON.parse(localStorage.getItem("fintrack-login-sessions") || "[]") as SessionRecord[]; }
    catch { return []; }
  });
  const [detectionRules, setDetectionRules] = useState<DetectionRules>(() => {
    try { return JSON.parse(localStorage.getItem("fintrack-detection-rules") || '{"enabled":true,"mediumThreshold":5000,"highThreshold":10000,"holdHighRisk":true}'); }
    catch { return { enabled: true, mediumThreshold: 5000, highThreshold: 10000, holdHighRisk: true }; }
  });
  useEffect(() => {
    localStorage.setItem("fintrack-users", JSON.stringify(registeredUsers));
  }, [registeredUsers]);
  useEffect(() => {
    localStorage.setItem("fintrack-transactions", JSON.stringify(createdTransactions));
  }, [createdTransactions]);
  useEffect(() => {
    if (!loggedIn) return;
    let active = true;
    getTransactions().then(({ data }) => {
      if (!active) return;
      const transactions = data.map(record => ({
        id: record.id || record.externalId || "",
        customer: record.customer || "Unknown customer",
        ownerId: record.ownerId,
        amount: Number(record.amount) || 0,
        currency: record.currency || "USD",
        merchant: record.merchant || "Unknown merchant",
        location: record.location || "—",
        type: record.type || "Transaction",
        description: record.description || "",
        date: record.date || (record.createdAt ? new Date(record.createdAt).toLocaleString() : "—"),
        createdAt: record.createdAt,
        risk: (record.risk || "LOW").toUpperCase() as TransactionRecord["risk"],
        score: Number(record.score) || 0,
        status: (record.status || "PENDING").toUpperCase() as TransactionRecord["status"],
      }));
      setCreatedTransactions(transactions);
    }).catch(error => console.error("Could not load transactions from the database:", error));
    return () => { active = false; };
  }, [loggedIn]);
  useEffect(() => {
    if (adminPasswordHash) localStorage.setItem("fintrack-admin-password", adminPasswordHash);
  }, [adminPasswordHash]);
  useEffect(() => {
    localStorage.setItem("fintrack-login-sessions", JSON.stringify(loginSessions));
  }, [loginSessions]);
  useEffect(() => {
    localStorage.setItem("fintrack-detection-rules", JSON.stringify(detectionRules));
  }, [detectionRules]);
  const completeLogin = (role: AccessRole, name: string, userId: string) => {
    setCurrentRole(role);
    if (role === "ADMIN") {
      try {
        const profile = JSON.parse(localStorage.getItem("fintrack-admin-profile") || "{}");
        setCurrentName(profile.name || "Abubakkar Admin");
        setCurrentEmail(profile.email || "abubakkar@fintrack.io");
        setCurrentTimezone(profile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
      } catch {
        setCurrentName("Abubakkar Admin");
        setCurrentEmail("abubakkar@fintrack.io");
        setCurrentTimezone("UTC");
      }
    } else {
      const account = registeredUsers.find(user => user.id === userId);
      setCurrentName(account?.name || name);
      setCurrentEmail(account?.email || "");
      setCurrentTimezone(account?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    }
    setCurrentUserId(userId);
    const userAgent = navigator.userAgent;
    const browser = userAgent.includes("Edg/") ? "Microsoft Edge" : userAgent.includes("Chrome/") ? "Google Chrome" : userAgent.includes("Firefox/") ? "Mozilla Firefox" : userAgent.includes("Safari/") ? "Safari" : "Web browser";
    const device = /Android|iPhone|iPad|Mobile/i.test(userAgent) ? "Mobile device" : navigator.platform || "Desktop device";
    const session: SessionRecord = {
      id: `SESSION-${Date.now()}`,
      userId,
      device,
      browser,
      location: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown timezone",
      loginAt: new Date().toLocaleString(),
      status: "ACTIVE",
    };
    setCurrentSessionId(session.id);
    setLoginSessions(records => [session, ...records.filter(record => record.userId !== userId || record.status !== "ACTIVE")].slice(0, 25));
    setPage(role === "ANALYST" ? "alerts" : "overview");
    setLoggedOut(false);
    setLoggedIn(true);
  };
  const logout = () => {
    if (currentSessionId) setLoginSessions(records => records.map(record => record.id === currentSessionId ? { ...record, status: "SIGNED OUT" as const } : record));
    setLoggedOut(true);
    setLoggedIn(false);
  };
  const verifyCurrentPassword = async (password: string) => {
    if (currentRole === "ADMIN") return adminPasswordHash ? await hashPassword(password) === adminPasswordHash : password === "10092004";
    const account = registeredUsers.find(user => user.id === currentUserId);
    return Boolean(account && await hashPassword(password) === account.passwordHash);
  };
  const updateCurrentPassword = (passwordHash: string) => {
    if (currentRole === "ADMIN") {
      setAdminPasswordHash(passwordHash);
      return;
    }
    setRegisteredUsers(users => users.map(user => user.id === currentUserId ? { ...user, passwordHash } : user));
  };
  const deleteUser = (user: UserRecord) => {
    setRegisteredUsers(users => users.filter(account => account.id !== user.id));
    setLoginSessions(sessions => sessions.filter(session => session.userId !== user.id));
    localStorage.removeItem(`fintrack-security-${user.id}`);
    localStorage.removeItem(`fintrack-notifications-${user.id}`);
    localStorage.removeItem(`fintrack-api-${user.id}`);
    localStorage.removeItem(`fintrack-preferences-${user.id}`);
    setCreatedTransactions(transactions => transactions.filter(transaction =>
      transaction.ownerId ? transaction.ownerId !== user.id : transaction.customer !== user.name
    ));
  };
  const saveProfile = (profile: { name: string; email: string; timezone: string }) => {
    setCurrentName(profile.name);
    setCurrentEmail(profile.email);
    setCurrentTimezone(profile.timezone);
    if (currentRole === "ADMIN") {
      localStorage.setItem("fintrack-admin-profile", JSON.stringify(profile));
      return;
    }
    setRegisteredUsers(users => users.map(user => user.id === currentUserId ? { ...user, name: profile.name, email: profile.email, timezone: profile.timezone } : user));
  };
  if (!loggedIn) return <Login users={registeredUsers} onLogin={completeLogin} adminPasswordHash={adminPasswordHash} loggedOut={loggedOut}/>;
  const visibleTransactions = currentRole === "USER"
    ? createdTransactions.filter(transaction => transaction.ownerId === currentUserId || (!transaction.ownerId && transaction.customer === currentName))
    : createdTransactions;
  let content: ReactNode;
  switch(page) {
    case "transactions": content=<Transactions setPage={setPage} transactions={visibleTransactions}/>; break;
    case "alerts": content=<Alerts transactions={visibleTransactions} detectionRules={detectionRules} onSaveRules={setDetectionRules} onUpdateStatus={(transactionId, status) => setCreatedTransactions(transactions => transactions.map(transaction => transaction.id === transactionId ? { ...transaction, status } : transaction))}/>; break;
    case "detail": content=<Detail setPage={setPage}/>; break;
    case "analytics": content=<Analytics transactions={visibleTransactions}/>; break;
    case "users": content=<Users setPage={setPage} users={registeredUsers} onDeleteUser={deleteUser}/>; break;
    case "create-user": content=<CreateUser setPage={setPage} onUserCreated={user => setRegisteredUsers(current => [user, ...current])}/>; break;
    case "change-password": content=<ChangePassword setPage={setPage} verifyCurrent={verifyCurrentPassword} onPasswordChanged={updateCurrentPassword}/>; break;
    case "settings": content=<Settings name={currentName} email={currentEmail} role={currentRole} timezone={currentTimezone} accountId={currentUserId} sessions={loginSessions.filter(session => session.userId === currentUserId).slice(0, 5)} onSave={saveProfile}/>; break;
    case "admin": content=<Admin users={registeredUsers} transactions={createdTransactions} setPage={setPage}/>; break;
    case "create": content=<CreateTransaction setPage={setPage} customer={currentName} ownerId={currentUserId} detectionRules={detectionRules} onTransactionCreated={transaction => setCreatedTransactions(current => [transaction, ...current])}/>; break;
    default: content=<Overview setPage={setPage} transactions={visibleTransactions} name={currentName}/>;
  }
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} role={currentRole} name={currentName} onLogout={logout}/><div className="app-main"><Topbar role={currentRole}/><main className="content">{content}<footer><span>FinTrack Fraud Detection System</span><button onClick={logout}><Icon name="logout" size={14}/> Sign out</button></footer></main></div><MobileNav page={page} setPage={setPage} role={currentRole}/></div>;
}
