import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageStyle from "../main parts/PageStyle";
import { loadULifeData, saveULifeData } from "../../data/ulifeStore";
import "../styles/pages/FeaturePages.css";

function FinanceGroupModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Custom Finance Group");
  const [members, setMembers] = useState("You");
  const [budget, setBudget] = useState("500");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      type: type.trim() || "Custom Finance Group",
      members: members
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean),
      budget: Number(budget) || 500,
    });

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <form className="module-modal" onSubmit={submit}>
        <div className="modal-header">
          <h2>Add Finance Group</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <label>Group name</label>
        <input
          value={name}
          placeholder="Example: Spring Break Trip"
          onChange={(e) => setName(e.target.value)}
        />

        <label>Group type</label>
        <input
          value={type}
          placeholder="Example: Friends Outing"
          onChange={(e) => setType(e.target.value)}
        />

        <label>Members, separated by commas</label>
        <input
          value={members}
          placeholder="You, Alex, Maya"
          onChange={(e) => setMembers(e.target.value)}
        />

        <label>Starting budget / goal</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <button className="modal-submit" type="submit">
          Create Finance Group
        </button>
      </form>
    </div>
  );
}

function GoalCircle({ saved, goal }) {
  const percent = goal > 0 ? Math.min(100, Math.round((saved / goal) * 100)) : 0;

  return (
    <div className="goal-circle-wrapper">
      <div
        className="goal-circle"
        style={{
          background: `conic-gradient(#ef8354 ${percent * 3.6}deg, #e3e6ec 0deg)`,
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
      .reduce((sum, expense) => sum + Number(expense.amount), 0);

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
  const max = Math.max(...trends.map((item) => Number(item.amount)), 1);

  return (
    <div className="bar-chart">
      {trends.map((item) => (
        <div className="bar-column" key={item.month}>
          <div className="bar-wrapper">
            <div
              className="bar-fill"
              style={{ height: `${(Number(item.amount) / max) * 100}%` }}
            />
          </div>

          <strong>${item.amount}</strong>
          <span>{item.month}</span>
        </div>
      ))}
    </div>
  );
}

function FinanceGroupDetails({ group, onBack, onUpdate }) {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidBy, setPaidBy] = useState(group.members[0] || "You");

  const totalSpent = useMemo(() => {
    return group.expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  }, [group.expenses]);

  const remaining = group.budget - totalSpent;

  const updateBudget = (value) => {
    onUpdate({
      ...group,
      budget: Number(value),
      goalAmount: Number(value),
    });
  };

  const updateSavedAmount = (value) => {
    onUpdate({
      ...group,
      savedAmount: Number(value),
    });
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

    onUpdate({
      ...group,
      savedAmount: Math.max(0, Number(group.savedAmount) - amount),
      expenses: [...group.expenses, newExpense],
      trends: group.trends.map((trend) =>
        trend.month === "Apr"
          ? { ...trend, amount: Number(trend.amount) + amount }
          : trend
      ),
    });

    setExpenseName("");
    setExpenseAmount("");
  };

  const addContribution = () => {
    if (!expenseAmount) return;

    const amount = Number(expenseAmount);

    onUpdate({
      ...group,
      savedAmount: Math.min(Number(group.goalAmount), Number(group.savedAmount) + amount),
      trends: group.trends.map((trend) =>
        trend.month === "Apr"
          ? { ...trend, amount: Number(trend.amount) + amount }
          : trend
      ),
    });

    setExpenseName("");
    setExpenseAmount("");
  };

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        ← Back to Finance Groups
      </button>

      <section className="selected-finance-header ombre-panel">
        <div>
          <p className="eyebrow">Selected finance group</p>
          <h2>{group.name}</h2>
          <p>{group.type} • {group.members.length} member(s)</p>
        </div>
      </section>

      <div className="finance-summary-grid">
        <section className="feature-card">
          <h2>Monthly Budget</h2>
          <input
            className="budget-input"
            type="number"
            value={group.budget}
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
          <h2>{group.goalName}</h2>

          <GoalCircle saved={group.savedAmount} goal={group.goalAmount} />

          <label className="finance-label">Amount saved/contributed</label>
          <input
            className="budget-input"
            type="number"
            value={group.savedAmount}
            onChange={(e) => updateSavedAmount(e.target.value)}
          />
        </section>

        <section className="feature-card">
          <h2>Contribution by Groupmate</h2>
          <ContributionChart expenses={group.expenses} members={group.members} />
        </section>

        <section className="feature-card">
          <h2>Money Trends Over Time</h2>
          <SpendingTrendChart trends={group.trends} />
        </section>
      </div>

      <section className="feature-card full-width">
        <h2>Recent Money Activity</h2>

        <div className="input-row finance-input-row">
          <input
            value={expenseName}
            placeholder="Expense or contribution name..."
            onChange={(e) => setExpenseName(e.target.value)}
          />

          <input
            value={expenseAmount}
            type="number"
            placeholder="Amount..."
            onChange={(e) => setExpenseAmount(e.target.value)}
          />

          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            {group.members.map((member) => (
              <option key={member} value={member}>
                Paid by {member}
              </option>
            ))}
          </select>

          <button onClick={addExpense}>Add Expense</button>
          <button onClick={addContribution}>Add Contribution</button>
        </div>

        <div className="saved-list">
          {group.expenses.map((expense) => (
            <div key={expense.id} className="saved-row">
              <div>
                <h3>{expense.name}</h3>
                <p>Paid by {expense.paidBy} • {expense.month}</p>
              </div>

              <strong>${expense.amount}</strong>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function Finances() {
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(loadULifeData());
  const [showModal, setShowModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupId = params.get("group");

    if (groupId) {
      setSelectedGroupId(groupId);
    }
  }, [location.search]);

  const updateData = (updated) => {
    saveULifeData(updated);
    setData(updated);
  };

  const selectedGroup = data.financeGroups.find((group) => group.id === selectedGroupId);

  const createFinanceGroup = (group) => {
    const newGroup = {
      id: `finance-${Date.now()}`,
      name: group.name,
      type: group.type,
      pinned: false,
      members: group.members.length ? group.members : ["You"],
      budget: group.budget,
      goalName: "Savings Goal",
      goalAmount: group.budget,
      savedAmount: 0,
      expenses: [],
      trends: [
        { month: "Jan", amount: 0 },
        { month: "Feb", amount: 0 },
        { month: "Mar", amount: 0 },
        { month: "Apr", amount: 0 },
      ],
    };

    updateData({
      ...data,
      financeGroups: [...data.financeGroups, newGroup],
    });
  };

  const togglePin = (id) => {
    updateData({
      ...data,
      financeGroups: data.financeGroups.map((group) =>
        group.id === id ? { ...group, pinned: !group.pinned } : group
      ),
    });
  };

  const updateGroup = (updatedGroup) => {
    updateData({
      ...data,
      financeGroups: data.financeGroups.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group
      ),
    });
  };

  const openGroup = (id) => {
    setSelectedGroupId(id);
    navigate(`/finances?group=${id}`);
  };

  const goBack = () => {
    setSelectedGroupId(null);
    navigate("/finances");
  };

  const deleteFinanceGroup = (id) => {
    const remainingGroups = data.financeGroups.filter((group) => group.id !== id);

    const updated = {
      ...data,
      financeGroups: remainingGroups,
    };

    saveULifeData(updated);
    setData(updated);

    if (selectedGroupId === id) {
      setSelectedGroupId(remainingGroups[0]?.id || null);
    }
  };

  return (
    <PageStyle>
      <div className="page-title-row">
        <div>
          <h1>Finances</h1>
          <p>
            Create finance groups first. Click a group to see budget details,
            money goals, contribution charts, and spending trends.
          </p>
        </div>

        <button className="primary-action" onClick={() => setShowModal(true)}>
          + Add Finance Group
        </button>
      </div>

      {!selectedGroup && (
        <>
          <section className="finance-groups-section">
            <h2>Finance Groups</h2>

            <div className="finance-group-grid">
              {data.financeGroups.map((group) => (
                <article key={group.id} className="finance-group-card">
                  <button
                    className="finance-card-main"
                    onClick={() => openGroup(group.id)}
                  >
                    <div className="finance-group-icon">$</div>

                    <div>
                      <h3>{group.name}</h3>
                      <p>{group.type}</p>
                      <span>{group.members.length} member(s)</span>
                    </div>
                  </button>

                  <div className="card-actions">
                    <button
                      className={group.pinned ? "pin-btn pinned finance-pin" : "pin-btn finance-pin"}
                      onClick={() => togglePin(group.id)}
                    >
                      {group.pinned ? "📌 Pinned" : "📍 Pin"}
                    </button>

                    <button
                      className="delete-module-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // 🚨 VERY IMPORTANT
                        deleteFinanceGroup(group.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}

              <button className="empty-add-box" onClick={() => setShowModal(true)}>
                <span>+</span>
                <p>Add finance group</p>
              </button>
            </div>
          </section>
        </>
      )}

      {selectedGroup && (
        <FinanceGroupDetails
          group={selectedGroup}
          onBack={goBack}
          onUpdate={updateGroup}
        />
      )}

      {showModal && (
        <FinanceGroupModal
          onClose={() => setShowModal(false)}
          onCreate={createFinanceGroup}
        />
      )}
    </PageStyle>
  );
}

export default Finances;