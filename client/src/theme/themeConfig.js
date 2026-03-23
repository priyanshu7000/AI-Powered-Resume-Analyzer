export const themeConfig = {
  light: {
    bg: 'bg-white',
    text: 'text-gray-900',
    border: 'border-gray-200',
    secondary: 'bg-gray-50',
    secondaryText: 'text-gray-600',
    hover: 'hover:bg-gray-100',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-400',
  },
  dark: {
    bg: 'bg-gray-900',
    text: 'text-gray-100',
    border: 'border-gray-700',
    secondary: 'bg-gray-800',
    secondaryText: 'text-gray-400',
    hover: 'hover:bg-gray-800',
    input: 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500',
  },
};

export const applyTheme = (theme) => {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
};
