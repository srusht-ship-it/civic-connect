import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './VoiceRecorder.css';

const VoiceRecorder = ({ onRecordingComplete, onTranscriptionUpdate }) => {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US'; // You can make this dynamic based on selected language
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscription(fullTranscript);
        if (onTranscriptionUpdate) {
          onTranscriptionUpdate(fullTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsTranscribing(false);
      };

      recognitionRef.current.onend = () => {
        setIsTranscribing(false);
      };
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onTranscriptionUpdate]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        if (onRecordingComplete) {
          onRecordingComplete(audioBlob, audioUrl);
        }

        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Start speech recognition for real-time transcription
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsTranscribing(true);
      }

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }
  };

  const playRecording = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const clearRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setTranscription('');
    setIsPlaying(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="voice-recorder">
      <div className="voice-recorder-header">
        <h3>{t('voiceReport')}</h3>
        <p className="voice-help-text">{t('recordingHelp')}</p>
      </div>

      <div className="recording-controls">
        {!isRecording ? (
          <button
            className="record-btn start"
            onClick={startRecording}
            disabled={isRecording}
          >
            <span className="record-icon">🎤</span>
            {t('startRecording')}
          </button>
        ) : (
          <button
            className="record-btn stop"
            onClick={stopRecording}
          >
            <span className="record-icon">⏹️</span>
            {t('stopRecording')}
          </button>
        )}

        {isRecording && (
          <div className="recording-status">
            <div className="recording-indicator">
              <div className="pulse-dot"></div>
              <span>{t('recording')}</span>
            </div>
            <div className="recording-timer">
              {formatTime(recordingTime)}
            </div>
          </div>
        )}
      </div>

      {audioUrl && (
        <div className="recording-playback">
          <div className="playback-controls">
            <button
              className="play-btn"
              onClick={playRecording}
            >
              <span className="play-icon">{isPlaying ? '⏸️' : '▶️'}</span>
              {isPlaying ? 'Pause' : t('playRecording')}
            </button>
            
            <div className="recording-info">
              <span className="recording-duration">{formatTime(recordingTime)}</span>
              <button className="clear-btn" onClick={clearRecording}>
                <span className="clear-icon">🗑️</span>
                Clear
              </button>
            </div>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={handleAudioEnded}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* Real-time Transcription Display */}
      {(isTranscribing || transcription) && (
        <div className="transcription-section">
          <div className="transcription-header">
            <h4>Live Transcription</h4>
            {isTranscribing && <div className="transcribing-indicator">🎯</div>}
          </div>
          <div className="transcription-text">
            {transcription || (isTranscribing ? "Listening..." : "No transcription available")}
          </div>
        </div>
      )}

      {/* Audio Waveform Visualization */}
      {isRecording && (
        <div className="audio-visualizer">
          <div className="wave-bars">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="wave-bar" style={{
                animationDelay: `${index * 0.1}s`
              }}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;