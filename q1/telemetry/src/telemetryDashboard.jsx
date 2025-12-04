import React, { useMemo, useState, useEffect } from "react";
import rawData from "./telemetry_sample.json";
import { cleanTelemetry } from "./utility-functions/cleanTelemetry";
import "./TelemetryDashboard.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function TelemetryDashboard() {
    const fullData = useMemo(() => cleanTelemetry(rawData), []);
    const [dataIndex, setDataIndex] = useState(0);
    const [currentData, setCurrentData] = useState([]);
    const delayTime = 500;

	// animate through the dataset
    useEffect(() => {
        if (!fullData.length) return;

        const interval = setInterval(() => {
            setCurrentData(fullData.slice(0, dataIndex + 1));
            setDataIndex((prev) => {
                if (prev >= fullData.length - 1) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + 1;
            });
        }, delayTime);

        return () => clearInterval(interval);
    }, [fullData, dataIndex]);

    const latest = currentData.length > 0 ? currentData[currentData.length - 1] : {};

    const displayValue = (val, fallback = "-") => val != null ? val.toFixed(1) : fallback;

	const isOverheat = typeof latest.motorTemp === "number" && latest.motorTemp > 90;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="tooltip-label">
                        {new Date(label).toLocaleTimeString()}
                    </p>
                    {payload.map((entry, index) => (
                        <p key={index} className="tooltip-value" style={{ color: entry.color }}>
                            {entry.name}: {entry.value?.toFixed(1)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-wrapper">
				{/* header */}
                <h1 className="dashboard-header">Vehicle Telemetry Dashboard</h1>

				{/* metrics cards */}
                <div className="metrics-grid">
					{/* speed card */}
                    <div className="metric-card">
                        <div className="metric-icon speed">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="icon-speed" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div className="metric-label">Speed</div>
                        <div className="metric-value">
                            {displayValue(latest.speed)} <span className="metric-unit">km/h</span>
                        </div>
                    </div>

					{/* battery card */}
                    <div className="metric-card">
                        <div className="metric-icon battery">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="icon-battery" strokeWidth="2">
                                <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
                                <line x1="23" y1="13" x2="23" y2="11" />
                            </svg>
                        </div>
                        <div className="metric-label">Battery</div>
                        <div className="metric-value">
                            {displayValue(latest.battery)} <span className="metric-unit">%</span>
                        </div>
                    </div>

					{/* motor temperature card */}
                    <div className={`metric-card ${isOverheat ? "overheat" : ""}`}>
                        <div className="metric-icon temperature">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="icon-temperature" strokeWidth="2">
                                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                            </svg>
                        </div>
                        <div className="metric-label">Motor Temperature</div>
                        <div className="metric-value">
                            {displayValue(latest.motorTemp)} <span className="metric-unit">°C</span>
                        </div>
                    </div>

					{/* gps location card */}
                    <div className="metric-card">
                        <div className="metric-icon gps">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="icon-gps" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                            </svg>
                        </div>
                        <div className="metric-label">GPS Location</div>
                        {latest.gps ? (
                            <div className="metric-coordinates">
                                {latest.gps.lat.toFixed(4)}, {latest.gps.lng.toFixed(4)}
                            </div>
                        ) : (
                            <div className="metric-no-signal">No Signal</div>
                        )}
                    </div>
                </div>

				{/* charts */}
                <div className="charts-grid">
					{/* speed chart */}
                    <div className="chart-card">
                        <h3 className="chart-title">Speed Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={currentData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                                    stroke="#9ca3af"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="speed"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Speed (km/h)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
					
					{/* battery chart */}
                    <div className="chart-card">
                        <h3 className="chart-title">Battery Level Over Time</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={currentData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="timestamp"
                                    tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                                    stroke="#9ca3af"
                                    style={{ fontSize: "12px" }}
                                />
                                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="battery"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                    name="Battery (%)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
				
				{/* motor temperature chart */}
                <div className="chart-card full-width">
                    <h3 className="chart-title">Motor Temperature Over Time</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={currentData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(t) => new Date(t).toLocaleTimeString()}
                                stroke="#9ca3af"
                                style={{ fontSize: "12px" }}
                            />
                            <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="motorTemp"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={false}
                                name="Motor Temp (°C)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

				{/* warning alert */}
                {latest.motorTemp > 90 && (
                    <div className="warning-alert">
                        Warning: Motor temperature exceeds 90°C!
                    </div>
                )}
            </div>
        </div>
    );
}
