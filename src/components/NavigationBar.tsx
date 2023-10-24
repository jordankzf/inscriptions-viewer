import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ArrowRight from '../assets/img/arrow_right.svg';

const NavigationBarTitle = styled.h1(() => ({
  textAlign: 'center',
  paddingTop: '54px',
  paddingBottom: '17px',
  margin: 0
}));

const LeftCaret = styled.img(() => ({
  paddingLeft: '11px',
  rotate: '180deg',
  position: 'absolute',
  left: '32px',
})
);

interface NavigationBarProps {
  title: string;
  showBackButton?: boolean;
}

function NavigationBar(props: NavigationBarProps) {
  const navigate = useNavigate();

  function handleBackClick() {
    navigate(-1);
  }

  return (
    <NavigationBarTitle>{props.showBackButton && <LeftCaret alt="back" src={ArrowRight} onClick={handleBackClick} />}
      {props.title}</NavigationBarTitle>

  );
}

export default NavigationBar;