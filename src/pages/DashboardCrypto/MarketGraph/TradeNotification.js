import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  Badge, 
  Card, 
  CardBody, 
  Row, 
  Col,
  Button
} from 'reactstrap';
// import { formatBalance } from '../../../utils/balanceSync';

const TradeNotification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Play sound based on result
      playNotificationSound(notification.result);
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  const playNotificationSound = (result) => {
    try {
      // Create audio context for sound effects
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      if (result === 'win') {
        // Play success sound (ascending tones)
        playTone(audioContext, 523.25, 0.1, 0); // C5
        setTimeout(() => playTone(audioContext, 659.25, 0.1, 0.1), 100); // E5
        setTimeout(() => playTone(audioContext, 783.99, 0.2, 0.2), 200); // G5
      } else {
        // Play loss sound (descending tones)
        playTone(audioContext, 523.25, 0.1, 0); // C5
        setTimeout(() => playTone(audioContext, 493.88, 0.1, 0.1), 100); // B4
        setTimeout(() => playTone(audioContext, 440.00, 0.2, 0.2), 200); // A4
      }
    } catch (error) {
      // console.log('Audio not supported or blocked'); // Removed console.log
    }
  };

  const playTone = (audioContext, frequency, duration, delay) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + delay);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + delay + duration);
    
    oscillator.start(audioContext.currentTime + delay);
    oscillator.stop(audioContext.currentTime + delay + duration);
  };

  if (!notification || !isVisible) return null;

  const isWin = notification.result === 'win';
//   const profitLoss = isWin 
//     ? `+${formatBalance(notification.payout || 0)}` 
//     : `-${formatBalance(notification.stake || 0)}`;

  return (
    <div className={`trade-notification ${isAnimating ? 'animate-in' : 'animate-out'}`}>
      <Card className={`notification-card ${isWin ? 'win-notification' : 'loss-notification'}`}>
        <CardBody className="p-3">
          <Row className="align-items-center">
            <Col xs="auto">
              <div className={`notification-icon ${isWin ? 'win-icon' : 'loss-icon'}`}>
                {isWin ? '🎉' : '💔'}
              </div>
            </Col>
            <Col>
              <div className="notification-content">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">
                    <Badge color={isWin ? 'success' : 'danger'} className="me-2">
                      {isWin ? 'WIN' : 'LOSS'}
                    </Badge>
                    {notification.symbol || 'Trade'}
                  </h6>
                  <Button 
                    color="link" 
                    size="sm" 
                    className="p-0 text-muted"
                    onClick={handleClose}
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="trade-details">
                  <Row>
                    <Col xs="6">
                      <small className="text-muted">Stake:</small>
                      {/* <div className="fw-bold">{formatBalance(notification.stake || 0)}</div> */}
                    </Col>
                    <Col xs="6">
                      <small className="text-muted">Result:</small>
                      {/* <div className={`fw-bold ${isWin ? 'text-success' : 'text-danger'}`}>
                        {profitLoss}
                      </div> */}
                    </Col>
                  </Row>
                  
                  {notification.direction && (
                    <div className="mt-2">
                      <small className="text-muted">Direction:</small>
                      <Badge 
                        color={notification.direction === 'buy' ? 'success' : 'danger'} 
                        className="ms-1"
                      >
                        {notification.direction.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  
                  {notification.duration && (
                    <div className="mt-1">
                      <small className="text-muted">Duration: {notification.duration}s</small>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default TradeNotification;



