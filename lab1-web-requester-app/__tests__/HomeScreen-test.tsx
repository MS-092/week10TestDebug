import { render, screen } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';
import 'jest-styled-components';
import 'jest-styled-components/native';

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

describe('<HomeScreen />', () => {
  test('Text renders correctly on HomeScreen', () => {
    render(<HomeScreen />);
    expect(screen.getByText('Web Requester')).toBeTruthy();
  });

  test('Text renders check style', async () => {
    const screen = render(<HomeScreen />);
    const t = await screen.findByTestId('t1');
    expect(t).toHaveStyle({ backgroundColor: '#fff' });
  });

  test('Component snapshot', () => {
    const tree = render(<HomeScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
