// color design tokens export
export const tokensDark = {
    grey: {
      0: "#ffffff", // manually adjusted
      10: "#f6f6f6", // manually adjusted
      50: "#f0f0f0", // manually adjusted
      100: "#e0e0e0",
      200: "#c2c2c2",
      300: "#a3a3a3",
      400: "#858585",
      500: "#666666",
      600: "#525252",
      700: "#3d3d3d",
      800: "#292929",
      900: "#141414",
      1000: "#000000", // manually adjusted
    },
    green: {
        100: "#e5fce7",
        200: "#cbfacf",
        300: "#b2f7b7",
        400: "#98f59f",
        500: "#7ef287",
        600: "#65c26c",
        700: "#4c9151",
        800: "#326136",
        900: "#19301b"
    }
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
              green: {
                ...tokensDark.green,
                main: tokensDark.green[700],
                light: tokensDark.green[700],
              },
              primary: {
                ...tokensLight.green,
                main: tokensDark.green[700],
                light: tokensDark.green[700],
              },
              neutral: {
                ...tokensDark.grey,
                main: tokensDark.grey[500],
              },
              background: {
                default: tokensDark.grey[800],
                alt: tokensDark.grey[900],
              }
            }
          : {
              // palette values for light mode
              green: {
                ...tokensLight.green,
                main: tokensDark.green[700],
                light: tokensDark.green[700],
              },
              primary: {
                ...tokensLight.green,
                main: tokensDark.green[300],
                light: tokensDark.green[300],
              },
              neutral: {
                ...tokensLight.grey,
                main: tokensDark.grey[500],
              },
              background: {
                default: tokensDark.grey[0],
                alt: tokensDark.grey[50],
              }
            }),
      },
      typography: {
        fontFamily: ["Roboto", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Roboto", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Roboto", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Roboto", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Roboto", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Roboto", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Roboto", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };
  };
  

