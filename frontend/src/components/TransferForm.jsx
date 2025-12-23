import { useState } from "react";

function TransferForm({ onSubmit, loading }) {
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      receiverId: Number(receiverId),
      amount: Number(amount),
    });
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="receiverId">Receiver ID</label>
        <input
          id="receiverId"
          type="number"
          min="1"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="amount">Amount</label>
        <input
          id="amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Send Funds"}
      </button>
    </form>
  );
}

export default TransferForm;

