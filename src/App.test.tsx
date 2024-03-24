import { render, act } from '@testing-library/react';
import App from 'App';
import { MemoryRouter } from 'react-router-dom';

describe('App component', () => {
  it('renders the MainPage component on the root URL', async () => {
    const { getByText } = await act(async () =>
      render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      )
    );

    const textElement = getByText('Main Page');
    expect(textElement).toBeInTheDocument();
  });
});
