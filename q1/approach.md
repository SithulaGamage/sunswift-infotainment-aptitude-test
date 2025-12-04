## Approach

For this telemetry dashboard, I wanted to make the key vehicle metrics—speed, battery, and motor temperature—easy to see at a glance. I built top-level cards to show the current values and line charts below to track how they change over time. The dashboard animates through the dataset using React hooks so you can see the latest data update in real time. I also added conditional styling, like making the motor temperature card turn red if it goes over 90°C. Overall, I tried to keep it simple, readable, and easy to expand if we want to add more telemetry later.
