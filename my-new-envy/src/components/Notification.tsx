// src/components/Notification.tsx

import React from 'react';
import styled from 'styled-components';
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';

const NotificationContainer = styled.div<{ $show: boolean; type: 'success' | 'error' }>`
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  align-items: center;
  color: ${(props) => (props.type === 'success' ? 'green' : 'red')};
  padding: 8px;
  margin-top: 10px;
  font-style: italic;
  font-size: 1rem;
`;

const IconContainer = styled.div`
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface NotificationProps {
  message: string;
  show: boolean;
  type: 'success' | 'error';
}

const Notification: React.FC<NotificationProps> = ({ message, show, type }) => {
  return (
    <NotificationContainer $show={show} type={type}>
      <IconContainer>
        {type === 'success' ? <AiOutlineCheckCircle size={24} /> : <AiOutlineCloseCircle size={24} />}
      </IconContainer>
      {message}
    </NotificationContainer>
  );
};

export default Notification;
