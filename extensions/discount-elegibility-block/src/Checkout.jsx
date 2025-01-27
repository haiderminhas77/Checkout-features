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
  useDiscountCodes,
  useSettings
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
  const settings = useSettings();


  useEffect(() => {
    if (cartItems.length >= settings.number_of_items) {
      setIsEligible(true);
    }
    else {
      setIsEligible(false);
      if (isApplied) {
        applyDiscountCodeChange({
          code: settings.discount_code,
          type: "removeDiscountCode"
        })
      }
    }
  }, [cartItems])

  useEffect(() => {
    if (discounts.find(discount => discount?.code === settings.discount_code)) {
      setIsApplied(true);
    }
    else {
      setIsApplied(false);
    }
  }, [discounts])

  function applyDiscount() {
    setIsApplied(true);
    applyDiscountCodeChange({
      code: settings.discount_code,
      type: "addDiscountCode"
    })
  }

  if (isEligible && !isApplied) {
    return (
      <InlineLayout columns={["fill", "auto"]} blockAlignment="start" padding={['base', 'none', 'base', 'none',]}>
        <BlockLayout rows={["auto", 'fill']}>
          <View padding={['none', 'tight', 'none', 'none',]}>
            <Heading level={3}>{settings.heading}</Heading>
            <View padding={['tight', 'none', 'tight', 'none',]}>
              <Text inlineAlignment="left">{settings.details}</Text>
            </View>
          </View>
        </BlockLayout>
        <Button onPress={applyDiscount}><View padding={['none', 'tight', 'none', 'none',]}><Icon size="base" appearance="monochrome" source="truck" /></View>Apply</Button>
      </InlineLayout>
    )
  }
  return null;
}