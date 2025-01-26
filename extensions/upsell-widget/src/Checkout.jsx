import {
  reactExtension,
  BlockStack,
  Text,
  useApi,
  InlineLayout,
  Heading,
  BlockSpacer,
  Divider,
  useCartLines,
  useApplyCartLinesChange,
  ProductThumbnail,
  SkeletonImage,
  SkeletonTextBlock,
  useSettings,
  Icon,
  View,
  Button
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const { query } = useApi();
  const variants = [];
  const cartItems = useCartLines();
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const settings = useSettings();
  const variantIds = [settings.selected_variant_01, settings.selected_variant_02, settings.selected_variant_03, settings.selected_variant_04].filter(id => {
    return id !== null && !cartItems.find(item => item.merchandise.id === id)
  });

  useEffect(() => {
    fetchVariantData();
    setSimilarProducts(variants);
  }, [])

  async function fetchVariantData() {
    setIsLoading(true);
    for (const variantId of variantIds) {
      try {
        const { data } = await query(`{
          node(id: "${variantId}") {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
              }
              product {
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }`);
        variants.push(data?.node);
      }
      catch (error) {
        console.error(error);
      }
    }
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <>
        <Heading level={2}>{settings.heading}</Heading>
        <BlockSpacer spacing="base" />
        <Divider />
        <BlockSpacer spacing="base" />
        <InlineLayout blockAlignment="center" spacing={["base", "base"]} columns={["auto", "fill"]}>
          <SkeletonImage
            inlineSize={50}
            blockSize={50}
          />
          <SkeletonTextBlock lines={3} />
        </InlineLayout>
      </>
    )
  }

  if (variantIds.length) {
    return (
      <>
        <Heading level={2}>{settings.heading}</Heading>
        <BlockSpacer spacing="base" />
        <Divider />
        <BlockSpacer spacing="base" />
        {similarProducts.map((variant, index) =>
          variant &&
          <VariantOffer isAdding={isAdding} setIsAdding={setIsAdding} variant={variant} key={index} />
        )}
      </>
    );
  }

  return null
}

function VariantOffer({ variant, isAdding, setIsAdding }) {
  const applyCartLineChange = useApplyCartLinesChange();
  const [isAdded, setIsAdded] = useState(false);

  function addVariant() {
    setIsAdding(true);
    setIsAdded(true);
    applyCartLineChange({
      type: "addCartLine",
      merchandiseId: variant.id,
      quantity: 1
    }).finally(() => setIsAdding(false));
  }

  if (!isAdded) {
    return (
      <InlineLayout blockAlignment="center" spacing={["base", "base"]} columns={["auto", "fill", "auto"]} padding={['base', 'none', 'base', 'none',]}>
        <ProductThumbnail
          source={variant.image?.url || variant.product.featuredImage?.url}
        />
        <BlockStack>
          <Heading level="3">{variant.product.title} - {variant.title}</Heading>
          <Text>{variant.price.amount} {variant.price.currencyCode}</Text>
        </BlockStack>
        <Button onPress={addVariant} disabled={isAdding}><View padding={['none', 'tight', 'none', 'none',]}><Icon size="base" appearance="monochrome" source="cart" /></View>Add</Button>
      </InlineLayout>
    )
  }
  return null;
}