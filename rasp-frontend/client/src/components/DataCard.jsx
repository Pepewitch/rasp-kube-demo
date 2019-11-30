import React from "react";
import styled from "styled-components";

export const DATA_CARD_COLOR = {
  BLUE: "BLUE",
  PINK: "PINK",
  GREEN: "GREEN",
  PURPLE: "PURPLE"
};

const getColor = color => {
  switch (color) {
    case DATA_CARD_COLOR.BLUE:
      return "linear-gradient(254.49deg, #4A85FE 4.32%, #34B1E3 67.44%, #29C6D5 100%), #2BC3D8";
    case DATA_CARD_COLOR.GREEN:
      return "linear-gradient(254.49deg, #09B0E7 4.32%, #26CFCA 45.62%, #41EEAC 100%), #2BC3D8";
    case DATA_CARD_COLOR.PURPLE:
      return "linear-gradient(254.49deg, #777CFE 4.32%, #B27EF6 52.72%, #F883EC 100%), #2BC3D8";
    case DATA_CARD_COLOR.PINK:
      return "linear-gradient(253.88deg, #FF6DB8 4.32%, #FF82A0 67.44%, #FF978C 100%), #2BC3D8";
    default:
      return "linear-gradient(254.49deg, #4A85FE 4.32%, #34B1E3 67.44%, #29C6D5 100%), #2BC3D8";
  }
};

const Container = styled.div`
  padding: 16px;
  border-radius: 16px;
  min-height: 80px;
  min-width: 120px;
  display: flex;
  flex-flow: column nowrap;
  color: white;
  flex: 1;
  background: ${props => getColor(props.color)};
  box-shadow: 0px 4.81865px 4.81865px rgba(0, 0, 0, 0.25);
`;

export const DataCard = ({ title, value, color }) => {
  return (
    <Container color={color}>
      <span>{title}</span>
      <span
        style={{ fontSize: "3rem", fontWeight: 600, alignSelf: "flex-end" }}
      >
        {value}
      </span>
    </Container>
  );
};
