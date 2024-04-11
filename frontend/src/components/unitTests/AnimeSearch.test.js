import { render } from '@testing-library/react';
import React from 'react';
import AnimeSearch from '../animeCards/AnimeSearch';

describe('AnimeSearch', () => {
  it('renders without crashing', () => {
    render(<AnimeSearch />);
  });

  it('renders with default props', () => {
    render(<AnimeSearch typeDefault="topAnime" />);
  });
});
