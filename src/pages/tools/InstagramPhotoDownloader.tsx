import React, { useState } from 'react';
import { Download, Link as LinkIcon, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';

const InstagramPhotoDownloader: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mediaInfo, setMediaInfo] = useState<any>(null);

  const extractInstagramId = (url: string): string | null => {
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getMediaType = (url: string): 'post' | 'reel' | 'tv' | 'unknown' => {
    if (url.includes('/reel/')) return 'reel';
    if (url.includes('/tv/')) return 'tv';
    if (url.includes('/p/')) return 'post';
    return 'unknown';
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Please enter an Instagram URL');
      return;
    }

    const mediaId = extractInstagramId(url);
    if (!mediaId) {
      setError('Invalid Instagram URL. Please enter a valid post, reel, or IGTV URL.');
      return;
    }

    setIsLoading(true);
    setError('');
    setMediaInfo(null);

    try {
      // Use a third-party Instagram API service
      const apiUrl = `https://api.insta-downloader.com/download?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        // Try alternative API
        const altResponse = await fetch(`https://instagram-downloader-download-instagram-videos-stories.p.rapidapi.com/index`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': 'demo-key',
            'X-RapidAPI-Host': 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com'
          },
          body: JSON.stringify({ url: url })
        });
        
        if (!altResponse.ok) {
          throw new Error('Unable to fetch Instagram content. The post may be private or the URL is invalid.');
        }
        
        const data = await altResponse.json();
      
      } else {
        const data = await response.json();
      }
      
      const mediaInfo = {
        id: mediaId,
        type: getMediaType(url),
        username: data.username || data.author || 'Instagram User',
        caption: data.caption || data.title || 'No caption available',
        likes: data.likes || data.like_count || 0,
        comments: data.comments || data.comment_count || 0,
        timestamp: data.timestamp || new Date().toISOString(),
        media: data.media_urls ? data.media_urls.map((mediaUrl: string, index: number) => ({
          type: getMediaType(url) === 'reel' || url.includes('/tv/') ? 'video' : 'image',
          url: mediaUrl,
          thumbnail: data.thumbnail || data.thumb || mediaUrl,
          quality: 'HD',
          filesize: 0
        })) : [{
          type: getMediaType(url) === 'reel' || url.includes('/tv/') ? 'video' : 'image',
          url: data.video_url || data.image_url || data.url,
          thumbnail: data.thumbnail || data.thumb,
          quality: 'Original',
          filesize: 0
        }]
      };
      
      setMediaInfo(mediaInfo);
    } catch (err) {
      setError('Failed to fetch media. Please check the URL and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMedia = async (mediaUrl: string, filename: string) => {
    try {
      const response = await fetch(mediaUrl, { mode: 'cors' });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: open in new tab
      window.open(mediaUrl, '_blank');
    }
  };

  const clearResults = () => {
    setUrl('');
    setMediaInfo(null);
    setError('');
  };

  return (
    <div className="tool-container">
      <div className="tool-header">
        <h1>Instagram Image/Video Downloader</h1>
        <p>Download Instagram posts, reels, and IGTV videos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="instagram-url">Instagram URL</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <input
                id="instagram-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/ABC123..."
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid var(--border-color)',
                  background: 'var(--bg-tertiary)',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={handleDownload}
                disabled={isLoading}
                className={`case-btn ${isLoading ? 'disabled' : 'active'}`}
                style={{ 
                  padding: '1rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  minWidth: '120px',
                  justifyContent: 'center'
                }}
              >
                {isLoading ? (
                  <>
                    <div style={{ 
                      width: '16px', 
                      height: '16px', 
                      border: '2px solid transparent',
                      borderTop: '2px solid currentColor',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Loading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Fetch
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {mediaInfo && (
            <div style={{ background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold'
                }}>
                  @
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>@{mediaInfo.username}</h3>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {mediaInfo.type.charAt(0).toUpperCase() + mediaInfo.type.slice(1)} • {mediaInfo.likes.toLocaleString()} likes
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  maxHeight: '60px',
                  overflow: 'hidden'
                }}>
                  {mediaInfo.caption}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                {mediaInfo.media.map((item: any, index: number) => (
                  <div key={index} style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ position: 'relative' }}>
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          poster={item.thumbnail}
                          controls
                          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={`Media ${index + 1}`}
                          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        />
                      )}
                      <div style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                        {item.quality}
                      </div>
                      {item.filesize > 0 && (
                        <div style={{
                          position: 'absolute',
                          bottom: '0.5rem',
                          left: '0.5rem',
                          background: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem'
                        }}>
                          {(item.filesize / 1024 / 1024).toFixed(1)} MB
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <button
                        onClick={() => downloadMedia(item.url, `instagram_${mediaInfo.id}_${index + 1}.${item.type === 'video' ? 'mp4' : 'jpg'}`)}
                        className="case-btn active"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          fontSize: '0.9rem'
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <button
                  onClick={clearResults}
                  className="case-btn"
                  style={{ padding: '0.75rem 2rem' }}
                >
                  Download Another
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '2px solid var(--border-color)' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <LinkIcon className="w-5 h-5" />
            How to Use
          </h3>

          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <ol style={{ paddingLeft: '1.5rem', margin: '0 0 1.5rem 0' }}>
              <li style={{ marginBottom: '0.5rem' }}>Copy the Instagram post, reel, or IGTV URL</li>
              <li style={{ marginBottom: '0.5rem' }}>Paste it in the input field above</li>
              <li style={{ marginBottom: '0.5rem' }}>Click "Fetch" to analyze the content</li>
              <li style={{ marginBottom: '0.5rem' }}>Download individual images or videos</li>
            </ol>

            <h4 style={{ marginBottom: '1rem' }}>Supported URLs:</h4>
            <ul style={{ paddingLeft: '1.5rem', margin: '0 0 1.5rem 0' }}>
              <li style={{ marginBottom: '0.5rem' }}>Posts: instagram.com/p/ABC123</li>
              <li style={{ marginBottom: '0.5rem' }}>Reels: instagram.com/reel/ABC123</li>
              <li style={{ marginBottom: '0.5rem' }}>IGTV: instagram.com/tv/ABC123</li>
            </ul>

            <div style={{
              background: '#dbeafe',
              color: '#1e40af',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              <strong>Backend Required:</strong> This tool requires a backend service running yt-dlp to extract Instagram media. The frontend sends requests to <code>/api/download</code> endpoint.
            </div>
            
            <h4 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Backend Setup:</h4>
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontFamily: 'monospace'
            }}>
              <div>pip install yt-dlp</div>
              <div>yt-dlp --extract-flat --dump-json [URL]</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default InstagramPhotoDownloader;