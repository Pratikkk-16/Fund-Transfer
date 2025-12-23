import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { fetchBalance, fetchHistory, submitTransfer } from "./api";
import TransferForm from "./components/TransferForm";
import TransactionHistory from "./components/TransactionHistory";

const SENDER_ID = 1;

function App() {
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  const loadData = async () => {
    try {
      setError("");
      const [balanceRes, historyRes] = await Promise.all([
        fetchBalance(SENDER_ID),
        fetchHistory(SENDER_ID),
      ]);
      setBalance(balanceRes.balance);
      setHistory(historyRes.history);
    } catch (err) {
      setError(err.message || "Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransfer = async ({ receiverId, amount }) => {
    try {
      setLoading(true);
      setError("");
      await submitTransfer({ receiverId, amount });
      await loadData();
    } catch (err) {
      setError(err.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const direction = prev.key === key && prev.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };

  const senderBalanceText = useMemo(() => {
    if (!balance) return "—";
    return `$${Number(balance.balance).toFixed(2)}`;
  }, [balance]);

  return (
    <div className="layout">
      <header className="header">
        <div>
          <p className="eyebrow">Real-time Transaction & Audit Log</p>
          <h1>Peer-to-Peer Transfer</h1>
          <p className="subhead">
            Sender is fixed to user #{SENDER_ID}. Transfers are atomic and logged immutably.
          </p>
        </div>
        <div className="balance-card">
          <p className="eyebrow">Current Balance</p>
          <h2>{senderBalanceText}</h2>
          {balance?.name && <p className="hint">{balance.name}</p>}
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      <div className="grid">
        <TransferForm onSubmit={handleTransfer} loading={loading} />
        <TransactionHistory history={history} sortConfig={sortConfig} onSort={handleSort} />
      </div>
    </div>
  );
}

export default App;
