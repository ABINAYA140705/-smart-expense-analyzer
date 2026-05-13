def generate_insights(expenses, budgets=None):
    insights = []

    if not expenses:
        return ["No expenses found. Add expenses to generate insights."]

    total = sum(item["amount"] for item in expenses)

    category_totals = {}
    for item in expenses:
        cat = item["category"]
        category_totals[cat] = category_totals.get(cat, 0) + item["amount"]

    # Budget alerts
    if budgets:
        budget_map = {b["category"]: b["monthly_limit"] for b in budgets}
        for cat, spent in category_totals.items():
            if cat in budget_map:
                limit = budget_map[cat]
                pct = (spent / limit) * 100
                if pct >= 100:
                    insights.append(f"🚨 BUDGET EXCEEDED in {cat}! You spent ₹{spent:.0f} against your ₹{limit:.0f} limit ({pct:.0f}%). Stop spending immediately.")
                elif pct >= 80:
                    insights.append(f"⚠ Budget warning for {cat}: {pct:.0f}% used (₹{spent:.0f} of ₹{limit:.0f}). You have only ₹{limit - spent:.0f} left.")

    # Spending pattern insights
    for category, amount in category_totals.items():
        percentage = (amount / total) * 100
        if percentage > 35:
            saving = amount * 0.15
            insights.append(f"High spending in {category} ({percentage:.1f}% of total). Reducing by 15% saves ₹{saving:.0f} this month.")
        elif percentage > 20:
            insights.append(f"Moderate spending in {category} ({percentage:.1f}% of total). Monitor this category regularly.")

    if total > 10000:
        insights.append(f"Total spending ₹{total:.0f} is high. Consider setting a monthly budget limit per category.")

    top_cat = max(category_totals, key=category_totals.get)
    insights.append(f"Your highest expense category is {top_cat} at ₹{category_totals[top_cat]:.0f}.")

    if not insights:
        insights.append("Your spending pattern looks balanced. Keep tracking regularly!")

    return insights
