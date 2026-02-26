import { h } from 'preact';
import { useState } from 'preact/hooks';
import { route } from 'preact-router';
import "./Deposit.css";
import { useBack } from '../useBack'; // back hook

const agents = {
  bkash: '017XXXXXXXX',
  nagad: '018XXXXXXXX'
};

export default function DepositPage() {
  const [method, setMethod] = useState('');
  const [number, setNumber] = useState('');
  const [amount, setAmount] = useState('');

  const showAgent = agents[method] || '';

  const back = useBack('/spa'); // fallback home

  const submitTransaction = () => {
    if (!method || !number || !amount) {
      alert('সব তথ্য পূরণ করুন');
      return;
    }
    alert(`${method.toUpperCase()} - ${amount}৳ Submitted`);
    back();
  };

  return (
    <div className="full-screen-modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="back-btn" onClick={back}>←</span>
          <h2>Deposit</h2>
        </div>

        <div className="modal-body">
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Select</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
          </select>

          {showAgent && (
            <div className="agent-number">
              Agent Number: <span>{showAgent}</span>
            </div>
          )}

          {showAgent && (
            <div className="notice-bar">
              Cash Out করতে হলে agent number ব্যবহার করুন।
            </div>
          )}

          <input
            type="text"
            placeholder="আপনার মোবাইল নাম্বার"
            value={number}
            onInput={(e) => setNumber(e.target.value)}
          />
          <input
            type="number"
            placeholder="৳ Amount"
            min="1"
            value={amount}
            onInput={(e) => setAmount(e.target.value)}
          />

          <button className="submit-btn" onClick={submitTransaction}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}