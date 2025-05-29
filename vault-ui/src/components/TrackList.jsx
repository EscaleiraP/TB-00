import { useState, useEffect } from 'react';
import { getTracks, getCertificate } from '../utils/apiService';

const TrackList = ({ userId }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        setLoading(true);
        const list = Array.isArray(await getTracks(userId))
         ? await getTracks(userId)
        : [];
      setTracks(list);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tracks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading tracks...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="track-list">
      <h2>Your Tracks</h2>
      {tracks.length === 0 ? (
        <p>No tracks found. Upload your first track!</p>
      ) : (
        <ul>
          {tracks.map((track) => (
            <li key={track.id} className="track-item">
              <h3>{track.title}</h3>
              <p>Artist: {track.artist}</p>
              {track.uploadDate && (
                <p>Uploaded: {new Date(track.uploadDate).toLocaleDateString()}</p>
              )}
              {track.cid && <p>CID: {track.cid}</p>}
              {track.txHash && <p>TX Hash: {track.txHash}</p>}
              
              {track.certificateUrl ? (
                <a
                  href={track.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="certificate-link"
                >
                  View Certificate
                </a>
              ) : (
                <span className="text-red-500">Certificate unavailable</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrackList;
