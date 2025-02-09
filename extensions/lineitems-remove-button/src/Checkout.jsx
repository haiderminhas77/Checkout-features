import {
  reactExtension,
  Link,
  useApplyCartLinesChange,
  useCartLineTarget,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.cart-line-item.render-after',
  () => <Extension />,
);

function Extension() {
  const applyCartLinesChange = useApplyCartLinesChange();
  const {
    id, quantity
  } = useCartLineTarget();
  const handleRemove = async () => {
    await applyCartLinesChange({
      type: 'removeCartLine',
      id: id,
      quantity: quantity,
    });
  };

  return <Link padding="tight" onPress={handleRemove}>Remove</Link>
}
