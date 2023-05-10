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
//     green: {
//           100: "#d8f4f4",
//           200: "#b1e9e9",
//           300: "#89dede",
//           400: "#62d3d3",
//           500: "#3bc8c8",
//           600: "#2fa0a0",
//           700: "#3377e0",
//           800: "#185050",
//           900: "#0c2828"
// },

blue: {
          100: "#d6e4f9",
          200: "#adc9f3",
          300: "#85adec",
          400: "#5c92e6",
          500: "#3377e0",
          600: "#295fb3",
          700: "#1f4786",
          800: "#14305a",
          900: "#0a182d"
},
paleYellow: {
    100: "#fffef3",
    200: "#fffde7",
    300: "#fffbdc",
    400: "#fffad0",
    500: "#fff9c4",
    600: "#ccc79d",
    700: "#999576",
    800: "#66644e",
    900: "#333227"
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
              yellow: {
                ...tokensDark.paleYellow,
                main: tokensDark.paleYellow[700],
                light: tokensDark.paleYellow[500],
              },
              primary: {
                ...tokensLight.blue,
                main: tokensDark.blue[500],
                light: tokensDark.blue[300],
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
              yellow: {
                ...tokensLight.paleYellow,
                main: tokensDark.paleYellow[700],
                light: tokensDark.paleYellow[700],
              },
              primary: {
                ...tokensLight.blue,
                main: tokensDark.blue[500],
                light: tokensDark.blue[300],
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
        fontSize: 13,
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
  

