import {
  Banner,
  reactExtension,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <OrderReservedCountdown />,
);

function OrderReservedCountdown() {
  const [countdown, setCountdown] = useState(600);
  const { banner_title } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        return prevCountdown > 0 ? prevCountdown - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const bannerTitle = banner_title ? `${banner_title} ${formattedTime} minutes!` : `${formattedTime} minutes!`;

  return (
    <Banner
      status="success"
      title={bannerTitle}
    />
  );
}

