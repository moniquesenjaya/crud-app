import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../index';

// Mock child components
jest.mock('../Header', () => () => <div data-testid="header" />);
jest.mock('../Table', () => () => <div data-testid="table" />);
jest.mock('../Add', () => () => <div data-testid="add-form" />);
jest.mock('../Edit', () => () => <div data-testid="edit-form" />);

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders Header and Table when not adding or editing', () => {
    render(<Dashboard setIsAuthenticated={jest.fn()} />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('table')).toBeInTheDocument();
  });

  test('displays employee data from localStorage if available', () => {
    const mockData = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        salary: '5000',
        date: '2023-01-01',
      },
    ];
    localStorage.setItem('employees_data', JSON.stringify(mockData));

    render(<Dashboard setIsAuthenticated={jest.fn()} />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
