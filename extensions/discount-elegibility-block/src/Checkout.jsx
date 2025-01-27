import {
  Button,
  Heading,
  Text,
  View,
  Icon,
  reactExtension,
  useApplyDiscountCodeChange,
  useCartLines,
  BlockLayout,
  useDiscountCodes
} from "@shopify/ui-extensions-react/checkout";
import { InlineLayout } from "@shopify/ui-extensions/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.reductions.render-before", () => (
  <Extension />
));

function Extension() {
  const cartItems = useCartLines();
  const discounts = useDiscountCodes();
  const applyDiscountCodeChange = useApplyDiscountCodeChange();
  const [isEligible, setIsEligible] = useState(false);
  const [isApplied, setIsApplied] = useState(false);


  useEffect(() => {
    if (cartItems.length >= 2) {
      setIsEligible(true);
    }
    else {
      setIsEligible(false);
      if (isApplied) {
        applyDiscountCodeChange({
          code: "FREESHIPPING",
          type: "removeDiscountCode"
        })
      }
    }
  }, [cartItems])

  useEffect(() => {
    if (discounts.find(discount => discount?.code === "FREESHIPPING")) {
      setIsApplied(true);
    }
    else {
      setIsApplied(false);
    }
  }, [discounts])

  function applyDiscount() {
    setIsApplied(true);
    applyDiscountCodeChange({
      code: "FREESHIPPING",
      type: "addDiscountCode"
    })
  }

  if (isEligible && !isApplied) {
    return (
      <InlineLayout columns={["fill", "auto"]} blockAlignment="start" padding={['base', 'none', 'base', 'none',]}>
        <BlockLayout rows={["auto", 'fill']}>
          <Heading level={3}>Congratulations! You are eligible for free shipping discount!</Heading>
          <View padding={['tight', 'none', 'tight', 'none',]}>
            <Text inlineAlignment="left">By applying this you can get free shipping all around the world.</Text>
          </View>
        </BlockLayout>
        <Button onPress={applyDiscount}><View padding={['none', 'tight', 'none', 'none',]}><Icon size="base" appearance="monochrome" source="truck" /></View>Apply</Button>
      </InlineLayout>
    )
  }
  return null;
}