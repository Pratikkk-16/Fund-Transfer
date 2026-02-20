function TransactionHistory({ history, sortConfig, onSort }) {
  const handleSort = (key) => {
    onSort(key);
  };

  const formatAmount = (amount) => Number(amount).toFixed(2);

  const formatDate = (date) => new Date(date).toLocaleString();

  const sortedHistory = [...history].sort((a, b) => {
    const { key, direction } = sortConfig;
    let aVal = a[key];
    let bVal = b[key];

    if (key === "createdAt") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="card">
      <div className="table-header">
        <h3>Transaction History</h3>
        <p className="hint">Click headers to sort</p>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("createdAt")}>Timestamp</th>
              <th onClick={() => handleSort("senderId")}>Sender</th>
              <th onClick={() => handleSort("receiverId")}>Receiver</th>
              <th onClick={() => handleSort("amount")}>Amount</th>
              <th onClick={() => handleSort("status")}>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedHistory.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No transactions yet.
                </td>
              </tr>
            )}
            {sortedHistory.map((log) => (
              <tr key={log.id}>
                <td>{formatDate(log.createdAt)}</td>
                <td>{log.sender?.name || `#${log.senderId}`}</td>
                <td>{log.receiver?.name || `#${log.receiverId}`}</td>
                <td className="amount">₹{formatAmount(log.amount)}</td>
                <td>
                  <span className="pill success">{log.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;

