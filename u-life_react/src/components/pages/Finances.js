import React, { useMemo, useState } from "react";
import PageStyle from "../main parts/PageStyle";
import "../styles/pages/FeaturePages.css";

const initialFinanceGroups = [
  {
    id: 1,
    name: "Roommate Budget",
    type: "Shared Housing",
    members: ["You", "Alex", "Maya", "Jordan"],
    goalName: "Monthly Rent & Bills",
    goalAmount: 1800,
    savedAmount: 1245,
    budget: 1800,
    expenses: [
      { id: 1, name: "Rent", amount: 900, paidBy: "You", month: "Jan" },
      { id: 2, name: "Groceries", amount: 145, paidBy: "Alex", month: "Feb" },
      { id: 3, name: "Utilities", amount: 120, paidBy: "Maya", month: "Mar" },
      { id: 4, name: "Internet", amount: 80, paidBy: "Jordan", month: "Apr" },
    ],
    trends: [
      { month: "Jan", amount: 850 },
      { month: "Feb", amount: 970 },
      { month: "Mar", amount: 910 },
      { month: "Apr", amount: 1040 },
    ],
  },
  {
    id: 2,
    name: "Weekend Adventures",
    type: "Friends Outing",
    members: ["You", "Brian", "Sofia"],
    goalName: "Trip Fund",
    goalAmount: 600,
    savedAmount: 330,
    budget: 600,
    expenses: [
      { id: 1, name: "Gas", amount: 60, paidBy: "You", month: "Jan" },
      { id: 2, name: "Snacks", amount: 45, paidBy: "Brian", month: "Feb" },
      { id: 3, name: "Tickets", amount: 150, paidBy: "Sofia", month: "Mar" },
    ],
    trends: [
      { month: "Jan", amount: 80 },
      { month: "Feb", amount: 120 },
      { month: "Mar", amount: 220 },
      { month: "Apr", amount: 150 },
    ],
  },
  {
    id: 3,
    name: "Self Budgeting",
    type: "Personal Budget",
    members: ["You"],
    goalName: "Emergency Fund",
    goalAmount: 1000,
    savedAmount: 420,
    budget: 1200,
    expenses: [
      { id: 1, name: "Food", amount: 220, paidBy: "You", month: "Jan" },
      { id: 2, name: "Textbooks", amount: 90, paidBy: "You", month: "Feb" },
      { id: 3, name: "Transportation", amount: 65, paidBy: "You", month: "Mar" },
    ],
    trends: [
      { month: "Jan", amount: 320 },
      { month: "Feb", amount: 410 },
      { month: "Mar", amount: 350 },
      { month: "Apr", amount: 280 },
    ],
  },
];

function GoalCircle({ saved, goal }) {
  const percent = Math.min(100, Math.round((saved / goal) * 100));

  return (
    <div className="goal-circle-wrapper">
      <div
        className="goal-circle"
        style={{
          background: `conic-gradient(#669bbc ${percent * 3.6}deg, #e3e6ec 0deg)`,
        }}
      >
        <div className="goal-circle-inner">
          <strong>{percent}%</strong>
          <span>${saved} / ${goal}</span>
        </div>
      </div>
    </div>
  );
}

function ContributionChart({ expenses, members }) {
  const totals = members.map((member) => {
    const total = expenses
      .filter((expense) => expense.paidBy === member)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return { member, total };
  });

  const max = Math.max(...totals.map((item) => item.total), 1);

  return (
    <div className="contribution-chart">
      {totals.map((item) => (
        <div className="contribution-row" key={item.member}>
          <span>{item.member}</span>
          <div className="contribution-track">
            <div
              className="contribution-fill"
              style={{ width: `${(item.total / max) * 100}%` }}
            />
          </div>
          <strong>${item.total}</strong>
        </div>
      ))}
    </div>
  );
}

function SpendingTrendChart({ trends }) {
  const max = Math.max(...trends.map((item) => item.amount), 1);

  return (
    <div className="bar-chart">
      {trends.map((item) => (
        <div className="bar-column" key={item.month}>
          <div className="bar-wrapper">
            <div
              className="bar-fill"
              style={{ height: `${(item.amount / max) * 100}%` }}
            />
          </div>
          <strong>${item.amount}</strong>
          <span>{item.month}</span>
        </div>
      ))}
    </div>
  );
}

