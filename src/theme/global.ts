import { createGlobalStyle } from "styled-components";
import Montserrat from "../assets/fonts/Montserrat.ttf";

const GlobalStyle = createGlobalStyle`
  @font-face{
    font-family: 'Montserrat';
    src: url(${Montserrat});
    font-display: block;
  }

  * {
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    font-size: 14px;
    background-color: #1A1A1A;
    color: #FFFFFF;
  }

  body {
    padding: 0 16px;
    @media (min-width: 768px) {
      margin: 0 30%;
    }
  }
`;

export default GlobalStyle;
