import { render } from '@testing-library/react';
import React from 'react';
import AnimeCard from '../animeCards/AnimeCard';

describe('AnimeCard Component', () => {
  const anime = {
    title: 'Test Anime',
    url: 'https://example.com/anime',
    images: {
      jpg: {
        image_url: 'https://example.com/anime.jpg'
      }
    }
  };

  it('renders without crashing', () => {
    render(<AnimeCard anime={anime} />);
  });

  it('renders correct title', () => {
    const { getByText } = render(<AnimeCard anime={anime} />);
    expect(getByText(anime.title)).toBeInTheDocument();
  });

  it('renders correct image URL', () => {
    const { getByAltText } = render(<AnimeCard anime={anime} />);
    expect(getByAltText('AnimeImage')).toHaveAttribute('src', anime.images.jpg.image_url);
  });

  it('renders correct link URL', () => {
    const { getByRole } = render(<AnimeCard anime={anime} />);
    expect(getByRole('link')).toHaveAttribute('href', anime.url);
  });

  it('opens link in new tab', () => {
    const { getByRole } = render(<AnimeCard anime={anime} />);
    expect(getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('rel attribute is set correctly', () => {
    const { getByRole } = render(<AnimeCard anime={anime} />);
    expect(getByRole('link')).toHaveAttribute('rel', 'norefererr');
  });
});
