import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { feedbackApi } from '@/db/api';
import { toast } from 'sonner';

type ChatStep = 'welcome' | 'name' | 'contact' | 'looking_for' | 'problems' | 'thank_you';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<ChatStep>('welcome');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    looking_for: '',
    problems_faced: '',
  });

  // Check if user has already completed the survey
  useEffect(() => {
    const surveyCompleted = localStorage.getItem('chatbot_survey_completed');
    const autoOpened = sessionStorage.getItem('chatbot_auto_opened');
    
    if (surveyCompleted === 'true') {
      return; // Don't auto-open if survey already completed
    }

    if (autoOpened !== 'true') {
      // Auto-open after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
        sessionStorage.setItem('chatbot_auto_opened', 'true');
        addBotMessage('👋 Hi there! Welcome to StayNearby! I\'m here to help you find the perfect accommodation. May I ask you a few quick questions?');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { text, isBot: true, timestamp: new Date() }]);
      setIsTyping(false);
    }, 500);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, isBot: false, timestamp: new Date() }]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      addBotMessage('👋 Hi there! Welcome to StayNearby! I\'m here to help you find the perfect accommodation. May I ask you a few quick questions?');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNextStep = async () => {
    if (!inputValue.trim() && currentStep !== 'welcome') return;

    // Add user message
    if (currentStep !== 'welcome') {
      addUserMessage(inputValue);
    }

    // Process based on current step
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('name');
        addBotMessage('Great! Let\'s start. What\'s your name?');
        break;

      case 'name':
        setFormData((prev) => ({ ...prev, name: inputValue }));
        setCurrentStep('contact');
        addBotMessage(`Nice to meet you, ${inputValue}! 😊 What\'s the best way to contact you? (Email or Phone)`);
        break;

      case 'contact':
        setFormData((prev) => ({ ...prev, contact: inputValue }));
        setCurrentStep('looking_for');
        addBotMessage('Perfect! What type of accommodation are you looking for? (PG, Flat, Hostel, or Room)');
        break;

      case 'looking_for':
        setFormData((prev) => ({ ...prev, looking_for: inputValue }));
        setCurrentStep('problems');
        addBotMessage('Got it! Have you faced any challenges or problems while searching for accommodation? Feel free to share your experience.');
        break;

      case 'problems':
        setFormData((prev) => ({ ...prev, problems_faced: inputValue }));
        await submitFeedback(inputValue);
        break;

      default:
        break;
    }

    setInputValue('');
  };

  const submitFeedback = async (problemsFaced: string) => {
    try {
      await feedbackApi.submitFeedback({
        name: formData.name,
        contact: formData.contact,
        looking_for: formData.looking_for,
        problems_faced: problemsFaced || null,
      });

      setCurrentStep('thank_you');
      addBotMessage(`Thank you so much for your valuable feedback, ${formData.name}! 🙏 Your insights will help us improve our platform. We'll reach out to you soon at ${formData.contact}. Happy house hunting! 🏠`);
      
      // Mark survey as completed
      localStorage.setItem('chatbot_survey_completed', 'true');

      // Auto-close after 5 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNextStep();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] shadow-2xl z-50 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-lg font-semibold">StayNearby Assistant</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 hover:bg-primary-light"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          {currentStep !== 'thank_you' && (
            <div className="p-4 border-t">
              {currentStep === 'welcome' ? (
                <Button onClick={handleNextStep} className="w-full">
                  Let's Get Started! 🚀
                </Button>
              ) : currentStep === 'problems' ? (
                <div className="space-y-2">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Share your experience (optional)..."
                    className="min-h-[80px] resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setInputValue('No problems so far');
                        setTimeout(() => handleNextStep(), 100);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Skip
                    </Button>
                    <Button onClick={handleNextStep} className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type your answer..."
                    className="flex-1"
                  />
                  <Button onClick={handleNextStep} size="icon" disabled={!inputValue.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </>
  );
};

export default ChatBot;
