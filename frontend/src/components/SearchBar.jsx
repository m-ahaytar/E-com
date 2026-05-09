import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <form className="wm-search-bar" onSubmit={handleSubmit}>
      <div className="wm-search-bar__inner">
        <i className="bi bi-search wm-search-bar__icon"></i>
        <input
          type="text"
          className="wm-search-bar__input"
          placeholder="SEARCH THE FUTURE..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search products"
        />
        <button type="submit" className="visually-hidden">Search</button>
      </div>
    </form>
  );
};

export default SearchBar;
