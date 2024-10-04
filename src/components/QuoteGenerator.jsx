import React, { useState, useEffect } from 'react';

function QuoteGenerator() {
  // State to store the quote and author
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [favorites, setFavorites] = useState([]); // State to store favorite quotes
  const [showFavorites, setShowFavorites] = useState(false); // Toggle favorite quotes visibility

  // Function to fetch a random quote
  const randomQuote = () => {
    fetch('https://dummyjson.com/quotes')
      .then((res) => res.json())
      .then((data) => {
        // Check if data is valid and not null
        if (data && data.quotes && data.quotes.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.quotes.length);
          setQuote(data.quotes[randomIndex].quote);
          setAuthor(data.quotes[randomIndex].author);
        }
      })
      .catch((error) => console.log('Error fetching the quote:', error));
  };

  // Function to handle text-to-speech
  const speakQuote = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(`${quote} by ${author}`);
      speech.pitch = 1;
      speech.rate = 1;
      window.speechSynthesis.speak(speech);
    } else {
      console.log('Text-to-Speech not supported');
    }
  };

  // Function to copy quote to clipboard
  const copyToClipboard = () => {
    const textToCopy = `"${quote}" - ${author}`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Quote copied to clipboard!'))
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  // Function to add/remove the current quote to/from favorites
  const toggleFavorite = () => {
    const currentQuote = { quote, author };
    const isFavorite = favorites.some(fav => fav.quote === quote && fav.author === author);

    if (isFavorite) {
      // Remove from favorites
      setFavorites(favorites.filter(fav => fav.quote !== quote));
    } else {
      // Add to favorites
      setFavorites([...favorites, currentQuote]);
    }
  };

  // Toggle the visibility of favorite quotes
  const toggleFavoritesView = () => {
    setShowFavorites(!showFavorites);
  };

  // Function to clear all favorite quotes
  const clearFavorites = () => {
    setFavorites([]);
  };

  // useEffect to fetch the first quote when the component mounts
  useEffect(() => {
    randomQuote();
  }, []);

  return (
    <div className="container">
      <header>A New Quote Everyday</header>
      
      <div className="content">
        <div className="quote-content">
          <i className="fa-solid fa-quote-left"></i>
          <p className="quote">{quote}</p>
          <i className="fa-solid fa-quote-right"></i>
        </div>
        <div className="author">
          <span>_</span>
          <span className="author-name">{author}</span>
        </div>
      </div>
      
      <div className="buttons">
        <div className="features">
          <ul>
            <li className="sound" onClick={speakQuote}>
              <i className="fa-solid fa-volume-high"></i>
            </li>
            <li className="copy" onClick={copyToClipboard}>
              <i className="fa-solid fa-copy"></i>
            </li>
            <li className="favorite" onClick={toggleFavorite}>
              <i className="fa-solid fa-heart"></i> {/* Heart icon to toggle favorite */}
            </li>
          </ul>
          <button onClick={randomQuote}>Next Quote</button>
        </div>
      </div>

      <div className="favorites-toggle">
        <button onClick={toggleFavoritesView}>
          {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
        </button>
      </div>

      {showFavorites && (
        <div className="favorites-list">
          <h3>Favorite Quotes</h3>
          {favorites.length > 0 ? (
            <div>
              <ul>
                {favorites.map((fav, index) => (
                  <li key={index}>
                    <p>"{fav.quote}" - {fav.author}</p>
                  </li>
                ))}
              </ul>
              <button onClick={clearFavorites}>Clear Favorites</button> {/* Button to clear all favorites */}
            </div>
          ) : (
            <p>No favorite quotes yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default QuoteGenerator;
