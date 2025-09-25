import React, { useState } from 'react';
import civicIssuesService from '../services/civicIssuesService';
import './IssueCard.css';

const IssueCard = ({ issue, onUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(issue.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    
    // Optimistic update
    setLiked(newLiked);
    setLikeCount(newCount);

    try {
      const response = await civicIssuesService.toggleLike(issue.id);
      if (response.success) {
        // Update parent component if needed
        if (onUpdate) {
          onUpdate({
            ...issue,
            likes: response.likes,
            liked: response.liked
          });
        }
        // Update local state with server response
        setLikeCount(response.likes);
        setLiked(response.liked);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikeCount(likeCount);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    
    setIsSharing(true);
    try {
      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: issue.title,
          text: issue.description,
          url: window.location.href
        });
      } else {
        // Fallback to clipboard
        const shareText = `${issue.title}\n\n${issue.description}\n\nReported by: ${issue.author}`;
        await navigator.clipboard.writeText(shareText);
        alert('Issue details copied to clipboard!');
      }
      
      // Track share on backend
      await civicIssuesService.shareIssue(issue.id);
      
    } catch (error) {
      console.error('Failed to share issue:', error);
      // Fallback share method
      const shareText = `${issue.title}\n\n${issue.description}\n\nReported by: ${issue.author}`;
      prompt('Copy this text to share:', shareText);
    } finally {
      setIsSharing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return '#10b981'; // green
      case 'scheduled':
        return '#f59e0b'; // yellow
      case 'under investigation':
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  };

  return (
    <div className="issue-card">
      {/* Author Info */}
      <div className="issue-header">
        <div className="author-info">
          <div className="author-avatar">
            {issue.author.charAt(0)}
          </div>
          <div className="author-details">
            <span className="author-name">{issue.author}</span>
            <span className="author-category">{issue.category}</span>
          </div>
        </div>
        <div className="issue-status" style={{ color: getStatusColor(issue.status) }}>
          {issue.status}
        </div>
      </div>

      {/* Issue Content */}
      <div className="issue-content">
        <h3 className="issue-title">{issue.title}</h3>
        <p className="issue-description">{issue.description}</p>
        
        {/* Issue Image */}
        <div className="issue-image">
          <img 
            src={issue.image} 
            alt={issue.title}
            onError={(e) => {
              // Fallback to a placeholder color block
              e.target.style.display = 'none';
              e.target.parentElement.style.background = '#f3f4f6';
              e.target.parentElement.style.display = 'flex';
              e.target.parentElement.style.alignItems = 'center';
              e.target.parentElement.style.justifyContent = 'center';
              e.target.parentElement.innerHTML = '📷 Image';
            }}
          />
        </div>
      </div>

      {/* Issue Actions */}
      <div className="issue-actions">
        <button 
          className={`action-btn like-btn ${liked ? 'liked' : ''} ${isLiking ? 'loading' : ''}`}
          onClick={handleLike}
          disabled={isLiking}
        >
          <span className="action-icon">{isLiking ? '⏳' : '👍'}</span>
          <span className="action-count">{likeCount}</span>
        </button>
        
        <button 
          className={`action-btn share-btn ${isSharing ? 'loading' : ''}`} 
          onClick={handleShare}
          disabled={isSharing}
        >
          <span className="action-icon">{isSharing ? '⏳' : '↗'}</span>
          <span className="action-text">Share</span>
        </button>

        <div className="action-count shares-count">
          {issue.shares} shares
        </div>
      </div>
    </div>
  );
};

export default IssueCard;