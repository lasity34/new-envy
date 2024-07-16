import React, { useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

const SyncCartComponent: React.FC = () => {
  const { user, initializeUser } = useUser();
  const { mergeAnonymousCartWithUserCart } = useCart();
  const initialSyncDone = useRef(false);

  useEffect(() => {
    const init = async () => {
      await initializeUser();
    };

    init();
  }, [initializeUser]);

  useEffect(() => {
    const sync = async () => {
      if (user && !initialSyncDone.current) {
        await mergeAnonymousCartWithUserCart();
        initialSyncDone.current = true;
      }
    };
  
    sync();
  }, [user, mergeAnonymousCartWithUserCart]);

  return null;
};

export default SyncCartComponent;