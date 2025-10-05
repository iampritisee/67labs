import React, { useState } from "react";
import VoiceClone from "./VoiceClone";
import TextToSpeech from "./TextToSpeech";
import ASLTracker from "./ASLTracker";
import { motion } from "framer-motion";
import SeeToSpeech from "./SeeToSpeech";  

export default function Dashboard() {
  const [tab, setTab] = useState("clone");

  const tabs = [
  { id: "clone", label: "Voice Clone", icon: "🎤" },
  { id: "tts", label: "Text → Speech", icon: "💬" },
  { id: "asl", label: "ASL Interpreter", icon: "👋" },
  { id: "see", label: "See to Speech", icon: "👁️" } 
  ];

  return (
    <div className="main-container">
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to 6 7 Labs</h1>
        <p>Unlock Your Voice with AI technology at your fingertips</p>
      </div>

      {/* Modern Tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div className="tab-container">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-item ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Animated Content Area */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="content-card fade-in"
      >
        {tab === "clone" && <VoiceClone />}
        {tab === "tts" && <TextToSpeech />}
        {tab === "asl" && <ASLTracker />}
        {tab === "see" && <SeeToSpeech />} 
      </motion.div>
    </div>
  );
}