function Finances() {
  const [financeGroups, setFinanceGroups] = useState(initialFinanceGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(initialFinanceGroups[0].id);

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidBy, setPaidBy] = useState("You");

  const selectedGroup = financeGroups.find((group) => group.id === selectedGroupId);

  const totalSpent = useMemo(() => {
    return selectedGroup.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [selectedGroup]);

  const remaining = selectedGroup.budget - totalSpent;

  const addFinanceGroup = () => {
    const name = prompt("Finance group name:");
    if (!name || !name.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: name.trim(),
      type: "Custom Finance Group",
      members: ["You"],
      goalName: "Savings Goal",
      goalAmount: 500,
      savedAmount: 0,
      budget: 500,
      expenses: [],
      trends: [
        { month: "Jan", amount: 0 },
        { month: "Feb", amount: 0 },
        { month: "Mar", amount: 0 },
        { month: "Apr", amount: 0 },
      ],
    };

    setFinanceGroups([...financeGroups, newGroup]);
    setSelectedGroupId(newGroup.id);
  };

  const addExpense = () => {
  if (!expenseName.trim() || !expenseAmount) return;

  const amount = Number(expenseAmount);

  const newExpense = {
    id: Date.now(),
    name: expenseName.trim(),
    amount,
    paidBy,
    month: "Apr",
  };

  setFinanceGroups(
    financeGroups.map((group) => {
      if (group.id !== selectedGroupId) return group;

      const updatedSavedAmount = Math.max(0, group.savedAmount - amount);

      return {
        ...group,

        savedAmount: updatedSavedAmount,

        expenses: [...group.expenses, newExpense],

        trends: group.trends.map((trend) =>
          trend.month === "Apr"
            ? { ...trend, amount: trend.amount + amount }
            : trend
        ),
      };
    })
  );

  setExpenseName("");
  setExpenseAmount("");
};

  const updateBudget = (newBudget) => {
    setFinanceGroups(
      financeGroups.map((group) =>
        group.id === selectedGroupId
          ? { ...group, budget: Number(newBudget), goalAmount: Number(newBudget) }
          : group
      )
    );
  };

  const updateSavedAmount = (newSavedAmount) => {
    setFinanceGroups(
      financeGroups.map((group) =>
        group.id === selectedGroupId
          ? { ...group, savedAmount: Number(newSavedAmount) }
          : group
      )
    );
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Finances</h1>
          <p>
            Create financial groups, track shared budgets, view contributions,
            and monitor spending trends.
          </p>
        </div>

        <button className="primary-action" onClick={addFinanceGroup}>
          + New Finance Group
        </button>
      </div>

      <section className="finance-groups-section">
        <h2>Finance Groups</h2>

        <div className="finance-group-grid">
          {financeGroups.map((group) => (
            <button
              key={group.id}
              className={
                selectedGroupId === group.id
                  ? "finance-group-card selected"
                  : "finance-group-card"
              }
              onClick={() => {
                setSelectedGroupId(group.id);
                setPaidBy(group.members[0]);
              }}
            >
              <div className="finance-group-icon">$</div>
              <div>
                <h3>{group.name}</h3>
                <p>{group.type}</p>
                <span>{group.members.length} member(s)</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="selected-finance-header">
        <div>
          <p className="eyebrow">Selected group</p>
          <h2>{selectedGroup.name}</h2>
          <p>{selectedGroup.type}</p>
        </div>
      </section>

      <div className="finance-summary-grid">
        <section className="feature-card">
          <h2>Monthly Budget</h2>
          <input
            className="budget-input"
            type="number"
            value={selectedGroup.budget}
            onChange={(e) => updateBudget(e.target.value)}
          />
        </section>

        <section className="feature-card">
          <h2>Total Spent</h2>
          <div className="finance-number">${totalSpent}</div>
        </section>

        <section className="feature-card">
          <h2>Remaining</h2>
          <div className={remaining >= 0 ? "finance-number positive" : "finance-number negative"}>
            ${remaining}
          </div>
        </section>
      </div>

      <div className="finance-analytics-grid">
        <section className="feature-card">
          <h2>{selectedGroup.goalName}</h2>
          <GoalCircle saved={selectedGroup.savedAmount} goal={selectedGroup.goalAmount} />

          <label className="finance-label">Amount saved/contributed</label>
          <input
            className="budget-input"
            type="number"
            value={selectedGroup.savedAmount}
            onChange={(e) => updateSavedAmount(e.target.value)}
          />
        </section>

        <section className="feature-card">
          <h2>Contribution by Groupmate</h2>
          <ContributionChart
            expenses={selectedGroup.expenses}
            members={selectedGroup.members}
          />
        </section>

        <section className="feature-card">
          <h2>Money Trends Over Time</h2>
          <SpendingTrendChart trends={selectedGroup.trends} />
        </section>
      </div>

      <section className="feature-card full-width">
        <h2>Recent Expenses</h2>

        <div className="input-row finance-input-row">
          <input
            value={expenseName}
            placeholder="Expense name..."
            onChange={(e) => setExpenseName(e.target.value)}
          />

          <input
            value={expenseAmount}
            type="number"
            placeholder="Amount..."
            onChange={(e) => setExpenseAmount(e.target.value)}
          />

          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            {selectedGroup.members.map((member) => (
              <option key={member} value={member}>
                Paid by {member}
              </option>
            ))}
          </select>

          <button onClick={addExpense}>Add Transaction</button>
        </div>

        <div className="saved-list">
          {selectedGroup.expenses.map((expense) => (
            <div key={expense.id} className="saved-row">
              <div>
                <h3>{expense.name}</h3>
                <p>
                  Paid by {expense.paidBy} • {expense.month}
                </p>
              </div>
              <strong>${expense.amount}</strong>
            </div>
          ))}
        </div>
      </section>
    </PageStyle>
  );
}

export default Finances;