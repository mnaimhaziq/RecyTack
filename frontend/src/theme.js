// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff",
    10: "#f6f6f6",
    50: "#f0f0f0",
    100: "#e0e0e0",
    200: "#c2c2c2",
    300: "#a3a3a3",
    400: "#858585",
    500: "#666666",
    600: "#525252",
    700: "#3d3d3d",
    800: "#292929",
    900: "#141414",
    1000: "#000000",
  },
  primary: {
    // dark green
    100: "#a7d7c5",
    200: "#87c1aa",
    300: "#67ab8f",
    400: "",
    500: "#278f5b",
    600: "#22774b",
    700: "#1c5f3c",
    800: "#17372c",
    900: "#111f1d"
  },
  secondary: {
    // dark purple
    100: "#ddc6e7",
    200: "#c39bdd",
    300: "#a97bd3",
    400: "#8f51c9",
    500: "#7537bf",
    600: "#5c2d9e",
    700: "#43237e",
    800: "#29195d",
    900: "#100f3d",
  },
  danger: {
    100: "#ffe4e6",
    200: "#ffc9cd",
    300: "#ffadb4",
    400: "#ff929b",
    500: "#ff7782",
    600: "#cc5f68",
    700: "#99474e",
    800: "#663034",
    900: "#33181a",
  },
};


// function that reverses the color palette
function reverseTokens(tokensDark) {
  const reversedTokens = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val);
    const values = Object.values(val);
    const length = keys.length;
    const reversedObj = {};
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[500],
              white: tokensDark.grey[1000]
            },
            background: {
              default: tokensDark.primary[700],
              alt: tokensDark.primary[500],
            },
            danger: {
              ...tokensDark.danger,
              main: tokensDark.danger[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.grey[50],
              light: tokensDark.grey[100],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.grey[500],
              white: tokensDark.grey[0]
            },
            background: {
              default: tokensDark.grey[0],
              alt: tokensDark.grey[50],
            },
            danger: {
              ...tokensLight.danger,
              main: tokensDark.danger[400],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
