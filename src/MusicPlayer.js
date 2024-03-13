import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./MusicPlayer.css";

export default function MusicPlayer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const audioRef = useRef(null);

  const client_id = "977193383daf44a48c98c87ebf2fb55d";
  const client_secret = "4db9d0e057b645bf8f35a0c211a81542";

  useEffect(() => {
    const authString = `${client_id}:${client_secret}`;
    const base64AuthString = btoa(authString);

    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      method: "POST", // Specify the POST method
      headers: {
        Authorization: "Basic " + base64AuthString,
        "Content-Type": "application/x-www-form-urlencoded", // Specify the content type
      },
      data: new URLSearchParams({
        grant_type: "client_credentials", // Pass form data in the body
      }).toString(),
    };

    axios(authOptions)
      .then((response) => {
        if (response.status === 200) {
          const token = response.data.access_token;
          console.log("Access Token:", token);
          setAccessToken(token);
        } else {
          console.error("Failed to obtain access token:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error obtaining access token:", error);
      });
  }, []);

  const handleSearch = async () => {
    try {
      const tokenResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        new URLSearchParams({
          grant_type: "client_credentials",
        }).toString(),
        {
          headers: {
            Authorization: "Basic " + btoa(`${client_id}:${client_secret}`),
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const accessToken = tokenResponse.data.access_token;
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${searchQuery}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setSearchResults(response.data.tracks.items);
    } catch (error) {
      console.error("Error searching for tracks:", error);
    }
  };

  function handlePlayTrack(track) {
    setSelectedTrack(track);
    setIsPlaying(true);
  }

  function handleResumeTrack () {
    setIsPlaying(true);
    audioRef.current.play();
  }

  function handlePauseTrack() {
    setIsPlaying((prevState) => !prevState);
    audioRef.current.pause();
  }

  function handleSkipTrack() {
    if(selectedTrack && searchResults.length>0)
    {
        const currentIndex = searchResults.findIndex(
            (track) => track.id === selectedTrack.id
        );
        const nextIndex = (currentIndex+1)% searchResults.length    ;
        handlePlayTrack(searchResults[nextIndex]);
    }
  }

  console.log("Selected Track:", selectedTrack);

  return (
    <>
      <div className="music-player">
        <h2>Music Player</h2>
        <div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for tracks"
          />
          {" "}
          <button onClick={handleSearch} className="search-button">Search</button>
        </div>

        {selectedTrack && (
          <div>
            <h3 className="text">Now Playing:</h3>
            <p className="text"><b>
              {selectedTrack.name} -{" "}
              {selectedTrack.artists.map((artist) => artist.name).join(", ")}
              </b></p>
            <button onClick={handleResumeTrack} className="resume-button">Play</button>{" "}
            <button onClick={handlePauseTrack} className="pause-button">Pause</button>{" "}
            <button onClick={handleSkipTrack} className="next-button">Next</button>
          </div>
        )}

        {searchResults.length > 0 && (
        <ul>
          {searchResults.map((track) => (
            <li key={track.id}>
              <span>
                {track.name} -{" "}
                {track.artists.map((artist) => artist.name).join(", ")}
              </span>
              {" "}
              <button onClick={() => handlePlayTrack(track)} className="play-button"><b>Play!</b></button>
            </li>
          ))}
        </ul>
        )}

        {selectedTrack && (
          <audio
            ref={audioRef}
            src={selectedTrack.preview_url}
            autoPlay={isPlaying}
          />
        )}
      </div>
    </>
  );
}
