# 🗣️ Articulate
## Regain Your Voice

---

## 🧠 Inspiration  
With 29.9 million Americans reporting having difficulty with their voice due to ALS, cancer, stroke, or other conditions, there's an undeniable part of our society that has trouble keeping up with communications and more importantly making it feel personable to them. Current assertive tools are often expensive, impersonal and lack the emotional connection that comes naturally from your own voice. We saw how people losing their voice not only lost the ability to speak but also their identity, connection to community and self-expression.

**Who is affected:**
- People with progressive neurological conditions (such as ALS and Parkinson's)
- Cancer Patients
- Patients recovering from strokes
- People at risk of losing their voice in the future
- Hard of Hearing

**Why it matters:**
Our voices are a part of who we are, in a society of social individuals. When people lose their ability to speak, we don't meet them where they're at and they don't just lose communication, they lose a fundamental aspect of themselves.

---

## 🎯 What It Does
Articulate is an AI-powered voice preservation and communication platform that enables users to:
1. Preserve their voice for future use before its gone through ElevenLabs API
2. Generate speech from text using their personal voice
3. Interpret ASL fingerspelling to convert to speech in real time
4. Communicate with eye gaze for those with limited mobility

**Key flows:**
- Bank your voice early with a few minutes of recordings that can create your voice for ever
- Type or sign to speak in your own voice
- Access communication tools adapted to you

---

## 🔍 Main Features  
- Voice Preservation: upload a short audio sample that can generate unlimited speech
- Text-to-Speech: type messages to be spoke in with your natural intonation
- ASL Fingerspelling: record or upload signing videos to cover to speech automatically  
- See to Speak: navigate and type using eye movements for users with limited mobility
- Terms and Ethics: build in ethical and consent requirements to prevent misuse, in addition to Auth0 for user security and privacy.

---

## 🏗️ How We Built It 
**Frontend:**
- React with SPA navigation
- FramerMotion for animation
- Custom liquid lava lamp background
- Lucide react for icons
- Terms and Conditions consent check box
- Custom login page consistent with branding

**Backend:**
- Node.js
- Flask, Gemini API and python for ASL processing
- ElevenLabs API for voice cloning and text to speech 
- MediaRecorderAPI for video capture
- Auth0 for user authentication
- Axios for HTTP requests
- npm for package manager

---

## 🧩 Technical Challenges 
**Challenge 1: Real-time ASL processing:**
Processing the videos for ASL fingerspelling requires balancing accuracy and speed. We implemented frame sampling and optimized a ML pipeline to achieve real-time results.

**Challenge 2: Voice quality and balancing processing time:**
ElevenLabs provides voice cloning but with latency so we added loading states and cached voice IDs.

**Challenge 3: Ethical considerations:**
Voice cloning can raise serious ethical concerns which is why we made a mandatory terms and conditions agreement to explain user guidelines and outline what prohibited use cases would be.

**Challenge 4: Accessibility-first:**
Creating an interface to accommodate the many forms of alternative communication was important to allow usability by people with varying abilities required consideration of contrast, button size and alternative input methods to use your voice.

---

## 🎉 Accomplishments and Highlights  
- Fully functional platform in under 24 hours
- Successful integration of voice cloning, ASL interpretation, text to speech and see to speech
- Real-time video processing and responsiveness

---

## 📚 What We Learned  
- Voice AI and the ethics around this technology
- Accessibility design
- React patterns
- API integration
- Real-time processing with accuracy and speed in ML pipelines  

**We were surprised by:**
- how little audio is needed for voices with natural intonation
- complexity of fingerspelling recognition
- browser limitations for camera/audio access

---

## 🔭 What’s Next / Future Work  
- Mobile app
- Offline mode
- Complete ASL interpretation beyond fingerspelling  

---

## 🚀 Try It Out 
- URL 
- GitHub    

---

## 🧾 Acknowledgments & References  
- ElevenLabs for voice cloning 
- Auth0 for authentication  
- MediaPipe/Tensor Flow for ASL detection  

---

## ⚠️ Known Limitations / Risks  
**Current limitations: **
- Video File size limit of 100MB 
- Quality depends on input audio  
- Limited to fingerspelling  
- Requires online connection 

**Ethical Risks we mitigated:**
- Voice impersonation mitigated through consent requirements and ElevenLabs verification
- DeepFake abuse mitigated through terms that prohibit malicious use
- Privacy concerns mitigated through secure data storing 

---

## 📈 Impact Metrics

**Potential users:**
- 29.9 million Americans with voice difficulties
- 5,000 new ALS diagnoses per year
- 13,000 new laryngeal cancer diagnoses per year 

**User value:**
- Voice preservation in less than 5 minutes
- Communication at natural speaking tone and pace
- Maintain self-expression
- Cost savings over Augmentative and Alternative Communication Devices

---
